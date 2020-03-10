# いろいろなHTML要素

HTMLはシンプルに見えてとても複雑な言語です。

HTMLは単にcssの装飾のためにdiv要素を置いていく言語ではなく、文章の構造を記述する言語です。

そのため、HTMLを記述する上では文書内のコンテンツの関連性を考えながら、
適切にコーディングを進めていく必要があります。

## 文書の親子兄弟関係

文書の親子関係、兄弟関係はHTMLを記述する上での重要な要素です。

webデザインをHTMLに起こす上で、文書の親子関係、
兄弟関係は適切にHTMLに落とし込まなければなりません。

## HTMLのコンテンツカテゴリー

HTML5から要素の区分けが大きく一新され、
それぞれの要素に、カテゴリーとしての名称が付与されました。

https://developer.mozilla.org/ja/docs/Web/Guide/HTML/Content_categories

## 文書の構造を記述するHTML要素

文章の構造を記述するHTML要素は、見た目上は全てdivで代替する事ができますが、
これらの要素を利用して適切にHTMLを記述することで、
Googleの検索エンジン等により適切にHTMLの構造を伝えることが可能となり、
SEOなどの面での効果を期待する事ができます。

### header 

文書の中でヘッダーに該当する要素を表します。

### footer

文書の中でフッターに該当する要素を表します。

### main

文書の中でメインのコンテンツとなる部分を表します。

### section

文章の中での、ひとまとまりのセクションを表します。

通常、sectionは見出しのhx系要素を含む形で実装されるのが適切です。

```html
<div>
  <h2>おすすめの居酒屋一覧</h2>
  <p>私が見つけたおすすめの居酒屋を紹介します。</p>
  
  <div>
    <div>
      <h3>居酒屋 つばき</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A cumque debitis ducimus error esse harum id laboriosam minima mollitia, nam obcaecati odio possimus quasi rem saepe totam, veritatis voluptate voluptatem!</p>          
    </div>
    <div>
      <h3>居酒屋 ききょう</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A cumque debitis ducimus error esse harum id laboriosam minima mollitia, nam obcaecati odio possimus quasi rem saepe totam, veritatis voluptate voluptatem!</p>          
    </div>
  </div>
</div>
```

上記のような、 divのみで作られたHTMLは以下のような形でsectionを利用して記述することが可能です。

```html
<section>
  <h2>おすすめの居酒屋一覧</h2>
  <p>私が見つけたおすすめの居酒屋を紹介します。</p>
  
  <div>
    <section>
      <h3>居酒屋 つばき</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A cumque debitis ducimus error esse harum id laboriosam minima mollitia, nam obcaecati odio possimus quasi rem saepe totam, veritatis voluptate voluptatem!</p>          
    </section>
    <section>
      <h3>居酒屋 ききょう</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A cumque debitis ducimus error esse harum id laboriosam minima mollitia, nam obcaecati odio possimus quasi rem saepe totam, veritatis voluptate voluptatem!</p>          
    </section>
  </div>
</section>
```

### article

1つの完結した記事のまとまりを表します。

### nav

文章内での主要なナビゲーションを表します。

### aside

文書内での補足的なコンテンツを表します。

::: tip
sectionのように内部で見出しを利用することを推奨するHTML5の要素を
セクショニング・コンテンツ、と呼びます。
:::

## 文書内の要素を記述するHTML要素

### hx

見出しを表現する `h1` から `h6` までの要素は、
セクショニングコンテンツとともに利用され、文章構造内の見出しを伝えます。

hxの各数字は見出しの強さを表しており、通常、親に近い要素ほど、小さな数字が用いられます。

### p

段落をあらわすp要素は、ある程度の意味上のまとまりを持った文書群を記述するために用いられます。

人まとまりの文書を、改行のために複数のp要素で記述するのは適切ではありません。

### a/button

リンク要素、クリック可能な要素をあらわす際にはa要素やbutton要素を利用します。

a要素はhrefとセットで利用することが必要です。

JavaScriptなどでのクリックイベントの設定もdivなどの要素に設定すると
クリック可能であることをブラウザが認識できないケースもあるため、
クリックイベントはa要素やbutton要素に設定するようにしましょう。

### li

ul要素やol要素とともに、リスト形式の構造を表します。

### div/span

一般的な、レイアウト等の目的でのグループ化を行う際に用いられます。

一般に、divがブロックレベル要素として用いられるのに対し、 
spanはインライン要素として用いられます。

## 変更に強いHTMLの構成

HTMLでマークアップした文章は、そのままでサイトとして用いられるケースもありますが、
システムに組み込まれたり、CMS経由でコンテンツが差し込まれたりして、
内部のコンテンツが大きく変わるケースも多々あります。

こうした状況に対応するためにも、変更に強いHTMLを記述することは非常に重要です。

### システム組み込みに対する柔軟性

適切なグルーピングができていないHTMLのコードは、
システムに組み込む上で問題となるケースが多々あります。

システムでは意味上のまとまり毎に、HTMLの要素の表示非表示を切り替えたり、
ループ構造を用いてデータを繰り返し表示したりします。

システムの構造を理解していなくても、このような表示非表示で切り替えになりうる要素や、
繰り返しで利用される要素を適切にグルーピングできれていれば、
システムに組み込みやすいHTMLを作成することは十分に可能です。

例えばお店の一覧などが以下のようなHTMLで記述されていると、繰り返しの導入が困難になります。

```html
  <div>
    <h3>居酒屋 つばき</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A cumque debitis ducimus error esse harum id laboriosam minima mollitia, nam obcaecati odio possimus quasi rem saepe totam, veritatis voluptate voluptatem!</p>          
    <h3>居酒屋 ききょう</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A cumque debitis ducimus error esse harum id laboriosam minima mollitia, nam obcaecati odio possimus quasi rem saepe totam, veritatis voluptate voluptatem!</p>          
  </div>
```

ループすべきまとまりは1つのdivを用いて以下のように記述するのが適切です。

```html
  <div>
    <div>
      <h3>居酒屋 つばき</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A cumque debitis ducimus error esse harum id laboriosam minima mollitia, nam obcaecati odio possimus quasi rem saepe totam, veritatis voluptate voluptatem!</p>          
    </div>
    <div>
      <h3>居酒屋 ききょう</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A cumque debitis ducimus error esse harum id laboriosam minima mollitia, nam obcaecati odio possimus quasi rem saepe totam, veritatis voluptate voluptatem!</p>          
    </div>
  </div>
```


### コンテンツの差し替えに対する柔軟性

CMSに限らず、コンテンツの差し替えは、運用上必ず発生しうるものです。

前提として差し替えうる項目と固定の項目を確認しておくのはディレクション上とても重要です。 
差し替えうる項目に関しては、コーディング上である程度の柔軟性を担保する必要があります。

コンテンツの差し替えで発生する問題は主に以下のようなものがあります。

- 画像を差し替えた際の、画像表示歪みなどの不具合
- テキストを差し替えた際の、テキスト表示溢れ等の不具合

画像のコーディングは、必ず幅か高さのいずれかを設定するようにしましょう。
幅も高さも設定せずに、そのままのサイズで画像を表示している場合、
異なる解像度の画像で差し替えを行うと、画像の表示領域が変化して大きくレイアウトを崩してしまいます。 
また、画像の幅と高さ両方を指定してしまうと、差し替えの前後で画像の縦横比が違う場合、画像が歪んで表示されてしまいます。

幅か高さで迷った場合、幅を固定に設定するのが良いでしょう。
横の長さが無限に大きくなる場合、コンテナから表示領域が溢れたりして、
意図しない横スクロールが発生してしまうなどの問題があります。

文字に関しても文章の溢れを考慮しておくと良いでしょう。 特に表示領域幅の狭いエリアでは、文章量増加に対する行数の増え具合が大きくなります。

またword-breakの設定にも注意が必要です。 URLなどのように、一単語で認識されうる長い英数字が表示される場合、 適切なword-breakの設定がないと表示幅があふれる可能性もあります。

https://developer.mozilla.org/ja/docs/Web/CSS/word-break

### レイアウトの組み換えに対する柔軟性

文言の差し替えとは別に、運用上の時間経過で、コンテンツの重要度や意味合いが変化するケースもあります。

- 掲載期間が終了したイベント告知領域を削除
- お知らせの掲載件数を3件から6件に変更
- お問い合わせ需要の増加に伴い、問い合わせエリアを画面上部に移動

このようなレイアウト変更や修正に対応するためには、
例えばTwitter BootstrapなどのCSSフレームワークにあるような、
「どこに配置しても適切に機能するCSS」の記述が必要です。

通常、このような仕様変更の要求は、意味上のまとまり、つまりセクショニングコンテンツ単位で起こるケースが多いでしょう。
最低限、セクショニングコンテンツ単位でコンポーネントの考え方を意識したコーディングができれば、
レイアウトの変更に対して強いコンポーネントライクなコードが出来上がります。

セクショニングコンテンツの単位で「どこに配置しても適切に機能するCSS」を実現するには、
厳密にはStyleGuideなどの導入が不可欠ですが、一般的な制作の範囲でそこまでするのは億劫なので、
ここでは押さえて置くべき主要な点についてのみ検討しておきましょう。

