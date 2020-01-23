---
title: Eloquent による DB 操作
---

# EloquentによるDB操作

Eloquentは、Laravelでデータベースの操作を行う際に用いられる一般的なO/Rマッパ ツールです。

通常データベースの操作にはSQL利用する必要がありますが、
Eloquentを利用することで複雑なSQLの管理を行う必要なく、データベースへの操作が可能になります。

## Eloquentの利用

Eloquentでは、1つのデータベース上のテーブルを、一つのクラスファイルで定義してデータベース操作を行います。

tasksテーブルに対して、Eloquentのクラスファイルを作成する場合、
`app/Task.php` を作成して以下のように記述します。

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = "tasks";

}
```

phpでクラスファイルを作成する上では、以下の点に注意してください。

- 拡張子は `.php` で作成する。
- クラス名とファイル名は揃える。

Eloquentでクラスを作成する際には、 `class Task extends Model` として `Model` クラスの継承を行う必要があります。

また `protected $table = "tasks";` のようにして、操作する対象のテーブルを指定します。

## Eloquentによるデータの追加

Eloquentを用いて、テーブルにデータを追加する場合、
例えば、タスクリストでデータを追加するコードは以下のようなかたちになります。

```
Route::post("/task",function(){
    $task = new \App\Task();
    $task->name = request()->get("name");
    $task->save();
    return [];
});
```

新規でデータを追加する際には、`new \App\Task()` のような形でオブジェクトを作成して、
`$task->name = request()->get("name");` のように、
作成したオブジェクトに対してプロパティとしてテーブル列の情報を与え、
最後に`$task->save()` でデータを保存します。

通常データベースへのデータ追加には `INSERT文` とよばれるSQLが必要ですが、
上記のようにプログラムを記述するだけでデータの追加が可能になります。

## Eloquentによるデータの取得

`\App\Task::all` メソドを利用して、テーブルのデータを全て取得することが可能です。

```php
<?php
Route::get("/tasks",function(){
    $tasks = \App\Task::all();
    return $tasks;
});
```

`\App\Task::all` を利用して取得したデータは複数のレコードのセットとなっており、
foreachなどの構文にかけて、反復処理を行うことが可能です。

```php
<?php
Route::get("/tasks",function(){
    $tasks = \App\Task::all();
    $response = [];
    foreach ($tasks as $task){
        $response[] = [
            "name" => $task->name
        ];
    }
    return $response;
});
```

テーブルの `id` をベースにデータを取得する際には `find` が利用可能です。
`find` は単一のレコードか `null` を返すため、データが取得できたかどうかは、
単純にifブロックを使って検証できます。

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

複雑な検索条件は、 `\App\Task::where` を利用して表現し、最後に `get` をコールしてデータを取得します。
以下では `category` 列に `雑誌` が入っているデータを取得するプログラムを記述しています。

`get` の戻り値は `all` と同様に複数のレコードのセットとなっています。

```php
<?php
Route::get("/tasks",function(){
    $tasks = \App\Task::where("category","雑誌")->get();
    $response = [];
    foreach ($tasks as $task){
        $response[] = [
            "name" => $task->name
        ];
    }
    return $response;
});
```

`orderBy` は検索結果の並び順を指定します。
第一引数に、並び替えで利用する列名を指定し、第二引数には `asc` か `desc` を指定します。

```php
<?php
Route::get("/tasks",function(){
    $tasks = \App\Task::where("category","雑誌")->orderBy('id','desc')->get();
    return $tasks;
});
```

`limit` を用いて、データの取得件数を制限することができます。

```php
<?php
Route::get("/tasks",function(){
    $tasks = \App\Task::where("category","雑誌")->limit(10)->get();
    return $tasks;
});
```

また `offset` は取得するデータの開始位置を指定します。

```php
<?php
Route::get("/tasks",function(){
    $tasks = \App\Task::where("category","雑誌")->offset(20)->limit(10)->get();
    return $tasks;
});
```

`groupBy` `limit` `offset` は組み合わせて使用することもでき、
記述が横に長くなる場合は、改行して記述することも可能です。

```php
<?php
Route::get("/tasks",function(){
    $tasks = \App\Task::where("category","雑誌")
        ->orderBy('id','desc')
        ->offset(20)
        ->limit(10)
        ->get();
    return $tasks;
});
```

## データの更新、削除

データを挿入する際には、 `new \App\Task()` としていましたが、
取得したEloquentの結果を用いてデータを更新、削除することも可能です。

以下のようにすることでタスクテーブルのname列の値を書き換えることが可能です。

```
$task = \App\Task::find($id);
$task->name = "新しいタスク名";
$task->save();
```

`delete()` をコールすれば、削除することも可能です。

```
$task = \App\Task::find($id);
$task->delete();
```
