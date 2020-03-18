# SSRの設定

Nuxt.jsの特徴の1つとしてSSRの対応があります。

SSRはブラウザ以外の場所でVue.jsのコードを動かす仕組みで、
Nodeのサーバを用いてNuxt.jsアプリケーションを動作させる際以外にも、
`npm run generate` でページを静的に出力する際に重要になってくる機能です。

SSRの機能を利用することで、`npm run generate` で生成されるページに、
APIのデータを埋め込む事ができるようになり、 SEOやOGPの生成に役立てることができるようになります。

## fetch / asyncData 

`pages` フォルダ内の .vueコンポーネントでは `fetch` や `asyncData` といった関数を定義することが可能で、
このセクションを用いてSSR時の挙動を制御することができます。

fetchの例

```vue
<template>
  <h1>Issues: {{ $store.state.issues.length }}</h1>
</template>

<script>
export default {
  async fetch (ctx) {
    ctx.store.dispatch('fetchIssues')
  }
}
</script>
```

asyncDataの例

```js
export default {
  data () {
    return { project: 'default' }
  },
  asyncData (context) {
    return { project: 'nuxt' }
  }
}
```

fetchはSSRのフェーズで任意の動作を行うことができるため、
単純にVuex Storeのアクションなどを呼び出すのに向いています。

asyncDataはSSRのフェーズで動作し、returnしたオブジェクトをdataのオブジェクトとマージすることができます。

fetchもasyncDataもどちらのセクションも、ブラウザ上では動作することはありません。

## headの設定

`pages` フォルダ内の .vueコンポーネントでは `head` 関数を定義して、head要素内の値をカスタマイズすることが可能です。

```vue
<template>
  <h1>{{ title }}</h1>
</template>

<script>
export default {
  data () {
    return {
      title: 'Hello World!'
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  }
}
</script>
```

head関数内で例えば　APIの情報などを取得したい場合には、
`fetch` や `asyncData` などのSSRフェーズの関数を利用してデータを準備する必要があります。 

