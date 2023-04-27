////// Bullet クラス //////

class Bullet extends Object{
    constructor(x, y, width, height, speed, img, s, player_code){
        super(x, y, width, height, speed, img, s, player_code);
    }
    // 対象にダメージを与える
    damage(player){
        // 相手の弾じゃなければ ダメージなし
        if(player.player_code == this.player_code) return false;
        if(!(player.x - player.width * 0.5 <= this.x)) return false;
        if(!(this.x <= player.x + player.width * 0.5)) return false;
        if(!(player.y - player.height * 0.5 <= this.y)) return false;
        if(!(this.y <= player.y + player.height * 0.5)) return false;
        if(player.player_code == 0)player.hp = player.hp - 1
        return true;
    }
    // 消去するかどうかチェック
    should_be_delete(player){
        // 相手の弾が自分に当たったらダメージ処理 & 消去
        if(this.damage(player)) return true;
        // もし壁にぶち当たったら消去
        if(this.x < 0 - this.width * 0.5) return true;
        if(canvas.width + this.width * 0.5 < this.x) return true;
        if(this.y < 0 - this.height * 0.5) return true;
        if(canvas.height + this.height * 0.5 < this.y) return true;
        return false;
    }
}