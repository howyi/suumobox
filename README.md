[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/howyi/suumobox)
# 機能概要
スーモのツイートをSlackに送信します。
# Amplify Consoleを使用してデプロイ
## 事前準備
- SlackのIncoming WebhookのURLがあること
- TwitterのTokenを持っていること
## デプロイ
- 上記 `DEPLOY TO AMPLIFY CONSOLE` ボタンをクリックし、コンソールの手順に従ってデプロイする
- 反映後、Lambda `suumostalk-amplify` のコンソールへアクセスし、Slack,Twitterの設定を記載
## 構成
![](https://cdn-ak.f.st-hatena.com/images/fotolife/h/howyi/20190816/20190816111233.png)
---
<details><summary>手動インストール方法（クリックして展開）</summary>

## 事前準備
- SlackのIncoming WebhookのURLがあること
- TwitterのTokenを持っていること
- AWSのorganizationを持っていること
- Amplify-CLIを導入していること

## 手順
1. このリポジトリをclone
2. `./amplify/backend/function/suumostalk/suumostalk-cloudformation-template.json` の `####` となっている部分を書き換える
3. $ amplify init
4. $ amplify push

</details>
