const commonConfig = require("../../../libs/common.config")

module.exports = {
  ...commonConfig,
  title: 'Nuxt.js による SPA 開発 実践編',
  description: 'Vue.js 製のフロント制作フレームワーク Nuxt.js で SPA を構築する際の実践的手法を紹介します。',
  themeConfig: {
    ...commonConfig.themeConfig,
    nav: [
      {text: 'Lec Café', link: 'https://leccafe.connpass.com/'},
    ],
    sidebar: [
      '/1.Nuxt.js でのサイト構築/',
      {
        title: 'Nuxt.jsでのTODO アプリ開発',
        path: "/3.memoapp/",
        children: [
          '/1.Nuxt.jsでのSPA開発/1.views/',
          '/1.Nuxt.jsでのSPA開発/2.axios/',
          '/1.Nuxt.jsでのSPA開発/3.vuex/',
          '/1.Nuxt.jsでのSPA開発/4.vuex-persistent-state/',
        ]
      },
      {
        title: 'Vue.js の活用',
        // path: "/6.vuejs/",
        children: [
          '/6.vuejs/1.basic',
          '/6.vuejs/3.component',
        ]
      },
      {
        title: 'Nuxt.js の活用',
        // path: "/6.vuejs/",
        children: [
          '/7.nuxtjs/1.layout',
          '/7.nuxtjs/2.scss',
          '/7.nuxtjs/3.ssr',
          '/7.nuxtjs/4.lint',
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
