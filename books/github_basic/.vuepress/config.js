const commonConfig = require("../../../libs/common.config")

// .vuepress/config.js
module.exports = {
  ...commonConfig,
  title: 'Terminal での Git/Github入門 - Netlify でWebサイト公開',
  description: `
Terminal (黒い画面) を使っての Git/Github の使い方をマスターします。

Githubを操作しながら Web サイトの公開ができる Netlify を利用して、 実際のWebサイト制作をイメージしながら Git の操作を体験してみましょう。

Git の基本操作 (コミット・ブランチの操作)
Github の使い方 （push / pull）
GIthub のチームでの使い方 ( Issue / Pull Request )    `,
  themeConfig: {
    ...commonConfig.themeConfig,
    nav: [
      {text: 'Lec Café', link: 'https://leccafe.connpass.com/'},
    ],
    sidebar: [
      '/',
      '/0.Gitの環境構築/',
      '/1_terminal/',
      '/2_start_github/',
      '/3.branch/',
      '/4.github_workflow/',
      {
        title: 'いろいろなGitコマンド',
        children: [
          '/8_git_status/',
          '/8_git_remote/',
          '/8_git_push/',
          '/8_git_remote/',
          '/8_git_status/',
        ]
      },
      {
        title: 'GitHub の活用',
        children: [
          '/9_netlify/',
          '/9_github_issues/',
          '/9_github_pullrequest/',
          '/9_github_flow/',
          '/9_github_actions/'
        ]
      },
    ],
    docsDir: 'books/github_basic/books',
  }
}
