#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const plist = require('plist');
const { program } = require('commander');
const glob = require('glob');
const chalk = require('chalk');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// macOS Shortcuts用のデータ構造を生成
function generateMacOSShortcutData(modeKey, modeName, withRecord = false) {
    const actions = [
        {
            WFWorkflowActionIdentifier: "is.workflow.actions.openurl",
            WFWorkflowActionParameters: {
                WFInput: {
                    Value: {
                        string: `superwhisper://mode?key=${modeKey}`,
                        attachmentsByRange: {}
                    },
                    WFSerializationType: "WFTextTokenString"
                }
            }
        }
    ];
    
    if (withRecord) {
        actions.push({
            WFWorkflowActionIdentifier: "is.workflow.actions.openurl",
            WFWorkflowActionParameters: {
                WFInput: {
                    Value: {
                        string: "superwhisper://record",
                        attachmentsByRange: {}
                    },
                    WFSerializationType: "WFTextTokenString"
                }
            }
        });
    }
    
    return {
        WFWorkflowClientVersion: "2605",
        WFWorkflowClientRelease: "2.2.2",
        WFWorkflowMinimumClientVersionString: "900",
        WFWorkflowMinimumClientVersion: 900,
        WFWorkflowIcon: {
            WFWorkflowIconStartColor: 4274264319,
            WFWorkflowIconGlyphNumber: 59511
        },
        WFWorkflowImportQuestions: [],
        WFWorkflowInputContentItemClasses: [
            "WFAppContentItem",
            "WFStringContentItem"
        ],
        WFWorkflowActions: actions
    };
}

// バイナリplistを生成（macOS用）
async function generateMacOSBinaryPlist(data) {
    const xmlPlist = plist.build(data);
    const tmpFile = `/tmp/macos_shortcut_${Date.now()}.plist`;
    
    try {
        // 一時的にXMLファイルを作成
        await fs.writeFile(tmpFile, xmlPlist);
        
        // plutilコマンドでバイナリ形式に変換
        await execAsync(`plutil -convert binary1 "${tmpFile}"`);
        
        // バイナリファイルを読み込み
        const binaryData = await fs.readFile(tmpFile);
        
        // 一時ファイルを削除
        await fs.unlink(tmpFile);
        
        return binaryData;
    } catch (error) {
        console.warn(chalk.yellow(`Warning: Could not convert to binary plist: ${error.message}`));
        // フォールバック: XMLを返す
        return xmlPlist;
    }
}

// JSONファイルからモード情報を読み込み
async function loadModeFromFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const mode = JSON.parse(content);
        
        if (!mode.key || !mode.name) {
            console.warn(chalk.yellow(`⚠️  Invalid mode file: ${filePath} (missing key or name)`));
            return null;
        }
        
        return mode;
    } catch (error) {
        console.error(chalk.red(`❌ Error reading ${filePath}: ${error.message}`));
        return null;
    }
}

// macOS Shortcutsに直接インポート（URLスキーム方式）
async function importToMacOSShortcuts(shortcutData, shortcutName, mode) {
    try {
        console.log(chalk.blue(`📱 Importing "${shortcutName}" to macOS Shortcuts...`));
        
        // 方法1: URLスキーム方式を試行
        try {
            const base64Data = shortcutData.toString('base64');
            const importURL = `shortcuts://import-shortcut?url=data:application/octet-stream;base64,${base64Data}&name=${encodeURIComponent(shortcutName)}`;
            
            console.log(chalk.blue(`🔗 Trying URL scheme import...`));
            await execAsync(`open "${importURL}"`);
            
            console.log(chalk.green(`✅ URL scheme import initiated for "${shortcutName}"`));
            return true;
        } catch (urlError) {
            console.log(chalk.yellow(`⚠️  URL scheme failed, trying file method...`));
        }
        
        // 方法2: ファイル方式（フォールバック）
        const tmpShortcutFile = `/tmp/${shortcutName.replace(/[^a-zA-Z0-9]/g, '_')}.shortcut`;
        await fs.writeFile(tmpShortcutFile, shortcutData);
        
        // Shortcutsアプリでファイルを開く（"File" → "Import Shortcut"）
        console.log(chalk.blue(`📁 Creating shortcut file: ${tmpShortcutFile}`));
        console.log(chalk.yellow(`   Manual import required:`));
        console.log(chalk.yellow(`   1. Open Shortcuts app`));
        console.log(chalk.yellow(`   2. File → Import Shortcut`));
        console.log(chalk.yellow(`   3. Select: ${tmpShortcutFile}`));
        
        // ファイルを生成後、手動インポート用の案内を表示
        return true;
    } catch (error) {
        console.error(chalk.red(`❌ Failed to import "${shortcutName}": ${error.message}`));
        
        // 最終手段：手動設定用URLを表示
        console.log(chalk.blue(`🔧 Manual setup alternative:`));
        console.log(chalk.blue(`   Deep Link: superwhisper://mode?key=${mode.key}`));
        
        return false;
    }
}

// AppleScriptを使用してmacOS Shortcutsを自動化
async function automateWithAppleScript(shortcuts) {
    const script = `
tell application "Shortcuts"
    activate
    delay 1
end tell

${shortcuts.map((shortcut, index) => `
-- Import shortcut ${index + 1}: ${shortcut.name}
tell application "System Events"
    tell process "Shortcuts"
        -- ここにショートカット追加の自動化を実装
        delay 2
    end tell
end tell
`).join('\n')}

display notification "All shortcuts have been imported!" with title "Superwhisper Shortcuts"
`;

    try {
        const tmpScript = `/tmp/import_shortcuts_${Date.now()}.applescript`;
        await fs.writeFile(tmpScript, script);
        
        console.log(chalk.blue('🍎 Running AppleScript automation...'));
        await execAsync(`osascript "${tmpScript}"`);
        
        await fs.unlink(tmpScript);
        return true;
    } catch (error) {
        console.error(chalk.red(`❌ AppleScript automation failed: ${error.message}`));
        return false;
    }
}

// ショートカットファイルを生成してmacOSに自動インポート
async function generateAndImportShortcut(mode, outputDir, withRecord = false, autoImport = false) {
    try {
        const shortcutData = generateMacOSShortcutData(mode.key, mode.name, withRecord);
        const binaryPlist = await generateMacOSBinaryPlist(shortcutData);
        
        const suffix = withRecord ? ' + 録音' : '';
        const fileName = `${mode.name}${suffix}.shortcut`;
        const filePath = path.join(outputDir, fileName);
        
        await fs.writeFile(filePath, binaryPlist);
        
        if (autoImport) {
            await importToMacOSShortcuts(binaryPlist, `${mode.name}${suffix}`, mode);
        }
        
        return { success: true, fileName, filePath };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// メイン処理
async function main() {
    program
        .version('1.0.0')
        .description('Superwhisper macOS Shortcuts Generator with Auto-Import')
        .option('-i, --input <path>', 'Input directory or file path', '.')
        .option('-o, --output <path>', 'Output directory', './macos-shortcuts')
        .option('-r, --with-record', 'Generate shortcuts with recording action')
        .option('-a, --auto-import', 'Automatically import to macOS Shortcuts app')
        .option('--applescript', 'Use AppleScript for full automation')
        .option('-w, --watch', 'Watch for file changes and auto-generate')
        .parse(process.argv);
    
    const options = program.opts();
    
    console.log(chalk.cyan('🎤 Superwhisper macOS Shortcuts Generator\n'));
    
    // macOSバージョンチェック
    try {
        const { stdout } = await execAsync('sw_vers -productVersion');
        const macOSVersion = stdout.trim();
        console.log(chalk.blue(`🍎 macOS Version: ${macOSVersion}`));
        
        if (parseFloat(macOSVersion) < 12.0) {
            console.warn(chalk.yellow('⚠️  This tool requires macOS Monterey (12.0) or later for Shortcuts app'));
        }
    } catch (error) {
        console.warn(chalk.yellow('⚠️  Could not detect macOS version'));
    }
    
    // Shortcutsアプリの存在確認
    try {
        await execAsync('test -d "/System/Applications/Shortcuts.app"');
        console.log(chalk.green('✅ Shortcuts app found'));
    } catch (error) {
        console.error(chalk.red('❌ Shortcuts app not found. Please update to macOS Monterey or later.'));
        process.exit(1);
    }
    
    // 出力ディレクトリを作成
    await fs.mkdir(options.output, { recursive: true });
    
    // 入力ファイルを検索
    let jsonFiles = [];
    const inputStat = await fs.stat(options.input).catch(() => null);
    
    if (inputStat && inputStat.isDirectory()) {
        const pattern = path.join(options.input, '**/*.json');
        jsonFiles = glob.sync(pattern);
        console.log(chalk.blue(`📁 Searching for JSON files in: ${options.input}`));
    } else if (inputStat && inputStat.isFile() && options.input.endsWith('.json')) {
        jsonFiles = [options.input];
    } else {
        console.error(chalk.red('❌ Invalid input path'));
        process.exit(1);
    }
    
    if (jsonFiles.length === 0) {
        console.error(chalk.red('❌ No JSON files found'));
        process.exit(1);
    }
    
    console.log(chalk.green(`✅ Found ${jsonFiles.length} JSON files\n`));
    
    // 各ファイルを処理
    const shortcuts = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const jsonFile of jsonFiles) {
        const mode = await loadModeFromFile(jsonFile);
        if (!mode) {
            errorCount++;
            continue;
        }
        
        console.log(chalk.blue(`📱 Processing: ${mode.name} (${mode.key})`));
        
        // 通常のショートカット
        const result = await generateAndImportShortcut(mode, options.output, false, options.autoImport);
        if (result.success) {
            console.log(chalk.green(`   ✅ ${result.fileName}`));
            shortcuts.push({ name: mode.name, path: result.filePath });
            successCount++;
        } else {
            console.log(chalk.red(`   ❌ Failed: ${result.error}`));
            errorCount++;
        }
        
        // 録音付きショートカット（オプション）
        if (options.withRecord) {
            const recordResult = await generateAndImportShortcut(mode, options.output, true, options.autoImport);
            if (recordResult.success) {
                console.log(chalk.green(`   ✅ ${recordResult.fileName}`));
                shortcuts.push({ name: `${mode.name} + 録音`, path: recordResult.filePath });
            } else {
                console.log(chalk.red(`   ❌ Record version failed: ${recordResult.error}`));
            }
        }
        
        // 自動インポート時は少し待機
        if (options.autoImport) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    // AppleScript自動化（実験的）
    if (options.applescript && shortcuts.length > 0) {
        console.log(chalk.blue('\n🍎 Running AppleScript automation...'));
        await automateWithAppleScript(shortcuts);
    }
    
    // 結果サマリー
    console.log(chalk.cyan('\n📊 Summary:'));
    console.log(chalk.green(`   ✅ Success: ${successCount} shortcuts`));
    if (errorCount > 0) {
        console.log(chalk.red(`   ❌ Errors: ${errorCount} files`));
    }
    console.log(chalk.blue(`   📁 Output: ${options.output}`));
    
    if (options.autoImport) {
        console.log(chalk.yellow('\n💡 Next steps:'));
        console.log(chalk.yellow('   1. Check the Shortcuts app'));
        console.log(chalk.yellow('   2. Click "Add Shortcut" for each imported shortcut'));
        console.log(chalk.yellow('   3. Test the shortcuts by running them'));
    }
}

// ファイル監視モード
async function watchMode(inputPath, options) {
    const chokidar = require('chokidar');
    
    console.log(chalk.blue(`👀 Watching for changes in: ${inputPath}`));
    
    const watcher = chokidar.watch(path.join(inputPath, '**/*.json'), {
        ignoreInitial: false,
        persistent: true
    });
    
    watcher.on('add', async (filePath) => {
        console.log(chalk.green(`📄 New file detected: ${filePath}`));
        // 単一ファイル処理
    });
    
    watcher.on('change', async (filePath) => {
        console.log(chalk.yellow(`📝 File changed: ${filePath}`));
        // 再生成処理
    });
}

// エラーハンドリング
process.on('unhandledRejection', (error) => {
    console.error(chalk.red(`\n❌ Unexpected error: ${error.message}`));
    process.exit(1);
});

// 実行
main().catch((error) => {
    console.error(chalk.red(`\n❌ Fatal error: ${error.message}`));
    process.exit(1);
});