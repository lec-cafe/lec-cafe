const commonConfig = require("../../../../libs/common.config")

module.exports = {
    ...commonConfig,
    title: 'Nuxt.js による SPA 開発 実践編',
    description: 'Vue.js 製のフロント制作フレームワーク Nuxt.js で SPA を構築する際の実践的手法を紹介します。',
    themeConfig: {
        ...commonConfig.themeConfig,
        sidebar: [
            '/1.Nuxt.js でのアプリケーション構築/',
            '/2.Axios による REST API の発行/',
            '/3.Vuexによるデータの管理/',
            '/4.Vuex Store の永続化/',
            '/5.認証処理の実装/',
            '/6.SSRの設定/',
            '/実践演習/',
            {
                title: 'Nuxt.js の活用',
                children: [
                    '/9.1.Promise と async await/',
                    '/9.2.axios モジュールの使いかた/',
                    '/9.3.Vuex のモジュール化/',
                ]
            },
            {
                title: '補足資料',
                children: [
                    '/9.1.Promise と async await/',
                    '/9.2.axios モジュールの使いかた/',
                    '/9.3.Vuex のモジュール化/',
                ]
            },
        ],
        docsDir: 'books/nuxtjs_practice/books',
    }
}
