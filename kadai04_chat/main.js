// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  onChildAdded,
  onChildRemoved,
  onChildChanged,
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); //RealtimeDBに接続
const dbRef = ref(db, "chat"); //RealtimeDB内の"chat"を使う

//データ登録(Click)
$(".send_button").on("click", function () {
  const uname = $(".uname").val();
  const text = $(".text").val();

  // 表示確認
  console.log(uname, "名前");
  console.log(text, "テキスト");

  // 送信データの塊（オブジェクト）を作成
  const msg = {
    uname: $(".uname").val(),
    text: $(".text").val(),
  };
  console.log(msg, "msg");

  // 送信処理
  // firebaseにpush＝送る準備 dbRefは鍵
  const newPostRef = push(dbRef);
  set(newPostRef, msg);

  // 送信後、フォームをクリア
  $(".uname").val("");
  $(".text").val("");
});

//データ登録(Enter)
$(".text").on("keydown", function (e) {
  console.log(e); //e変数の中身を確認！！
  if (e.keyCode == 13) {
    //EnterKey=13
    const msg = {
      uname: $(".uname").val(),
      text: $(".text").val(),
    };
    const newPostRef = push(dbRef); //ユニークKEYを生成
    set(newPostRef, msg); //"chat"にユニークKEYをつけてオブジェクトデータを登録
  }
});

//最初にデータ取得＆onSnapshotでリアルタイムにデータを取得
onChildAdded(dbRef, function (data) {
  const key = data.key;
  const msg = data.val();

  // htmlとして埋め込みたいのでテンプレートリテラル(es6の書き方)を使います🤗
  let html = `
  <div class="msg_box">
    <div class="${key}">
    <p class="name_icon">${msg.uname}</p>
        <span contentEditable="true" class="${key}_update">${msg.text}</span>
        <br>
        <div class="output_btn">
          <button class="update" data-key=${key}>✏️</button>
          <button class="remove" data-key=${key}>🗑️</button>
        </div>
    </div>
  </div>
  `;
  //#outputの最後に追加
  $(".output").append(html);
});

// 編集イベント
$(".output").on("click", ".update", function () {
  const key = $(this).attr("data-key");
  update(ref(db, "chat/" + key), {
    text: $("." + key + "_update").html(),
  });
});

// 削除イベント
$(".output").on("click", ".remove", function () {
  const key = $(this).attr("data-key");
  const remove_item = ref(db, "chat/" + key);
  remove(remove_item); //Firebaseデータ削除
});

//Firebaseで更新があったらイベント発生
onChildChanged(dbRef,(data)=>{
  $("." + data.key + "_update").html(data.val().text);
  $("." + data.key + "_update").fadeOut(800).fadeIn(800);
})

onChildRemoved(dbRef,(data)=>{
  $("."+data.key).remove();
})



