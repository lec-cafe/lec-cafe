const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// .vuepress/config.js
module.exports = (site) =>{
  const yamlText = fs.readFileSync(path.join(__dirname, site,'lesson.yml'), 'utf8')
  const siteConfig = yaml.safeLoad(yamlText);
  return {
    base: `/${site}/`,
    dest: `dist/${site}`,
    title: siteConfig.title,
    description: siteConfig.description,
    temp: `/tmp/vuepress/tmp/${site}`,
    cache: `/tmp/vuepress/cache/${site}`,
    theme: "@chatbox-inc/vuepress-theme-leccafe",
    head: [
      ['script', {src: "https://static.codepen.io/assets/embed/ei.js"}]
    ],
    locales: {
      '/': {
        lang: 'ja',
      },
    },
    plugins: [
      ['@chatbox-inc/vuepress-plugin-leccafe',{
        lessons: siteConfig.lessons,
      }],
    ],
    markdown: {
      anchor: {
        level: [1, 2, 3],
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
      video: siteConfig.video,
      nav: [
        {text: 'Lec Café', link: 'https://leccafe.connpass.com/'},
      ],
      sidebar: siteConfig.sidebar,
      repo: 'lec-cafe/lec-cafe',
      repoLabel: 'Github',
      docsDir: `lessons/${site}`,
      editLinks: true,
      editLinkText: 'ページに不明点や誤字等があれば、Github にて修正を提案してください！'
    }
  }
}
