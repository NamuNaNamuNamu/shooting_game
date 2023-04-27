const HTTP = require("http");
const HTML = require("fs").readFileSync("views/index.html");
const MAIN_JS = require("fs").readFileSync("views/js/main.js");
const BULLET_JS = require("fs").readFileSync("views/js/classes/bullet.js");
const OBJECT_JS = require("fs").readFileSync("views/js/classes/object.js");
const PLAYER_JS = require("fs").readFileSync("views/js/classes/player.js");
const GAME_JS = require("fs").readFileSync("views/js/screens/game.js");
const LOBBY_JS = require("fs").readFileSync("views/js/screens/lobby.js");
const TITLE_JS = require("fs").readFileSync("views/js/screens/title.js");
const BULLET_PNG = require("fs").readFileSync("views/img/bullet.png");
const BUTTON_PNG = require("fs").readFileSync("views/img/button.png");
const PLAYER1_PNG = require("fs").readFileSync("views/img/player1.png");
const PLAYER2_PNG = require("fs").readFileSync("views/img/player2.png");
const SPACE_JPG = require("fs").readFileSync("views/img/space.jpg");


// ポート番号
const PORT = 3000;

// リクエスト・レスポンスの対応内容を記述
const SERVER = HTTP.createServer(function(request, response){
    let url = request.url;
    // htmlファイルのリクエストに対する対応
    if(url == "/"){
        response.writeHead(200, {"Content-Type" : "text/html"});
        response.end(HTML);
    }
    // javascriptファイルのリクエストに対する対応
    if(url == "/js/main.js"){
        response.writeHead(200, {"Content-Type" : "text/javascript"});
        response.end(MAIN_JS);
    }
    if(url == "/js/classes/bullet.js"){
        response.writeHead(200, {"Content-Type" : "text/javascript"});
        response.end(BULLET_JS);
    }
    if(url == "/js/classes/object.js"){
        response.writeHead(200, {"Content-Type" : "text/javascript"});
        response.end(OBJECT_JS);
    }
    if(url == "/js/classes/player.js"){
        response.writeHead(200, {"Content-Type" : "text/javascript"});
        response.end(PLAYER_JS);
    }
    if(url == "/js/screens/game.js"){
        response.writeHead(200, {"Content-Type" : "text/javascript"});
        response.end(GAME_JS);
    }
    if(url == "/js/screens/lobby.js"){
        response.writeHead(200, {"Content-Type" : "text/javascript"});
        response.end(LOBBY_JS);
    }
    if(url == "/js/screens/title.js"){
        response.writeHead(200, {"Content-Type" : "text/javascript"});
        response.end(TITLE_JS);
    }
    if(url == "/img/bullet.png"){
        response.writeHead(200, {"Content-Type" : "image/png"});
        response.end(BULLET_PNG);
    }
    if(url == "/img/button.png"){
        response.writeHead(200, {"Content-Type" : "image/jpeg"});
        response.end(BUTTON_PNG);
    }
    if(url == "/img/player1.png"){
        response.writeHead(200, {"Content-Type" : "image/jpeg"});
        response.end(PLAYER1_PNG);
    }
    if(url == "/img/player2.png"){
        response.writeHead(200, {"Content-Type" : "image/jpeg"});
        response.end(PLAYER2_PNG);
    }
    if(url == "/img/space.jpg"){
        response.writeHead(200, {"Content-Type" : "image/jpeg"});
        response.end(SPACE_JPG);
    }
});

// リスナーを起動
SERVER.listen(PORT, function(){
    let date = new Date();
    console.log(date + "http://localhost:" + PORT);
})

// 既に割り当てられているクライアント番号
let used_client_nums = [];
// 既に割り当てられているルーム番号
let used_room_nums = [];

// WebSocketの実装を効率化してくれる socket.io を使ってみる
let io = require("socket.io")(SERVER);
io.on("connection", function(socket){

    // 8桁のクライアント番号生成要求に対する回答
    assign_hogehoge_number(socket, used_client_nums, 8, "require_client_num");

    // クライアント番号削除要求に対する回答
    delete_hogehoge_number(socket, used_client_nums, "delete_client_num");

    // 4桁のルーム番号生成要求に対する回答
    assign_hogehoge_number(socket, used_room_nums, 4, "require_room_num");

    // ルーム番号削除要求に対する回答
    delete_hogehoge_number(socket, used_room_nums, "delete_room_num");

    // 参加するボタンに対しての返答
    socket.on("participating_with_room_num", function(room_num_and_client_num){ 
        let room_num = room_num_and_client_num.substr(0, room_num_and_client_num.indexOf("|"));
        let client_num = room_num_and_client_num.substr(room_num_and_client_num.indexOf("|") + 1);
        // もし そのルーム番号で部屋が作成されていれば
        if(used_room_nums.includes(room_num)){
            io.emit("participating_with_room_num", room_num + "|" + client_num);
        }
        // 作成されていなければ
        else{
            io.emit("participating_with_room_num", "10000" + "|" + client_num);
        }
    });

    // ゲームに関するデータを受け取った時の返答
    socket.on("game", function(data){
        io.emit("game", data);
    });

});

// ◯◯番号生成処理
function assign_hogehoge_number(socket, array, digit, event_name){
    socket.on(event_name, function(client_num){ // client_num は誰からのリクエストかどうか
        let num;
        while(1){
            // digit 桁の乱数を生成
            num = String(Math.floor(Math.random() * Math.pow(10, digit)));
            // もし、使われていないルーム番号だった場合、それで決定
            if(!(array.includes(num))) break;
        }
        // array に num を追加
        array.push(num);
        console.log(event_name);
        console.log(array);
        // 要求されたクライアント番号と紐づけてroom_num を返却
        io.emit(event_name, client_num + "|" + num);
    });
}

// ◯◯番号削除処理
function delete_hogehoge_number(socket, array, event_name){
    socket.on(event_name, function(num){
        if(array.includes(num)) array.splice(array.indexOf(num), 1);
        console.log(event_name);
        console.log(array);
    });
}