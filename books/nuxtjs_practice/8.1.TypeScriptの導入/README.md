# TypeScriptの導入

Nuxt.jsのTypeScriptサポートはversion 2.9から外部パッケージに移行され、
よりスムーズに簡略化されました。

https://typescript.nuxtjs.org/ja/

Nuxt.jsでTypeScriptを利用するには、まずモジュールのインストールを行い、
`nuxt.config.js` の `buildModules` セクションにモジュールを追加します。

```bash
$ npm install --save-dev @nuxt/typescript-build
```

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
