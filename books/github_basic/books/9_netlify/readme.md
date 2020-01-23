---
permalink: /netlify
---
# Netlifyを使ってWebサイトをUpする

Netlifyを利用すれば、Netlifyに自分のGitHubリポジトリからWebサイトをUPすることができます。

## Netlifyを利用する

NetlifyはGitHubと連携して静的サイトの作成ができるWebサービスです。

以下のURLからLoginを選択してGithubアカウントを利用したサインアップが可能です。

https://www.netlify.com/

### Netlifyでサイトを作成する

Netlifyにログインしたら、 `New site from Git` からGitHubのリポジトリを選択します。


リポジトリ選択後は、以下のような設定で `Deploy Site` をクリックするとWebサイトの生成が始まります。

- Build Command: サイトにビルドコマンドを利用している場合、コマンドを記載
- Publish Directory: Webに公開するフォルダ名を記載

## NetlifyのDeploy設定

### ブランチデプロイ

`Setting` のタブより、`Build & deploy` の `Deploy contexts` の設定を行うことで、
ブランチごとのデプロイ設定を行うことができます。

`Branch Deploy` の設定項目は以下のような内容になっています。

- `All` リポジトリ上の全てのブランチをデプロイする
- `None production` ブランチのみをデプロイする
- `Let me add individual branches` デプロイするブランチを個別に指定する

デフォルトでは `None` に設定されており、productionブランチ（通常 `master`) のみが
Netlifyにデプロイされます。

`All` や `Let me add individual branches` で個別にブランチを設定するなどすることで、
`master` 以外のブランチもNetlifyでのデプロイ対象に含めることが可能になり、
ブランチごとのサイトプレビューを `Deploy` のセクションから確認することができるようになります。
