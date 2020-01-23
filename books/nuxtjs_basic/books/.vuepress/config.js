module.exports = {
    title: 'Nuxt.js による SPA 開発 実践編',
    description: 'Vue.js 製のフロント制作フレームワーク Nuxt.js で SPA を構築する際の実践的手法を紹介します。',
    head: [
        ['script', { src: "https://static.codepen.io/assets/embed/ei.js"}]
    ],
    locales: {
        '/': {
            lang: 'ja',
        },
    },
    markdown: {
        anchor: {
            level: [1,2,3],
            slugify: (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-')),
            permalink: true,
            permalinkBefore: true,
            permalinkSymbol: '#'
        },
        config: md => {
            md.use(require('markdown-it-playground'))
        },
        linkify: true
    },
    themeConfig: {
        nav: [
            { text: 'Lec Café', link: 'https://leccafe.connpass.com/' },
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
              '/8.1.コンテナとレイアウト/',
              '/8.2./',
              '/8.3.クラス名の管理/',
              '/8.4.Meta要素とSEO/',
              '/8.5.FLOCSSによるCSS管理/',
            ]
          },
          {
            title: '補足資料',
            children: [
              '/9.1.AmplifyConsoleでのデプロイ/',
            ]
          },
        ],
        repo: 'lec-cafe/books_nuxtjs_practice',
        repoLabel: 'Github',
        docsDir: 'books',
        editLinks: true,
        editLinkText: 'ページに不明点や誤字等があれば、Github にて修正を提案してください！'
    }
}
