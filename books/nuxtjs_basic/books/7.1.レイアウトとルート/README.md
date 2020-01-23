# レイアウトとルート

## レイアウト

Nuxt.jsでは、ページの共通部分をlayoutフォルダ内のVueコンポーネントで共通化することができます。

これまでの例では、`layout/default.vue` をサイト共通のレイアウトとして定義し、
ヘッダやフッタを定義して、サイト共通のレイアウトを記述していました。

しかし、例えば、後からイベントのページを追加する際に、
特別なヘッダ・フッタ構成のレイアウトを利用したいケースなども出てくるでしょう。

layoutフォルダには、 `default.vue` の他にも、
任意のレイアウトファイルを作成することができます。

作成した任意のレイアウトファイルの利用は、ページコンポーネント側で指定します。

`layout/event.vue` を作成して、`pages/event/summer.vue` のページでこれを利用する場合、
`pages/event/summer.vue` のscriptセクション内で以下のようにして `layout` を指定します。

```vue
<template>
  <div >
     ...
  </div>
</template>

<script>
export default {
    layout: "event"
}
</script>

<style>

</style>
```

## パラメータ付きのルート

pagesフォルダ内に配置したVueコンポーネントは、URL付きのページとして動作する、
ということを紹介してきました。

固定のURLでページを表示する場合、こうした挙動はもんだいありませんが、
複数のパターンのURLでマッチする画面を作成しようとした場合、こうした挙動がや不便なケースもあります。

例えば `/items/{商品ID}` のようなURLや `/service/{サービス種別}` のような 
いろいろな値に対応できるURLを作成する場合、変化する部分のファイル名を `_` で記述してページを作成することができます。 

例えば、`/service/{サービス種別}` のURLページを作成する場合、
`pages/service/_type.vue` または、`pages/service/_type/index.vue` を作成します。

```vue
<template>
  <div >
    <h1>{{type}} の紹介</h1>
     ...
  </div>
</template>

<script>
export default {
  computed:{
    type(){
      return this.$route.params.type          
    }
  }
}
</script>

<style>

</style>
```

こうして作成したページは `servie/ec` `service/consultant` などの様々な形式でアクセスすることができます。

実際にURLで指定された `{サービス種別}` の部分に該当する文字列は、
`this.$route.params.type` の形式で取得することが可能で、
URLの情報をキーにしながら、プログラム等を用いて追加の情報を取得してくるなどして多様なページを展開することが可能になります。
