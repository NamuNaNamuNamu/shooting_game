////// メイン関数 //////

// サーバー側と紐づくためのソケット
let socket = io();

// ゲームに必要な画像の配列
let imgs = [];
// canvas を用意
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

function main(){
    let status = {
        loading_images_is_completed: false, // 画像の読み込みが終了したかどうか
    };
    // ウィンドウが閉じた時、ルーム番号を削除するように設定
    add_beforeunload_listener();
    // ゲームに必要な画像の読み込みスタート
    load_images(status);
    // canvas のサイズを決定
    determine_canvas_size(canvas);
    // タイトル画面へ遷移
    go_to_title(status);
}

// ページが読み込まれたら
window.addEventListener("load", function(e){
    // メイン関数実行
    main();
});

////// 関数 //////

//// ゲームに必要な写真を読み込む
/** 
* 画像の読み込みが終わったら、status の loading_images_is_completed を true にする
*/
function load_images(status){
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
                status.loading_images_is_completed = true;
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

//// ウィンドウが閉じた時、ルーム番号を削除するように設定
function add_beforeunload_listener(){
    window.addEventListener("beforeunload", function(e){
        // ルーム番号削除要求
        socket.emit("delete_room_num", room_num);
    });

    window.addEventListener("unload", function(e){
        // ルーム番号削除要求
        socket.emit("delete_room_num", room_num);
    });

    window.addEventListener("pagehide", function(e){
        // ルーム番号削除要求
        socket.emit("delete_room_num", room_num);
    });
}

//// タイトル画面へ遷移(画像読み込みが終わっていれば)
/** 
* status を参照し、画像読み込みが終わっていれば タイトルに遷移する
*/
function go_to_title(status){
    let interval = setInterval(function(){
        if(status.loading_images_is_completed){
            clearInterval(interval);
            title();
        }
    }, 100);
}