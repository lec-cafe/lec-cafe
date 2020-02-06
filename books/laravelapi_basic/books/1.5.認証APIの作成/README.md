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
- `GET /profile` ユーザ情報を取得するためのAPI 

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

`DB_CONNECTION` を `sqlite` にする他、
その他の設定項目の `DB_` から始まるものを `#` をつけてコメントアウトします。

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
    Schema::create('users', function (Blueprint $table) {
        $table->increments('id');
        $table->string('name');
        $table->string('email')->unique();
        $table->string('password');
        $table->timestamps();
    });
    
    Schema::create('user_tokens', function (Blueprint $table) {
        $table->increments('id');
        $table->unsignedInteger('user_id');
        $table->string('token');
        $table->timestamps();
    });
}

public function down(){
    //テーブル削除
    Schema::dropIfExists('users');
    Schema::dropIfExists('user_tokens');
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

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $table = "users";

}
```

`app/UserToken.php` を以下のように記述します。

```
<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class UserToken extends Model
{
    protected $table = "user_tokens";

}
```

`$fillable` などの元から書かれている内容は消してしまってもOKです。

Laravelではこの `Illuminate\Database\Eloquent\Model` クラスを継承して作成したモデルクラスを利用して、
テーブルに対する様々な操作を行うことができます。

## ユーザ追加APIの作成

準備が整ったので実際にREST APIを作成していきましょう。

APIに関する情報はすべて `routes/api.php` に記述します。

まずは、タスクを追加するAPI `POST /user` を作成するため、
以下のようなかたちでPOSTのAPIを定義します。

```php
<?php
Route::post("/user",function(){
    $user = new \App\User();
    $user->user = request()->input("name");
    $user->email = request()->input("email");
    $user->password = request()->input("password");
    $user->save();
    return [
      "message" => "ユーザを作成しました"
    ];
});
```

上記の形式で作成したAPIは、Postmanなどのツールを用いて以下の形式でリクエスト可能です。

- URL: `/api/user`
- METHOD: `POST`
- BODY: JSON `{"name":"山田太郎","email":"taro@gmail.com",password:"pass"}`

[Postman \| Download Postman App](https://www.getpostman.com/downloads/)

リクエストを発行して実際にデータベースにデータが追加されることを確認してみましょう。

API経由で送られたJSONのデータは、
`request()->get("name")` のようにして取得することができます。

上記のコードでは new で `\App\User` クラスを作成して、name列にJSONのデータを格納し、
`save` でデータベースにデータを保存します。


ちなみにこのままでは パスワードがDBに直接保存されてしまいます。
以下のようにしてパスワードをハッシュ化してみましょう。

```php
<?php
Route::post("/user",function(){
    $user = new \App\User();
    $user->user = request()->input("name");
    $user->email = request()->input("email");
    $user->password = sha1(request()->input("password"));
    $user->save();
    return [];
});
```


## ログイン用のAPI

次に、ログイン用のAPI `POST /login` を作成します。
`routes/api.php` に以下のような記述を追加してみましょう。

```php
<?php
Route::post("/login",function(){
  $email = request()->input("email");
  $password = request()->input("password");
  
  $user = \App\User::where("email",$email)->first();
  if($user){
    if($user->password === sha1($password)){
      $token = new \App\UserToken();
      $token->user_id = $user->id;
      $token->token = \Illuminate\Support\Str::ramdom();
      $token->save();
      return [
        "token" => $token->token
      ];
    }      
  }
  abort(401);
});
```

上記の形式で作成したAPIは、Postmanなどのツールを用いて以下の形式でリクエスト可能です。

- URL: `/api/login`
- METHOD: `POST`
- BODY: JSON `{"email":"登録したEmail","password":"登録したパスワード"}`


APIリクエストを実行すると、
レスポンスにJSON形式でトークンが表示され、DBにもトークンが追加されるでしょう。

## 認証付きAPI

最後に、トークンを用いて認証を識別するAPI `GET /profile` を作成します。
`routes/api.php` を以下のような形式で編集してみましょう。

```php
<?php
Route::get("/profile",function(){
  $token = request()->bearerToken();
  $userToken = \App\UserToken::where("token",$token)->first();
  if($userToken){
    $user = \App\User::where("user_id",$userToken->user_id)->first();      
    return [
      "user" => $user
    ];
  }
  abort(401);
});
```

- URL: `/api/profile`
- METHOD: `GET`
- HEADER: Authorization: Bearer {作成されたトークン}

API の戻り地で ログインしたユーザの名前が表示されれば成功です！

## 認証処理の共通化

`app/Providers/AuthServiceProvider.php` に以下のような記述を追加してみましょう。

```php
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

...

/**
 * Register any application authentication / authorization services.
 *
 * @return void
 */
public function boot()
{
    $this->registerPolicies();

    Auth::viaRequest('custom-token', function ($request) {
      $token = request()->bearerToken();
      $userToken = \App\UserToken::where("token",$token)->first();
      if($userToken){
        $user = \App\User::where("user_id",$userToken->user_id)->first();      
        return $user;
      }
      return null;
    });
}
```

そして、 config/auth.php に以下の記述を追加します。

```php 
   'guards' => [
       'api' => [
           'driver' => 'custom-token',
       ],
   ],
```  

profile の API は以下のように書き換えが、         


```php
<?php
Route::middleware("auth:custom-token")->get("/profile",function(){
  return [
    "user" => Auth::guard("custom-token")->user()
  ];
});
```
