---
---

# REST APIのユニットテスト

HTMLを生成するページアプリケーションでは、
ビューロジックの変動によりHTMLが頻繁に変化しやすいためE2Eテストが行いづらいという欠点がありました。

これに対してJSONを返却するREST APIはビューロジックによるレスポンスの変更を受けにくく、
比較的簡単にE2Eテストを実行する事ができます。

LaravelではREST APIを用いたアプリケーションで、
簡単にテストケースを記述してActionのテストを行う仕組みが用意されています。

Laravelを通じてREST APIの自動テストを行う手法を確認していきましょう。

## PHPUnitのテストを実行する

まずはLaravelに付属敷いているPHPUnitのテストの実行方法を確認しておきましょう。

Laravelの環境ではデフォルトでPHPUnitがインストールされているため、
`./vendor/bin/phpunit` コマンドでユニットテストを実行できます。

```php
$ ./vendor/bin/phpunit
PHPUnit 7.5.2 by Sebastian Bergmann and contributors.

..                                                                  2 / 2 (100%)

Time: 143 ms, Memory: 16.00MB

OK (2 tests, 2 assertions)
```

テスト実行環境をカスタマイズしたい場合には、 リポジトリルートの `phpunit.xml` を利用します。

例えばテスト実行時の環境変数は `phpunit.php.env` のセクションを追加することで定義できます。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit backupGlobals="false"
         backupStaticAttributes="false"
         bootstrap="vendor/autoload.php"
         colors="true"
         convertErrorsToExceptions="true"
         convertNoticesToExceptions="true"
         convertWarningsToExceptions="true"
         processIsolation="false"
         stopOnFailure="false">
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">./tests/Unit</directory>
        </testsuite>

        <testsuite name="Feature">
            <directory suffix="Test.php">./tests/Feature</directory>
        </testsuite>
    </testsuites>
    <filter>
        <whitelist processUncoveredFilesFromWhitelist="true">
            <directory suffix=".php">./app</directory>
        </whitelist>
    </filter>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="BCRYPT_ROUNDS" value="4"/>
        <env name="CACHE_DRIVER" value="array"/>
        <env name="MAIL_DRIVER" value="array"/>
        <env name="QUEUE_CONNECTION" value="sync"/>
        <env name="SESSION_DRIVER" value="array"/>
    </php>
</phpunit>
```

::: tip
Telescopeを導入している環境では、`ReflectionException: Class env does not exist`
のエラーが表示されるかも知れません。
これは[既知の障害](https://github.com/laravel/telescope/issues/347)に起因するもののため、
`<env name="TELESCOPE_ENABLED" value="false"/>` を追加して、テスト中のTelescopeを無効化するよう調整が必要です。
:::

### テストコードのフォルダ

テストのコードは、 `tests`フォルダ内に記述していきます。

`tests` フォルダには `Feature` と `Unit` のディレクトリが用意されており、
以下のような形で使い分けがされるケースがほとんどです。

- `Feature` REST APIやページなどのリクエスト単位のテスト
- `Unit` 作成したServiceなどのユニットテスト

例えばこの他に、特定のサービスとの連携など独自のフォルダ構成のテストを追加する場合には、
`phpunit.xml` にてテストのフォルダを追加することができます。

```xml
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">./tests/Unit</directory>
        </testsuite>

        <testsuite name="Feature">
            <directory suffix="Test.php">./tests/Feature</directory>
        </testsuite>

        <testsuite name="MailSystem">
            <directory suffix="Test.php">./tests/MailSystem</directory>
        </testsuite>
    </testsuites>
```

上記の例では `./tests/MailSystem` というテストのフォルダを追加しています。

testsuite要素に `name` を付与することで、 testsuiteの単位でテストを実行することが可能になります。

例えば `Feature` のtestsuiteのみを実行するには以下のようにtestsuiteオプションを付与してコマンドを実行します。

```bash
./vendor/bin/phpunit --testsuite Feature
```

## REST APIのテストを実行する

PHPUnitの準備が整ったところで実際にテストを記述していきましょう。

`tests/Feature/TaskAPITest.php` を作成して、以下のような形でテストのコードを記述します。

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;

class TaskAPITest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testタスクリストAPIの検証()
    {
        $response = $this->json('get','/api/tasks');

        $response->assertStatus(200);
    }
}
```

テストのメソドは `public` でメソド名を `test` で始めて記述します。
わかりやすさのために、メソド名に日本語を用いるケースも多く見られます。

上記のテストコードでは、　`/api/tasks` のルートを実行して、
レスポンスのステータスコードが `200` になることを検証しています。

::: tip
Laravelのテストでgetなどを使ったリクエストのテストは、
実際にはサーバ経由でリクエストを処理しているわけではないので、厳密な意味ではE2Eテストとは異なります。 
:::

### Requestを発行する

`Tests\TestCase` を継承したテストクラスの中では、
`$this->json` を経由して、任意のURLのアクションを実行できます。

第三引数ではリクエストボディのパラメータを配列で指定できる他、
第四引数を用いてリクエストヘッダを付与することも可能です。

```php
    public function testBasicTest()
    {
        $response = $this->json($method,$url,$data,$headers);
    }
```

jsonメソドは戻り値として $responseのオブジェクトを返します。

::: tip
`$this->json` は `$this->get` や `$this->call` などのリクエストと異なり、
APIリクエストに適したAcceptヘッダなどを付与するため、
より実際のAPIリクエストに近い形でリクエスト処理を行うことができます。
:::

### Responseを検証する

取得した `$response` を用いて様々な検証が可能です。

`$response->assertStatus` はレスポンスのステータスコードを検証することができます。

```php
    public function testタスクリストAPIの検証()
    {
        $response = $this->json('get','/api/tasks');

        $response->assertStatus(200);
    }
```

`$response->decodeResponseJson()` はJSON形式でリクエストボディを取得する関数です。

JSON形式で生成されたリクエストボディを、パースされた配列の状態で取得できるため、
取得したデータを用いた様々な検証を行う事ができます。

```php
use PHPUnit\Framework\Assert;

//...

    public function testタスクリストAPIの検証()
    {
        $response = $this->json('get','/api/tasks');

        $response->assertStatus(200);
        $data = $response->decodeResponseJson();
        Assert::assertTrue(array_key_exists("tasks",$data));
    }
```

PHPUnitで独自の検証を行う場合には、 `PHPUnit\Framework\Assert` クラスを利用します。

Assertクラスには様々な検証用の関数が用意されていますが、主に以下のようなものを抑えておけば問題ないでしょう。

- Assert::assertTrue($a) `$a` がtrueであることを検証する。
- Assert::assertEquals($a, $b) `$a` と `$b` が等しいことを検証する。

::: tip 
これまで作成したAPIのテストを実際に作成して、
自動テストの記述方法を確認してみましょう。
:::
