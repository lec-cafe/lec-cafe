const commonConfig = require("../../../libs/common.config")

module.exports = {
  ...commonConfig,
  title: 'Laravel 実践講座',
  description: 'HTML/CSS を使った Web 制作技術について、現場で使えるテクニックを紹介します。',
  themeConfig: {
    ...commonConfig.themeConfig,
    nav: [
      {text: 'Lec Café', link: 'https://leccafe.connpass.com/'},
    ],
    sidebar: [
      '/1.アプリケーションの設計',
      {
        title: 'Database と Eloquent の活用',
        children: [
          '/2.Eloquent の活用/',
          '/2.Eloquent の活用/2.1.テーブルの作成',
          '/2.Eloquent の活用/2.2.リレーションの活用',
          '/2.Eloquent の活用/2.3.Factoryの活用',
        ]
      },
      {
        title: 'Schema & Eloquent',
        children: [
          '/6.Schema&Eloquent/6.1.Schema',
          '/6.Schema&Eloquent/6.2.Seeder',
          '/6.Schema&Eloquent/6.3.Eloquentの基本操作',
          '/6.Schema&Eloquent/6.4.Eloquentとリレーション',
        ]
      },
      {
        title: 'Digging Deeper',
        children: [
          '/7.DiggingDeeper/7.1.Artisan Console',
        ]
      },
      {
        title: 'コード分割とモジュール',
        children: [
          '/3.1.Repositoryパターン',
          '/3.2.DIコンテナの活用',
          '/3.3.ServiceProviderの利用',
        ]
      },
      {
        title: '補足資料',
        children: [
        ]
      },
    ],
    docsDir: 'books/laravel_practice',
  }
}
