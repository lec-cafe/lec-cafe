# Databaseの利用

ログイン認証の処理ができたら、chatのデータをデータベースに格納し、
複数のユーザでデータを共有できるようにしてみましょう。

## FirebaseにおけるDatabase 

Firebaseでは以下2種類のデータベースが用意されています。

- Firebase Realtime Database 
- Firebase Cloud Firestore

Cloud Firestoreはクエリの機能などが強化されたDatabaseです。

このドキュメントでもCloud Firestoreを利用したデータ操作を紹介していきます。

まずはFirebase Console上でCloud Firestoreを有効化しておきましょう。

## Databaseにデータを追加する

Cloud Firestoreの操作には、 `firebase.firestore()` が利用されます。

`firebase.firestore().collection('collection_name').add` を利用して、
データベースにデータを追加することが可能です。

```vue
<script>
  import firebase from '~/service/firebase'

  const db = firebase.firestore();

  export default {
    // ...
    methods: {
      // ...
      submitPost() {
        if (this.form.comment === "") {
          return false
        }
        const date = new Date()
        db.collection('posts').add({
          comment: this.form.comment,
          user: this.user.name,
          date: `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
        })
        this.form.comment = ""
      }
    }
  }
</script>
```

submitPostの処理内で、データの追加をVuexからCloud Firestoreに書き換えています。

addでは任意のコレクション（テーブル）に1つのデータを追加することが可能となっており、
実際に画面を操作して、postsコレクションにデータを追加することが可能です。

追加されたデータはFirestoreの管理画面上から確認することができるので、
Firebase Cosoleからその動作を確認してみましょう。

## Databaseからデータを取得する
 
データの追加ができるようになったら、一覧で表示するデータを
Databaseから取得したデータに置き換えてみましょう。

```vue
<script>
  import firebase from '~/service/firebase'

  const db = firebase.firestore();

  export default {
    data () {
      return {
        form: {
          comment: ""
        },
        posts: null
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    async mounted(){
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          this.$store.dispatch("loginWithUserName", user.displayName)
        }
      })
      this.load()
    },
    methods: {
      async load(){
        const snapshot = await db.collection('posts')
          .orderBy('date', 'desc')
          .get()
        console.log(snapshot)
        if(snapshot.empty){
          this.posts = []
        }else{
          this.posts = snapshot.docs.map((doc)=>{
            return doc.data()
          })
        }
      },
      async login () {
        const provider = new firebase.auth.GithubAuthProvider()
        const result = await firebase.auth().signInWithPopup(provider)
        // var token = result.credential.accessToken
        var user = result.user
        this.$store.dispatch("loginWithUserName", user.displayName)
      },
      submitPost() {
        // ...
        db.collection('posts').add({
          // ...
        })
        this.load()
        this.form.comment = ""
      }
    }
  }
</script>
```

変更点は以下の3つです。

- postsをvuexからdataに移動
- methodsにload関数を追加
- mountedとsubmitPostでloadをコール

load関数では、getを利用して、データの取得を行うことができます。

```js
const snapshot = await db.collection('posts')
  .orderBy('date', 'desc')
  .get()
console.log(snapshot)
if(snapshot.empty){
  this.posts = []
}else{
  this.posts = snapshot.docs.map((doc)=>{
    return doc.data()
  })
}
```

取得したオブジェクトはQuerySnapshotオブジェクトと呼ばれるもので、
`docs` の中から配列形式でデータを取得することが可能です。

配列内のデータは、QueryDocumentSnapshotオブジェクトと呼ばれるもので、
data関数をコールしてそれぞれのデータを取得することができます。

結果オブジェクトに関する詳しいAPIは以下の資料から確認可能です。

https://googleapis.dev/nodejs/firestore/latest/index.html
