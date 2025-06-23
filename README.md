# Superwhisper Shortcut Generator

Superwhisperのカスタムモード用iOSショートカットを一括生成するNode.jsツールです。

## インストール

```bash
npm install
```

## 使い方

### 基本的な使い方

```bash
# modesフォルダ内のすべてのJSONファイルからショートカットを生成
node generate-shortcuts.js -i ~/Documents/superwhisper/modes

# 特定のJSONファイルからショートカットを生成
node generate-shortcuts.js -i test-mode.json

# 録音付きショートカットも生成
node generate-shortcuts.js -i ~/Documents/superwhisper/modes -r

# ZIPファイルとして出力
node generate-shortcuts.js -i ~/Documents/superwhisper/modes -z

# 出力先を指定
node generate-shortcuts.js -i ~/Documents/superwhisper/modes -o ./output
```

### オプション

- `-i, --input <path>`: 入力ディレクトリまたはファイルパス（デフォルト: 現在のディレクトリ）
- `-o, --output <path>`: 出力ディレクトリ（デフォルト: ./shortcuts）
- `-r, --with-record`: 録音アクション付きのショートカットも生成
- `-z, --zip`: すべてのショートカットをZIPファイルにまとめる

## 生成されるファイル

1. **`.shortcut` ファイル**: iOSで直接インポートできるショートカットファイル
2. **`URL.txt` ファイル**: 手動設定用のURL情報（フォールバック）

## iOSでのインポート方法

### 方法1: .shortcutファイル（推奨）
1. 生成された `.shortcut` ファイルをiOSデバイスに送信（AirDrop、メール等）
2. ファイルをタップ
3. ショートカットアプリが自動的に開く
4. 「ショートカットを追加」をタップ

### 方法2: URL.txtファイル（手動）
1. `URL.txt` ファイルの内容を確認
2. iOSショートカットアプリで新規ショートカットを作成
3. 「URLを開く」アクションを追加
4. Deep Link URLをペースト

## モードJSONファイルの形式

```json
{
  "key": "unique-mode-key",
  "name": "モード名",
  "type": "custom",
  "language": "ja",
  "languageModelID": "sw-gpt-4",
  "prompt": "カスタムプロンプト"
}
```

必須フィールド:
- `key`: ユニークなモード識別子
- `name`: モードの表示名

## トラブルシューティング

- **ショートカットファイルが開けない場合**: URL.txtファイルの手動設定方法を使用してください
- **JSONファイルが認識されない場合**: `key`と`name`フィールドが存在することを確認してください