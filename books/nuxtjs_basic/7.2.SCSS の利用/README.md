# Nuxt.jsにおけるSCSSの活用
 
## Nuxt.jsでSCSSを利用するセットアップ

Nuxt.jsでSCSSを利用する場合、
追加でSCSS関連のモジュールをインストールする必要があります。

### node-sassを利用する

```bash
$ npm install node-sass sass-loader
```

上記のインストールが完了すると、SCSSのセットアップが完了します。

### dart-sassを利用する

一般的にSCSSのコンパイルにはnode-sassが利用されますが、
node-sassにはインストールが遅い、Nodeのバージョンに伴うエラーが頻発する、などの問題もあります。

これらの問題を解決するために、dart-sassを利用してSCSSのコンパイルを行うこともできます。

```bash
$ npm install sass sass-loader fibers
```

セットアップのために `nuxt.config.js` を以下の形で修正します。

```js
// ファイル丈夫に以下のモジュール読み込みを追加
const Sass = require('sass')
const Fiber = require('fibers')

export default {
  // build.loaders のセクションに scss オプションを追加
  build: {
    loaders: {
      scss: {
        implementation: Sass,
        sassOptions: {
          fiber: Fiber
        }
      }
    }
  }
}
```

## SCSS記述の活用

### Vueコンポーネント内でのSCSSの利用

Vueコンポーネント内でSCSS記法を利用する場合、
以下のようにstyle要素にlang属性を指定します。

```vue
<template>
    <div>
      ...
    </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
$color: #565656;

div{
  border: 1px solid $color;
}
</style>
```

### Nuxt.jsでのSCSSファイルの利用

Vueコンポーネントの外で、
グローバルに適用するCSS記述としてSCSSを利用したい場合は、
一旦コンパイルするファイルとして `assets` フォルダにファイルを格納します。

`assets/scss/common.scss` を以下のような形で作成してみましょう。

```scss
$baseFontSize: 16px;

body{
  font-size: $baseFontSize;
}
```

コレをグローバルなCSSとして認識させるには、
`nuxt.config.js` のcssセクションに以下のように記述します。

```js
module.exports = {
  // ...
  css: [
    "~assets/scss/common.scss"
  ],
}
```

また、`assets` フォルダ内にmixinを配置してVueコンポーネント内で利用する事も可能です。

`assetes/scss/mixins.scss` を作成している場合、以下のようなimportが実行できます。

```vue
<template>
    <div>
      ...
    </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins.scss";
  // ...
</style>
```

