# Netlify + GitHub でWebサイトを公開する手順

## 📋 事前準備

### 必要なアカウント
1. **GitHubアカウント** - [github.com](https://github.com) で無料作成
2. **Netlifyアカウント** - [netlify.com](https://netlify.com) で無料作成

## 🚀 STEP 1: GitHubリポジトリを作成

### 1-1. GitHubにログイン
1. [github.com](https://github.com) にアクセス
2. 右上の「Sign in」でログイン

### 1-2. 新しいリポジトリを作成
1. 右上の **「+」** → **「New repository」** をクリック
2. 以下の設定で作成：
   - **Repository name**: `superwhisper-mode-manager`
   - **Description**: `Superwhisper Mode Manager - 4ステップでショートカット作成`
   - **Public** を選択（無料プランの場合）
   - **Add a README file** にチェック
   - **Create repository** をクリック

### 1-3. ファイルをアップロード
1. 作成されたリポジトリページで **「Add file」** → **「Upload files」**
2. 以下のファイルをドラッグ&ドロップ：
   - `superwhisper-mode-manager-final.html`
3. **「index.html」** にファイル名を変更（重要！）
4. **Commit changes** で以下を入力：
   - Commit message: `Add Superwhisper Mode Manager`
   - **Commit directly to the main branch** を選択
   - **Commit changes** をクリック

## 🌐 STEP 2: Netlifyでサイトを公開

### 2-1. Netlifyにログイン
1. [netlify.com](https://netlify.com) にアクセス
2. **「Log in」** をクリック
3. **「GitHub」** でログインを選択
4. GitHubアカウントでログイン

### 2-2. サイトをデプロイ
1. Netlifyダッシュボードで **「Add new site」** → **「Import an existing project」**
2. **「Deploy with GitHub」** を選択
3. GitHubとの連携を許可
4. リポジトリ一覧から **「superwhisper-mode-manager」** を選択
5. デプロイ設定：
   - **Branch to deploy**: `main`
   - **Publish directory**: （空欄のまま）
   - **Build command**: （空欄のまま）
6. **「Deploy site」** をクリック

### 2-3. デプロイ完了を待つ
1. デプロイが開始されます（数分程度）
2. 完了すると **「Site is live」** と表示
3. 自動生成されたURL（例：`https://amazing-name-123456.netlify.app`）をクリック

## ⚙️ STEP 3: サイト設定をカスタマイズ

### 3-1. サイト名を変更（オプション）
1. Netlifyダッシュボードでサイトを選択
2. **「Site settings」** → **「General」** → **「Site details」**
3. **「Change site name」** をクリック
4. 好みのサイト名を入力（例：`superwhisper-manager`）
5. **「Save」** をクリック
6. 新しいURL: `https://superwhisper-manager.netlify.app`

### 3-2. カスタムドメイン設定（上級者向け）
独自ドメインを使いたい場合：
1. **「Domain settings」** → **「Add custom domain」**
2. 所有しているドメインを入力
3. DNS設定を変更（ドメイン提供者のサイトで設定）

## 🔄 STEP 4: 自動デプロイの確認

### ファイルを更新してテスト
1. GitHubのリポジトリページに戻る
2. `index.html` ファイルをクリック
3. 右上の **「✏️ Edit this file」** をクリック
4. 何か小さな変更を加える（例：タイトルに「v1.1」を追加）
5. **「Commit changes」** で変更を保存
6. 数分後、Netlifyサイトが自動的に更新されることを確認

## 📱 STEP 5: 公開完了！

### サイトが正常に動作することを確認
- [ ] サイトが正しく表示される
- [ ] ファイルアップロード機能が動作する
- [ ] キーコピー機能が動作する
- [ ] ショートカットダウンロードリンクが正しく動作する

### 完成したサイト
🎉 **おめでとうございます！**

あなたのサイトは以下のURLで公開されています：
- `https://your-site-name.netlify.app`

## 🛠️ トラブルシューティング

### よくある問題と解決方法

**問題**: サイトが表示されない
- **解決**: `index.html` という名前でファイルがアップロードされているか確認

**問題**: デプロイが失敗する
- **解決**: Netlifyの「Deploys」タブでエラーログを確認

**問題**: 変更が反映されない
- **解決**: ブラウザのキャッシュをクリアするか、シークレットモードで確認

**問題**: ファイルアップロード機能が動作しない
- **解決**: HTTPSでアクセスしているか確認（一部ブラウザ機能はHTTPSが必要）

## 📊 無料プランの制限

### Netlify無料プランでできること
- ✅ 月間100GBの帯域幅
- ✅ 自動SSL証明書
- ✅ 継続的デプロイ
- ✅ カスタムドメイン
- ✅ 基本的なフォーム処理

### GitHub無料プランでできること
- ✅ 無制限のパブリックリポジトリ
- ✅ 500MBのストレージ
- ✅ GitHub Pages
- ✅ Issues、Pull Requests

## 🔧 追加設定（オプション）

### GitHub Actionsでの自動テスト
より高度な設定として、コードの品質チェックを自動化できます。

### アナリティクス追加
Google Analyticsなどでアクセス解析を追加できます。

### PWA化
Progressive Web Appとして、スマートフォンのホーム画面に追加できるようにできます。

---

**🎯 次のステップ**
1. サイトをソーシャルメディアで共有
2. ユーザーフィードバックを収集
3. 機能追加や改善を検討
4. GitHub Issues でバグ報告や機能要望を受付

これで、あなたのSuperwhisper Mode Managerが世界中に公開されました！🌍✨