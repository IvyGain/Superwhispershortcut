#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

// 手動設定用の簡単な案内を生成
async function generateManualSetupGuide() {
    console.log(chalk.cyan('🎤 Superwhisper Manual Setup Guide Generator\n'));
    
    // modesディレクトリからJSONファイルを検索
    const modesDir = path.expanduser || ((p) => p.replace('~', require('os').homedir()));
    const inputPath = modesDir('~/Documents/superwhisper/modes');
    
    let jsonFiles = [];
    try {
        const pattern = path.join(inputPath, '**/*.json');
        jsonFiles = glob.sync(pattern);
    } catch (error) {
        console.error(chalk.red('modesディレクトリが見つかりません。代替方法を使用します。'));
        return;
    }
    
    if (jsonFiles.length === 0) {
        console.error(chalk.red('JSONファイルが見つかりませんでした'));
        return;
    }
    
    console.log(chalk.green(`✅ ${jsonFiles.length}個のモードファイルを発見\n`));
    
    let setupGuide = `# Superwhisper ショートカット手動設定ガイド\n\n`;
    setupGuide += `このガイドに従って、各モード用のショートカットを手動で作成してください。\n\n`;
    setupGuide += `## 📱 基本的な作成手順\n\n`;
    setupGuide += `1. **Shortcuts.app** を開く\n`;
    setupGuide += `2. 右上の **「+」** をクリック\n`;
    setupGuide += `3. **「Add Action」** をクリック\n`;
    setupGuide += `4. 検索で **「Open URL」** を探して選択\n`;
    setupGuide += `5. URL欄に下記のDeep Link URLをコピー&ペースト\n`;
    setupGuide += `6. 右上の **「Next」** をクリック\n`;
    setupGuide += `7. ショートカット名を入力\n`;
    setupGuide += `8. **「Done」** をクリック\n\n`;
    setupGuide += `---\n\n`;
    
    // 各モードの情報を生成
    for (let i = 0; i < jsonFiles.length; i++) {
        try {
            const content = await fs.readFile(jsonFiles[i], 'utf8');
            const mode = JSON.parse(content);
            
            if (!mode.key || !mode.name) continue;
            
            console.log(chalk.blue(`📝 ${mode.name} (${mode.key})`));
            
            setupGuide += `## ${i + 1}. ${mode.name}\n\n`;
            setupGuide += `**Deep Link URL:**\n`;
            setupGuide += `\`\`\`\n`;
            setupGuide += `superwhisper://mode?key=${mode.key}\n`;
            setupGuide += `\`\`\`\n\n`;
            setupGuide += `**ショートカット名:** ${mode.name}\n\n`;
            
            if (mode.type) {
                setupGuide += `**タイプ:** ${mode.type}\n`;
            }
            if (mode.language) {
                setupGuide += `**言語:** ${mode.language}\n`;
            }
            
            setupGuide += `\n### 録音付きバージョン（オプション）\n\n`;
            setupGuide += `上記の手順に加えて、もう一つの **「Open URL」** アクションを追加：\n`;
            setupGuide += `\`\`\`\n`;
            setupGuide += `superwhisper://record\n`;
            setupGuide += `\`\`\`\n\n`;
            setupGuide += `**ショートカット名:** ${mode.name} + 録音\n\n`;
            setupGuide += `---\n\n`;
            
        } catch (error) {
            console.warn(chalk.yellow(`⚠️  ${jsonFiles[i]}の読み込みに失敗: ${error.message}`));
        }
    }
    
    setupGuide += `## 🚀 完了後の確認\n\n`;
    setupGuide += `1. 各ショートカットが正常に作成されていることを確認\n`;
    setupGuide += `2. テスト実行してSuperwhisperが正しく起動することを確認\n`;
    setupGuide += `3. 必要に応じてショートカットをホーム画面やDockに追加\n\n`;
    setupGuide += `## ❓ トラブルシューティング\n\n`;
    setupGuide += `- **Superwhisperが起動しない**: アプリが最新版であることを確認\n`;
    setupGuide += `- **モードが切り替わらない**: Deep Link URLが正確にコピーされていることを確認\n`;
    setupGuide += `- **録音が開始されない**: マイクのアクセス許可を確認\n\n`;
    
    // ファイルに保存
    const outputPath = './manual-setup-guide.md';
    await fs.writeFile(outputPath, setupGuide);
    
    console.log(chalk.green(`\n📄 設定ガイドを生成しました: ${outputPath}`));
    console.log(chalk.blue(`このファイルを開いて、手動でショートカットを設定してください。\n`));
    
    // 簡易版をコンソールに出力
    console.log(chalk.cyan('🔧 簡易設定情報:\n'));
    
    for (let i = 0; i < Math.min(jsonFiles.length, 5); i++) {
        try {
            const content = await fs.readFile(jsonFiles[i], 'utf8');
            const mode = JSON.parse(content);
            
            if (!mode.key || !mode.name) continue;
            
            console.log(chalk.white(`${i + 1}. ${mode.name}`));
            console.log(chalk.gray(`   superwhisper://mode?key=${mode.key}\n`));
            
        } catch (error) {
            // エラーは無視
        }
    }
    
    if (jsonFiles.length > 5) {
        console.log(chalk.gray(`   ... および ${jsonFiles.length - 5} 個のその他のモード\n`));
    }
    
    console.log(chalk.yellow('💡 完全なリストは manual-setup-guide.md ファイルを参照してください。'));
}

// 実行
generateManualSetupGuide().catch(error => {
    console.error(chalk.red(`エラー: ${error.message}`));
    process.exit(1);
});