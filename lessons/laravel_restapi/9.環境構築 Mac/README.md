---
---

# Macを用いた環境構築

## PHP実行環境の構築

Macには通常PHP実行環境が標準で付属していますが、
ひとくちにPHPといっても、バージョンや付属する拡張機能などで様々な違いがあります。

Mac標準のPHPはOSのバージョンごとに採用されいてるPHPバージョンが異なる上、
付属している拡張機能も必要なものが揃っていないことが多く、そのままのものでは開発に利用するには不便です。

Mac環境でのPHP環境のインストールは、以下のサイトを利用するのが便利です。

https://php-osx.liip.ch/

このサイトで公開されているPHP環境は、主に開発で必要になる様々な拡張機能が標準で用意されているものとなっており、
以下のようなコマンドを用いて、任意のPHPをインストールすることができます。

```bash
$ curl -s https://php-osx.liip.ch/install.sh | bash -s 7.2
```

::: tip
上のコマンドでは `7.2` のバージョンのPHPが用意されます。
異なるバージョンのPHPが必要な場合は、`bash -s 7.3` のようにしてバージョン番号を指定します。
:::

::: tip
どのバージョンを選択するか迷った場合には、 `Current stable` のバージョンを選択すると良いでしょう。
:::

インストールしたPHPはMac本体にもとより搭載されているPHPとは別に、
`/usr/local/php5/bin/php` に展開されます。

このPHPをデフォルトに設定するには `~/.zprofile` に、以下の一行を追加してみてましょう。

```text
export PATH=/usr/local/php5/bin:$PATH
```

この状態で新しいターミナルを開き `php -v` でバージョンを確認して、
希望するバージョンに変更されていれば作業は完了です。

```bash
$ php -v
```

::: tip
`echo $SHELL` の出力結果が `/bin/bash` となる古いMac環境では、
`~/.zprofile` ではなく `~/.profile` を利用します。
:::

::: danger
profileの書き換えを誤ると、最悪PCにログイン不能になります。
操作手順に不安がある方は、経験のある方とペアで作業を行ってください。
:::

## Composer環境の構築

ComposerはPHPの依存解決ツールです。 Composerを利用することで、
Laravelを始めとする様々なPHPライブラリを簡単にインストールすることが可能になります。

Composerのインストールには以下のコマンドを利用します。

```bash
$ curl -sS https://getcomposer.org/installer | php
``` 

実行すると手元に `composer.phar` が作成されるため、パスの通った場所に移動させます。

```bash
$ sudo mv composer.phar /usr/local/bin/composer
```

最後にコマンドを実行して、バージョンが表示されればOKです。

```bash
$ composer --version
```

Composer経由でインストールされたコマンドを実行可能にするため、`~/.profile` などに、
`~/.composer/vendor/bin` のパスを通しておきましょう。

```text
export PATH=$PATH:$HOME/.composer/vendor/bin
```

## Laravel環境のセットアップ

Laravel環境のセットアップを簡単に行うためには、
公式から提供されているインストーラーを利用するのが便利です。

インストーラは以下のコマンドでインストール可能です。

```bash
$ composer global require laravel/installer
```

コマンドが完了したら `laravel new` コマンドで、Laravelの初期構成がセットアップ可能になります。

```bash
$ laravel new blog
```

上記のようなコマンドを実行することで手元にblogフォルダが作成され、内部にLaravelの初期構成が展開されます。

### SQLiteを利用する

ローカルMac環境でLaravelを利用する場合、SQLiteデータベースを利用するのが便利です。

`DB_CONNECTION=sqlite` の設定でSQLiteデータベースが利用可能となっており、
`.env` ファイルでの設定は以下のようになります。

```bash
DB_CONNECTION=sqlite
#DB_HOST=127.0.0.1
#DB_PORT=3306
#DB_DATABASE=homestead
#DB_USERNAME=homestead
#DB_PASSWORD=secret
```

SQLiteデータベースはを使用するために `database/database.sqlite` を作成しておきましょう。

```bash
$ touch database/database.sqlite
```

### Built-in Serverの起動

最後にセットアップが完了したら、Laravelのフォルダ（composer.jsonのある階層）に移動して
`php artisan serve` のコマンドを実行します。

```bash
$ php artisan serve
```

ブラウザで `http://localhost:8000` にアクセスしてLaravelの初期画面が表示されたらセットアップは完了です。

## Postgres環境の構築

MacでPoststres環境を構築する場合、
サーバアプリのPostgres.appを利用するのが便利です。

https://postgresapp.com/

インストールするとローカル環境にPostgresサーバが立ち上がります。

Postgres環境の接続にはPosticoというクライアントアプリがありますのでこちらをご利用ください。

https://eggerapps.at/postico/

::: tips 
データベースサーバに接続するためのアプリがクライアントアプリで、
データベースサーバを構築するためのアプリがサーバアプリです。
:::
