# Nuxt.jsを使ったWebサイト制作

Nuxt.jsはVue.jsのアプリケーションフレームワークです。

フロントエンドのライブラリVue.jsやその周辺ライブラリをまとめて、
Single Page Application (SPA) の構築を行うために必要な構成を取りまとめたのがNuxt.jsです。

WebサイトをSPAで構築することにより、スムーズなページ遷移が提供できるなど、
ユーザにとっての閲覧性が高まるだけではなく、 Vue.jsの機能を利用してよりスムーズなWebサイト構築を進めることができます。

サンプルサイトの制作を通じて、 Nuxt.jsでのWebサイト制作の基本を学んでいきましょう。

## 準備

まずは、Nuxt.jsの開発環境を構築しましょう。

Nuxt.jsの環境構築にはNode.jsを利用するため、
Node.jsの環境構築が未の場合には、先に以下のURLからインストールを行っておいてください。

https://nodejs.org/ja/download/

::: tip
手元のNode.jsのバージョンは `node -v`で確認可能です。
Node.jsのバージョンが古い場合にも、新しいNode.jsのインストールを進めておきましょう。
:::

Nuxt.jsでアプリケーション開発を始めるためには、まずnpxコマンドを利用して、
アプリケーションの雛形を作成します。

```
$ npx create-nuxt-app my_website
```

コマンドを入力すると、対話形式でプロジェクトの作成が進みます。
一旦デフォルトの選択でOKですのでEnterを連打して、選択肢を進めてください。
しばらくすると、ダウンロードが始まり、プロジェクトの雛形が`my_website` フォルダに作成されます。

yarnがインストールされていない環境では、以下のようなエラーが表示されると思います。

```text
Installing packages with yarnTrace: Error: spawn yarn ENOENT
  at Process.ChildProcess._handle.onexit (internal/child_process.js:264:19)
  at onErrorNT (internal/child_process.js:456:16)
  at processTicksAndRejections (internal/process/task_queues.js:81:21) {
 errno: 'ENOENT',
 code: 'ENOENT',
 syscall: 'spawn yarn',
 path: 'yarn',
 spawnargs: [ 'install' ]
}
```

このような場合には以下のコマンドで、yarnのインストールを行ってください。

```bash
$ npm -g i yarn 
```

::: tip 
`npm -g i yarn` を実行した時に、EACCESSのエラーが表示される場合は、
[こちら](https://qiita.com/okohs/items/ced3c3de30af1035242d) の記事を参考に権限を調整するか、
`sudo npm -g i yarn` コマンドを実行してインストールを完了させてください。
:::

ファイルが展開されたら、作成されたフォルダ内に移動して `npm run dev` コマンドを実行すれば、
開発用のWebサーバが立ち上がります。

ブラウザに `http://localhost:3000` を入力して、 Nuxt.jsの初期画面を確認してみましょう。

::: tip 
`npm run dev` コマンドでエラーが表示された際には、`npm i` コマンドを実行して、
必要なモジュールが正しくインストールされているか確認してみてください。
:::

## Webサイトの制作

今回は、 サンプルのWebサイト制作として、簡単なLPサイトの制作を始めてみましょう。

トップページの他にフォームなどのサブページを想定して、SPA構成のランディングページを制作します。

### ページ作成の準備

今回は、CSSの記述を簡単にするために  Booststrapを利用しましょう。

https://getbootstrap.com/

Nuxt.jsでは、ページ全体で共通のhead要素を利用するため、
head要素の設定は、アプリケーションの設定ファイル、`nuxt.config.js` にて行います。
 
`nuxt.config.js` の `head.link` セクションにBootstrapのCDNを追加することで、
ページ全体にBootstrapを適用することが可能です。

```js
module.exports = {
  // ...
  head: {
    // ...
    link: [
      { rel: 'stylesheet', href: "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" }
    ]
  },
}
```

次に、レイアウトファイルを調整します。

`layouts/defautl.vue`を編集して、以下のような内容で書き換えます。

Nuxt.jsにおいて `layouts` フォルダ内のvueファイルは、全ページでの共通のレイアウト定義となります。

全てのページは、このlayoutファイルをベースに描画され、各ページで定義した内容は、
`<nuxt />` 要素の中で展開されます。

```vue
<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <div class="container">
        <a class="navbar-brand" href="/">LP SITE</a>
      </div>
    </nav>
    <div class="container">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style>
  .container{
    max-width: 640px;
  }
</style>
```

レイアウトでは、全てのページで表示されるようなヘッダやフッタを配置しておくと便利です。

::: tip
拡張子が `.vue` のファイルはVueコンポーネントと呼ばれる、
Vue.js独自のコンポーネントファイルです。
Vueコンポーネントの便利な使い方等は、 別途Vueコンポーネントの使い方のセクションを参照して下さい。
:::

## トップページの作成

レイアウトの準備ができたら、各ページを作成します。
Nuxt.jsでのWebサイト制作では、`pages` フォルダに置いたファイルが、
それぞれのWebページとして認識されます。

ファイルは `.html` でなく、`.vue` ファイルの形式でを追加して作成していきます。

例えば、トップのページは、 `pages/index.vue` に以下のような形で作成します。

```vue
<template>
  <div >
    <div class="jumbotron">
      <h1 class="display-4">Hello, world!</h1>
      <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
      <hr class="my-4">
      <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
      <router-link class="btn btn-primary btn-lg" to="/contact">お問い合わせ</router-link>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style>

</style>
```

ページ内ではお問い合わせページ `/contact` へのリンクをrouter-link要素を利用して記述しています。

Nuxt.js内でのページ遷移は通常、この `router-link` 要素を用いて記述し、
遷移先を `to` 属性で指定します。

Nuxt.jsで作成するサイト外へのリンクは通常通りa要素を用いて記述して構いません。

## お問い合わせページの作成

お問い合わせのページとして `/contact` のURLページを作成するには、
`pages/contact.vue` を作成するか、 `/pages/contact/index.vue` を作成します。

```vue
<template>
  <div >
    <form>
      <h1 class="h3">お問い合わせ</h1>
      <div class="form-group">
        <label>お名前</label>
        <input type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>Email address</label>
        <input type="email" class="form-control">
      </div>
      <div class="form-group">
        <label>件名</label>
        <input type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>メッセージ</label>
        <textarea class="form-control" rows="5"/>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
}
</script>

<style>

</style>
```

Nuxt.jsでは、 pagesフォルダにファイルを追加すればするほど、
URLページが増えていきます。

ページ同士の遷移は `router-link` 要素を用いて記述することで、
ページの差分のみを用いたページ遷移を実現する事ができます。

## Nuxt.jsのフォルダ構成

Nuxt.jsでページを作成する方法のイメージが掴めたらその他のフォルダ構成についても確認しておきましょう。

- assets : scssなどwebpackを利用して配信するファイル類
- components : サイト内で利用するVueコンポーネント
- layouts : ページ内で利用するlayoutコンポーネント
- middleware : ページ内で利用するミドルウェア 
- node_modules : package.jsonに記述されたライブラリの格納先
- pages : URLページを作成するためのVueコンポーネントの置き場所
- plugins : サイト内で利用するプラグイン
- static : ファビコンや画像、動画などサイトで利用する静的ファイルの配置場所
- store : Vuexのモジュールファイルの格納場所

通常のサイト制作において、プラグインやミドルウェア、 Vuexを利用することはほとんど稀でしょう。
その他のフォルダについても、以降のセクションで必要に応じて紹介していきます。

Nuxt.jsを利用したサイト制作において理解しておかなければならないのは、
`static` フォルダの存在です。

`static` フォルダには、ファビコンや画像、動画などサイトで利用する静的ファイルが配置され、
`static` フォルダ内をルートとしてアクセスすることが可能になります。

例えば、 `static/images/logo.png` のパスで配置した画像をimg要素で描画する場合、
以下のようなコードを記述すればよいでしょう。

```html
<img src="/images/logo.png" alt="">
```

## Nuxt.jsで作成したサイトのビルド(追記 2020/07/02)

Nuxt.jsで作成したサイトをサーバ上で配信する場合、
「ビルド」と呼ばれる工程を踏んで、vueコンポーネントで記述したファイルを、
htmlに書き出す必要があります。

まずはプロジェクト内でNuxt.jsのバージョンを確認するため以下のコマンドを実行してみましょう。

```bush
$ nuxt --version
```

するとターミナルに以下のような表示がされると思います。

```bash
@nuxt/cli v2.11.0
```

ビルドの工程はNuxt.jsのバージョンによって少し異なります。

## v2.13.0未満の方

Nuxt.jsプロジェクトのビルドを行う場合、以下のように `npm run generate` コマンドを実行します。

```bash
$ npm run generate
```

コマンドを実行すると `dist` フォルダが作成され、内部にhtmlファイルなどが生成されるでしょう。

このdistフォルダの中身をサーバ上に配信することで、 Nuxt.jsで作成したWebサイトをインターネット上に配信することが可能になります。

## v2.13.0以上の方

Nuxt.jsのアップデートの関係で `nuxt.config.js` に `target` という項目が新たに追加されました。

デフォルトでは `server` が指定されていると思います。

```js
export default {
    //...
    target: 'server',
}
```

ビルドを行う際には `server` から `static` に変更します。

```js
export default {
    //...
    target: 'static',
}
```

ビルドする際のコマンドも `npm run generate` が `npm run build` と `npm run export` に 分けられました。

- `npm run build` : vueコンポーネントで記述されたファイルがバンドルされる
- `npm run export` : バンドルされたhtmlファイルが `dist` ディレクトリ内に吐き出される

また、`npm run serve` というコマンドでローカル環境下でも `dist` フォルダの中身をブラウザで確認できるようになりました。

```bash
$ npm run serve
```
インターネットに配信する前に上記コマンドで実際に `dist` フォルダ内を確認してみましょう。


## TRY! 

- Nuxt.jsのプロジェクトを作成して、気になるサイトの模写をしてみましょう。
- Nuxt.jsでSCSSの環境構築を整え、 SCSSを使ったサイトコーディングを進めてみましょう。
- ページのコンテンツ毎に、要素をコンポーネント分割して見ましょう。
- Nuxt.jsでFLOCSSを用いたCSS設計に挑戦してみましょう。

