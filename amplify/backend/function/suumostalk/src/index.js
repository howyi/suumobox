/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const { IncomingWebhook } = require('@slack/webhook');
// Lambdaの環境変数からSlackのIncoming WebhookのURLを取得する
const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

const Twitter = require('twitter');

// Lambdaの環境変数からTwitterの設定を取得する
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

// ① CloudWatch Eventsで定期的に実行される想定
exports.handler = async function (event, context) { //eslint-disable-line

    let param = {
        screen_name: 'suumo',
        exclude_replies: true,
        include_rts: false,
    };
    try {
        // S3に最新取得ツイートIDが入っているか確認し、入っていた場合はそれ以降のツイートしか取得しないようにする
        const object = await S3.getObject({
            Bucket,
            Key: 'since_id',
        }).promise();

        param['since_id'] = object.Body.toString();
    } catch (e) {
        console.log(e)
    }

    // ② twitterへ取得APIを実行する
    const tweets = await twitterClient.get('statuses/user_timeline', param);

    // ④ 取得したツイートをログへ投げておく
    console.log(tweets);

    let nextSinceId;
    for (let tweet of tweets) {
        let expanded_text = tweet.text;

        for (let media of tweet.extended_entities.media) {
            expanded_text = expanded_text.replace(
                media.url,
                media.media_url_https,
            )
        }

        // ④ SlackのIncoming Webhookで設定したチャンネルにツイートを投稿する
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
        // ③ 最新のツイートIDをS3へ保存する
        await S3.putObject({
            Bucket,
            Key: 'since_id',
            ContentType: 'text/plain',
            Body: nextSinceId
        }).promise();
    }
};
