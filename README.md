# madoi-sample-chat-ts

未来環境ラボで開発しているオブジェクト共有サービス madoi を使ってチャットを作成するサンプルのTypeScript版です。

まずはこのリポジトリをcloneしてください。
```
git clone https://github.com/kcg-edu-future-lab/madoi-sample-chat-ts
```

次に，madoi-sample-chat-ts ディレクトリに入り，npm installを実行してください。

```
cd madoi-sample-chat-ts
npm install
```

次に，npmコマンドを実行し，アプリケーションを立ち上げてください。

```
npm run serve
```

実行に成功すれば，アプリケーションが起動し，ブラウザが開き，チャット画面が表示されます。
表示された画面のテキストフィールドにメッセージを入力してEnterを押すか送信ボタンを押すと，チャットメッセージが送信されます。

## コードの説明

madoiを使ったチャットのサンプルです。madoiは指定されたメソッドの実行を，同じセッションに参加しているアプリ間で共有するサービスです。このチャットサンプルのコード([index.ts](https://github.com/kcg-edu-future-lab/madoi-sample-chat-ts/blob/main/src/index.ts))では，まずチャットログを管理するクラスChatを作り，メソッドsendを以下のように記述しています。

```ts
class Chat{
    // 省略
    @Share({maxLog: 1000})
    send(name: string, message: string){
        const textSpan = document.createElement("span");
        textSpan.append(name + ": " + message);
        this.logDiv.append(textSpan);
        this.logDiv.append(document.createElement("br"));
        this.logDiv.scrollTop = this.logDiv.scrollHeight;
    }
}
```

このメソッドでは，名前(name)とメッセージ(message)を受け取り，チャットログに"名前: メッセージ"という文字列を追加しています。もしこの処理が他のブラウザでも実行されば，誰かがチャットログを追加したときに他のブラウザでも同じように追加されることになります。そのために，まずこのメソッドが共有の対象であることをmadoiに伝えるために，@Shareデコレータを宣言し，次に[index.ts](https://github.com/kcg-edu-future-lab/madoi-sample-chat-ts/blob/main/src/index.ts)の以下の部分で，madoiにchatオブジェクトを登録しています。

```js
window.addEventListener("load", ()=>{
    // 省略
    m.register(chat);
});
```

上記のコードが実行されると，chat.sendの内容が置き換えられ，メソッドが実行されたら一旦それをサービスに送信するようになります。サービスは参加している全てのブラウザにそれを送信し，ブラウザ側で受信されたら本来のchat.sendの処理が実行されます。これにより，チャットログの共有が実現されます。
