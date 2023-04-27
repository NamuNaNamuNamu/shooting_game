////// メイン関数 //////

// サーバー側と紐づくためのソケット
let socket = io();

// クライアント番号
let client_num = "";
// 画像の用意
let loading_images_is_completed = false;
let imgs = [];
// canvas を用意
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

function main(){
    // クライアント番号生成要求
    socket.emit("require_client_num", client_num);
    // サーバーから8桁のクライアント番号をうけとる
    socket.once("require_client_num", function(returned_client_num){
        // 先頭の "|" を削除
        returned_client_num = returned_client_num.slice(1);
        client_num = returned_client_num;
    });
    // ウィンドウが閉じた時の処理を追加
    add_beforeunload_listener();
    // 画像の読み込みスタート
    load_images();
    // canvas のサイズを決定
    determine_canvas_size(canvas);
    // タイトル画面へ遷移(画像読み込みが終わっていれば)
    let interval = setInterval(function(){
        if(loading_images_is_completed){
            clearInterval(interval);
            // title(canvas, context);
            title(canvas, context);
        }
    }, 100);
}

// ページが読み込まれたら
window.addEventListener("load", function(e){
    // メイン関数実行
    main();
});

////// 関数 //////

//// 写真を読み込む
function load_images(){
    let num_of_loading_completed = 0;
    let srcs = [
        "img/bullet.png",
        "img/button.png",
        "img/player1.png",
        "img/player2.png",
        "img/space.jpg",
    ];
    for(let i = 0; i < srcs.length; i++){
        let img = new Image();
        img.src = srcs[i];
        imgs.push(img);
        img.addEventListener("load", function(){
            num_of_loading_completed++;
            if(num_of_loading_completed >= srcs.length){
                loading_images_is_completed = true;
            }
        });
    }
}

//// canvas のサイズを決める
function determine_canvas_size(canvas){
    let scale_down_ratio = 1;
    let width = document.documentElement.clientHeight * 0.48;
    let height = document.documentElement.clientHeight * 0.96;
    if(document.documentElement.clientWidth * 0.96 < width){
        scale_down_ratio = document.documentElement.clientWidth * 0.96 / width;
    }
    canvas.width = width * scale_down_ratio;
    canvas.height = height * scale_down_ratio;
}

//// ウィンドウが閉じた時の処理を追加
function add_beforeunload_listener(){
    window.addEventListener("beforeunload", function(e){
        // ルーム番号削除要求
        socket.emit("delete_room_num", room_num);
        // クライアント番号削除要求
        socket.emit("delete_client_num", client_num);
    });
}