////// プレイ画面 //////
const FPS = 30;
const INITIAL_NUM_OF_BULLETS = 6;
const FRAME = 3;    // 何フレーム分のデータをまとめて送るか or 受け取るか
let it_is_first_time_to_get_to_game = true;
let sent_text = "";
let sending_count = 0;
let received_data = null;       // 受け取ったデータ (FRAME 分まとまっている) のまとまり
let receiving_count = 0;        // データを受け取ってから何フレームたったか

function game(canvas, context){
    // 部屋番号を解放 (ルーム番号削除要求)
    socket.emit("delete_room_num", room_num);
    //// ゲームデータ受付開始
    if(it_is_first_time_to_get_to_game) waiting_game_data();
    it_is_first_time_to_get_to_game = false;
    //// プレイヤーの用意
    let player1 = new Player(
        canvas.width * 0.5,         // 初期 x 座標 (中心)
        canvas.height * 0.9,        // 初期 y 座標 (中心)
        canvas.width * 0.08,        // 横幅
        canvas.height * 0.04,       // 縦幅
        canvas.width * 0.08 * 0.15, // スピード
        10,                        // 初期 HP
        INITIAL_NUM_OF_BULLETS,                          // 初期 残弾
        imgs[2],                    // 画像情報
        {                           // 元画像の切り抜き情報
            x : 15,
            y : 11,
            width : 71,
            height : 81,
        },
        0,                          // 0 ... 青, 1 ... 赤
    );
    let player2 = new Player(
        canvas.width * 0.5,         // 初期 x 座標 (中心)
        canvas.height * 0.1,        // 初期 y 座標 (中心)
        canvas.width * 0.08,        // 横幅
        canvas.height * 0.04,       // 縦幅
        canvas.width * 0.08 * 0.15, // スピード
        10,                        // 初期 HP
        INITIAL_NUM_OF_BULLETS,                          // 初期 残弾
        imgs[3],                    // 画像情報
        {                           // 元画像の切り抜き情報
            x : 14,
            y : 8,
            width : 71,
            height : 81,
        },
        1,                          // 0 ... 青, 1 ... 赤
    );
    //// 弾の用意
    let bullets = [];

    //// イベントリスナー関係
    let move_x = player1.x;
    let move_y = player1.y;
    let shot_x = null;
    let shot_y = null;
    let clicked = false;
    // 画面タッチ(マウス)のイベントリスナーを起動
    canvas.addEventListener("mousedown", mousedownListener, false);
    // 画面タッチ(指)のイベントリスナーを起動
    canvas.addEventListener("touchstart", touchstartListener, false);
    // 画面スワイプ(マウス)のイベントリスナーを起動
    canvas.addEventListener("mousemove", mousemoveListener, false);
    // 画面スワイプ(指)のイベントリスナーを起動
    canvas.addEventListener("touchmove", touchmoveListener, false);
    // 画面からマウスを離した時ののイベントリスナーを起動
    canvas.addEventListener("mouseup", mouseupListener, false);
    function mousedownListener(event){
        event.preventDefault();
        let x = event.clientX - canvas.getBoundingClientRect().left
        let y = event.clientY - canvas.getBoundingClientRect().top
        // 画面上半分の場合は shot 情報を入れる
        if(0 <= y && y <= canvas.height * 0.5){
            shot_x = x;
            shot_y = y;
        }
        // 画面下半分の場合は move 情報を入れる
        else{
            move_x = x;
            move_y = y;
        }
        clicked = true;
    }
    function touchstartListener(event){
        event.preventDefault();
        let x = event.changedTouches[0].pageX - canvas.getBoundingClientRect().left;
        let y = event.changedTouches[0].pageY - canvas.getBoundingClientRect().top;
        // 画面上半分の場合は shot 情報を入れる
        if(0 <= y && y <= canvas.height * 0.5){
            shot_x = x;
            shot_y = y;
        }
        // 画面下半分の場合は move 情報を入れる
        else{
            move_x = x;
            move_y = y;
        }
    }
    function mousemoveListener(event){
        event.preventDefault();
        if(clicked){
            // 画面下半分をタッチした時の x, y
            move_x = event.clientX - canvas.getBoundingClientRect().left
            move_y = event.clientY - canvas.getBoundingClientRect().top
        }
    }
    function touchmoveListener(event){
        event.preventDefault();
        move_x = event.changedTouches[0].pageX - canvas.getBoundingClientRect().left;
        move_y = event.changedTouches[0].pageY - canvas.getBoundingClientRect().top;
    }
    function mouseupListener(event){
        event.preventDefault();
        clicked = false;
    }

    // 30fps でメインループ開始
    let mainloop = setInterval(function(){
        //// 処理 (player 1)
        // 残弾計算
        player1.remaining_bullets = INITIAL_NUM_OF_BULLETS;
        player2.remaining_bullets = INITIAL_NUM_OF_BULLETS;
        for(let bullet of bullets){
            if(player1.player_code == bullet.player_code) player1.remaining_bullets--;
            if(player2.player_code == bullet.player_code) player2.remaining_bullets--;
        }
        // 指(マウス)とプレイヤーの角度を測る
        let theta_move = get_degree(player1.x, player1.y, move_x, move_y);
        let theta_shot = get_degree(player1.x, player1.y, shot_x, shot_y);
        // もし画面下側の操作だったら プレイヤーの移動
        player1.move(move_x, move_y, theta_move);
        // もし画面上側の操作でかつ、画面タッチの操作だったら 弾の発射
        if(shot_x != null && shot_y != null){
            let bullet = player1.shot(shot_y, theta_shot);
            if(bullet != null) bullets.push(bullet);
        }

        //// 処理 (player 2)
        if(received_data != null){
            // プレイヤーデータ
            player2.hp = received_data[receiving_count].hp;
            player2.x = canvas.width - Number(received_data[receiving_count].x * canvas.width);
            player2.y = canvas.height - Number(received_data[receiving_count].y * canvas.height);
            // 弾の発射データ
            if(received_data[receiving_count].shot_y != "null"){
                let bullet = player2.shot(Number(received_data[receiving_count].shot_y), Math.PI + Number(received_data[receiving_count].theta_shot));
                if(bullet != null) bullets.push(bullet);
            }
        }
        receiving_count++;
        if(receiving_count > FRAME - 1){
            received_data = null;
        }

        //// 処理 (弾)
        for(let bullet of bullets){
            // 弾の移動
            bullet.move();
            // 弾が場外に出たら or 相手に当たったら消去
            if(bullet.player_code == 0){
                if(bullet.should_be_delete(player2)){
                    bullets.splice(bullets.indexOf(bullet), 1);
                }
            }
            if(bullet.player_code == 1){
                if(bullet.should_be_delete(player1)){
                    bullets.splice(bullets.indexOf(bullet), 1);
                }
            }
        }

        //// room_num, hp, x座標, y座標, shot_y, theta_shot を送信
        sending_game_data(player1, shot_y, theta_shot);

        shot_x = null;
        shot_y = null;

        //// 描画
        // 宇宙の画像(背景)の描画
        draw_background(canvas, context);
        // 中央線を引く
        draw_center_line(canvas, context);
        // Player を描画
        player1.draw(canvas, context);
        player2.draw(canvas, context);
        // 弾を描画
        for(let bullet of bullets){
            bullet.draw();
        }
        // どちらかの hp が 0 かつ 相手にもデータを送り切ったらタイトル画面に戻る
        if((player1.hp <= 0 || player2.hp <= 0) && sending_count == 0){
            // メインループ終了
            clearInterval(mainloop);
            // この画面のイベントリスナーを解除する
            canvas.removeEventListener("mousedown", mousedownListener, false);
            canvas.removeEventListener("touchstart", touchstartListener, false);
            canvas.removeEventListener("mousemove", mousemoveListener, false);
            canvas.removeEventListener("touchmove", touchmoveListener, false);
            canvas.removeEventListener("mouseup", mouseupListener, false);
            title(canvas, context);
        }
    }, 1000 / FPS);
}

////// 関数 //////

// 角度からラジアンを求める関数
function degree_to_rad(degree){
    return degree * Math.PI / 180;
}

// ラジアンから角度を求める関数
function rad_to_degree(rad){
    return rad / Math.PI * 180;
}

// 2点の x, y 座標から角度を算出する関数(単位は 度)
function get_degree(x1, y1, x2, y2){
    let rad = Math.atan2(y2 - y1, x2 - x1);
    return rad;
}

// 中央線を引く関数
function draw_center_line(canvas, context){
    // パスの開始
    context.beginPath();
    // 起点
    context.moveTo(0, canvas.height * 0.5);
    // 終点
    context.lineTo(canvas.width, canvas.height * 0.5);
    // 描画
    context.strokeStyle = "rgb(150, 255, 150)";
    context.lineWidth = canvas.width * 0.005;
    context.stroke();
}

function sending_game_data(player1, shot_y, theta_shot){
    // まとめてデータを送るまでカウント
    sending_count++;
    // client_num
    sent_text += (client_num + "|");
    // room_num
    sent_text += (room_num + "|");
    // hp
    sent_text += (String(player1.hp) + "|");
    // x座標 (0 ~ 1) 
    sent_text += (String(player1.x / canvas.width) + "|");
    // y座標 (0 ~ 1) 
    sent_text += (String(player1.y / canvas.height) + "|");
    // shot_y
    sent_text += (String(shot_y) + "|");
    // theta_shot
    sent_text += (String(theta_shot) + "|");
    if(sending_count >= FRAME){
        sending_count = 0;
        socket.emit("game", sent_text);
        sent_text = "";
    }
}

//// ゲーム中に必要なを待ち受けるための関数
function waiting_game_data(){
    // サーバーからゲームに必要なデータを受け取る
    socket.on("game", function(data){
        let bunch_of_data = [];
        for(let i = 0; i < FRAME; i++){
            // 送信元の client_num を確認
            let returned_client_num = data.substr(0, data.indexOf("|"));
            data = data.substr(data.indexOf("|") + 1);
            // 自分の送ったデータならば無視
            if(returned_client_num == client_num) return;
            // 自分の部屋番号のデータかどうか確認
            let returned_room_num = data.substr(0, data.indexOf("|"));
            data = data.substr(data.indexOf("|") + 1);
            // 自分の部屋番号のデータないならば無視
            if(returned_room_num != room_num) return;
            // データ抽出
            let hp = data.substr(0, data.indexOf("|"));
            data = data.substr(data.indexOf("|") + 1);
            let x = data.substr(0, data.indexOf("|"));
            data = data.substr(data.indexOf("|") + 1);
            let y = data.substr(0, data.indexOf("|"));
            data = data.substr(data.indexOf("|") + 1);
            let shot_y = data.substr(0, data.indexOf("|"));
            data = data.substr(data.indexOf("|") + 1);
            let theta_shot = data.substr(0, data.indexOf("|"));
            data = data.substr(data.indexOf("|") + 1);
            // データを受け取る
            bunch_of_data.push({
                hp : hp,
                x : x,
                y : y,
                shot_y : shot_y,
                theta_shot : theta_shot,
            });
        }
        received_data = bunch_of_data;
        receiving_count = 0;
    });
}