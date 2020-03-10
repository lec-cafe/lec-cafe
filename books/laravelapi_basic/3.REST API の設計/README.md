---
---

# REST APIの設計

REST APIは、プログラムでアクセスする分、
一般のWebサイトルートと違ってかなり複雑な設計が可能になります。

REST APIの構成要素は、リクエストとレスポンスからなり、それぞれ以下のような要素を検討する必要があります。

- リクエスト： URLやHTTP Method、Request BodyやRequest Header
- レスポンス： ステータスコードや、Response BodyやResponse Header

## ルートに関する設計

リクエストにおける、URLやHTTP Methodは、ルートの記述によって設定します。

APIのルートは、`routes/api.php` に、以下のようにRouteクラスを用いて記述します。

```php
<?php
Route::get("/status",function(){
    //...
});
```

Routeクラスは、HTTP Methodを利用して 
`Route::get` `Route::post` `Route::put` `Route::patch` `Route::delete` のように記述できます。

第一引数にはURLを指定し、第2引数に処理を行う関数を記述します。

::: warning
定義したメソドと異なるメソドでリクエストを受けた場合、Laravelは405のステータスコードを返します。
:::

同一のURLでもメソド違いで異なるAPIを作成することが可能です。

```php
<?php
Route::get("status", function(){
    return [
      "status" => "OK",
      "message" => "this is get api"
    ];
});

Route::post("status", function(){
    return [
      "status" => "OK",
      "message" => "this is post api"
    ];
});
```


### URL Parameter

URLの内部で `{ }` を指定すると、任意の文字にマッチするようになります。

```php
<?php 
Route::patch("/task/{id}",function($id){
    $task = \App\Task::find($id);
    if($task){
        $task->name = request()->input("name");
        $task->save();
    }    
    return [];
});
```

上記のルートは `/api/task/1` や `/api/task/2` にマッチするようになり、
関数の引数 `$id` にはそれぞれ `1` `2` が渡されます。

### API Prefix

`routes/api.php` 内で作成されたREST APIはURLに `/api/` のプレフィックスが付与されます。

APIの動作設定は、 `app/Providers/RouteServiceProvider.php` に記述されており、
これを修正することで、その挙動を変更することができます。

```php
    protected function mapApiRoutes()
    {
        Route::prefix('api') // URL に付与される プレフィックス
             ->middleware('api') // ミドルウェアのグループ
             ->namespace($this->namespace) // アクションクラスのデフォルト名前空間
             ->group(base_path('routes/api.php'));
    }
```

## リクエスト

### リクエストボディ

APIのリクエストではリクエストボディとして、様々なパラメータを送信することができます。

一般的にREST APIではJSON形式のリクエストボディが用いられ、ルート内では `request()->input()` の形式で、
JSONからデータを取得することが可能です。

例えば、以下のようなルートはJSON形式のリクエストボディ `{"name":"牛乳を買う"}` から、
nameの項目を取り出すことができます。

```php
<?php
Route::post("/task",function(){
    $task = new \App\Task();
    $task->name = request()->input("name");
    $task->save();
    return [];
});
```

単純にリクエストボディ全体を取得したい場合には、 `request()->all()` を取得します。

```php
<?php
Route::post("/status",function(){
    return [
        "payload" => request()->all()    
    ];
});
```

::: warning
HTTP Methodが `GET` `DELETE` の場合、リクエストボディにデータをセットすることは、一般的にふさわしくありません。
:::

### リクエストヘッダ

APIのリクエストでは、ヘッダと呼ばれる追加項目で、パラメータを送信することもできます。
リクエストボディがメインのパラメータとして用いられるのに対し、リクエストヘッダはサブのパラメータとしての位置づけで用いられることが多いです。

ヘッダから情報を取得するには、`request()->header()` を用います。

```php
<?php
Route::post("/search",function(){
    $category = request()->input("category");
    $limit = request()->header("X-COUNT");
    
    $books = \App\Book::where("category",$category)
        ->limit($limit)
        ->get();
    return $books;
});
```

上記のAPIでは、 ヘッダ項目 `X-COUNT` から取得する件数を指定できるようにしています。

::: tip
REST APIにおけるHTTP通信では、標準で様々なヘッダ情報が付与されています。
自分で任意に作成するヘッダ項目には、名前の重複を避けるために `X-` の接頭辞を付与するのがマナーです。
:::

## レスポンス

一般的にAPIのレスポンスは、JSON形式で送信されます。

Laravelではルート内で配列をreturnすることで、自動的にJSON形式のレスポンスを生成することができます。

```php
<?php
Route::get("status", function(){
    return [
      "status" => "OK",
      "message" => "no issues with systemn"
    ];
});
```

複数のキーや深い階層の配列を利用しても問題なくレスポンスを生成できます。

REST APIのレスポンスは、メインの情報であるレスポンスボディの他に、
ステータスコードやヘッダといった補足的な情報を添えることができます。

- ステータスコード： APIの結果の形式を、数値で表す
- レスポンスヘッダ： APIの補足的な情報を表現する

ステータスコードは、HTTP通信においては、一般的な成功の際には `200`  のステータスコードとなりますが、
データが存在しない場合には `404` システムエラーの場合には `503` など、
応答の種別によって適切な値をを返すのが好ましいケースもあります。

また、レスポンスヘッダは、API通信における補足的な返却情報です。
例えばユーザの一覧を返却するAPIでは、
レスポンスボディでJSON形式のユーザリストを返却し、
ページングの情報をレスポンスヘッダで返す、などといった使われ方をするケースもあります。

ステータスコードやレスポンスヘッダをルート内で定義する場合には以下のように `response` 関数を利用します。

第一引数にJSONにすべきレスポンスボディの配列、
第二引数に、ステータスコードを、第三引数にレスポンスヘッダを指定することが可能です。

```php
<?php
Route::get("status", function(){
    //...
    $headers = [
        "X-PAGE" => 1
    ];
    return response([
        "message" => "hello world"
    ],200,$headers);
});
```

::: tip
REST APIにおけるHTTP通信では、標準で様々なヘッダ情報が付与されています。
自分で任意に作成するヘッダ項目には、名前の重複を避けるために `X-` の接頭辞を付与するのがマナーです。
:::

## CORSの対応

CORSはブラウザのセキュリティ機能の1つで、
異なるオリジン間でのAPI通信をブロックするためのものです。

Laravelで作成したREST APIも例外ではなく、
通常同一オリジン下に置かれたアプリケーション以外からは、ブラウザ経由でのAPIアクセスをすることができません。

::: tip
オリジンとは、スキーマ（http/https) とドメイン、ポート番号をセットでまとめた概念です。
:::

### laravel-cors

作成したREST APIをCORSに対応させ、
様々なオリジンからアクセス可能にする場合、laravel-corsのライブラリを利用するのが便利です。

https://github.com/barryvdh/laravel-cors

laravel-corsを利用するには、 composerでモジュールをインストールします。
Service ProviderはAuto Discoveryで自動認識されるため登録は不要です。 

```
$ composer require barryvdh/laravel-cors
```

APIにCORS対応を入れる場合、ミドルウェアとして `\Barryvdh\Cors\HandleCors::class` を登録します。

```php
<?php
Route::get('status', function () {
    //
})->middleware(\Barryvdh\Cors\HandleCors::class);
```

アプリケーション全体で、CORS対応を入れる場合、
`app/Http/Kernel.php` の `$middleware` プロパティに登録すれば、
個別のルートに設定を行う手間は省けます。

### CORSの設定

CORSの詳細な設定を行う場合、 設定ファイルを利用して管理を行います。

以下のコマンドを実行すると `config/cors.php` が生成され、 CORSの詳細な設定を行うことができるようになります。

```
$ php artisan vendor:publish --provider="Barryvdh\Cors\ServiceProvider"
```

以下のような設定ファイル `config/cors.php` が生成されるため、この内容を編集してCORSの設定を編集することが可能です。

```
return [
     /*
     |--------------------------------------------------------------------------
     | Laravel CORS
     |--------------------------------------------------------------------------
     |
     | allowedOrigins, allowedHeaders and allowedMethods can be set to array('*')
     | to accept any value.
     |
     */
    'supportsCredentials' => false,
    'allowedOrigins' => ['*'],
    'allowedHeaders' => ['Content-Type', 'X-Requested-With'],
    'allowedMethods' => ['*'], // ex: ['GET', 'POST', 'PUT',  'DELETE']
    'exposedHeaders' => [],
    'maxAge' => 0,
];
```

::: warning
デフォルトの設定項目 `'allowedOrigins' => ['*']` は、
ブラウザのCORS制限を無効化するもので、アプリケーションのXSS脆弱性と組み合わせて、
大きなセキュリティリスクを引き起こす可能性があります。
:::



