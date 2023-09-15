////// スタート画面 //////

// 参加ルームナンバー
let room_num = "";

function title(){
    // room_num の初期化
    room_num = "";
    // 宇宙の画像(背景)の描画
    draw_background(canvas, context);
    // ボタンの用意
    let buttons = make_buttons_in_title(canvas, context, mousedownListener);
    // テキストの表示
    draw_text_in_title(canvas, context);
    // 画面タッチのイベントリスナーを起動
    canvas.addEventListener("mousedown", mousedownListener, false);
    function mousedownListener(event){
        for(let button of buttons){
            if(button.is_clicked(event.clientX - canvas.getBoundingClientRect().left, event.clientY - canvas.getBoundingClientRect().top)){
                button.event();
            }
        }
    }
}

////// 関数 //////

//// 宇宙の背景を描画する関数
function draw_background(canvas, context){
    context.drawImage(imgs[4], 0, 0, 1920, 1080, 0, 0, canvas.width, canvas.height); // imgs[4] は 宇宙の画像
    // 画像を合わせるための処理
    draw_background_one_part(context, 0, 0.27 * canvas.height, canvas.width, canvas.height * 0.05);
}

function draw_background_one_part(context, x, y, width, height){
    context.drawImage(imgs[4], 1920 * 0, 1080 * 0.27, 1920 * 1, 1080 * 0.05, x, y, width, height); // imgs[4] は 宇宙の画像
}

//// ボタンをつくる関数
function make_buttons_in_title(canvas, context, mousedownListener){

    // "募集する"ボタン
    let recruiting_button = new Button(
        canvas.width * 0.5,         // ボタンの x 座標 (中心)
        canvas.height * 0.1,        // ボタンの y 座標 (中心)
        canvas.width * 0.6,         // ボタンの横幅
        canvas.height * 0.15,        // ボタンの縦幅
        function(){                 // クリックイベント
            // ルーム番号受け取り終了したか
            let receiving_room_num_is_completed = false;
            // 4桁のルーム番号生成要求
            socket.emit("require_room_num", "生成要求");
            // ここで "require_room_num" のサーバーからの返答をうけとる
            socket.once("require_room_num", function(returned_room_num){
                // ルーム番号にセット
                room_num = returned_room_num;
                receiving_room_num_is_completed = true;
            });
            // この画面のイベントリスナーを解除する
            canvas.removeEventListener("mousedown", mousedownListener, false);
            // プレイ待機画面に遷移する
            let interval = setInterval(function(){
                if(receiving_room_num_is_completed){
                    clearInterval(interval);
                    lobby(canvas, context);
                }
            }, 100);
        },
        imgs[1],                    // 画像
        "募集する",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 60,
            y : 397,
            width : 422,
            height : 120,
        },
    );

    // "参加する"ボタン
    let participating_button = new Button(
        canvas.width * 0.5,         // ボタンの x 座標 (中心)
        canvas.height * 0.4,        // ボタンの y 座標 (中心)
        canvas.width * 0.6,         // ボタンの横幅
        canvas.height * 0.15,        // ボタンの縦幅
        function(){                 // クリックイベント
            // 4桁のルーム番号を送信
            socket.emit("participating_with_room_num", room_num);
            // ここで "participating_with_room_num" のサーバーからの返答をうけとる
            socket.once("participating_with_room_num", function(returned_room_num_and_client_num){
                let returned_room_num = returned_room_num_and_client_num.substr(0, returned_room_num_and_client_num.indexOf("|"));
                // もしマッチングしたら
                if(room_num == returned_room_num){
                    // この画面のイベントリスナーを解除する
                    canvas.removeEventListener("mousedown", mousedownListener, false);
                    // プレイ画面に遷移する
                    game(canvas, context);
                }
            });
        },
        imgs[1],                    // 画像
        "参加する",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 60,
            y : 397,
            width : 422,
            height : 120,
        },
    );

    // 1 ボタン
    let _1_button = new Button(
        canvas.width * 0.3,         // ボタンの x 座標 (中心)
        canvas.height * 0.6,        // ボタンの y 座標 (中心)
        canvas.width * 0.2 - 1,         // ボタンの横幅
        canvas.height * 0.1 - 1,        // ボタンの縦幅
        function(){                 // クリックイベント
            room_num += "1";
            draw_background_one_part(context, 0, 0.27 * canvas.height, canvas.width, canvas.height * 0.05);
            draw_room_num(canvas, context, room_num);
        },
        imgs[1],                    // 画像
        "1",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 211,
            y : 65,
            width : 121,
            height : 119,
        },
    );

    // 2 ボタン
    let _2_button = new Button(
        _1_button.x + _1_button.width,         // ボタンの x 座標 (中心)
        _1_button.y,        // ボタンの y 座標 (中心)
        _1_button.width,         // ボタンの横幅
        _1_button.height,        // ボタンの縦幅
        function(){                 // クリックイベント
            room_num += "2";
            draw_background_one_part(context, 0, 0.27 * canvas.height, canvas.width, canvas.height * 0.05);
            draw_room_num(canvas, context, room_num);
        },
        imgs[1],                    // 画像
        "2",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 211,
            y : 65,
            width : 121,
            height : 119,
        },
    );

    // 3 ボタン
    let _3_button = new Button(
        _1_button.x + _1_button.width * 2,         // ボタンの x 座標 (中心)
        _1_button.y,        // ボタンの y 座標 (中心)
        _1_button.width,         // ボタンの横幅
        _1_button.height,        // ボタンの縦幅
        function(){                 // クリックイベント
            room_num += "3";
            draw_background_one_part(context, 0, 0.27 * canvas.height, canvas.width, canvas.height * 0.05);
            draw_room_num(canvas, context, room_num);
        },
        imgs[1],                    // 画像
        "3",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 211,
            y : 65,
            width : 121,
            height : 119,
        },
    );

    // 4 ボタン
    let _4_button = new Button(
        _1_button.x,         // ボタンの x 座標 (中心)
        _1_button.y + _1_button.height,        // ボタンの y 座標 (中心)
        _1_button.width,         // ボタンの横幅
        _1_button.height,        // ボタンの縦幅
        function(){                 // クリックイベント
            room_num += "4";
            draw_background_one_part(context, 0, 0.27 * canvas.height, canvas.width, canvas.height * 0.05);
            draw_room_num(canvas, context, room_num);
        },
        imgs[1],                    // 画像
        "4",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 211,
            y : 65,
            width : 121,
            height : 119,
        },
    );

    // 5 ボタン
    let _5_button = new Button(
        _1_button.x + _1_button.width,         // ボタンの x 座標 (中心)
        _1_button.y + _1_button.height,        // ボタンの y 座標 (中心)
        _1_button.width,         // ボタンの横幅
        _1_button.height,        // ボタンの縦幅
        function(){                 // クリックイベント
            room_num += "5";
            draw_background_one_part(context, 0, 0.27 * canvas.height, canvas.width, canvas.height * 0.05);
            draw_room_num(canvas, context, room_num);
        },
        imgs[1],                    // 画像
        "5",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 211,
            y : 65,
            width : 121,
            height : 119,
        },
    );

    // 6 ボタン
    let _6_button = new Button(
        _1_button.x + _1_button.width * 2,         // ボタンの x 座標 (中心)
        _1_button.y + _1_button.height,        // ボタンの y 座標 (中心)
        _1_button.width,         // ボタンの横幅
        _1_button.height,        // ボタンの縦幅
        function(){                 // クリックイベント
            room_num += "6";
            draw_background_one_part(context, 0, 0.27 * canvas.height, canvas.width, canvas.height * 0.05);
            draw_room_num(canvas, context, room_num);
        },
        imgs[1],                    // 画像
        "6",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 211,
            y : 65,
            width : 121,
            height : 119,
        },
    );

    // 7 ボタン
    let _7_button = new Button(
        _1_button.x,         // ボタンの x 座標 (中心)
        _1_button.y + _1_button.height * 2,        // ボタンの y 座標 (中心)
        _1_button.width,         // ボタンの横幅
        _1_button.height,        // ボタンの縦幅
        function(){                 // クリックイベント
            room_num += "7";
            draw_background_one_part(context, 0, 0.27 * canvas.height, canvas.width, canvas.height * 0.05);
            draw_room_num(canvas, context, room_num);
        },
        imgs[1],                    // 画像
        "7",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 211,
            y : 65,
            width : 121,
            height : 119,
        },
    );

    // 8 ボタン
    let _8_button = new Button(
        _1_button.x + _1_button.width,         // ボタンの x 座標 (中心)
        _1_button.y + _1_button.height * 2,        // ボタンの y 座標 (中心)
        _1_button.width,         // ボタンの横幅
        _1_button.height,        // ボタンの縦幅
        function(){                 // クリックイベント
            room_num += "8";
            draw_background_one_part(context, 0, 0.27 * canvas.height, canvas.width, canvas.height * 0.05);
            draw_room_num(canvas, context, room_num);
        },
        imgs[1],                    // 画像
        "8",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 211,
            y : 65,
            width : 121,
            height : 119,
        },
    );

    // 9 ボタン
    let _9_button = new Button(
        _1_button.x + _1_button.width * 2,         // ボタンの x 座標 (中心)
        _1_button.y + _1_button.height * 2,        // ボタンの y 座標 (中心)
        _1_button.width,         // ボタンの横幅
        _1_button.height,        // ボタンの縦幅
        function(){                 // クリックイベント
            room_num += "9";
            draw_background_one_part(context, 0, 0.27 * canvas.height, canvas.width, canvas.height * 0.05);
            draw_room_num(canvas, context, room_num);
        },
        imgs[1],                    // 画像
        "9",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 211,
            y : 65,
            width : 121,
            height : 119,
        },
    );

    // 0 ボタン
    let _0_button = new Button(
        _1_button.x + _1_button.width,         // ボタンの x 座標 (中心)
        _1_button.y + _1_button.height * 3,        // ボタンの y 座標 (中心)
        _1_button.width,         // ボタンの横幅
        _1_button.height,        // ボタンの縦幅
        function(){                 // クリックイベント
            room_num += "0";
            draw_background_one_part(context, 0, 0.27 * canvas.height, canvas.width, canvas.height * 0.05);
            draw_room_num(canvas, context, room_num);
        },
        imgs[1],                    // 画像
        "0",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 211,
            y : 65,
            width : 121,
            height : 119,
        },
    );

    // 消 ボタン
    let delete_button = new Button(
        _1_button.x + _1_button.width * 2,         // ボタンの x 座標 (中心)
        _1_button.y + _1_button.height * 3,        // ボタンの y 座標 (中心)
        _1_button.width,         // ボタンの横幅
        _1_button.height,        // ボタンの縦幅
        function(){                 // クリックイベント
            room_num = "";
            draw_background_one_part(context, 0, 0.27 * canvas.height, canvas.width, canvas.height * 0.05);
            draw_room_num(canvas, context, room_num);
        },
        imgs[1],                    // 画像
        "消",                   // テキスト
        {                           // 元画像の切り抜き情報
            x : 211,
            y : 65,
            width : 121,
            height : 119,
        },
    );

    return [
        recruiting_button,
        participating_button,
        _1_button,
        _2_button,
        _3_button,
        _4_button,
        _5_button,
        _6_button,
        _7_button,
        _8_button,
        _9_button,
        _0_button,
        delete_button,
    ];
}

//// ボタンクラス 
class Button{
    constructor(x, y, width, height, event, img, text, s){
        this.x = x;             // ボタンの横幅
        this.y = y;             // ボタンの縦幅
        this.width = width;     // ボタンの x 座標 (中心)
        this.height = height;   // ボタンの y 座標 (中心)
        this.event = event;     // クリックイベント
        this.img = img;
        this.text = text;
        this.s = s;
        this.draw();
    }
    draw(){
        // ボタン写真の描画
        context.drawImage(
            this.img,  // imgs は ボタンの画像
            this.s.x,  // sx (元画像の切り抜き始点 x)
            this.s.y,  // sy (元画像の切り抜き始点 y)
            this.s.width,  // s_width (元画像の切り抜きサイズ 横幅)
            this.s.height,  // s_height (元画像の切り抜きサイズ 縦幅)
            this.x - this.width * 0.5,  // dx (canvas の描画開始位置 x)
            this.y - this.height * 0.5,  // dy (canvas の描画開始位置 y)
            this.width,  // d_width (canvas の描画サイズ 横幅)
            this.height,  // d_height (canvas の描画サイズ 縦幅)
        );
        // ボタンにテキストを追加
        context.font = this.height * 0.4 + "px メイリオ";
        context.fillStyle = "#000080";
        context.textAlign = "center";
        context.fillText(this.text, this.x, this.y + this.height * 0.15);
    }
    is_clicked(finger_x, finger_y){
        // ボタンに触れていなければ false
        if(!(this.x - this.width * 0.5 <= finger_x && finger_x <= this.x + this.width * 0.5)) return false;
        if(!(this.y - this.height * 0.5 <= finger_y && finger_y <= this.y + this.height * 0.5)) return false;
        // 触れていれば true
        return true;
    }
}

//// テキストを表示する関数
function draw_text_in_title(canvas, context){
    let text;
    context.fillStyle = "#FFFFFF";
    context.textAlign = "center";

    text = "ルームID(入力) : ";
    context.font = canvas.height * 0.04 + "px メイリオ";
    context.fillText(text, canvas.width * 0.5, canvas.height * 0.24 + canvas.height * 0.015);
}

//// 参加ルームナンバーを描画する関数
function draw_room_num(canvas, context, room_num){
    context.fillStyle = "#FFFFFF";
    context.textAlign = "center";
    context.font = canvas.height * 0.04 + "px メイリオ";
    context.fillText(room_num, canvas.width * 0.5, canvas.height * 0.29 + canvas.height * 0.015);
}