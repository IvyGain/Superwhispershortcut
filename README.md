# 🎤 Superwhisper Mode Manager

Superwhisperのモード用ショートカットを4ステップで簡単作成！

[![Demo](https://img.shields.io/badge/Demo-Live%20Site-blue)](https://superwhisper-manager.netlify.app)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 概要

SuperwhisperのカスタムモードをiOSショートカットで瞬時に切り替えられるようにするWebアプリです。複雑な設定は一切不要で、4つの簡単なステップでショートカットが完成します。

## ✨ 特徴

- **🚀 超簡単**: 4ステップで完了、技術知識不要
- **📱 ワンクリック**: キーをコピーしてショートカットダウンロード
- **📁 一括対応**: modesフォルダ全体を一度にアップロード
- **🎯 自動スクロール**: 次のステップに自動案内
- **📋 詳細表示**: 各モードの設定を視覚的に確認
- **🔄 レスポンシブ**: PC・スマートフォン両対応

## 🚀 使い方

### STEP 1: modesフォルダを探す
- macOSの場合: `~/Documents/superwhisper/modes`
- 「パスをコピー」ボタンでワンクリックコピー
- Finder で `Command + Shift + G` → パスを貼り付け

### STEP 2: フォルダ/ファイルをアップロード
- modesフォルダ全体をドラッグ&ドロップ
- または個別JSONファイルを選択

### STEP 3: モードを選択してキーをコピー
- 使いたいモードの「📋 キーをコピー」をクリック
- 自動で完了画面にスクロール

### STEP 4: ショートカットをダウンロード
- 「📥 Superwhisperショートカットをダウンロード」をクリック
- ダウンロードしたショートカットを開く
- 最初の画面でコピーしたキーを貼り付け
- 完成！🎉

## 🌐 デモサイト

**[👉 今すぐ試す](https://superwhisper-manager.netlify.app)**

## 📋 対応モード情報

アップロードされたモードファイルから以下の情報を自動取得・表示：

- **モード名**: カスタム名
- **モードタイプ**: voice, message, email, note, custom等
- **使用言語**: ja, en, auto等
- **AIモデル**: GPT-4, Claude, Gemini等
- **出力モード**: text, markdown等
- **プロンプト**: カスタムプロンプトのプレビュー

## 🔧 技術仕様

- **フロントエンド**: Pure HTML5 + CSS3 + JavaScript
- **ファイル処理**: File API, Drag & Drop API
- **クリップボード**: Clipboard API
- **レスポンシブ**: CSS Grid + Flexbox
- **ホスティング**: Netlify (推奨)

## 📦 デプロイ方法

### Netlify + GitHub (推奨)

1. **GitHubリポジトリ作成**
   ```bash
   # リポジトリ作成後
   git clone https://github.com/your-username/superwhisper-mode-manager.git
   cd superwhisper-mode-manager
   ```

2. **ファイル配置**
   ```bash
   # index.html をルートに配置
   cp index.html ./
   ```

3. **Netlifyデプロイ**
   - [netlify.com](https://netlify.com) でGitHub連携
   - リポジトリを選択してデプロイ
   - 自動生成URLまたはカスタムドメイン設定

### その他のホスティング

- **GitHub Pages**: Settings → Pages → Source を main ブランチに設定
- **Vercel**: GitHub連携で自動デプロイ
- **Firebase Hosting**: `firebase deploy` コマンド
- **Surge.sh**: `surge` コマンド

## 🛠️ 開発・カスタマイズ

### ローカル開発
```bash
# 静的ファイルサーバーで起動
python -m http.server 8000
# または
npx serve .
```

### カスタマイズポイント

**ショートカットURL変更**:
```javascript
// index.html 内の以下の行を変更
href="https://www.icloud.com/shortcuts/YOUR_SHORTCUT_ID"
```

**スタイルカスタマイズ**:
```css
/* カラーテーマ変更 */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}
```

**機能追加**:
- QRコード生成
- バッチ処理
- エクスポート機能
- 設定保存

## 🤝 貢献

プルリクエスト、Issue報告、機能提案を歓迎します！

### 開発ガイドライン
1. フォークしてブランチ作成
2. 変更を実装
3. テスト確認
4. プルリクエスト作成

### 報告・要望
- [Issues](https://github.com/your-username/superwhisper-mode-manager/issues) で報告
- 機能要望も同じく Issues で

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照

## 🙏 謝辞

- [Superwhisper](https://superwhisper.com/) - 素晴らしい音声入力アプリ
- [Netlify](https://netlify.com/) - 無料ホスティング
- [GitHub](https://github.com/) - ソースコード管理

## 📞 サポート

- **使い方**: このREADMEとサイト内ガイドを参照
- **バグ報告**: [Issues](https://github.com/your-username/superwhisper-mode-manager/issues)
- **機能要望**: 同じく Issues で受付

---

**🎯 簡単4ステップでSuperwhisperがもっと便利に！**

[👉 今すぐ試す](https://superwhisper-manager.netlify.app) | [📚 デプロイガイド](DEPLOYMENT_GUIDE.md)