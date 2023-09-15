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
const EXPLOSION1_PNG = require("fs").readFileSync("views/img/01_explosion.png");
const EXPLOSION2_PNG = require("fs").readFileSync("views/img/02_explosion.png");
const EXPLOSION3_PNG = require("fs").readFileSync("views/img/03_explosion.png");
const EXPLOSION4_PNG = require("fs").readFileSync("views/img/04_explosion.png");
const EXPLOSION5_PNG = require("fs").readFileSync("views/img/05_explosion.png");

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
        response.writeHead(200, {"Content-Type" : "image/png"});
        response.end(BUTTON_PNG);
    }
    if(url == "/img/player1.png"){
        response.writeHead(200, {"Content-Type" : "image/png"});
        response.end(PLAYER1_PNG);
    }
    if(url == "/img/player2.png"){
        response.writeHead(200, {"Content-Type" : "image/png"});
        response.end(PLAYER2_PNG);
    }
    if(url == "/img/space.jpg"){
        response.writeHead(200, {"Content-Type" : "image/jpeg"});
        response.end(SPACE_JPG);
    }
    if(url == "/img/01_explosion.png"){
        response.writeHead(200, {"Content-Type" : "image/png"});
        response.end(EXPLOSION1_PNG);
    }
    if(url == "/img/02_explosion.png"){
        response.writeHead(200, {"Content-Type" : "image/png"});
        response.end(EXPLOSION2_PNG);
    }
    if(url == "/img/03_explosion.png"){
        response.writeHead(200, {"Content-Type" : "image/png"});
        response.end(EXPLOSION3_PNG);
    }
    if(url == "/img/04_explosion.png"){
        response.writeHead(200, {"Content-Type" : "image/png"});
        response.end(EXPLOSION4_PNG);
    }
    if(url == "/img/05_explosion.png"){
        response.writeHead(200, {"Content-Type" : "image/png"});
        response.end(EXPLOSION5_PNG);
    }
});

// リスナーを起動
SERVER.listen(PORT, function(){
    let date = new Date();
    console.log(date + "http://localhost:" + PORT);
})

// 既に割り当てられているルーム番号
let used_room_nums = [];

// WebSocketの実装を効率化してくれる socket.io を使ってみる
let io = require("socket.io")(SERVER);
io.on("connection", function(socket){

    // 4桁のルーム番号生成要求に対する回答
    socket.on("require_room_num", function(request){ // request は使わない
        let room_num;
        // 生成要求を出してきたクライアントを表す id
        let client_id = this.id
        while(1){
            // 4 桁の乱数を生成
            room_num = String(Math.floor(Math.random() * Math.pow(10, 4)));
            // もし、使われていないルーム番号だった場合、それで決定
            if(!(used_room_nums.includes(room_num))) break;
        }
        // used_room_nums に num を追加
        used_room_nums.push(room_num);
        console.log("require_room_num");
        console.log(used_room_nums);
        // 要求されたクライアントに対して room_num を返却
        io.to(client_id).emit("require_room_num", room_num);
    });

    // ルーム番号削除要求に対する回答
    socket.on("delete_room_num", function(num){
        if(used_room_nums.includes(num)) used_room_nums.splice(used_room_nums.indexOf(num), 1);
        console.log("delete_room_num");
        console.log(used_room_nums);
    });

    // 参加するボタンに対しての返答
    socket.on("participating_with_room_num", function(room_num){ 
        // 参加するボタンを押したクライアントを表す id
        let client_id = this.id;
        // もし そのルーム番号で部屋が作成されていれば
        if(used_room_nums.includes(room_num)){
            io.emit("participating_with_room_num", room_num + "|" + client_id);
        }
        // 作成されていなければ
        else{
            io.emit("participating_with_room_num", "10000" + "|" + client_id);
        }
    });

    // ゲームに関するデータを受け取った時の返答
    socket.on("game", function(data){
        io.emit("game", data);
    });

});