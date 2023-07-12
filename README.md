パックマンHTML版
===
```
Create : 2023.07.12
Author : Yugeta.Koji
```

# Summary
- HTMLエレメントで往年の名作「パックマン」を作ってみます。


# Session
- 最終回
- 総仕上げ
  - 自キャラdead時の再生処理（残り自機数）
  - ステージ状態はそのまま
  - 敵キャラは、スタートエリアにリセット
  - 自キャラからも、スタートエリアにリセット
  - life-countを設置、3個
  - frameの横に、残りlifeを自キャライメージで個数表示
  - life-countが0になった時に、ゲームオーバー処理
  - パワーエサを点滅させる
  - ゲームスタート時に「ready」、ゲームオーバー時に「GameOver」文字を表示
  - フルーツアイテムの表示
  - 自キャラのdeadモードで、消えたマークの表示アニメを挿入
  - issue
    - ghost,pacmanの初期処理がイケてないので、大幅リファクタリング

# Blog
- [Javascript: パックマンをHTMLで作ってみるブログ#15 総仕上げ（最終回）](https://blog.myntinc.com/2023/07/javascript-html15.html)
