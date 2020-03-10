# Vue.jsの基礎文法

## テンプレート内での変数展開

::: v-pre
Vue.jsにおけるtemplate要素の一番の特徴は、
JavaScriptで記述した変数の値が、template内で展開できる点です。

以下のようにdataの内部で定義したmessage変数は、
`{{ message }}` のように記述してHTML要素内に展開することができます。
::: 

```vue
<template>
  <div>
    <div class="message">
      {{ message }}
    </div>
  </div>
</template>

<script >
  export default {
    data(){
      return {
        message: "hello world"
      }
    }
  }
</script>

<style scoped>
</style>
```

テキストノードではなく、属性の値としてデータを展開する場合、
属性名の頭に `:` をつけて変数名を指定します。

```vue
<template>
  <div>
    <a class="link" :href="url">
      click here!!
    </a>
  </div>
</template>

<script >
  export default {
    data(){
      return {
        url: "https://google.com"
      }
    }
  }
</script>

<style scoped>
</style>
```

## Vue.jsのディレクティブ

Vue.jsでは、変数をHTML内に展開する以外にも、変数の値を利用して様々な処理を記述することができます。

Vue.jsで用意されている `v-` から始まる特別なHTML属性は、
ディレクティブと呼ばれ、
テンプレート内で利用することで様々な処理を実行することが可能になります。

## v-if / v-show

v-if / v-showは条件式と組み合わせて使うことで、 DOM要素の表示を制御することができます。

v-ifは条件式の真偽値に応じてDOM要素の廃生成が行われますが、
v-showは条件式の値に応じてCSSの `display` 値が変化するだけです。

### v-else-if

v-else-ifはv-ifの兄弟要素として利用することで、
v-ifにelse-if節を設ける事ができます。

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
```

### v-else 

v-elseはv-if / v-else-ifの兄弟要素として利用することで、
v-ifにelse節を設ける事ができます。

```html
<div v-if="Math.random() > 0.5">
  Now you see me
</div>
<div v-else>
  Now you don't
</div>
```

## v-for

v-forは配列などのデータを繰り返し描画する際に利用することができます。

```html
<div v-for="item in items">
  {{ item.text }}
</div>
```

## v-model

v-modelはフォーム要素の値とVueコンポーネントの変数との間に双方向バインディングを実現します。

```html
<div>
    <input type="text" v-model="form.name">
</div>
```

v-modelでは通常 `input` イベントを購読して、値の変更をリアルタイムに変数へと伝達します。
`change` イベントを利用したい場合には、 `lazy` 修飾子を利用します。

```html
<div>
    <input type="text" v-model.lazy="form.name">
</div>
```

inputフィールドにおけるv-modelの値は通常、文字列として取得されますが、
`number` 修飾子を利用することで、数値にキャストすることが可能です。

```html
<div>
    <input type="number" v-model.number="form.name">
</div>
```

また `trim` 修飾子は、 input要素の値をトリムすることが可能です。

```html
<div>
    <input type="text" v-model.trim="form.name">
</div>
```

## v-text 

v-textはHTML要素内に変数の値を出力します。

```html
<div>
    <div v-text="user.name"/>
</div>
```

::: v-pre
上の例のコードは次の `{{ ... }}` を用いて記述されるコードと同じ動作をするため、
通常はこちらのほうがよく利用されます。
:::

```html
<div>
    <div>{{ user.name }}</div>
</div>
```

::: v-pre
`v-text` や `{{ ... }}` は、XSS脆弱性対策として、
変数中に含まれるHTMLタグをエスケープして画面に出力します。
:::

そのため以下のコードでは、リンク要素ではなく、単純に `<a href='http://google.com'>LINK</a>` という形でHTML文字列が画面に表示されてしまいます。

```vue
<template>
    <div>
        <div v-text="link" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            link: "<a href='http://google.com'>LINK</a>"
        }
    }
}
</script>
```

### v-html

v-htmlはv-textと似ていますが、変数内にHTMLタグが含まれていた場合でも、
エスケープせずにHTML文字列をHTML要素として画面に出力します。

以下のコードでは、画面にa要素で実装されたクリック可能なリンク要素が表示されます。

```vue
<template>
    <div>
        <div v-html="link" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            link: "<a href='http://google.com'>LINK</a>"
        }
    }
}
</script>
```

v-htmlは便利な半面、 XSS脆弱性というセキュリティ上のリスクをもたらす可能性もあります。
v-htmlを使用する際には、変数の内容が信頼できるコンテンツかどうか十分に考慮する必要があります。

また、v-html内部のHTML要素に対してscoped cssを記述する場合、
うまく装飾が適用されないことがあります。

このようなケースでは　`/deep/` 演算子を使って以下のようにスタイルを記述することで問題を解決することが可能です。

```vue
<template>
    <div>
        <div class="htmlArea" v-html="link" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            link: "<a href='http://google.com'>LINK</a>"
        }
    }
}
</script>
<style lang="scss" scoped>
.htmlArea a{ // dont work
    color: red;
}

.htmlArea /deep/ a{ // work!
    color: blue;
}
</style>
```

`/deep/` 演算子はSCSSでの記法のため、 通常のCSSを利用する場合などは `>>>` コンビネータを利用します。


```html
<style scoped>
.htmlArea >>> a{ // dont work
    color: red;
}
</style>
```

::: tip

上記で紹介した他にも、様々なディレクティブが用意されています。
Vue.jsで利用可能なディレクティブの全容は、
[公式ドキュメント](https://jp.vuejs.org/v2/api/#%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96)
を参照してください。
:::
