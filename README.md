<p align="center">
  <strong>スーモのツイートをSlackに送信します</strong><br>
  <a href="https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/howyi/suumobox">
    <img src="https://oneclick.amplifyapp.com/button.svg" alt="Deploy to Amplify Console">
  </a>
</p>

## 事前準備
- SlackのIncoming WebhookのURLがあること
- TwitterのTokenを持っていること
## デプロイ
- 上記 `DEPLOY TO AMPLIFY CONSOLE` ボタンをクリックし、コンソールの手順に従ってデプロイする
- 反映後、Lambda `suumostalk-amplify` のコンソールへアクセスし、Slack,Twitterの設定を記載
## 構成
![](https://cdn-ak.f.st-hatena.com/images/fotolife/h/howyi/20190816/20190816111233.png)

