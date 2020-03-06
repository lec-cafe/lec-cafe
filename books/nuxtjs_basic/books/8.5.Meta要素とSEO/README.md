# Meta要素とSEO 

HTMLでは、コンテンツを記述するBody要素の他に 
ページのメタ要素を記述するHead要素が存在します。

主たるコンテンツを記述するBody要素とは異なり、
Head要素ではページに表示されない補足的な情報が記述されます。

以下に一般的なHEAD要素の中身を記述しておきます。

```html
<!doctype html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>サイトタイトル</title>

    <meta name="description" content="ページの詳細な説明文">
    
    <link rel="icon" type="image/png" href="/path/to/icon.png">
    <link rel="apple-touch-icon" type="image/png" href="/path/to/apple-touch-icon.png">

    <meta name="og:url" content="http://siteaddress.com">
    <meta name="og:type" content="website">
    <meta name="og:title" content="サイトタイトル">
    <meta name="og:image" content="http://siteaddress.com/ogp.png">
    <meta name="og:description" content="ページの詳細な説明文">
</head>
<body>
    ....
</body>
</html>
```

## HTML5の基本構造

```html
<!doctype html>
<html lang="ja">
    <head> ... </head>
    <body> ... </body>
</html>
```

HTMLのDOCTYPEは現在上記の形式で十分です。

以下のような古い形式のDOCTYPE宣言はもうほとんど使う必要はないでしょう。

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

HTMLのlang属性は忘れがちですが正しい言語設定を記述するよう心がけましょう。

### SCRIPTやCSSの読み込みはどこで行うべきか

link要素を利用したCSSの読み込みやscript要素を利用したJavaScriptの読み込みは通常HEAD要素の中で行われます。

body要素に記述されたコンテンツより先にCSSやJavaScriptを有効化するためにHEAD要素の中で読み込みが記述されますが、
一部のJavaScriptではいくつかの理由で、Bodyの一番最後に記述するよう指定がある場合もあります。

基本的にはCSS / JavaScriptベンダーの指示にしたがって読み込みの処理を記述するのがベストですが、
自分で作成するCSS / JavaScriptなどは以下の点に注意しておけば、問題なくHEAD要素内に読み込みの処理を纏める事ができます。

### Body内で記述されたHTML要素を正しく取り扱うために

JavaScriptをBodyの一番末尾に記述させる理由として、
Body内で記述されたHTML要素を正しく取り扱うために、と言った理由付けがされるケースがあります。

しかし、jQueryを利用する場合は、 `$(function(){ .... })` の内部に処理を記述したり、
その他の場合でも `DOMCONTENTLOADED` イベント内で処理を記述させることで、
Body内で記述されたHTML要素を正しく取り扱う事は可能です。

### JSファイルの読み込みに伴うHTMLレンダリングのブロックを防ぐ

HEAD要素内でJSファイルを読み込むと、 JSファイルの規模が大きい際にHTMLのパース処理がブロックされ、サイト表示速度に悪影響を及ぼす、
という問題があります。

BODYの一番最後にSCRIPT要素を記述することで、こうした問題は解決することができますが、
SCRIPT要素にHTML5から導入された `async` `defer` 属性を付与することで、SCRIPT要素をHEAD要素内に置いたままで問題を解決することができます。

![](/images/sec4/asyncdefer.svg)

image from https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async

## HEAD要素のコーディング

HTMLのHEAD要素にはページのメタ情報として様々なものを記述します。

ページの性質によって様々ですが、大きく分けて以下のような要素を記述するケースが多いでしょう。

- SEOのためのページ情報
- ビューポートの記述
- アイコンの記述
- OGPのためのページ情報


### SEOのためのHEAD管理

title要素やdescription要素は、 SEO上重要な要素です。

```html
    <title>サイトタイトル</title>
    <meta name="description" content="ページの詳細な説明文">
```

titleは30文字程度、 descriptionは300文字程度が望ましいと言われていますが、
実際には、Googleでの検索結果ページでどのように表示されるかについて意識して設定するのが良いでしょう。

例えば商品紹介のページに「商品紹介」というタイトルを設定してしまうと、
Googleの検索結果では、何の商品紹介ページなのかわからなくなります。

「商品紹介｜企業名」のような形で記述することで最低限検索結果上で、
どこの会社のページなのかを明記する事ができます。

また一般的なブラウザに置いてはtitle要素はブックマーク名としても利用されるため、
SEOが重要でない業務系のシステムにおいてもtitle要素は最低限意識するほうが良さそうです。

以前はSEO上重要と言われていた、keyword要素やauthor要素などはSEO上はほとんど効果がないようです。
SEOに関してはネット上でも様々な言説が飛び交っていますが、
検索順位に関するロジックは日々進化し変化し続けていますので、
ネット上でやり取りされる信頼性の低いSEO術に捕われるよりも、
MDNなどを参考に正しいHTML構造を意識するマークアップに努めるのが建設的です。

### ビューポートの記述

```html
    <meta name="viewport" content="width=device-width, initial-scale=1">
```

ビューポートはスマートフォンでページを閲覧する際に利用される、ページの表示領域の指定です。

`content="width=device-width"`は、ページ幅を　デバイス幅に合わせる設定です。
`content="width=900"` のようにすることで、ページ幅を任意のサイズで表現することも可能です。

`initial-scale` は初期表示時の表示比率です。
`minimum-scale` や `maximum-scale` でズームイン・アウト時の最小・最大スケールを指定できる他、
`user-scalable=no` を設定することでユーザによるスケールイン・アウト操作を無効化することも可能です（ただしアクセシビリティ上推奨されません）。


### アイコンの記述

Webサイトで必要なアイコンは、ブラウザ上で使用されるfaviconの他iOSで利用されるWebクリップアイコンがあります。

```html
    <link rel="icon" type="image/png" href="/path/to/icon.png">
    <link rel="apple-touch-icon" type="image/png" href="/path/to/apple-touch-icon.png">
```

faviconもapple-toouch-iconも152 px程度の大きさがあれば十分でしょう。

ico形式は複数サイズのアイコンを1ファイルに纏めることができるファイル形式ですが、type属性と併用してpngを用いることも可能です。
typeは `image/png` とします（icoの場合は `image/x-icon` が一般的）。

ico形式の画像を使わなくてもsize属性を用いて複数のサイズの画像を記述することも可能です。

ファビコンはHTMLで記述しなくてもドメインルートで `/favicon.ico` の名前で取得可能なように配信すれば、
ブラウザ側で自動的に認識されます。ドメインルートの配信が難しい場合等にlink要素を用いた参照を利用してください。

`appletouch-icon` は、スマートフォンの「ホーム画面に追加」や「リーディングリスト」などの機能で利用されるアイコンです。

ファビコンもWebクリップアイコンも、未設定のままでリリースする場合、サーバ側に不要な404エラーログを発生させる原因となるため、
要件として不要であっても、極力設定しておくほうが良いでしょう。

### OGPタグ

OGP要素は、 様々なWebサービス上で、ウェブサイトのメタ情報として利用される項目です。

FacebookやTwitter, LINEやSlackなど様々なサービスで 
OGP要素の情報がサイトのメタ情報として利用されています。

主にURLを投稿した際などに、URLの情報をカード形式で表示するために用いられるケースがほとんどです。

```html
    <meta name="og:url" content="http://siteaddress.com">
    <meta name="og:type" content="website">
    <meta name="og:title" content="サイトタイトル">
    <meta name="og:image" content="http://siteaddress.com/ogp.png">
    <meta name="og:description" content="ページの詳細な説明文">
``` 

OGPの画像はサービスによって利用される形式が様々です。
以下のようなツールを利用して、画像の切り抜き方式を調整することで、様々なサービス上で適切なOGPカードを出力する事ができます。

http://ogimage.tsmallfield.com/

また、多くのサービスでOGPの情報は一定時間のキャッシュが行われます。
一度認識されたOGP情報は、サイト上で変更を行った場合でも即時反映させることができません。

Facebookなどは以下のようなキャッシュのクリアツールを用意しているため、これを用いてキャッシュを無効化し、最新の情報を再取得させることができます。
ツールが提供されていないサービスに置いては、一定時間経過でキャッシュが無効化されるため、時間を置いて再チャレンジしてみると良いでしょう。

https://developers.facebook.com/tools/debug/

### Twitter Card 

Twitter CardはTwitter向けのメタタグです。 OGPとは別にTwitterカードを用いることで、
Twitter上に投稿されたURLを特別なカード形式を用いて表現する事ができます。

Twitterカードの見え方は以下のサイトを利用して確認することができます。

https://cards-dev.twitter.com/validator

以下は、Summaryカードと呼ばれる、カードの記述形式です。

```
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="@flickr" />
<meta name="twitter:title" content="Small Island Developing States Photo Submission" />
<meta name="twitter:description" content="View the album on Flickr." />
<meta name="twitter:image" content="https://farm6.staticflickr.com/5510/14338202952_93595258ff_z.jpg" />
```

大きめの画像を利用する場合、 `summary_large_image` と呼ばれる形式も利用可能です。

```
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@nytimes">
<meta name="twitter:creator" content="@SarahMaslinNir">
<meta name="twitter:title" content="Parade of Fans for Houston’s Funeral">
<meta name="twitter:description" content="NEWARK - The guest list and parade of limousines with celebrities emerging from them seemed more suited to a red carpet event in Hollywood or New York than than a gritty stretch of Sussex Avenue near the former site of the James M. Baxter Terrace public housing project here.">
<meta name="twitter:image" content="http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-articleLarge.jpg">
```

[https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/summary](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/summary)

### その他のHEAD要素

ブラウザごとに機能を有効化無効化したりするために、様々な独自メタ要素が定義されています。

独自のメタ定義はブラウザベンダーのバージョンアップ等で利用できなくなったり仕様が変更されたりと
動作が不安定なため、必ず公式のリファレンスを参考にしながら利用してください。

```html
<meta name="format-detection" content="telephone=no">
```

`format-detection` はiOSのSarafiにおいて、サイト内に記述された電話番号の自動リンク機能を制御するものです。
電話発信はa要素を用いて実装する事が可能なため、機能を無効化にする場合には `telephone=no` を指定します。

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="タイトル">
```

`apple-mobile-web-app-` 系のメタ要素は、iOS Safariで、サイトをHome画面に追加した際の挙動を制御します。 

`apple-mobile-web-app-capable` を `yes` に設定することで、アイコンからのサイト閲覧がフルスクリーン表示となります。
`apple-mobile-web-app-status-bar-style` には `default` `black` `black-translucent` が指定可能で、
トップバーの表示がそれぞれ切り替わります。

```html
<meta name="apple-itunes-app" content="app-id=APP_ID">
```

`apple-itunes-app` はiOS Safari上で特定のアプリのインストールを促すバナーの掲出が可能です。

```html
<meta name="google" content="notranslate" />
```

meta要素の `google` は、 `notranslate` を指定することでchrome上での翻訳版提供を禁止するようGoogleに指示を出すことができます。


## SEOのためにすべきこと

検索エンジン最適化、いわゆるSEOはWebアクセス数を向上させるために重要なテーマとなっています。

ネット上では様々な形でSEOに関する記述のテクニックが公開されていますが、
SEOの仕組みは検索エンジンごとに日々変化しており、これと言った確実な方法は実際のところ存在しません。

特に、Googleは「コンテンツの品質」をベースにした検索順位付をおこなう、と言ったことを明言しており、
メタ要素の記述や正しいHTMLの記述といったことすらも検索順位には大きく影響する要素ではないとされています。

では、コンテンツの品質を管理するために、コーディング上で気をつけなければならない点はどのようなものがあるのでしょうか？

### 正しいHTMLを記述する

正しいHTMLの形式であることはGoogleの検索順位について大きな影響を及ぼすものではないようで、
例えば閉じタグの書き忘れや誤ったHTML属性の利用などで検索順位上のペナルティが与えられることはないとされています。

しかし、タイトル要素や見出し要素を利用した情報のセクショニングは、
検索エンジンがサイトの情報を把握する上である程度参考になる要素です。

特にタイトル要素やdescription 、OGPなどのサイトの説明文に関する情報を充実させることは、
後述するサイトの滞在時間向上にも大きく貢献するでしょう。

### サイト体験を向上させる

ユーザがサイトを閲覧する上でのサイト体験を向上させるのは、サイト品質に重要なポイントです。

サイトを閲覧する上での不便さや不具合は可能な限り除去されるべきでしょう。

- サイトは、モバイルなどのマルチメディアに最適化された形式になっているか
- サイトは様々なネットワーク上において、快適に閲覧できる速度になっているか
- サイト閲覧には信頼できるネットワーク接続が利用されているか（SSL対応）

サイト上でのユーザ体験向上については、ネットワーク上の知識が欠かせません
特にサイトの表示速度は重要なテーマとなっていますが、
表示速度以外にもモバイル対応やSSL対応など、ウェブを取り巻くユーザの変化に対して柔軟に対応する必要があります。

### サイトのコンテンツの質を向上させる

サイトのコンテンツに関しても注意が必要です。

他サイトからのコピーなど類似コンテンツはSEO上品質の低いコンテンツと判断される可能性があります。

コンテンツ品質の高いサイトを目指す場合、ページの滞在時間や回遊率などにも注意を払いながら
ユーザにとって本当に役に立つサイトの構成になっているか、などを分析する必要があるでしょう。

## サイトの表示速度を向上させる

サイトの表示速度は、 Webページの品質にとって重要な要素です。

最低限一般的な3G回線等で高速にWebサイトが表示されるよう、
サイトの構成や外部ファイルの読み込みなどを調整する必要があります。

サイトの表示速度の調整は、なんとなくで行うのではなく、「明確な数値目標」を持って行っていくのが良いでしょう。

### Chromeの開発者ツールを用いたチェック

![](/images/sec4/developers.png)

image from https://developers.google.com/web/tools/chrome-devtools/network-performance/resource-loading

最も簡易なチェック方法としてChromeの開発者ツールを用いたチェック方法があります。

開発者ツールのNetworkタブでは、
サイト上での総読み込みファイル数や読み込みサイズ、通信を完了するまでの時間等が記録されるため、
これらに目標値を設定して、速度向上を進めることができます。

「Console Drawer」の「network conditions」では、
ネットワークの状態をエミュレートすることも可能なため、
高速なWifi環境下であっても3G回線での読み込み状態を仮想的に再現することも可能です。

### SpeedInsightを用いたチェック

![](/images/sec4/insight.png)

image from https://developers.google.com/speed/

GoogleのSpeedInsightはサイトのスピード評価でよく用いられるツールです。

https://developers.google.com/speed/pagespeed/insights/?hl=ja

画像やCSS等の圧縮などの問題は、このツールを用いて検出する事ができます。

圧縮などの配信最適化はGulpなどの自動化ツールを用いると簡単に行う事が事ができますが、
個別に手作業で進めようと思った場合、運用に大きな影響を及ぼす可能性もあるため注意が必要です。

### TestMySiteを用いたチェック

GoogleのTest My Siteはモバイル向けのスピード評価ツールとして最近よく用いられています。

https://testmysite.withgoogle.com/intl/ja-jp

SpeedInsightと異なり、 モバイルのみに特化した評価となっており、
同業種内での比較が得られるのが特徴です。

## サイト評価ツールの利用

スピード評価だけでなく、様々なツールを用いてサイトの性能測定を行うことで、
サイト上のパフォーマンスを改善することができます。

### Google Analitics

言わずと知れたGoogleの提供するアクセス解析ツールです。

とりあえず入れておくことで、PVやユーザ数のほか滞在時間やユーザ属性などの値が取得可能なため、
サイトのページ改善だけでなく、他サイト制作上でのユーザ比率推定の指標等としても役立つでしょう。

### Google My Bussinessへの登録
    
ローカルビジネスの場合は、 Google My Bussinessへの登録もSEO上の効果が得られるでしょう。

https://business.google.com/

検索結果上で地図を表示したり、営業時間やウェブサイトの案内を掲出できるため、
検索結果上で強いアピールを行うことができます。
 
### Search Consoleの利用

GoogleのSearch ConsoleはWebサイトの検索エンジン登録上の問題点などを抽出してくれるツールです。

https://search.google.com/search-console

Webサイト上に公開したサイトマップを認識させることで、
サイト内に展開された個別のページ群を適切に検索エンジンに認識させることができます。




