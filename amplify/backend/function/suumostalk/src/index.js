/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const { IncomingWebhook } = require('@slack/webhook');
const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

const Twitter = require('twitter');

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

let Bucket = 'suumostalk';
if(process.env.ENV && process.env.ENV !== "NONE") {
    Bucket = Bucket + '-' + process.env.ENV;
}

exports.handler = async function (event, context) { //eslint-disable-line

    let param = {
        screen_name: 'suumo',
        exclude_replies: true,
        include_rts: false,
    };
    try {
        const object = await S3.getObject({
            Bucket,
            Key: 'since_id',
        }).promise();

        param['since_id'] = object.Body.toString();
    } catch (e) {
        console.log(e)
    }

    const tweets = await twitterClient.get('statuses/user_timeline', param);

    console.log(tweets);

    let nextSinceId;
    for (let tweet of tweets) {
        let expanded_text = tweet.text;

        console.log(tweet.extended_entities.media);

        for (let media of tweet.extended_entities.media) {
            expanded_text = expanded_text.replace(
                media.url,
                media.media_url_https,
            )
        }

        await webhook.send({
            text:  expanded_text,
            username: tweet.user.name,
            icon_url: tweet.user.profile_image_url_https,
            unfurl_links: true,
            unfurl_media: true,
        });

        if ((!nextSinceId) || (nextSinceId <= tweet.id_str)) {
            nextSinceId = tweet.id_str;
        }
    }

    if (nextSinceId) {
        await S3.putObject({
            Bucket,
            Key: 'since_id',
            ContentType: 'text/plain',
            Body: nextSinceId
        }).promise();
    }

    context.done(null, 'Hello World'); // SUCCESS with message
};
