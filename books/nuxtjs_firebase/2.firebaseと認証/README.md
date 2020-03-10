# Firebaseを使った認証のセットアップ

基本的なアプリケーションの構成が整ったら、
Firebaseのセットアップを行って認証機能を実装してみましょう。

## Firebase Projectの作成

Fireabseを利用するにあたってプロジェクトの作成を行いましょう。

Firebase Consoleからプロジェクトの作成を行ってください。

https://console.firebase.google.com

プロジェクトの作成が終わったら、Github認証の仕組みを用意しましょう。

左のメニューから「開発 → Authentication → ログイン方法」を選択します。

利用可能なログインプロバイダから「Github」を選択し、「有効にする」をONにしてください。

FirebaseでGithub認証を利用するためには、
Github側でOAuth Applicationの作成が必要です。

この画面で表示される「認証コールバックURL」は、
Github上でアプリケーションを登録する際に必要になるため控えておきましょう。

## Githubアプリケーションの準備

FirebaseでGithub認証を利用するためにはGithub上でOAuth Appsを作成する必要があります。

Gitbubの設定画面からDevelopper settingを開き、 New OAuth Appをクリックします」

https://github.com/settings/developers

アプリケーション名とHomepageのURL、先程取得したCallbackURLを入力し、アプリケーションを登録してください。

アプリケーションを作成するとclientIDやClient Secretが取得可能なため、
これをFirebaseの画面に戻って入力しましょう。

![](/images/2/github_auth.png)

これで認証用のセットアップは完了です。

## Nuxt.jsにおけるFirebase環境のセットアップ

Nuxt.jsでFirebaseを利用するために、まずはfirebaseのモジュールをインストールします。

```
$ npm i firebase
```

`firebase` モジュールを利用するためには、Firebaseの接続情報を読み込んで、
アプリケーションを識別する必要があります。

Firebaseの接続情報は、 FirebaseのProject Overviewから「アプリを追加」でWebのアイコンをクリックすると閲覧できます。

![](/images/2/firebase_credentials.png)

これらの認証情報を利用するためにNuxt.jsのフォルダに `service` フォルダを作成し、
`service/firebase.js` を以下のかたちで作成してみましょう。

```
import firebase from 'firebase'

if (!firebase.apps.length) {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBWhfl2SwYkdQt8qZ4kxgDwH_8lpM21e48",
    authDomain: "leccafe-nuxt-firebase-chat.firebaseapp.com",
    databaseURL: "https://leccafe-nuxt-firebase-chat.firebaseio.com",
    projectId: "leccafe-nuxt-firebase-chat",
    storageBucket: "leccafe-nuxt-firebase-chat.appspot.com",
    messagingSenderId: "1050388390938"
  };
  firebase.initializeApp(config);}

export default firebase
```

`!firebase.apps.length` はアプリケーションが既に識別されているかを判別するための条件式です。

このファイルを作成することで、
アプリケーションが未認証の場合に、識別情報を利用してアプリケーションの接続を行わせ、
常に認証済みの `firebase` モジュールを取得可能な状態にします。

## Firebaseログインの利用

準備ができたところで、実際にFirebase認証を試してみましょう。

`pages/index.vue` のログイン処理を以下のように書き換えてみましょう。

```vue
<script>
  import firebase from '~/service/firebase'

  export default {
    // ...
    methods: {
      async login () {
        const provider = new firebase.auth.GithubAuthProvider()
        const result = await firebase.auth().signInWithPopup(provider)
        // var token = result.credential.accessToken
        var user = result.user
        this.$store.dispatch("loginWithUserName", user.displayName)
      },
      // ...
    }
  }
</script>
```

上記のコードで、GitHubアカウントを利用したログインが可能になります。

Firebaseでログイン認証のポップアップを起動する場合、`firebase.auth().signInWithPopup` を利用します。

```
    const provider = new firebase.auth.GithubAuthProvider()
    const result = await firebase.auth().signInWithPopup(provider)
```

`signInWithPopup` はポップアップを起動し、 Promiseでユーザ情報を返却します。
`result` を利用することでOAuthのトークンを取得したり、
ユーザ情報を取得したりすることが可能です。

### ログイン情報の永続化

上記のコードでGitHubアカウントを利用したログインが可能になりましたが、
まだリロードするとログイン状態が解除されてしまいます。

ログインした状態をブラウザに記録し、継続的なログインを有効化するには、
以下のような形で、 `mounted` のセクションに認証情報の読み込み処理を追加します。

```vue
<script>
  import firebase from '~/service/firebase'

  export default {
    // ...
    mounted(){
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          this.$store.dispatch("loginWithUserName", user.displayName)
        }
      })
    },    
    // ...
  }
</script>
```

`firebase.auth().onAuthStateChanged` はFirebaseの認証状態をチェックするための関数です。
過去の認証情報を読み取ってコールバック関数で取得可能なため、
引数に渡した関数からログイン状態を取得して、自動的に再ログインさせることができます。
