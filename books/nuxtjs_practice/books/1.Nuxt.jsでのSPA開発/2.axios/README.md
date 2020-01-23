# AxiosによるREST APIの発行

Nuxt.jsなどのフロントアプリケーションでは、
サーバとのデータの受け渡しは、REST APIを利用して行うのが一般的です。

JavaScriptではREST APIの通信に際し、 axiosというライブラリを用いる事が多く、
Nuxt.jsでもこれを利用するためのaxiosモジュールが提供されています。

まずはNuxt.js上でaxiosモジュールを利用するために、以下のコマンドでモジュールのインストールをを粉います。

```
$ npm i @nuxtjs/axios
```

モジュールのインストールが終わったら、axiosモジュールを有効化するために`nuxt.config.js`を修正します。

```js
export default {
  // ...
  modules: [
    '@nuxtjs/axios',
  ],
  // ...
  axios: {
    baseURL: "https://api.github.com"
  }
}
```

`modules` に `@nuxtjs/axios` を追加するのに加え、
`axios` セクションを追加して、今回主に通信するGithub APIのbaseURLを設定しておきます。

## APIを発行する

準備ができたら実際にAPIを発行してみましょう。

GithubのIssue一覧ページを作成するために、 GithubのREST APIを実行して、
Issue一覧のデータを取得します。

GithubのREST APIの一覧は以下の公式ドキュメントからその使いかたを確認する事ができます。

https://developer.github.com/v3/

APIの実行にはGithubのPersonal Access Tokenが必要になるため、以下のURLから事前に準備しておいてください。

https://github.com/settings/tokens

サンプルアプリでは、issueの操作を行うため、 tokenにはrepo権限をチェックして作成しておいてください。 

::: tip
GithubのPersonal Access Tokenはアカウントのパスワード以上のセキュリティ的な重要性があります。

Personal Access Tokenが書かれたコードをGitHubの公開リポジトリにUPするなどしないよう十分に注意して取り扱いを行ってください。
:::

### Issueの一覧を取得する

GithubからIssueの一覧を取得する場合 `GET /repos/:owner/:repo/issues` のAPIを使用します。

[Issues \| GitHub Developer Guide](https://developer.github.com/v3/issues/#list-issues-for-a-repository)

Issue一覧画面読み込み時に、 Issue一覧取得APIをコールしてデータを取得することで、
GitHub上から取得したデータを画面に表示する事ができます。

画面読み込み時の処理は `mounted` セクションで定義できるため、
`/pages/index.vue` にて、`script` のセクションに以下のような形でmounted内でAPIの発行処理を記述します。

```js
export default {
  data(){
    return {
      issues: []
    }
  },
  async mounted(){
    const url = "/repos/lec-cafe/books_nuxtjs_practice/issues"
    const response = await this.$axios.get(url, {
      headers: {
        Authorization: "token YOUR_GITHUB_PRESONAL_ACCESS_TOKEN"
      }
    })
    console.log(response)
    this.issues = response.data
  }
}
```

`YOUR_GITHUB_PRESONAL_ACCESS_TOKEN` の箇所はGithubから取得したPersonal Access Tokenの値で置き換えてください。

responseのデータは `response.data` に格納されているため、以下のように記述するケースも多いでしょう。

```js
export default {
  async mounted(){
    const url = "/repos/lec-cafe/books_nuxtjs_practice/issues"
    const {data} = await this.$axios.get(url, {
      headers: {
        Authorization: "token YOUR_GITHUB_PRESONAL_ACCESS_TOKEN"
      }
    })
    console.log(data)
    this.issues = data
  }
}
```

::: tip 
async awaitの使いかたについては [こちら](/9.1.Promise%20と%20async%20await/) のドキュメントを確認してください。
:::

::: tip 
axiosモジュールの詳細な使いかたについては [こちら](/9.2.axios%20モジュールの使いかた/) のドキュメントを確認してください。
:::

一覧のデータが取得がREST API経由で実施できたら、リポジトリ名を変更するなどして、
様々なリポジトリ上のIssue一覧を画面に表示してみましょう。

## その他のAPI発行

残りのIsseu詳細画面や、Issue作成画面でも同様にAPIを発行して機能を実装することができます。


[Issue の詳細API](https://developer.github.com/v3/issues/#get-a-single-issue)

[Issue の作成API](https://developer.github.com/v3/issues/#create-an-issue)


例えば、 Issueの詳細APIは、`GET` メソドで、`/repos/:owner/:repo/issues/:issue_number` のURL形式を取るため、
Issue詳細画面の `pages/issue/_id/index.vue` で`script` のセクションに以下のような形でmountedを記述します。

```js
export default {
  async mounted(){
    const number = this.$route.params.id
    const url = `/repos/lec-cafe/books_nuxtjs_practice/issues/${number}`
    const {data} = await this.$axios.get(url, {
      headers: {
        Authorization: "token YOUR_GITHUB_PRESONAL_ACCESS_TOKEN"
      }
    })
    console.log(data)
    this.issue = data
  }
}
```

また、 Issueの作成APIは、 `POST` メソドで、`/repos/:owner/:repo/issues`の形式を取ります。
ドキュメントの記載にある通り、作成するAPIはJSON形式でパラメータとして付与するため、
Issue作成画面の作成ボタンでは以下のようなメソドをコールするとIssue作成処理を実装できるでしょう。

```js
export default {
  data(){
    return {
      form: {
        title: "",
        body: ""
      }
    }
  },
  methods:{
    async submit(){
      const url = `/repos/lec-cafe/books_nuxtjs_practice/issues/`
      const requestBody = {
          title: this.form.title,
          body: this.form.body,
      }
      await this.$axios.post(url, requestBody, {
        headers: {
          Authorization: "token YOUR_GITHUB_PRESONAL_ACCESS_TOKEN"
        }
      })
      this.$router.push("/")
    }
  }
}
```

APIを利用してIssueアプリケーションの実装ができたら、
次はVuexなどを利用して、アプリケーションのデータフローを改善してみましょう。
