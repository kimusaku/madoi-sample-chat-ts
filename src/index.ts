import { GetState, Madoi, SetState, Share } from "./madoi/madoi";

window.addEventListener("load", ()=>{
    // Chatクラスのインスタンスを作成する。
    const chat = new Chat("#chatForm", "#name", "#message", "#chatLog");

    // Madoiライブラリを使ってサービスに接続する。引数の"room/"以降はセッション識別文字列。
    const m = new Madoi(`wss://fungo.kcg.edu/madoi-20211030/rooms/chat-o3i4falskdjj`);

    // chatインスタンスを登録する。共有に関するメソッドの情報はデコレータ(@???)から取得される。
    m.register(chat);
});

class Chat{
    private chatForm: HTMLFormElement;
    private nameInput: HTMLInputElement;
    private messageInput: HTMLInputElement;
    private logDiv: HTMLDivElement;
    private logs: string[] = [];
    constructor(formSelector: string, nameSelector: string,
        messageSelector: string, logSelector: string){
        // HTML内のタグをJavaScriptから操作するために，対応するElementオブジェクトを取り出す。
        this.chatForm = document.querySelector(formSelector)!;
        this.nameInput = document.querySelector(nameSelector)!;
        this.messageInput = document.querySelector(messageSelector)!;
        this.logDiv = document.querySelector(logSelector)!;
        // チャットフォームのsubmitイベントで，chat.addMessageを実行する。
        this.chatForm.addEventListener("submit", e => {
            e.preventDefault();
            const name = this.nameInput.value.trim();
            const message = this.messageInput.value.trim();
            if(message.length == 0) return false;
            this.messageInput.value = "";
            // addMessage実行。プロキシが実行される。本来のaddMessageはサービスからメッセージが届いた際に実行される。
            this.addMessage(name, message);
        });
    }

    // ログ領域にチャットメッセージを追加するメソッド
    @Share()
    addMessage(name: string, message: string){
        const log = name + ": " + message;
        this.appendLog(log);
        this.logDiv.scrollTop = this.logDiv.scrollHeight;
        this.logs.push(log);
        // 100件以上は保持しないようにする。
        if(this.logs.length > 100){
            this.logs.splice(0, this.logs.length - 100);
        }
    }

    // ログ領域にログを追加するメソッド
    private appendLog(log: string){
        const span = document.createElement("span");
        const br = document.createElement("br");
        span.append(log);
        this.logDiv.append(span);
        this.logDiv.append(br);
    }

    // 状態を取得するメソッド。
    @GetState()
    getState(){
        return JSON.stringify(this.logs);
    }

    @SetState()
    // 状態を設定するメソッド
    setState(state: string){
        this.logs = JSON.parse(state);
        this.logDiv.innerHTML = "";
        for(let log of this.logs){
            this.appendLog(log);
        }
        this.logDiv.scrollTop = this.logDiv.scrollHeight;
    }
}
