const commonConfig = require("../../../libs/common.config")

module.exports = {
    ...commonConfig,
    title: 'Nuxt.js による SPA 開発 実践編',
    description: 'Vue.js 製のフロント制作フレームワーク Nuxt.js で SPA を構築する際の実践的手法を紹介します。',
    themeConfig: {
        ...commonConfig.themeConfig,
        sidebar: [
            {
                title: 'Nuxt.jsでのSPA開発',
                path: "/1.Nuxt.jsでのSPA開発/",
                children: [
                    '/1.Nuxt.jsでのSPA開発/1.views/',
                    '/1.Nuxt.jsでのSPA開発/2.axios/',
                    '/1.Nuxt.jsでのSPA開発/3.vuex/',
                    '/1.Nuxt.jsでのSPA開発/4.vuex-persistent-state/',
                ]
            },
            {
                title: '認証付きアプリケーションの開発',
                path: "/2.認証付きアプリケーションの開発/",
                children: [
                    '/2.認証付きアプリケーションの開発/1.views/',
                    '/2.認証付きアプリケーションの開発/2.login/',
                    '/2.認証付きアプリケーションの開発/3.store/',
                    '/2.認証付きアプリケーションの開発/4.auth/',
                ]
            },
            '/5.認証処理の実装/',
            '/6.SSRの設定/',
            '/実践演習/',
            {
                title: 'Nuxt.js の活用',
                children: [
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
