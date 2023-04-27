////// Player クラス //////

class Player extends Object{
    constructor(x, y, width, height, speed, hp, remaining_bullets, img, s, player_code){
        super(x, y, width, height, speed, img, s, player_code);
        this.hp = hp;                               // HP
        this.remaining_bullets = remaining_bullets; // 残弾
    }
    // 移動する
    move(click_x, click_y, theta){
        this.vx = this.speed * Math.cos(theta);
        this.vy = this.speed * Math.sin(theta);
        // もしスワイプ部分まで移動していたらもう移動はしない (カクカクしないようにする)
        if(Math.abs(this.x - click_x) <= this.speed){
            if(Math.abs(this.y - click_y) <= this.speed){
                return;
            }
        }
        // もし壁にぶち当たったら移動しない
        if(this.x + this.vx < 0 + this.width * 0.5){
            this.x = this.width * 0.5;
            this.vx = 0;
        }
        if(canvas.width - this.width * 0.5 < this.x + this.vx){
            this.x = canvas.width - this.width * 0.5;
            this.vx = 0;
        }
        if(this.y + this.vy < canvas.height * 0.5 + this.height * 0.5){
            this.y = canvas.height * 0.5 + this.height * 0.5;
            this.vy = 0;
        }
        if(canvas.height - this.height * 0.5 < this.y + this.vy){
            this.y = canvas.height - this.height * 0.5;
            this.vy = 0;
        }
        // 速度分移動する
        super.move();
    }
    // 弾を撃つ
    shot(shot_y, theta){
        // 残弾がないと弾は撃てない
        if(this.remaining_bullets <= 0) return null;
        let sx = [256, 16];
        let y;
        if(this.player_code == 0) y = this.y - this.height * 0.5
        if(this.player_code == 1) y = this.y + this.height * 0.5
        let bullet = new Bullet(
            this.x,                     // 初期 x 座標 (中心)
            y, // 初期 y 座標 (中心)
            canvas.width * 0.02,        // 横幅
            canvas.height * 0.02,       // 縦幅
            canvas.height * 0.015,        // スピード
            imgs[0],                    // 画像情報
            {                           // 元画像の切り抜き情報
                x : sx[this.player_code],
                y : 14,
                width : 224,
                height : 226,
            },
            this.player_code,                          // 0 ... 青, 1 ... 赤
        );
        // 弾のスピードを決定する
        let magnification = 1 // 倍率
        // 画面上半分のさらに上半分をタッチした場合、弾の速度は 1.5 倍
        if(shot_y < canvas.height * 0.25) magnification = 1.5;
        // 角度をもとに弾の速度の x 成分, y 成分 を決定
        bullet.vx = magnification * bullet.speed * Math.cos(theta);
        bullet.vy = magnification * bullet.speed * Math.sin(theta);
        // 弾情報を メインループ に返す
        return bullet;
    }
    // 自身と HP を描画する
    draw(canvas, context){
        // 自身の描画
        super.draw();
        // hp の描画
        if(this.player_code == 0){
            for(let i = 0; i < this.hp; i++){
                context.fillStyle = "#4444FF";
                context.fillRect(canvas.width * 0.75 + i * canvas.width * 0.02, canvas.height * 0.52 - canvas.height * 0.0025, canvas.width * 0.021, canvas.height * 0.005);
            }
        }
        if(this.player_code == 1){
            for(let i = 0; i < this.hp; i++){
                context.fillStyle = "#FF4444";
                context.fillRect(canvas.width * 0.75 + i * canvas.width * 0.02, canvas.height * 0.48 - canvas.height * 0.0025, canvas.width * 0.021, canvas.height * 0.005);
            }
        }
    }
}