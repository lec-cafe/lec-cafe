---
title: Laravel におけるDI
---

# LaravelにおけるDI

LaravelにおけるDIは、モジュール間の依存関係を処理する重要な設計思想です。

ページのアプリケーションでは、複雑なViewロジックで
コードは複雑になりがちですが、 REST APIのようにResponse周りのロジックが
シンプルな構造のシステムは、工夫次第でコードの可読性・柔軟性を大きく改善できます。

LaravelにおけるDIの仕組みを理解しながら、クラス設計の基礎を理解していきましょう。

## アクションクラスの生成

まずはRouteの処理をクラスに記述するようコードを修正していきましょう。

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
        $query = $query->limit(request()->get("limit", 10));

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

実際にAPIにアクセスして正しく動作が行われているか確認してみましょう。

## Repositoryパターンの利用

これまでのコードでは、DB関連の処理を直接Eloquent経由で実施してきました。

しかし、アプリケーション全体を眺めた際に、Eloquentの提供する機能は膨大で大きすぎるため、
これらを直接ルートから利用するのは、危険なケースも多々あります。

アプリケーションの中でDBへのアクセスを制御しようとするとき、
一般的にRepositoryパターンと呼ばれる手法がよく用いられます。
Repositoryパターンでは、Repositoryと呼ばれるクラスを定義して、
アプリケーション内でのDB操作をひとまとめに管理します。

タスクテーブルへのクラスの操作を制御するための `TaskRepository` を作成するために、
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
namespace App\Http\Actions;

use App\Repository\TaskRepository;

class TaskListAction
{
    public function handle()
    {
        $repo = new TaskRepository();

        $sort = request()->get("sort","DESC");
        $limit = request()->get("limit", 10);

        return [
            "tasks" => $repo->getList($sort,$limit)
        ];
    }
}
```

上記の様に `TaskRepository` クラスを作成して `tasks` テーブルへの操作を
Eloquentではなく `TaskRepository` クラスに経由に限定することで、
アプリケーション全体で `tasks` テーブルに対してどの様な操作がされているのか
ひと目で把握することができるようになります。

DBに対する処理の中には、特にDBの負荷を増大させるような重たい検索処理や、
ルール・想定に違反するような書き込み・更新・削除処理が含まれることもあるため、
万能なEloquentをアプリケーション全体で利用するよりも、
このようにしてRepositoryを作成して機能を制限するほうが安全です。

### Repositoryの設計

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

RepositoryはAPIのフォーマット等を意識する必要がない（意識してはならない）ため、
ソートのパラメータ等は、`request()` 関数経由で取得するのではなく、
引数で直接取得するようにしています。

引数リストは以下のような形でデフォルト値付きで記述することもできますが、
「デフォルト値が何か」といったことも、「APIの仕様」の範囲なので、
これも `Repository` 内では記述しません。

```php
    public function getList($sort="DESC",$limit=10)
    {
        // ...
    }
```

Repositoryは純粋なDB操作のみをコードとして表現するクラスです。
 `request()` によるリクエスト関連処理だけでなく、
ページアプリケーションでのセッションや、
認証関連処理もRepositoryからは除外する方が良いでしょう。 

APIの仕様に左右されない、純粋な　機能表現としてのDB操作をRepoisitoryに落とし込むことで、
後述する自動テストでの利便性や、変更に対して強いアプリケーション構成を整えることができます。

## ValueObjectの利用

上記の様な形のRepositoryを作成したところで、実はまだ完璧とは言えません。

Repositoryの `getList` メソドの戻り値はEloquentで取得できるため、
Actionでは`getList`の戻り値を利用して、簡単にEloquentの機能を利用することができます。

この様な問題に対応するためには、 ValueObjectと呼ばれる単純なデータのみを扱うクラスを作成する必要があります。

`app/ValueObject/TaskObject.php`を作成して以下のようなコードを記述してみましょう。

```php
<?php

namespace App\ValueObject;

use Carbon\Carbon;

class TaskObject
{
    public $name;

    public $createdAt;

    public function __construct(string $name,Carbon $createdAt)
    {
        $this->name = $name;
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
            $this->name,
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

これで、ルート内からEloquentの利用を防ぐことが可能になりました。

### ValueObjectのJSON整形

上記の例で実際にAPIリクエストを投げると以下のようなレスポンスが帰ってきます。

```json
{
    "tasks": [
        {
            "name": "牛乳を買う",
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

## DIの利用

先程までのコードではルートの中で直接Repositoryをnewして利用していました。

Repositoyの中でもEloquentを利用しています。

特定のコードが、その動作のために特定のコードを必要としているとき、
プログラミングの世界では「依存」という形でその関係性を定義します。

例えば先程までのコードはルートはRepositoryに依存しており、 RepositoryはEloquentに依存しています。

依存オブジェクトの調達を行うことを一般に「依存解決」といいます。

- 依存オブジェクトの要求に対して、何を作るか
- 依存オブジェクトの実体を誰がいつ作るか
- 作成された依存オブジェクトを誰が管理するか

と言ったテーマが依存解決を考える上で問題としてあがりうるため、
依存解決はコードの本質的な処理とは別の設計上の大きな関心ごとです。

DIはDependency Injectionの略で、日本語では「依存性の注入」と呼ばれる概念です。
要するに「依存」関係にあるコードは、内部で生成するよりも外部から持ち込むべき、という考え方です。

例えば先程までのルートのコードはDIの形式で記述すると以下のような形になるでしょう。

```php
<?php
namespace App\Http\Actions;

use App\Repository\TaskRepository;

class TaskListAction
{
    protected $repo;

    public function __construct(TaskRepository $repo)
    {
        $this->repo = $repo;
    }

    public function handle()
    {
        $sort = request()->get("sort","DESC");
        $limit = request()->get("limit", 10);

        return [
            "tasks" => $this->repo->getList($sort,$limit)
        ];
    }
}
```

ルートの内部でnewしていたリポジトリを、コンストラクタ経由で引数として渡すように書き換えられています。
単純な引数記述とは異なり、引数の型を明記することで何が必要なモジュールかを明示しています。

この書き換えられたルートの記述では、ルートがその動作に必要なオブジェクトを生成したり管理したりする責任を負いません。
ルートの処理に必要だったRepositoryは、ルートの内部で用意するのはなく、外部から渡されるようになりました。

DIと呼ばれるコードのパターンでは、特定のコード上で必要なオブジェクトを引数経由で受け取るようにすることで、
オブジェクトの生成や管理に関する問題をクラスの外部に追いやることができます。
逆に言えば、依存解決に関する問題はコードの外部に追いやられただけなので、
オブジェクトの生成は、DIによる記述が行われているコードの外でそのモジュールを利用する側が責任をもななければなりません。

LaravelではDI形式で記述された一部のクラスで、こうしたDI形式で記述した引数の自動解決の機能が設けられています。
 
上記のルートのコードでも、DI形式で記述した引数は自動的にLaravel側で用意され、
正しくリポジトリがルートに渡されます。 
 
このようなLaravelのDI機能は、以下のような場面（主にララベルが内部で生成orコールするクラス）で利用可能です。

- ルートクラスのコンストラクタ
- ルート関数の引数、ルートクラスのルートに相当するメソドの引数
- artisanクラスのコンストラクタ
- artisanのhandle関数
- Mailableクラスのコンストラクタ
- Jobクラスのコンストラクタ
- Jobクラスのhandle関数
- DIによる自動解決で呼ばれるクラスのコンストラクタ

### DIコンテナによる依存解決

DIの目的は、「依存解決の外部化」にありました。

DI形式で記述されたルートやartisan, Jobなどのクラスを適切に動作させるために、
Laravelでは依存解決の仕組み、DIコンテナが用意されています。 
DIコンテナは連想配列形式でオブジェクトを管理するグローバルなコンテナオブジェクトです。

通常LaravelでDIを行う上では、 ほとんどDIコンテナのことを意識する必要はありませんが、
特殊なDIによる解決を行う際に、DIコンテナの操作が必要になります。

Laravelの基本的なモジュール群はその殆どがDIコンテナ上に格納されており、
DIを経由してDIコンテナからそのオブジェクトを受け取ることができます。

例えば `request()` 関数で取得可能なRequestクラスのオブジェクトは以下の形式で取得することも可能です。

```php
<?php
namespace App\Http\Actions;

use App\Repository\TaskRepository;
use Illuminate\Http\Request;

class TaskListAction
{
    protected $repo;

    protected $request;

    public function __construct(TaskRepository $repo,Request $request)
    {
        $this->repo = $repo;
        $this->request = $request;
    }

    public function handle()
    {
        $sort = $this->request->get("sort","DESC");
        $limit = $this->request->get("limit", 10);

        return [
            "tasks" => $this->repo->getList($sort,$limit)
        ];
    }
}
```

上記では `Illuminate\Http\Request` というクラス名でRequestクラスを取得しています。

他にも、 `Illuminate\Mail\Mailer` でMailクラスを取得したり、
`Illuminate\Database\DatabaseManager` でDBクラスを取得したり、
`Illuminate\Auth\AuthManager` でAuthクラスを取得したりできます。

DIコンテナはLaravelのコードであれば `app()` 関数を利用して簡単にアクセス可能です。

DIを利用しない場合でも以下のような形式で、DIコンテナからオブジェクトを簡単に取り出すことができます。

```php
$request = app(\Illuminate\Http\Request::class);

$repository = app(\App\Repository\TaskRepository::class);
```

DIコンテナを用いて各種サービスを取りまとめどこからでも利用可能にする設計のパターンは
一般的にサービスロケーターパターンと呼ばれ、依存解決のための手法としてよく用いられます。

::: tip
DIを使った依存解決に比べ、 サービスロケータによる依存解決は設計手法としては悪手とされるケースがほとんどです。
`app()` を使ってコンテナから直接依存オブジェクトを取り出すよりも引数等を経由したDIの手法が利用できないか、
まず検討するほうが良いでしょう。
:::

Laravelでは習慣的に、`app()` を利用したDIコンテナへの操作は 
ServiceProvider上で行うのが好ましいとされています。
例えば `app()->extend()` 関数は、DIコンテナ上に登録されたオブジェクトに
特定の処理を施すことができます。

以下は `app()->extend()` を利用して前章のRequest Guardの処理を追加する例です。

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

use Illuminate\Auth\AuthManager;
use Illuminate\Auth\RequestGuard;

class AuthServiceProvider extends ServiceProvider
{
    // ...
    public function register()
    {
        app()->extend(AuthManager::class,function(AuthManager $auth){
            $auth->extend('custom-token', function () use($auth) {
                $guard = new RequestGuard(function(){
                    $token = request()->bearerToken();
                    return \App\User::where("token",$token)->first();                    
                }, request(), $auth->createUserProvider());
    
                $this->app->refresh('request', $guard, 'setRequest');
    
                return $guard;
            });
        });        
    }
}
```

DIコンテナ上に登録されたすべてのモジュールはこの様にextendを利用してその内部状態を
「各種システムから利用される前に」調整する事が可能になっています。

## 依存関係の逆転

DIパターンにより、依存の外部化は実現できたものの、
まだアプリケーションとして健全な状態ではありません。

依存は外部化できているものの、ルートなどのより具体的な処理は特定の処理実装に依存すべきではありません。

例えば、タスク一覧APIが欲しいのは、具体的なDBアクセスの処理そのものではなく、
条件を渡せばタスクの配列を返す、という入力と結果のみです。

一般的には「抽象に依存せよ」と呼ばれるもので、より抽象的な処理概念にルートを依存させるため、
インタフェースを用いる事ができます。

`app/Repository/TaskRepositoryInterface.php` を以下のような形で作成してみましょう。

```php
<?php
namespace App\Repository;

interface TaskRepositoryInterface
{
    public function getList($sort,$limit);
}
```

ルートは以下のような形になるでしょう。

```php
<?php
namespace App\Http\Actions;

use App\Repository\TaskRepositoryInterface;

class TaskListAction
{
    protected $repo;

    public function __construct(TaskRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }


    public function handle()
    {
        $sort = request()->get("sort","DESC");
        $limit = request()->get("limit", 10);

        return [
            "tasks" => $this->repo->getList($sort,$limit)
        ];
    }
}
```

リポジトリはこのインタフェースを利用して、以下のように変更されます。

```php
<?php
namespace App\Repository;

use App\Task;

class TaskRepository implements TaskRepositoryInterface
{
    public function getList($sort,$limit)
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

これでルートはリポジトリに依存することなく、リポジトリの抽象、
インタフェースに依存するようになりました。

注目すべきは、リポジトリがインタフェースを利用している（依存しいる）点です。
これまで依存される側だったリポジトリがインタフェースの登場で依存する側へと変化しています。
これが「依存関係逆転の法則」と呼ばれるものです。

依存されるオブジェクトは、変更が困難という問題があります。
変更が起こりやすい実装の実体は、依存されるよりも依存するオブジェクトである方が変更管理上は安全です。
抽象のインタフェースを利用することで、依存されていいたオブジェクトを依存する側に変更することで、
システムの柔軟性をより高めることができます。

### DIコンテナによるインタフェースの解決

リポジトリクラスをDIした際と異なり、インタフェースを使ったDIでは
依存解決がうまく行えず、実行時にエラーとなってしまいます。

クラスによるDIではクラス名 `` で依存オブジェクトを検索し、
該当するクラスを見つけて自動的に依存オブジェクトを生成することが可能ですが、
DIコンテナによる依存解決はインタフェース名 ` ` で検索しても
利用可能なクラス実体を見つけ出す事ができません。

このため、ServiceProvider上で以下のようにして
インタフェースと実体のヒモ付を行う必要があります。
`app/Providers/AppServiceProvider.php` を利用して以下のように記述しましょう。
 
```php
<?php
namespace App\Providers;

use App\Repository\TaskRepository;
use App\Repository\TaskRepositoryInterface;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        app()->singleton(TaskRepositoryInterface::class,function(){
            return  new TaskRepository();
        });
    }
    
    // ...
}
``` 

registerセクションでDIコンテナへの操作を記述しています。

`singoleton` はDIコンテナにモジュールを登録するメソドで、
`TaskRepositoryInterface` のクラス名で、`TaskRepository` の生成を紐づけて登録しています。

この記述を行うことで、引数に `TaskRepositoryInterface` を記述した際に `TaskRepository` が
自動的に注入されるようになります。

## サービスの設計

アプリケーションを開発する上で、特定の機能をクラスに分割して再利用可能な状態に置くことは
とても重要なコトです。

しかし、大量のクラスを生成してしまうと、クラス同士の依存関係はとても複雑になり、
システム設計の全容を把握するのがとても困難になります。

機能をクラスに分割しながら、なおかつシステムの全体をよりシンプルに保つための工夫として、
いくつかのクラス設計のポイントを抑えておきましょう。

### 単一責務の原則

クラスは、たった1つの責任のためにコードが記述されるべきという考え方を「単一責務の原則（SRP)」
クラスが全うすべき責任の範囲が明確化されていない場合、1つのクラスが様々なことを行ってしまい、
異なる用途で複数箇所からクラスが依存されてしまうなどの問題が生じます。

原則、クラスは1つの責任を全うすべきですし、万一クラスが複数の問題に対して
適用可能な状態となっている場合には、インタフェースを用いて機能を分離（ISP:インタフェース分離の原則）する事が望ましいでしょう。

古くからクラスの設計としてSOLID原則という考え方がよく参照されます。
SOLID原則は以下の5つの考え方の頭文字をとったもので、1つ1つが柔軟なクラス設計を考える上での重要な指標になる考え方です。

- 単一責務の原則Single Responsibility Principle (SRP)
- オープンクローズドの原則Open Closed Principle (OCP)
- リスコフの置換原則Liskov Substitution Principle (LSP)
- インタフェース分離の原則Interface Segregation Principle (ISP)
- 依存性逆転の原則Dependency Inversion Principle (DIP)

### レイヤードアーキテクチャ

クラスの責務を検討する上で、アプリケーション内での働きを層状に把握する事は非常に効果的です。

例えばルートからDBのデータを取得する、といったケースを考えたとき、以下の様なレイヤーが考えられます。

- DB層 : データベースへの接続とSQL処理を行う層
- Gateway(Repository) 層 : DB層を用いてアプリケーションに必要なDB操作を提供する層
- UseCase層 : Gateway層を用いてアプリケーションに必要なビジネスロジックを記述する層
- アプリケーション層 : リクエストを受け取りUseCase層を用いてルートの処理を提供する層

それぞれのレイヤーは、仕様変更に対する影響度合いを定義しており、
レイヤーを分割する事により、仕様変更の度合いに応じて生じる修正範囲を最小限に留める働きを持っています。

アプリケーションを層状に把握して、それぞれのレイヤーに適切な責務を担当させて
アプリケーション全体の依存の流れを管理する考え方をレイヤードアーキテクチャと呼びます。
上記のレイヤー分割とその命名はCleanアーキテクチャと呼ばれる、レイヤードアーキテクチャの一種から借用したものですが、
レイヤードアーキテクチャの分野では他にも様々な形のレイヤー設計が提案されています。

### ステートレスなクラス設計

クラスはプロパティを用いて、その内部に状態をもたせることが可能ですが、
クラス内部に用意された状態は、時として条件付きバグの温床になります。

クラス内プロパティが特定の値に書き換えられているケースでのみAのメソドをコールすると例外が発生、
などと言ったバグは、原因検出も困難で障害調査のコストを大幅に増加させるでしょう。

この様な問題を回避するためには、クラスプロパティを利用せず、
単純なメソドのみを用いたクラス設計を行うのがベストです。

クラス内に用意された「状態」は一般的に「ステート」と呼ばれ、
クラス内に状態を持たないクラスをステートレスなクラス、と呼びます。
