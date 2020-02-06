---
title: 認証APIの開発
---

# 認証APIの開発

REST APIはHTTP通信を利用してデータの受け渡しを実現するためのシンプルなWebシステムの形です。

通常のLaravelアプリケーションのようにViewを用いてHTMLを生成するのではなく、
データのやり取りは単純なJSONの形式で行われます。

Webシステムを、REST API形式で構築することにより、フロントエンドのWebアプリケーションや、iOS / Androidなどのネイティブアプリケーションなど
様々な場面でLaravelを用いたデータベースシステムを活用する事ができるようになります。

まずははじめに、シンプルなタスクリストのAPIを作成して、
REST API形式のWebシステムを構築するフローを確認してみましょう。

## 認証APIの設計

シンプルなタスクリストアプリケーションでは、
タスクの登録と削除、それにタスクの一覧取得が必要になります。

REST APIは、それぞれの機能にURLとHTTP Methodを与えて、
Web経由でリクエスト可能な機能を提供します。

HTTP Methodには、 `GET` `POST` `PUT` `PATCH` `DELETE` などの種別があり、  
それぞれ `取得(GET)` `各種処理(POST)` `データの追加(PUT)` `データの更新(PATCH)` `データの削除(DELETE)`
などの意味が与えられています。

これからシンプルなタスクリストアプリケーションのAPIを作成するにあたり、
以下のような3本のAPI構築を目標にしてみましょう。

- `POST /user` ユーザを登録するAPI
- `POST /login` ログインしてトークンを発行するためのAPI 
- `POST /profile` ユーザ情報を取得するためのAPI 

## データベースのセットアップ

DBを利用したアプリケーションを作成するために、
まずは、LaravelにおけるDatabaseの設定を行いましょう。

Laravelアプリケーションがデータベースに接続可能なように、
`.env` ファイルに接続の設定を記述します。

デフォルトの状態では、homesteadで環境構築を行った場合の、
MySQL接続設定が記述されています。

homesteadのMySQL以外、例えばSQLiteでLaravelに接続する場合、`.env` ファイルは以下のように書き換えます。

```.dotenv
DB_CONNECTION=sqlite
#DB_HOST=127.0.0.1
#DB_PORT=3306
#DB_DATABASE=homestead
#DB_USERNAME=homestead
#DB_PASSWORD=secret
```

SQLiteを使用するために `database/database.sqlite` を作成しておきましょう。

```bash
$ touch database/database.sqlite
```

### テーブルの作成

データベースの接続設定ができたら、まずはテーブルを作成しましょう。

デフォルトで用意されている `database/migrations/2014_10_12_000000_create_users_table.php`
を以下のように変更してみましょう。

```php
public function up(){
    //テーブル作成
    Schema::create('m_users', function (Blueprint $table) {
        $table->increments('id');
        $table->string('name');
        $table->string('email');
        $table->string('password');
        $table->timestamps();
    });
    
    Schema::create('m_user_tokens', function (Blueprint $table) {
        $table->increments('id');
        $table->unsignedInteger('user_id');
        $table->string('token');
        $table->timestamps();
    });
}

public function down(){
    //テーブル削除
    Schema::dropIfExists('m_users');
    Schema::dropIfExists('m_user_tokens');
}
```

以上でDBの設定とマイグレーションの準備が整いました。
最後にmigrateコマンドを実行して完了です。

```bash
$ php artisan migrate
```

`migrate` コマンドはデータベースにテーブルを作成するためのコマンドで、
実行された順番を記録して、次回新しくマイグレーションのファイルを追加した際に続きからの実行を行ってくれます。

既存のマイグレーションファイルを編集した際など、マイグレーションを最初から実行し直したいときは `migrate:fresh` コマンドを実行します。

```bash
$ php artisan migrate:fresh
```

migrationのより詳しい使い方は、

https://laravel.com/docs/6.x/migrations

を参考にしてください。

### Eloquentの準備

テーブルが作成できたらタスクを投入するための、Eloquent Modelを作成しましょう。

`app/User.php` を以下のように記述します。

```
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = "m_users";

}
```

Laravelではこの `Illuminate\Database\Eloquent\Model` クラスを継承して作成したモデルクラスを利用して、
テーブルに対する様々な操作を行うことができます。

## タスク追加APIの作成

準備が整ったので実際にREST APIを作成していきましょう。

APIに関する情報はすべて `routes/api.php` に記述します。

まずは、タスクを追加するAPI `POST /task` を作成するため、
以下のようなかたちでPOSTのAPIを定義します。

```php
<?php
Route::post("/task",function(){
    $task = new \App\Task();
    $task->name = request()->input("name");
    $task->save();
    return [];
});
```

上記の形式で作成したAPIは、Postmanなどのツールを用いて以下の形式でリクエスト可能です。

- URL: `/api/task`
- METHOD: `POST`
- BODY: JSON `{"name":"牛乳を買う"}`

[Postman \| Download Postman App](https://www.getpostman.com/downloads/)

リクエストを発行して実際にデータベースにデータが追加されることを確認してみましょう。

API経由で送られたJSONのデータは、
`request()->get("name")` のようにして取得することができます。

上記のコードでは `\App\Task` クラスを作成して、name列にJSONのデータを格納し、
`save` でデータベースにデータを保存します。

## タスク一覧を取得するAPI

次に、タスクの一覧を取得するAPI `GET /tasks` を作成します。
`GET` のAPIは以下のような形で `Route::get` を用いて `routes/api.php` に記述します。

```php
<?php
Route::get("/tasks",function(){
    return \App\Task::all();
});
```

上記の形式で作成したAPIは、Postmanなどのツールを用いて以下の形式でリクエスト可能です。

- URL: `/api/tasks`
- METHOD: `GET`

APIリクエストを実行すると、
レスポンスにJSON形式でタスクの一覧が表示され、先程追加したデータが表示されるのが確認できるでしょう。

Laravelで記述したルート関数では、returnした内容がそのままレスポンスとして利用されます。
配列 `[]` やEloquentのコレクションをreturnにわたすことで、
自動的にJSON形式に変換されてREST APIとして機能する様に動作させることができます。

JSON形式への変換は再帰的に行われるため、以下のように任意の配列構造を作成することもできます。

```php
<?php
Route::get("/tasks",function(){
    return [
        "status" => "OK",
        "tasks" => \App\Task::all(),
    ];
});
```

## タスクを更新・削除するAPI

最後に、タスクを削除するAPI `GET /task/{id}` を作成します。
`DELETE` のAPIは以下のような形で `Route::delete` を用いて `routes/api.php` に記述します。


通常Webページを利用するシステムではGET / POSTのHTTP Methodがよく用いられますが、
REST APIではPATCH / PUT / DELETEなどのHTTP Methodもよく用いられます。

```php
<?php
Route::delete("/task/{id}",function($id){
    $task = \App\Task::find($id);
    if($task){
        $task->delete();
    }    
    return [];
});
```

RouteでURLを記述する際に `/task/{id}` のように `{ }` を利用して記述すると、
その部分は任意の文字列にマッチするようになります。 

マッチした文字列は関数の引数として `$id` のように取得可能です。

`\App\Task::find($id)` はIDを指定してEloquentのモデルを取得する方法で、
取得したオブジェクトに対して `delete` をコールすることで、
該当のオブジェクトを削除することが可能になります。

Eloquentのより詳しい使い方は以下を参考にしてください。

https://laravel.com/docs/5.8/eloquent

