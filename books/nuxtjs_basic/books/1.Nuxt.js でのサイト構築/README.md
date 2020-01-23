# Nuxt.js を使ったWebサイト制作

Nuxt.js は Vue.js のアプリケーションフレームワークです。

フロントエンドのライブラリ Vue.js やその周辺ライブラリをまとめて、
Single Page Application (SPA) の構築を行うために必要な構成を取りまとめたのが Nuxt.js です。

Web サイトを SPA で構築することにより、スムーズなページ遷移が提供できるなど、
ユーザにとっての閲覧性が高まるだけではなく、 Vue.js の機能を利用してよりスムーズなWebサイト構築を進めることができます。

サンプルサイトの制作を通じて、 Nuxt.js でのWebサイト制作の基本を学んでいきましょう。

## 準備

まずは、Nuxt.js の開発環境を構築しましょう。

Nuxt.js の環境構築には Node.js を利用するため、
Node.js の環境構築が未の場合には、先に以下のURLからインストールを行っておいてください。

https://nodejs.org/ja/download/

::: tip
手元の Node.js のバージョンは `node -v`で確認可能です。
Node.js のバージョンが古い場合にも、新しい Node.js のインストールを進めておきましょう。
:::

Nuxt.js でアプリケーション開発を始めるためには、まず npx コマンドを利用して、
アプリケーションの雛形を作成します。

```
$ npx create-nuxt-app my_website
```

コマンドを入力すると、対話形式でプロジェクトの作成が進みます。
一旦デフォルトの選択でOKですので Enter を連打して、選択肢を進めてください。
しばらくすると、ダウンロードが始まり、プロジェクトの雛形が`my_website` フォルダに作成されます。

yarn がインストールされていない環境では、以下のようなエラーが表示されると思います。

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

このような場合には以下のコマンドで、yarn のインストールを行ってください。

```bash
$ npm -g i yarn 
```

::: tip 
`npm -g i yarn` を実行した時に、EACCESS のエラーが表示される場合は、
[こちら](https://qiita.com/okohs/items/ced3c3de30af1035242d) の記事を参考に権限を調整するか、
`sudo npm -g i yarn` コマンドを実行して インストールを完了させてください。
:::

ファイルが展開されたら、作成されたフォルダ内に移動して `npm run dev` コマンドを実行すれば、
開発用のWebサーバが立ち上がります。

ブラウザに `http://localhost:3000` を入力して、 Nuxt.js の初期画面を確認してみましょう。

::: tip 
`npm run dev` コマンドでエラーが表示された際には、`npm i` コマンドを実行して、
必要なモジュールが正しくインストールされているか確認してみてください。
:::

## Webサイトの制作

今回は、 サンプルのWebサイト制作として、簡単なLPサイトの制作を始めてみましょう。

トップページの他にフォームなどのサブページを想定して、SPA 構成の ランディングページを制作します。

### ページ作成の準備

今回は、CSSの記述を簡単にするために  Booststrap を利用しましょう。

https://getbootstrap.com/

Nuxt.js では、ページ全体で共通の head 要素を利用するため、
head 要素の設定は、アプリケーションの設定ファイル、`nuxt.config.js` にて行います。
 
`nuxt.config.js` の `head.link` セクションに Bootstrap の CDN を追加することで、
ページ全体に Bootstrap を適用することが可能です。

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

Nuxt.js において `layouts` フォルダ内の vue ファイルは、全ページでの共通のレイアウト定義となります。

全てのページは、この layout ファイルをベースに描画され、各ページで定義した内容は、
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
拡張子が `.vue` のファイルは Vue コンポーネントと呼ばれる、
Vue.js 独自のコンポーネントファイルです。
Vue コンポーネントの便利な使い方等は、 別途 Vue コンポーネントの使い方 のセクションを参照して下さい。
:::

## トップページの作成

レイアウトの準備ができたら、各ページを作成します。
Nuxt.js での Web サイト制作では、`pages` フォルダに置いたファイルが、
それぞれの Web ページとして認識されます。

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

ページ内では お問い合わせページ `/contact` へのリンクを router-link 要素を利用して記述しています。

Nuxt.js 内でのページ遷移は通常、この `router-link` 要素を用いて記述し、
遷移先を `to` 属性で指定します。

Nuxt.js で作成するサイト外へのリンクは通常通り a 要素を用いて記述して構いません。

## お問い合わせページの作成

お問い合わせのページとして `/contact` のURL ページを作成するには、
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

Nuxt.js では、 pages フォルダにファイルを追加すればするほど、
URL ページが増えていきます。

ページ同士の遷移は `router-link` 要素を用いて記述することで、
ページの差分のみを用いたページ遷移を実現する事ができます。

## Nuxt.js のフォルダ構成

Nuxt.js でページを作成する方法のイメージが掴めたらその他のフォルダ構成についても確認しておきましょう。

- assets : scss など webpack を利用して配信するファイル類
- components : サイト内で利用する Vue コンポーネント
- layouts : ページ内で利用する layout コンポーネント
- middleware : ページ内で利用するミドルウェア 
- node_modules : package.json に記述されたライブラリの格納先
- pages : URL ページを作成するための Vue コンポーネントの置き場所
- plugins : サイト内で利用するプラグイン
- static : ファビコンや画像、動画などサイトで利用する静的ファイルの配置場所
- store : Vuex のモジュールファイルの格納場所

通常のサイト制作において、プラグインやミドルウェア、 Vuex を利用することはほとんど稀でしょう。
その他のフォルダについても、以降のセクションで必要に応じて紹介していきます。

Nuxt.js を利用したサイト制作において理解しておかなければならないのは、
`static` フォルダの存在です。

`static` フォルダには、ファビコンや画像、動画などサイトで利用する静的ファイルが配置され、
`static` フォルダ内をルートとしてアクセスすることが可能になります。

例えば、 `static/images/logo.png` のパスで配置した画像を img 要素で描画する場合、
以下のようなコードを記述すればよいでしょう。

```html
<img src="/images/logo.png" alt="">
```

## Nuxt.js で作成したサイトのビルド

Nuxt.js で作成したサイトをサーバ上で配信する場合、
「ビルド」と呼ばれる工程を踏んで、vue コンポーネントで記述したファイルを、
html に書き出す必要があります。

Nuxt.js プロジェクトのビルドを行う場合、以下のように `npm run generate` コマンドを実行します。

```bash
$ npm run generate
```

コマンドを実行すると `dist` フォルダが作成され、内部に html ファイルなどが生成されるでしょう。

この dist フォルダの中身をサーバ上に配信することで、 Nuxt.js で作成した Web サイトをインターネット上に配信することが可能になります。
