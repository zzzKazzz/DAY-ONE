# DAY 100

100日の活動記録。写真もログインもサーバーもない。テーマを決めて、毎日「やったこと」と分数だけ書く。

Safari からホーム画面に追加して使う PWA。

## ローカルで開く

```bash
npm install
npm run dev
```

## iPhone に入れる

1. GitHub リポジトリの **Settings → Pages** で Source を **GitHub Actions** にする
2. `main` に push すると Pages にデプロイされる
3. iPhone の Safari で Pages の URL を開く（`https://<user>.github.io/DAY-ONE/`）
4. 共有 → **ホーム画面に追加**
5. 以降はアイコンから起動する

記録は iPhone 内の IndexedDB に保存される。初回アクセス後はオフラインでも書ける。

サイトデータを消すとテーマも記録も消える。
