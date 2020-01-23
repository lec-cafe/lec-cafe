// .vuepress/config.js
module.exports = {
  title: 'Terminal での Git/Github入門 - Netlify でWebサイト公開',
  description: `
Terminal (黒い画面) を使っての Git/Github の使い方をマスターします。

Githubを操作しながら Web サイトの公開ができる Netlify を利用して、 実際のWebサイト制作をイメージしながら Git の操作を体験してみましょう。

Git の基本操作 (コミット・ブランチの操作)
Github の使い方 （push / pull）
GIthub のチームでの使い方 ( Issue / Pull Request )    `,
  themeConfig: {
    nav: [
      { text: 'Lec Café', link: 'https://leccafe.connpass.com/' },
    ],
    repo: 'lec-cafe/lec-cafe',
    repoLabel: 'Github',
    editLinks: true,
    editLinkText: 'ページに不明点や誤字等があれば、Github にて修正を提案してください！'
  }
}
