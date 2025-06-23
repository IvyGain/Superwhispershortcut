# iOS ショートカット作成の代替アプローチ

## 1. URL スキーム方式（最も確実）

iOSショートカットアプリの URL スキームを使用して、ユーザーが簡単にショートカットを作成できる方法：

```javascript
// ショートカット作成用のURLを生成
function generateShortcutCreationURL(modeName, modeKey, withRecord = false) {
    const baseURL = 'shortcuts://create-shortcut';
    const actions = [
        {
            identifier: 'is.workflow.actions.openurl',
            parameters: {
                url: `superwhisper://mode?key=${modeKey}`
            }
        }
    ];
    
    if (withRecord) {
        actions.push({
            identifier: 'is.workflow.actions.openurl',
            parameters: {
                url: 'superwhisper://record'
            }
        });
    }
    
    // URLエンコード
    const shortcutData = {
        name: modeName,
        actions: actions
    };
    
    return `${baseURL}?data=${encodeURIComponent(JSON.stringify(shortcutData))}`;
}
```

## 2. ワンタップ設定方式

HTMLページから直接ショートカットを作成：

```html
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Superwhisper ショートカット設定</title>
</head>
<body>
    <h1>ショートカットを作成</h1>
    
    <div class="shortcut-card">
        <h2>モード名: テストモード</h2>
        <a href="shortcuts://run-shortcut?name=URLを開く&input=text&text=superwhisper://mode?key=test-mode">
            📱 ショートカットを作成
        </a>
    </div>
    
    <div class="instructions">
        <h3>手動設定方法：</h3>
        <ol>
            <li>ショートカットアプリを開く</li>
            <li>➕ ボタンをタップ</li>
            <li>「URLを開く」アクションを追加</li>
            <li>URL: <code>superwhisper://mode?key=test-mode</code></li>
            <li>ショートカット名を設定して保存</li>
        </ol>
    </div>
</body>
</html>
```

## 3. QRコード方式

各モード用のQRコードを生成して、スキャンするだけで設定：

```javascript
const QRCode = require('qrcode');

async function generateQRCode(modeKey, modeName) {
    const url = `superwhisper://mode?key=${modeKey}`;
    const qrDataURL = await QRCode.toDataURL(url);
    return qrDataURL;
}
```

## 4. 設定プロファイル方式（.mobileconfig）

最も高度な方法ですが、エンタープライズ向け：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>URLScheme</key>
            <string>superwhisper</string>
            <key>URLs</key>
            <array>
                <string>superwhisper://mode?key=test-mode</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

## 推奨アプローチ

**最も実用的なのは「URL スキーム + 手動設定ガイド」の組み合わせ：**

1. 各モード用のディープリンクURLを生成
2. わかりやすい設定手順を提供
3. コピー＆ペーストで簡単に設定可能
4. Appleの仕様変更に影響されない

これなら確実に動作し、ユーザーも理解しやすいです。