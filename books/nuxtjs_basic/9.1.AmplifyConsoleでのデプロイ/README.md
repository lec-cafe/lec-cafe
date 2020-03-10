# Amplify Consoleでのデプロイ

Amplify Consoleは、 Amazonの提供する静的ファイルのホスティングサービスです。

Amplify Consoleを利用することで簡単に高速な静的ファイル配信サービスを活用することが可能になります。

Amplify Consoleの利用にはAWSアカウントが必要ですので、
まだお持ちでない方は、以下よりアカウントの作成をお願いします。

https://aws.amazon.com/jp/register-flow/

AWSアカウントが作成できたら、ログインし、
サービスの一覧から `AWS Amplify` を選択します。

## Amplify Consoleを始める

AWS Amplifyには `Amplify Framework` と `Amplify Console` の2つのサービスが存在します。

まだAmplifyを利用したことがない場合、以下のAmplify URLには、2つのボタンが表示されているかと思いますので、
Amplify Consoleの方を選んで、サービスの利用を初めましょう。

https://us-east-2.console.aws.amazon.com/amplify/home

### Amplify Consoleの利用

Amplify Consoleは様々なソース元からソースコードを取得し、
自動的なWebサイトの更新を実現してくれるツールです。

Amplify Consoleでは、以下のようなGitリポジトリのサービスと連携を始めることができます。

- GtiHub
- BitBucket 
- GitLab
- AWS CodeCommit

::: tip
Deploy without Git providerを選択して、
Git管理されていないソースを配信することも可能です。
::: 

### GitHubとの連携

実際にAmplify Consoleでサイトを配信するにあたって、
とりあえずGitHubとの連携をベースに解説を進めていきますので、
Webサイトのソースを管理しているGitリポジトリを1つ、用意しておきましょう。

Amplify Consoleの画面でGitHubを選択して、 Continueをクリックすると、
GitHubとの認証画面に飛びます。アカウントを連携すると、リポジトリとブランチを選択する画面に遷移するので、
ターゲットのリポジトリを選択してみましょう。

ビルドの設定などは一旦そのままでOKです。最後に `保存してデプロイ` のボタンをクリックすればアプリケーションが登録されます。

### ビルドの設定

アプリケーションの設定が完了したら、サイトのビルドが始まります。

ビルドが失敗する場合には、ビルドの設定を行う必要があるでしょう。

ビルドの設定はアプリケーション画面左のメニューからアクセスできます。

ビルドの設定はYamlファイルで記述します。
一般的なNode.jsアプリケーションの場合、以下のような設定になるでしょう。

```yaml
version: 1.0
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    # IMPORTANT - Please verify your build output directory
    baseDirectory: /dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

主な設定は、frontendセクションの中で記述します。
`phases` はビルド処理に関するコマンドで、以下のような項目でサイトの設定を追記することができます。

- `preBuild.commands` ビルド前の前処理で、依存解決やファイルのチェック等を行う。
- `build.commands` ビルド前の前処理で、依存解決やファイルのチェック等を行う。

`artifacts` はサイトの配信に関する設定です。

- `baseDirectory` 実際に配信する対象となるフォルダ
- `files` 配信対象のフォルダをパターン形式で記述

`cache,.paths` では、デプロイフェーズでキャッシュするファイルを指定することができます。

これらの設定ファイルは、Amplify Consoleの画面上から編集する他にも、
リポジトリルートにamplify.ymlを配置して、コードベースで管理することも可能です。

amplify.ymlの詳細なドキュメントに関しては以下を確認してください。

https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html

::: tip
ビルドの設定の画面では、 amplify.ymlファイルの設定編集のほか、
ビルドに利用するイメージの設定やビルドのタイムアウトに関する設定を加えることが可能です。
:::

## Tips 

### GitHubのPreview環境構築

アプリケーション内メニューのPreviewsのセクションから構築が可能です。

Previewsを有効にすることでPull Requestと連動してPreview環境を構築することが可能です。

### 環境内でのパス構成

初期状態でのpwdは `/codebuild/output/src930812300/src/{app_name}` のような構成で、
`~/` は `/root/` となっています。

preBuild内で行ったcdはbuildステージでも維持されます。

artifacts.baseDirectoryの相対パスは、初期状態でのpwdからの相対パス指定となります。

### ブランチ固有のビルド設定

amplify.ymlファイル内では `${ }` を利用して各種環境変数が利用可能です。

${AWS_BRANCH} の形式でビルド対象のブランチ名が取得可能なため、コレを利用してブランチ固有のビルド設定を記述できます。

```yaml
frontend:
  phases:
    build:
      commands:
        - if [ “${AWS_BRANCH}” = “master” ]; then echo “master branch”; fi
        - if [ "${AWS_BRANCH}" = "dev" ]; then echo "dev branch"; fi
```

他にも以下のような環境変数が利用可能です。

- `AWS_APP_ID` 現在のビルドのアプリID
- `AWS_BRANCH` 現在のビルドのブランチ名
- `AWS_BRANCH_ARN` 現在のビルドのブランチARN
- `AWS_CLONE_URL` Gitリポジトリの内容を取得するために使用されるクローンURL
- `AWS_COMMIT_ID` 現在のビルドのコミットID。再ビルドの「HEAD」
- `AWS_JOB_ID` 現在のビルドのジョブID。これには、「0」のパディングが含まれるため、長さは常に同じになります。

### Nodeのバージョンを変更する

デフォルトのコンテナ内ではnvmが利用可能なため、
`nvm use` コマンドを用いてNode.jsのバージョン指定が可能です。

```
frontend:
  phases:
    preBuild:
      commands:
        - nvm use $VERSION_NODE_10
        - npm ci
    build:
      commands:
        - node -v
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```


## Amplify Consoleの構成・料金

### Doamin構成

Amplify Consoleでは、デフォルトで仮ドメインが与えられるため、任意のドメインサービスと接続して、
独自ドメインをサイトに割り当てることが可能です。

サイトに独自ドメインを割り当てる際には `CNAME` レコードを利用すると良いでしょう。

https://branch-name.d1m7bkiki6tdw1.amplifyapp.com

ルートのドメインを割り当てるには、`ANAME/ALIAS` レコードの設定が必要になります。
一般的なDNSサービスでは `ANAME/ALIAS` レコードが設定可能なケースは少ないですが、
AWSのRoute 53で管理しているドメインであれば、より簡単にルートのドメインを設定することが可能です。

### コンテンツの配信

Amplify Consoleではコンテンツは、CDN経由で配信され、
キャッシュはコードコミットのたびに自動的に無効化されます。

https://docs.aws.amazon.com/ja_jp/amplify/latest/userguide/ttl.html

### 料金

Amplify Consoleの利用には、以下の項目での課金が発生します。

- ビルド & デプロイ処理時間
- ホスティング容量単位課金
- ホスティング配信単位単位課金

新規に作成したAWSアカウントでは12ヶ月間のAWS無料利用枠が用意されているため、
通常の小規模なWebサイトホスティングであれば、無料利用枠内で利用することも可能です。

料金体系に関する正確な情報は以下の公式の料金ページをご確認ください。

https://aws.amazon.com/jp/amplify/console/pricing/
