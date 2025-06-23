# Superwhisper macOS Shortcuts Generator

macOS専用の自動ショートカット作成ツールです。Superwhisperのモード用ショートカットを自動生成し、macOS Shortcutsアプリに直接インポートできます。

## 🍎 システム要件

- **macOS Monterey (12.0) 以降**
- **Shortcuts.app**（macOS 12以降で標準搭載）
- **Node.js 16.0以降**

## 🚀 機能

### ✨ 主な特徴
- **完全自動化**: ショートカット生成からmacOS Shortcutsアプリへのインポートまで自動
- **一括処理**: 複数のJSONファイルから一度に全てのショートカットを生成
- **録音付きオプション**: モード切替＋録音開始の組み合わせショートカット
- **リアルタイム監視**: ファイル変更を監視して自動再生成
- **GUI / CUI 両対応**: コマンドラインとWebベースのGUIから選択可能

## 📦 インストール

```bash
# 依存関係をインストール
npm install

# macOS Shortcutsアプリの存在確認
ls /System/Applications/Shortcuts.app
```

## 💻 使用方法

### 方法1: コマンドライン（推奨）

```bash
# 基本的な使用方法
node macos-shortcut-generator.js -i ~/Documents/superwhisper/modes -a

# 全オプション付き
node macos-shortcut-generator.js -i ~/Documents/superwhisper/modes -r -a --applescript

# 特定のファイルから生成
node macos-shortcut-generator.js -i test-mode.json -a
```

#### オプション

| オプション | 説明 |
|------------|------|
| `-i, --input <path>` | 入力ディレクトリまたはファイルパス |
| `-o, --output <path>` | 出力ディレクトリ（デフォルト: ./macos-shortcuts） |
| `-r, --with-record` | 録音付きショートカットも生成 |
| `-a, --auto-import` | macOS Shortcutsアプリに自動インポート |
| `--applescript` | AppleScriptによる完全自動化（実験的） |
| `-w, --watch` | ファイル変更監視モード |

### 方法2: WebベースのGUI

```bash
# GUIアプリを開く
open macos-gui-app.html
```

1. ブラウザでGUIが開きます
2. JSONファイルまたはmodesフォルダをドラッグ&ドロップ
3. オプションを選択
4. 「ショートカットを生成してインポート」をクリック

## 🔧 自動インポートの仕組み

### 1. ショートカットファイル生成
- JSONファイルからmacOS用の`.shortcut`ファイルを生成
- バイナリplist形式で正確なフォーマット

### 2. 自動インポート
```bash
# 生成されたショートカットをmacOS Shortcutsアプリで開く
open "テストモード.shortcut"
```

### 3. AppleScript自動化（実験的）
```applescript
tell application "Shortcuts"
    activate
    delay 1
end tell

tell application "System Events"
    tell process "Shortcuts"
        -- ショートカット追加の自動化
        click button "Add Shortcut"
        delay 2
    end tell
end tell
```

## 📁 生成されるファイル

```
macos-shortcuts/
├── テストモード.shortcut
├── テストモード + 録音.shortcut
├── 会議モード.shortcut
└── ...
```

## 🎯 ワークフロー例

### 基本的なワークフロー

1. **JSONファイルを準備**
```json
{
  "key": "meeting-mode",
  "name": "会議モード",
  "type": "meeting",
  "language": "ja"
}
```

2. **自動生成＆インポート**
```bash
node macos-shortcut-generator.js -i modes/ -a -r
```

3. **結果確認**
- macOS Shortcutsアプリが自動で開く
- 生成されたショートカットが表示される
- 「Add Shortcut」をクリックして追加

### 継続的な使用

```bash
# ファイル監視モードで自動更新
node macos-shortcut-generator.js -i modes/ -a -w

# JSON追加・変更時に自動でショートカットを再生成
```

## 🔍 トラブルシューティング

### よくある問題

1. **Shortcutsアプリが見つからない**
```bash
# macOSバージョン確認
sw_vers -productVersion

# 12.0未満の場合はアップデートが必要
```

2. **ショートカットが開かない**
```bash
# 手動でショートカットファイルを開く
open "macos-shortcuts/テストモード.shortcut"
```

3. **自動インポートが動作しない**
```bash
# アクセシビリティ権限を確認
# システム環境設定 > セキュリティとプライバシー > アクセシビリティ
```

### デバッグモード

```bash
# 詳細ログを出力
DEBUG=1 node macos-shortcut-generator.js -i modes/ -a

# テストモードで実行
node macos-shortcut-generator.js -i test-mode.json --dry-run
```

## 🔮 高度な使用例

### 1. 自動化スクリプトとして組み込み

```bash
#!/bin/bash
# update-shortcuts.sh

echo "Superwhisperショートカットを更新中..."
node macos-shortcut-generator.js -i ~/Documents/superwhisper/modes -a -r

echo "完了しました！"
osascript -e 'display notification "ショートカットが更新されました" with title "Superwhisper"'
```

### 2. Launchdで定期実行

```xml
<!-- ~/Library/LaunchAgents/com.superwhisper.shortcuts.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.superwhisper.shortcuts</string>
    <key>ProgramArguments</key>
    <array>
        <string>/path/to/update-shortcuts.sh</string>
    </array>
    <key>StartInterval</key>
    <integer>3600</integer>
</dict>
</plist>
```

### 3. Git Hookとの連携

```bash
#!/bin/sh
# .git/hooks/post-merge

if git diff-tree --name-only HEAD HEAD~1 | grep -q "modes/.*\.json"; then
    echo "モードファイルが更新されました。ショートカットを再生成します..."
    node macos-shortcut-generator.js -i modes/ -a
fi
```

## 📈 今後の拡張予定

- [ ] **Electron アプリ化**：スタンドアローンのデスクトップアプリ
- [ ] **自動アップデート**：新しいモードの自動検出と更新
- [ ] **クラウド同期**：複数のMac間でのショートカット同期
- [ ] **カスタムテンプレート**：独自のショートカット構造をサポート

## ⚖️ ライセンス

MIT License