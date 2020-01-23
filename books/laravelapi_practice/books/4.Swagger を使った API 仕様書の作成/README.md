---
title: OAS を使った API 仕様書の作成
---

# OAS 

Open API Specification(OAS) はAPI仕様書を記述するためのJSONフォーマットのドキュメントです。

昔はSwaggerと呼ばれていたものでJSON / Yamlのフォーマットを用いてAPI仕様書を記述することができるようになっています。

https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md

## OASでドキュメントを記述する

OASでドキュメントを記述する際には、オンラインのエディタSwagger-editorを利用する事ができます。

https://editor.swagger.io/

左側のエディタにOASドキュメントを入力すると、リアルタイムに右側でドキュメントのプレビューが表示されます。

OASドキュメントのサンプルは以下のリポジトリから取得することが可能です。

https://github.com/OAI/OpenAPI-Specification/tree/master/examples/v3.0

試しに、以下のようなドキュメントをエディタに記述してドキュメントを確認してみましょう。

```yaml
openapi: "3.0.2"
info:
  version: 1.0.0
  title: OSA Sample Document
  license:
    name: MIT
servers:
  - url: http://laravel-api.lec.cafe/api
paths:
  /tasks:
    get:
      summary: タスクの一覧を取得する
      operationId: listTasks
      tags:
        - task
      parameters:
        - name: limit
          in: query
          description: 取得するタスクの件数 (max 100)
          required: false
          schema:
            type: integer
            format: int32
      responses:
        '200':
          description: タスクの一覧を表示する
          content:
            application/json:    
              schema:
                type: array
                items:
                  required:
                    - id
                    - name
                  properties:
                    id:
                      type: integer
                      format: int64
                    name:
                      type: string
```

`openapi`  はドキュメントを記述するOASのバージョンを指定します。現時点での最新のドキュメントは `3.0.2` となっています。

`info` はドキュメントのメタ情報を定義します。
`info.version` はOASのバージョンとは異なる、ドキュメント自体のバージョン番号を表します。

https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#info-object

`servers`ではAPIをホストしているサーバを記述することができます。

https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#server-object

`paths` は各APIの定義を記述するセクションです。

### APIの定義

OASではAPIの各種定義は、`paths` のセクション内で行います。

`paths` の各セクション内に `paths.{URL}.{methods}` の形式でAPI定義を追加していきます。

URLの中にパスパラメータを含む場合は `{}` でくくって記述することができます。

```yaml
paths:
  /tasks:
    get:
      summary: タスクの一覧を取得する
      ....
    post:
      summary: タスクを作成する。
      ....
  /task/{id}:
    get:
      summary: タスクの詳細情報を取得する
      ....
    delete:
      summary: タスクを削除する
      ....
```

HTTPメソドの下にはOperation Objectという形式で、APIの仕様情報を記述していきます。

https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#operation-object

```yaml
paths:
  /tasks:
    get:
      summary: タスクの一覧を取得する
      operationId: listTasks
      tags:
        - task
      parameters:
        ...
      responses:
        ...
```

`summary` は簡単なAPIの説明文です。
詳細なAPIの使用説明が必要な場合、Markdownの形式で `description` セクションに記述することができます。

`tags` はそれぞれのAPIをグループ化するのに便利な項目です。 配列の形式で複数記述することができます。

`operationId` は任意で添えられるAPIのID名称です。ドキュメント内で各APIごとに一意の値をつけなければなりません。

`parameters` はリクエストパラメータを定義するセクションです。

`requestBody` はリクエストボディの形式を定義します。

`responses` はレスポンスの形式を定義します。

### パラメーターの定義

リクエストパラメータは、`patameters` セクションにて、
Parameter Objectという形式のオブジェクトで定義することができます。

https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#parameter-object

```yaml
      parameters:
        - name: limit
          in: query
          description: 取得するタスクの件数 (max 100)
          required: false
          schema:
            type: integer
            format: int32
```

`in` セクションは、"query" "header" "パス"  "Cookie" と言った値を取ることができ、
それぞれに異なるタイプのリクエストパラメータを定義することができます。

- query : URL内で ? を用いて添えられるクエリパラメータ
- header : リクエストヘッダ上で送信されるパラメータ
- path: URLの一部として送信されるパスパラメータ
- Cookie : cookieを用いて送信されるパラメータ

`in` セクションの内容によって記述すべき項目が異なるため注意が必要です。

### リクエストボディの定義

リクエストボディは `requestBody` セクションにて、
Request Body Objectという形式のオブジェクトで定義することができます。

https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#request-body-object

```yaml
description: user to add to the system
content: 
  'application/json':
    schema:
      $ref: '#/components/schemas/User'
    examples:
      user:
        summary: User Example
        externalValue: 'http://foo.bar/examples/user-example.json'
```

contentTypeに応じて複数のRequestBodyを定義することが可能になっていますが、
通常は `application/json` の形式を定義するだけで足るでしょう。

### レスポンスの定義

レスポンスは、`responses` セクションにて、
Response Objectという形式のオブジェクトで定義することができます。

https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#responses-object

```yaml
responses:
  '200':
    description: a pet to be returned
    content: 
      application/json:
        schema:
          $ref: '#/components/schemas/Pet'
  default:
    description: Unexpected error
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorModel'

```

レスポンスはステータスコードごとに定義しますが、
`1XX` `2XX` `3XX` `4XX` `5XX` のように大文字の `X` を用いて複数の帯域のステータスコードをまとめて表現することも可能です。

### Sehcemaの定義

パラメータやリクエストボディ、レスポンスにおいては、
schemaというキーでその値の型を定義することができます。

schemaはSchema Objectという形のオブジェクトを用いて記述するか、
`$ref` を用いた参照の形式で記述する事ができます。

Schema ObjectはJSON Schemaの形式で記述されるオブジェクト定義で、
オブエジェクトの持つキーや値の方などを指定することができます。

```yaml
type: object
required:
- name
properties:
  name:
    type: string
  address:
    type: string
  age:
    type: integer
    format: int32
    minimum: 0
```

SchemaはJSON Schemaで型を定義するだけではなく、
`example` のセクションを利用してその値の例を表現することも可能です。

```yaml
type: object
properties:
  id:
    type: integer
    format: int64
  name:
    type: string
required:
- name
example:
  name: Puma
  id: 1
```

`$ref` を用いた参照の形式で記述されたオブジェクトは、
OASドキュメントのルートに `components` セクションを設けて、
その形式を定義することができます。

```yaml
components:
  schemas:
    Pet:
      type: object
      discriminator:
        propertyName: petType
      properties:
        name:
          type: string
        petType:
          type: string
      required:
      - name
      - petType
    Cat:  ## "Cat" will be used as the discriminator value
      description: A representation of a cat
      allOf:
      - $ref: '#/components/schemas/Pet'
      - type: object
        properties:
          huntingSkill:
            type: string
            description: The measured skill for hunting
            enum:
            - clueless
            - lazy
            - adventurous
            - aggressive
        required:
        - huntingSkill
    Dog:  ## "Dog" will be used as the discriminator value
      description: A representation of a dog
      allOf:
      - $ref: '#/components/schemas/Pet'
      - type: object
        properties:
          packSize:
            type: integer
            format: int32
            description: the size of the pack the dog is from
            default: 0
            minimum: 0
        required:
        - packSize
```

componentsに記述したSchema定義は、 `$ref: '#/components/schemas/XXX` の形式でドキュメント内から参照することができ、
再利用可能なスキーマ定義として利用することができます。

## ローカル環境でドキュメントを構築する

ローカル環境でドキュメントを構築するには、 Nodeのツールを利用します。

```bash
$ npm i swagger-ui-dist json-refs
```

### swagger-ui

OAS形式で記述された文書をHTMLのWebページとして表示するためのツールとして 
`swagger-ui` というツールが用意されています。

`swagger-ui-dist` はこの `swagger-ui` のビルド済みのファイル一式を提供するもので、
`public` 等の公開フォルダにそのまま一式移動させることで、簡単にローカル環境でOAS文書を閲覧することができるようになります。

npm経由でインストールされたswagger-ui-distのファイル群は `node_modules/swagger-ui-dist` に格納されるため、
以下のコマンドでpublicフォルダにその内容をコピーすることができます。

```bash
$ cp -R node_modules/swagger-ui-dist/ public/swagger
```

デフォルトでは、`https://petstore.swagger.io/v2/swagger.json` から読み込まれる
PetStoreAPIのドキュメントが表示されています。

作成されたswaggerフォルダの中にある `index.html` を確認すると、
コードの下部にあるscriptのセクションで、 対象となるOASファイルのURLが指定されている箇所が見つけられるはずです。

```html
    <script>
    window.onload = function() {
      // Begin Swagger UI call region
      const ui = SwaggerUIBundle({
        url: "https://petstore.swagger.io/v2/swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      })
      // End Swagger UI call region

      window.ui = ui
    }
  </script>
```

このURLの値を任意の値、例えば `/swagger.json` などに修正することで、
自分で作成したOASドキュメントをWeb上で表示することができるようになります。

### json-refs

swagger-uiを使って任意のjsonをWebページ化することができるようになったので、
次はYamlファイルをJSONに変換する方法を確認していきましょう。

swagger-ui-distとともにインストールしたjson-refsは 
ローカルにあるYamlファイルをjsonに展開してくれるツールです。

`swagger/api.yaml` に　OAS定義を作成して以下のような形でJSONを生成することが可能です。

````bash
$ ./node_modules/.bin/json-refs resolve ./swagger/api.yaml > public/swagger.json
````

上記のコマンドを実行することで `./swagger/api.yaml` の内容がJSON形式で
 `public/swagger.json` に出力されます。

またjson-refsは複数のYamlファイルを組み合わせてJSONを生成することも可能です。

まず、 メインのYamlとして``swagger/api.yaml` を以下のような形で作成します。

```yaml
openapi: "3.0.2"
info:
  version: 1.0.0
  title: OSA Sample Document
  license:
    name: MIT
servers:
  - url: http://laravel-api.lec.cafe/api
paths:
  /tasks:
    $ref: ./entries/tasks.yml
```

このドキュメントでは今度のAPIの追加に備えURL以下のAPI定義を外部ファイルに記述して、
その参照を `$ref: ./entries/tasks.yml` という形で相対パスで記述しています。

API定義の本体となる `swagger/entries/tasks.yml` は以下のような形になるでしょう。

```yaml
get:
  summary: タスクの一覧を取得する
  operationId: listTasks
  tags:
    - task
  parameters:
    - name: limit
      in: query
      description: 取得するタスクの件数 (max 100)
      required: false
      schema:
        type: integer
        format: int32
  responses:
    '200':
      description: タスクの一覧を表示する
      content:
        application/json:    
          schema:
            type: array
            items:
              required:
                - id
                - name
              properties:
                id:
                  type: integer
                  format: int64
                name:
                  type: string
```

ドキュメントの用意ができたら、以下のコマンドでjsonを出力可能です。

```bash
$ ./node_modules/.bin/json-refs resolve ./swagger/api.yaml > public/swagger.json
```

resolveコマンドの仕様詳細は以下のURLからも確認可能です。

https://github.com/whitlockjc/json-refs/blob/master/docs/CLI.md#the-resolve-command
