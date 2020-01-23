# Nuxt.js における SCSS の活用
 
## Nuxt.js で SCSS を利用する

Nuxt.js で SCSS を利用する場合、
追加で SCSS 関連のモジュールをインストールする必要があります。

```bash
$ npm install node-sass sass-loader
```

上記のインストールが完了すると、SCSS のセットアップが完了です。
Vue コンポーネント内で SCSS 記法を利用する場合、
以下のように style 要素に lang 属性を指定します。

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

## Nuxt.js での SCSS ファイルの利用

Vue コンポーネントの外で、
グローバルに適用する CSS 記述として SCSS を利用したい場合は、
一旦コンパイルするファイルとして `assets` フォルダにファイルを格納します。

`assets/scss/common.scss` を以下のような形で作成してみましょう。

```scss
$baseFontSize: 16px;

body{
  font-size: $baseFontSize;
}
```

コレをグローバルな CSS として認識させるには、
`nuxt.config.js` の css セクションに以下のように記述します。

```js
module.exports = {
  // ...
  css: [
    "~assets/scss/common.scss"
  ],
}
```

また、`assets` フォルダ内に mixin を配置して Vue コンポーネント内で利用する事も可能です。

`assetes/scss/mixins.scss` を作成している場合、以下のような import が実行できます。

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

