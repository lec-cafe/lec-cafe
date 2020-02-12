const commonConfig = require("../../../../libs/common.config")

module.exports = {
  ...commonConfig,
  title: 'Nuxt.js による SPA 開発 実践編',
  description: 'Vue.js 製のフロント制作フレームワーク Nuxt.js で SPA を構築する際の実践的手法を紹介します。',
  themeConfig: {
    nav: [
      {text: 'Lec Café', link: 'https://leccafe.connpass.com/'},
    ],
    sidebar: [
      '/1.Nuxt.js でのサイト構築/',
      '/実践演習/',
      {
        title: 'Vue.js の活用',
        children: [
          '/6.1.Vuejsの基礎文法/',
          '/6.3.vueコンポーネントの活用/',
        ]
      },
      {
        title: 'Nuxt.js の活用',
        children: [
          '/7.1.レイアウトとルート/',
          '/7.2.SCSS の利用/',
        ]
      },
      {
        title: 'コーディングガイド',
        children: [
          '/8.2.いろいろな HTML 要素/',
          '/8.3.CSS 設計のベストプラクティス/',
          '/8.4.レスポンシブデザイン/',
          '/8.5.Meta要素とSEO/',
          '/8.6.FLOCSSによるCSS設計/',
        ]
      },
      {
        title: '補足資料',
        children: [
          '/9.1.AmplifyConsoleでのデプロイ/',
        ]
      },
    ],
    docsDir: 'books/nuxtjs_basic/books',
  }
}
