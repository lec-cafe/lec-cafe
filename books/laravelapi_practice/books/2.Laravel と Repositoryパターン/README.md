# LaravelとRepositoryパターン

## Repositoryパターン

Repositoryパターンは、アプリケーションにおけるデータ操作を抽象化するためのクラス設計です。

データ操作に関する処理をRepositoryと呼ばれるクラスに集約させることで、
アプリケーション内でのデータ操作を共通化し、一貫したデータ操作を行うことができるようになります。

簡単なステップでRepositoryクラスを作成しながら、
Repositoryパターンの実践について確認していきましょう。

## アクションクラスの生成

まずはサンプルのルートを作成してみましょう。

以下のようなテーブルを取り扱う、`App\Task` Eloquentに関する処理を想定します。

```php
<?php 
Schema::create('tasks', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('title');
    $table->integer('priority');
    $table->string('category');
    $table->timestamps();
});
```

`App\Task` Eloquentを利用してタスクの一覧を生成するAPIを
`app/Http/Controllers/TaskListController.php` を作成して以下のように記述します。

```php
<?php
namespace App\Http\Controllers;

use App\Task;

class TaskListController
{
    public function getList()
    {
        $query = new Task();
        $query = $query->orderBy("created_at",request()->get("sort","DESC"));
        $query = $query->limit(request()->get("limit", 5));

        return [
            "tasks" => $query->get()
        ];
    }
}
```

より実際に即した処理にするため、多少のロジックを入れています。

リクエストパラメーターの `sort` でソート順が変更可能となっており、
`limit` で取得件数を変更できます。それぞれ `DESC` `10` の初期値が用意されています。

次に `routes/api.php` で以下のようにルートを定義すれば準備は完了です。

```php
Route::get("task/list","TaskListController@getList");
```

データベースにサンプルデータを複数格納し、実際にAPIにアクセスして、
正しく動作が行われているか確認してみましょう。

## Repositoryパターンの利用

ルート内で直接Eloquentを操作して処理してきたコードを、
Repostiroyパターンを利用して実装してみましょう。

Taskテーブルへの操作を制御するための `TaskRepository` を作成するために、
`app/Repository/TaskRepository.php` を作成して以下のようなコードを記述してみましょう。

```php
<?php
namespace App\Repository;

use App\Task;

class TaskRepository
{
    public function getList($sort,$limit)
    {
        $query = new Task();
        $query = $query->orderBy("created_at",$sort);
        $query = $query->limit($limit);

        return $query->get();
    }
}
```

ルートから利用する場合は以下のようなコードになります。

```php
<?php
namespace App\Http\Controllers;

use App\Repository\TaskRepository;

class TaskListController
{
    public function handle()
    {
        $sort = request()->get("sort","DESC");
        $limit = request()->get("limit", 10);

        $repo = new TaskRepository();

        return [
            "tasks" => $repo->getList($sort,$limit)
        ];
    }
}
```

上記のように記述することで、ルート内での処理はより明瞭になります。

Repositoryをコールして処理を実行していることに加え、
ルート内で利用しているパラメータも明確に判断することができます。

また、アプリケーション内でのデータ処理をRepository経由に限定することで、
アプリケーション全体で `tasks` テーブルに対してどの様な操作がされているのか
ひと目で把握することができるようになります。

他のCRUD処理全体に関しても同様の手法で、Repositoryを作成することができます。

## Repositoryの設計

先に作成したリポジトリのコードを見てみましょう。

```php
<?php
namespace App\Repository;

use App\Task;

class TaskRepository
{
    public function getList($sort,$limit)
    {
        $query = new Task();
        $query = $query->orderBy("created_at",$sort);
        $query = $query->limit($limit);

        return $query->get();
    }

}
```

Repositoryの設計で重要なのはRepositoryにはDB操作に関するコードのみを記載するということです。

Repositoryはアプリケーション全体でのデータ利用に関するロジックを記載する場所となるため、
Controllerからのリクエストフォーマット等を意識してはいけません。

パラメータ等は、`request()` 関数経由で取得するのではなく、引数で直接取得するようにしています。

引数リストは以下のような形でデフォルト値付きで記述することもできますが、
「デフォルト値が何か」といったことも、「APIの仕様」の範囲なので、
これもRepository内では記述しないほうがいいでしょう。

```php
    public function getList($sort="DESC",$limit=10)
    {
        // ...
    }
```

Repositoryは純粋なDB操作のみをコードとして表現するクラスです。

`request()` によるリクエスト関連処理だけでなく、ページアプリケーションでのセッションや、
認証関連処理もRepositoryからは除外する方が良いでしょう。 

ルートの仕様に左右されない、
純粋な機能表現としてのDB操作をRepoisitoryに落とし込むことで、
自動テストでの利便性や、変更に対して強いアプリケーション構成を整えることができます。

## ValueObjectの利用

上記のようなRepositoryコードを利用して、
ルートの処理とデータアクセスの処理を分離することができました。

しかし、上記のコードでは、 `getList` の戻り値はEloquentで取得できるため、
Controller内で `getList`の戻り値を利用して、簡単にEloquentの機能を利用することができます。

Controolerに対してシンプルなデータモデルを提供するために、
ValueObjectと呼ばれるクラスを作成してみましょう。

`app/ValueObject/TaskObject.php`を作成して以下のようなコードを記述します。

```php
<?php

namespace App\ValueObject;

use Carbon\Carbon;

class TaskObject
{
    public $title;

    public $createdAt;

    public function __construct(string $title,Carbon $createdAt)
    {
        $this->title = $title;
        $this->createdAt = $createdAt;
    }
}
```

ValueObjectではtasksテーブルの中でアプリケーションにとって必要な情報のみを
プロパティとして定義し、単純なデータの入れ物として作成します。

EloquentをこのValueObjectに変換するためにはEloquentに以下のようなメソドを追加します。

```php
<?php

namespace App;

use App\ValueObject\TaskObject;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = "tasks";

    public function toValueObject(){
        return new TaskObject(
            $this->title,
            $this->created_at
        );
    }
}
```

Repositoryは以下のように修正して作業完了です。

```php
<?php
class TaskRepository
{
    public function getList($sort="DESC",$limit=10)
    {
        $query = new Task();
        $query = $query->orderBy("created_at",$sort);
        $query = $query->limit($limit);

        $result = $query->get();

        $rtn = [];
        foreach ($result as $row) {
            $rtn[] = $row->toValueObject();
        }
        return $rtn;
    }
}
```

Repository内部で取得したEloquentの結果セットを、
Eloquentにて定義した `toValueObject` メソドを用いて
ValueObjectに変換し、Eloquentではない結果セットをreturnするように変更しています。

これで、`TaskRepository::getList` の戻り値は、
Eloquentのコレクションから、`TaskObject` のコレクションへと変化しました。

Eloquentではなくシンプルな `TaskObject`を利用することで、
アプリケーション全体で利用するデータモデルがDatabaseに依存しないものになります。

例えばtitle列がname列に名前変更された場合でも、
アプリケーション全体での影響は、ValueObject生成時のコードを変更することで吸収できます。

### ValueObjectのJSON整形

上記の例で実際にAPIリクエストを投げると以下のようなレスポンスが帰ってきます。

```json
{
    "tasks": [
        {
            "title": "牛乳を買う",
            "createdAt": {
                "date": "2019-01-31 11:29:17.000000",
                "timezone_type": 3,
                "timezone": "UTC"
            }
        },
        // ....
    ],
}
```

Carbonで表現されている日付情報がそのまま内部のデータを含めてJSON化されているため、
やや利用しづらいフォーマットになっています。

ValueObjectのような単純なJSON形式のデータを整形するには、
以下の様にValueObjectに対し `JsonSerializable` インタフェースを実装します。

```php
<?php
namespace App\ValueObject;

use Carbon\Carbon;

class TaskObject implements \JsonSerializable
{
    public $name;

    public $createdAt;

    public function __construct(string $name,Carbon $createdAt)
    {
        $this->name = $name;
        $this->createdAt = $createdAt;
    }

    public function jsonSerialize()
    {
        return [
            "name" => $this->name,
            "createdAt" => $this->createdAt->format("Y-m-d H:i:s")
        ];
    }
}
```

JsonSerializableインタフェースはオブジェクトがJSON化された際の挙動を制御する
インタフェースです。 `jsonSerialize` メソドの中で任意の配列をreturnすることで
JSON化された際の表現形式を制御する事ができます。

