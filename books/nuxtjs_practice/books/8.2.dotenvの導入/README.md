# 環境変数と Dotenv の導入

## Nuxt.js における 環境変数

Nuxt.js では、環境変数を利用したプログラムを記述することが可能です。

JavaScript において環境変数は、`process.env` を利用してアクセスすることが可能です。

```js
const token = process.env.SERVICE_TOKEN
```

環境変数は、アプリケーションの動作する環境に応じて設定が可能なため、
開発環境・テスト環境・本番環境などの環境毎に変化させたいパラメータなどを設定するのに便利です。

## dotenv モジュールの活用

サーバ上の環境変数はサーバ側の設定で調整することが可能ですが、

```bash
$ npm install --dev @nuxtjs/dotenv
```


### ブラウザ上での環境変数の扱い

[dotenvとは…]

https://typescript.nuxtjs.org/ja/

Nuxt.js で TypeScript を利用するには、まずモジュールのインストールを行い、
`nuxt.config.js` の `buildModules` セクションにモジュールを追加します。


```js
// nuxt.config.js
export default {
  buildModules: ['@nuxt/typescript-build']
}
```

次に、`tsconfig.json` ファイルを作成します：

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "esnext",
    "moduleResolution": "node",
    "lib": [
      "esnext",
      "esnext.asynciterable",
      "dom"
    ],
    "esModuleInterop": true,
    "allowJs": true,
    "sourceMap": true,
    "strict": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "~/*": [
        "./*"
      ],
      "@/*": [
        "./*"
      ]
    },
    "types": [
      "@types/node",
      "@nuxt/types"
    ]
  },
  "exclude": [
    "node_modules"
  ]
}
```
