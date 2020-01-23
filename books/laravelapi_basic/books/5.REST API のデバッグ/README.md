---
---

# REST API開発におけるデバッグ

これまでPHPアプリケーションのデバッグに、`var_dump` や `dd` を利用していた人にとって、
REST APIでのデバッグ実行は非常に分かりづらいものになるかもしれません。

REST APIでのデバッグ実行には、`var_dump` や `dd` のような画面に表示するタイプのデバッグが利用できないため、
デバッグのフローにも工夫が必要になります。

## Logを利用したデバッグ

最もシンプルな方法はログを利用したデバッグです。

以下のように記述して、ログファイルにメッセージを出力することができます。

```php
Log::debug('An informational message.');
```

Logクラスには、 PSR-7準拠で以下のようなメソドが実装されており、
適宜エラーレベルを切り替えることでログの出し分けを行うことができます。

```php
Log::emergency($message);
Log::alert($message);
Log::critical($message);
Log::error($message);
Log::warning($message);
Log::notice($message);
Log::info($message);
Log::debug($message);
```

## Telescopeを使ったデバッガの利用

Laravel 5.7からは新しくtelescopeと呼ばれるデバッガが導入されました。
telescopeを利用することでログだけではない、様々なAPIの情報をWeb画面から確認することが可能になります。

### 導入

telescopeを利用するには、関連モジュールをcomposer経由でインストールします。

```
$ composer require laravel/telescope
```

インストールが完了したら、`telescope:install` のartisanコマンドを実行して関連ファイルを作成します。 
データベースのセットアップが必要なため `migrate` の実行も行います。

```
$ php artisan telescope:install
$ php artisan migrate
```

`telescope:install` で生成されるのは以下のファイル群となります。

- TelescopeServiceProvider
- config/telescope.php 
- public/vendor/telescope配下のassets群

またconfig/app.phpにもServiceProviderの追加が行われます。

以後のtelescopeバージョンアップ等の更新に対応する際には、`php artisan telescope:publish` を利用することができます。

### Telescopeの利用

セットアップが完了すると、 `/telescope` のアドレスでtelescopeの管理画面を確認することができます。

![](/images/9/telescope.png)

発行されたAPIの リクエスト パラメータや レスポンスなど、様々な情報が時系列で確認できるようになっていあす。

### Telescopeの機能一覧

Telescopeで確認可能な項目として以下のようなものが用意されています。

- Request
- Commands
- Schedule
- Job
- Exception
- Logs
- Dumps
- Queries
- Models
- Mail
- Notification
- Gates
- Cache
- Redis


### Telescopeの管理

Telescopeはアプリケーションのログ情報を、常にテーブルへと格納していきます。

この挙動は、bool値の環境変数 `TELESCOPE_ENABLED` で管理が可能となっており、
falseに設定した場合、アプリケーションのログ出力は行われなくなります（ダッシュボードは有効）。

### 認証

telescopeの管理画面はデフォルトの状態では、環境変数 `APP_ENV=local` の状態でのみ有効です。

stagingやproductionの環境で利用するためには、
Laravelの認証機能を利用して、

`\App\Providers\TelescopeServiceProvider::gate`

に信頼できるユーザのEmailアドレスを追加する必要があります。
(ログイン機能等は自分で実装する必要があります）

### データの削除

データを削除する場合、`telescope:prune` メソドでデータを削除できます。

```
$ php artisan telescope:prune
```

古いデータのみ削除する場合には、`--hours` オプションでデータの期限を指定します。

```
$ php artisan telescope:prune --hours=48
```
