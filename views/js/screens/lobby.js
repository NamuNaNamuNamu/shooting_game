////// プレイ待機画面 //////

// この画面に訪れたのが最初かどうか
let it_is_first_time_to_get_to_lobby = true;
let mousedownListener;

function lobby(canvas, context){
    mousedownListener = function mousedownListener(event){
        if(button.is_clicked(event.clientX - canvas.getBoundingClientRect().left, event.clientY - canvas.getBoundingClientRect().top)){
            button.event();
        }
    }
    // 宇宙の画像(背景)の描画
    draw_background(canvas, context);
    // テキストを描画
    draw_text_in_lobby(canvas, context);
    // この画面を訪れたのが最初であれば参加の待ち受けを開始(ソケットをオープン)
    if(it_is_first_time_to_get_to_lobby) waiting_participating();
    it_is_first_time_to_get_to_lobby = false;
    // ボタンの用意
    let button = make_buttons_in_lobby(canvas, context);
    // 画面タッチのイベントリスナーを起動
    canvas.addEventListener("mousedown", mousedownListener, false);
}


////// 関数 //////

//// ボタンをつくる関数
function make_buttons_in_lobby(canvas, context){

    // 戻るボタン
    let go_back_button = new Button(
        canvas.width * 0.10,         // ボタンの x 座標 (中心)
        canvas.height * 0.05,        // ボタンの y 座標 (中心)
        canvas.width * 0.16,         // ボタンの横幅
        canvas.height * 0.08,        // ボタンの縦幅
        function(){                 // クリックイベント
            // ルーム番号削除要求
            socket.emit("delete_room_num", room_num);
            // ルーム番号をリセット
            room_num = "";
            // この画面のイベントリスナーを解除する
            canvas.removeEventListener("mousedown", mousedownListener, false);
            // プレイ待機画面に遷移する
            title(canvas, context);
        },
        imgs[1],                    // 画像
        "⬅︎",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 211,
            y : 65,
            width : 121,
            height : 119,
        },
    );

    return go_back_button;
}

//// テキストを表示する関数
function draw_text_in_lobby(canvas, context){
    let text;
    context.textAlign = "center";

    text = "ルームID";
    context.fillStyle = "#FFFFFF";
    context.font = canvas.height * 0.04 + "px メイリオ";
    context.fillText(text, canvas.width * 0.3, canvas.height * 0.3 + canvas.height * 0.015);

    text = room_num;
    context.fillStyle = "#FFFFFF";
    context.font = canvas.height * 0.08 + "px メイリオ";
    context.fillText(text, canvas.width * 0.5, canvas.height * 0.4 + canvas.height * 0.03);

    text = "参加を待っています...";
    context.font = canvas.height * 0.04 + "px メイリオ";
    context.fillStyle = "#FFFFFF";
    context.fillText(text, canvas.width * 0.5, canvas.height * 0.6 + canvas.height * 0.015);
}

//// 参加を待ち受けるための関数
function waiting_participating(){
    // サーバーから4桁のルーム番号をうけとる
    socket.on("participating_with_room_num", function(returned_room_num_and_client_num){
        let returned_room_num = returned_room_num_and_client_num.substr(0, returned_room_num_and_client_num.indexOf("|"));
        let returned_client_num = returned_room_num_and_client_num.substr(returned_room_num_and_client_num.indexOf("|") + 1);
        
        // もし自分が送信したものを自分でキャッチしてしまっていたら無視
        if(returned_client_num == client_num){
            return;
        }
        // もしマッチングしたら
        if(room_num == returned_room_num){
            // この画面のイベントリスナーを解除する
            canvas.removeEventListener("mousedown", mousedownListener, false);
            // プレイ画面に遷移する
            game(canvas, context);
        }
    });
}