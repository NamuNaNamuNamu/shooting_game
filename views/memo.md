### 1. フォルダ構造
- views
    この中にあるファイルがクライアントサイドに配布される
    - img
        使う画像一覧
    - js
        - classes
            主なクラス定義
            - bullet.js
                弾丸クラス
            - object.js
                弾丸とプレイヤーの継承元
            - player.js
                プレイヤークラス
        - screens
            画面毎の処理を記述
            - game.js
                プレイ（ゲーム）画面の処理
            - lobby.js
                プレイ待機（ロビー）画面の処理
            - title.js
                スタート画面（タイトル）画面の処理
        - main.js
            クライアントサイドのメインプログラム
            ページが読み込まれたら、まずはここの main 関数が呼ばれる
    - index.html
        htmlファイル
    - memo.md 
        このファイル
- server.js
    サーバーサイドプログラム

### 2. ファイルごとの処理

#### 1. main.js
- 
- 