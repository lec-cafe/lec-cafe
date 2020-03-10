# Promiseとasync await

JavaScriptで非同期処理を行う際に重要になるPromiseとAsync Awaitの仕組みについて理解しておきましょう。

## Promise

Promiseは非同期な処理をJavaScriptで表現するための共通のフォーマットです。

PromiseはPromiseクラスを利用して作成する事ができます。
下記は一秒後に処理が完了するPromiseです。

```js 
const promise = new Promise( (resolve)=>{
  setTimeout( ()=>{
    resolve(true)
  },1000)
})
```

通常Promiseを自分で作成するケースは稀かもしれません。
多くのJavaScriptライブラリで、 非同期の処理はPromiseベースで実装されており 
通常はこうしたライブラリから生成されたpromiseのオブジェクトを受け取るケースがほとんどです。

生成されたpromiseオブジェクトは、`then` を呼び出すことで、処理完了時の動作を定義することができます。

```js
promise.then((result)=>{
  // 処理が完了したタイミングで呼び出される
  console.log(result)
})
```

`then` で定義する関数の第一引数には、 resolveが呼び出された際の引数が格納されます。
また、 thenはチェインすることも可能で、チェインされたthenでは直前のthenでreturnした値が
次のthenの関数の第一引数に渡されます。

```js
const promise = new Promise( (resolve)=>{
  setTimeout( ()=>{
    resolve("first message")
  },1000)
})
promise.then((result)=>{
  console.log(result) // first message
  return "second message" 
}).then((result)=>{
    console.log(result) // second message
})
```

Promise内でthrowされたエラーは、 catchを利用して受け取ることができます。

```js
promise.catch((e)=>{
  console.log(e)
})
```

## async await 

async awaitはES2017で追加された、 非同期処理の新しい書き方です。

asyncを付与した関数（async function) は自動的にPromiseを返却するよう変換されます。

```js
const myFunc = async () => {
  return "hello world"
}
// 上の関数は下の関数と同じ
const myFunc = () => {
  return new Promise( (resolve)=>{
    resolve("hello world")
  })
}
```

またasync functionの内部ではawaitキーワードが利用可能です。

`await promise` の形式でコードを記述することで、 thenを記述することなく、 
promiseの処理完了を待つことができます。

```js
const promise = new Promise( (resolve)=>{
  setTimeout( ()=>{
    resolve("hello world")
  },1000)
})

const myFunc = async () => {
  const message = await promise
  console.log(message) // "hello world"
}
```
