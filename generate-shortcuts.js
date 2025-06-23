#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const plist = require('plist');
const archiver = require('archiver');
const { program } = require('commander');
const glob = require('glob');
const chalk = require('chalk');

// ショートカットデータを生成
function generateShortcutData(modeKey, modeName, withRecord = false) {
    const actions = [
        {
            WFWorkflowActionIdentifier: "is.workflow.actions.openurl",
            WFWorkflowActionParameters: {
                WFURL: `superwhisper://mode?key=${modeKey}`
            }
        }
    ];
    
    if (withRecord) {
        actions.push({
            WFWorkflowActionIdentifier: "is.workflow.actions.openurl",
            WFWorkflowActionParameters: {
                WFURL: "superwhisper://record"
            }
        });
    }
    
    return {
        WFWorkflowClientVersion: "2605",
        WFWorkflowClientRelease: "2.2.2",
        WFWorkflowIcon: {
            WFWorkflowIconStartColor: 4274264319,
            WFWorkflowIconGlyphNumber: 59511
        },
        WFWorkflowImportQuestions: [],
        WFWorkflowTypes: ["NCWidget", "WatchKit"],
        WFWorkflowInputContentItemClasses: [
            "WFAppContentItem",
            "WFAppStoreAppContentItem",
            "WFArticleContentItem",
            "WFContactContentItem",
            "WFDateContentItem",
            "WFEmailAddressContentItem",
            "WFFolderContentItem",
            "WFGenericFileContentItem",
            "WFImageContentItem",
            "WFiTunesProductContentItem",
            "WFLocationContentItem",
            "WFDCMapsLinkContentItem",
            "WFAVAssetContentItem",
            "WFPDFContentItem",
            "WFPhoneNumberContentItem",
            "WFRichTextContentItem",
            "WFSafariWebPageContentItem",
            "WFStringContentItem",
            "WFURLContentItem"
        ],
        WFWorkflowActions: actions,
        WFWorkflowMinimumClientVersionString: "900",
        WFWorkflowMinimumClientVersion: 900
    };
}

// バイナリplistを生成
async function generateBinaryPlist(data) {
    return plist.build(data);
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

// ショートカットファイルを生成
async function generateShortcutFile(mode, outputDir, withRecord = false) {
    try {
        const shortcutData = generateShortcutData(mode.key, mode.name, withRecord);
        const binaryPlist = await generateBinaryPlist(shortcutData);
        
        const suffix = withRecord ? ' + 録音' : '';
        const fileName = `${mode.name}${suffix}.shortcut`;
        const filePath = path.join(outputDir, fileName);
        
        await fs.writeFile(filePath, binaryPlist);
        
        return { success: true, fileName, filePath };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// URLファイルを生成
async function generateURLFile(mode, outputDir, withRecord = false) {
    const deepLink = `superwhisper://mode?key=${mode.key}`;
    let content = `${mode.name} - Superwhisper Deep Link\n\n`;
    content += `Deep Link URL:\n${deepLink}\n\n`;
    
    if (withRecord) {
        content += `録音開始 URL:\nsuperwhisper://record\n\n`;
    }
    
    content += `使い方:\n`;
    content += `1. iOSショートカットアプリを開く\n`;
    content += `2. 右上の + をタップ\n`;
    content += `3. 「アクションを追加」をタップ\n`;
    content += `4. 「URL」で検索し「URLを開く」を選択\n`;
    content += `5. URL欄に上記のDeep Link URLをペースト\n`;
    if (withRecord) {
        content += `6. もう一度「URLを開く」を追加し、録音開始URLをペースト\n`;
    }
    content += `${withRecord ? '7' : '6'}. 右上の「次へ」をタップしてショートカット名を設定\n`;
    content += `${withRecord ? '8' : '7'}. 「完了」をタップ\n`;
    
    const suffix = withRecord ? ' + 録音' : '';
    const fileName = `${mode.name}${suffix} - URL.txt`;
    const filePath = path.join(outputDir, fileName);
    
    await fs.writeFile(filePath, content, 'utf8');
    
    return { fileName, filePath };
}

// ZIPファイルを作成
async function createZip(files, outputPath) {
    return new Promise((resolve, reject) => {
        const output = require('fs').createWriteStream(outputPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        
        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));
        
        archive.pipe(output);
        
        for (const file of files) {
            archive.file(file.path, { name: file.name });
        }
        
        archive.finalize();
    });
}

// メイン処理
async function main() {
    program
        .version('1.0.0')
        .description('Superwhisper iOS Shortcut Generator')
        .option('-i, --input <path>', 'Input directory or file path', '.')
        .option('-o, --output <path>', 'Output directory', './shortcuts')
        .option('-r, --with-record', 'Generate shortcuts with recording action')
        .option('-z, --zip', 'Create ZIP file of all shortcuts')
        .parse(process.argv);
    
    const options = program.opts();
    
    console.log(chalk.cyan('🎤 Superwhisper Shortcut Generator\n'));
    
    // 出力ディレクトリを作成
    await fs.mkdir(options.output, { recursive: true });
    
    // 入力ファイルを検索
    let jsonFiles = [];
    const inputStat = await fs.stat(options.input).catch(() => null);
    
    if (inputStat && inputStat.isDirectory()) {
        // ディレクトリの場合
        const pattern = path.join(options.input, '**/*.json');
        jsonFiles = glob.sync(pattern);
        console.log(chalk.blue(`📁 Searching for JSON files in: ${options.input}`));
    } else if (inputStat && inputStat.isFile() && options.input.endsWith('.json')) {
        // 単一ファイルの場合
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
    const generatedFiles = [];
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
        const result = await generateShortcutFile(mode, options.output, false);
        if (result.success) {
            console.log(chalk.green(`   ✅ ${result.fileName}`));
            generatedFiles.push({ path: result.filePath, name: result.fileName });
            successCount++;
        } else {
            console.log(chalk.red(`   ❌ Failed: ${result.error}`));
            // URLファイルを代替として生成
            const urlFile = await generateURLFile(mode, options.output, false);
            console.log(chalk.yellow(`   📄 ${urlFile.fileName} (fallback)`));
            generatedFiles.push({ path: urlFile.filePath, name: urlFile.fileName });
        }
        
        // 録音付きショートカット（オプション）
        if (options.withRecord) {
            const recordResult = await generateShortcutFile(mode, options.output, true);
            if (recordResult.success) {
                console.log(chalk.green(`   ✅ ${recordResult.fileName}`));
                generatedFiles.push({ path: recordResult.filePath, name: recordResult.fileName });
            } else {
                const urlFile = await generateURLFile(mode, options.output, true);
                console.log(chalk.yellow(`   📄 ${urlFile.fileName} (fallback)`));
                generatedFiles.push({ path: urlFile.filePath, name: urlFile.fileName });
            }
        }
    }
    
    // ZIPファイルを作成（オプション）
    if (options.zip && generatedFiles.length > 0) {
        const zipPath = path.join(options.output, 'superwhisper-shortcuts.zip');
        console.log(chalk.blue('\n📦 Creating ZIP file...'));
        
        try {
            await createZip(generatedFiles, zipPath);
            console.log(chalk.green(`✅ ZIP file created: ${zipPath}`));
        } catch (error) {
            console.error(chalk.red(`❌ ZIP creation failed: ${error.message}`));
        }
    }
    
    // 結果サマリー
    console.log(chalk.cyan('\n📊 Summary:'));
    console.log(chalk.green(`   ✅ Success: ${successCount} files`));
    if (errorCount > 0) {
        console.log(chalk.red(`   ❌ Errors: ${errorCount} files`));
    }
    console.log(chalk.blue(`   📁 Output: ${options.output}`));
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