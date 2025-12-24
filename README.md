# Suno Input Fields Color Customizer

Suno.comの作成ページ（`https://suno.com/create`）の入力欄の背景色をカスタマイズするTampermonkeyスクリプトです。

## 機能

以下の入力欄の背景色を変更します：

- **Song Title**: 暗いオレンジ色（`#402300`）
- **Lyrics**: 暗い水色（`#0f232d`）
- **Styles**: 暗い緑色（`#143214`）

## インストール方法

1. [Tampermonkey](https://www.tampermonkey.net/) をブラウザにインストールします
2. Tampermonkeyのダッシュボードを開きます
3. 「新規スクリプトを作成」をクリックします
4. `suno-colorchanger.user.js` の内容をコピー＆ペーストします
5. 保存します（Ctrl+S または Cmd+S）

## 使用方法

1. [Suno.com](https://suno.com/create) の作成ページにアクセスします
2. スクリプトが自動的に適用され、入力欄の背景色が変更されます

## 技術的な詳細

- **対象URL**: `https://suno.com/create`
- **動作方式**: 
  - CSSスタイルシートによる強制適用
  - JavaScriptによる動的な要素検出とスタイル適用
  - MutationObserverによる動的要素の監視
  - 定期的なチェック（200ms間隔、最大20秒間）による遅延表示への対応

## カスタマイズ

背景色を変更したい場合は、スクリプト内の以下の部分を編集してください：

```javascript
// Song Title: 暗いオレンジ
'#402300'

// Lyrics: 暗い水色
'#0f232d'

// Styles: 暗い緑色
'#143214'
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## バージョン履歴

- **v1.4**: Styles入力欄の検出ロジックを強化、定期チェックの間隔を短縮
- **v1.3**: 遅延表示に対応するための定期チェック機能を追加
- **v1.2**: LyricsとStylesの入力欄にも対応
- **v1.1**: CSSスタイルシートを追加してより確実に適用
- **v1.0**: 初回リリース（Song Titleのみ対応）

