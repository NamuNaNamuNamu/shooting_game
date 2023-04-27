////// Object クラス //////

class Object{
    constructor(x, y, width, height, speed, img, s, player_code){
        this.x = x;                     // x 座標 (中心)
        this.y = y;                     // y 座標 (中心)
        this.vx = 0;                    // x 方向の速度
        this.vy = 0;                    // y 方向の速度
        this.width = width;             // 横幅
        this.height = height;           // 縦幅
        this.speed = speed;             // スピード         
        this.img = img;                 // 画像情報
        this.s = s;                     // 画像の切り抜き情報
        this.player_code = player_code; // 0 ... 青, 1 ... 赤
    }
    // 移動する
    move(){
        this.x += this.vx;
        this.y += this.vy;
    }
    // 自身を描画する
    draw(){
        // 写真の描画
        context.drawImage(
            this.img, // imgs は ボタンの画像
            this.s.x,  // sx (元画像の切り抜き始点 x)
            this.s.y,  // sy (元画像の切り抜き始点 y)
            this.s.width,  // s_width (元画像の切り抜きサイズ 横幅)
            this.s.height,  // s_height (元画像の切り抜きサイズ 縦幅)
            this.x - this.width * 0.5,  // dx (canvas の描画開始位置 x)
            this.y - this.height * 0.5,  // dy (canvas の描画開始位置 y)
            this.width,  // d_width (canvas の描画サイズ 横幅)
            this.height,  // d_height (canvas の描画サイズ 縦幅)
        );
    }
}