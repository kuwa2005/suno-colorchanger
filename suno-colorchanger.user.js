// ==UserScript==
// @name         Suno Input Fields Color Customizer
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Suno.comの入力欄の背景色をカスタマイズ（Song Title: オレンジ、Lyrics: 水色、Styles: 緑）
// @author       You
// @match        https://suno.com/create*
// @match        https://*.suno.com/create*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // CSSスタイルシートを追加して背景色を強制的に適用
    // GM_addStyleが利用可能な場合はそれを使用、そうでなければ通常の方法を使用
    const cssText = `
        /* Song Title: 暗いオレンジ - より強力なセレクタ */
        input[placeholder="Song Title (Optional)"],
        input[placeholder*="Song Title"] {
            background-color: #402300 !important;
            background: #402300 !important;
        }
        input[placeholder="Song Title (Optional)"]:focus,
        input[placeholder*="Song Title"]:focus,
        input[placeholder="Song Title (Optional)"]:hover,
        input[placeholder*="Song Title"]:hover {
            background-color: #402300 !important;
            background: #402300 !important;
        }
        /* Lyrics: 暗い水色 - より強力なセレクタ */
        textarea[placeholder*="Write some lyrics"],
        textarea[placeholder*="Write some lyrics or a prompt"],
        textarea[placeholder*="or leave blank for instrumental"] {
            background-color: #0f232d !important;
            background: #0f232d !important;
        }
        textarea[placeholder*="Write some lyrics"]:focus,
        textarea[placeholder*="Write some lyrics or a prompt"]:focus,
        textarea[placeholder*="or leave blank for instrumental"]:focus,
        textarea[placeholder*="Write some lyrics"]:hover,
        textarea[placeholder*="Write some lyrics or a prompt"]:hover,
        textarea[placeholder*="or leave blank for instrumental"]:hover {
            background-color: #0f232d !important;
            background: #0f232d !important;
        }
        /* Styles: 暗い緑色 - より広範囲なセレクタ */
        textarea[maxlength="1000"] {
            background-color: #143214 !important;
            background: #143214 !important;
        }
        textarea[maxlength="1000"]:focus,
        textarea[maxlength="1000"]:hover {
            background-color: #143214 !important;
            background: #143214 !important;
        }
        /* ただし、Lyricsのtextareaは除外 */
        textarea[placeholder*="Write some lyrics"][maxlength="1000"],
        textarea[placeholder*="or leave blank for instrumental"][maxlength="1000"] {
            background-color: #0f232d !important;
            background: #0f232d !important;
        }
        textarea[placeholder*="Write some lyrics"][maxlength="1000"]:focus,
        textarea[placeholder*="or leave blank for instrumental"][maxlength="1000"]:focus {
            background-color: #0f232d !important;
            background: #0f232d !important;
        }
    `;
    
    // CSSを適用
    try {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(cssText);
            console.log('[Suno ColorChanger] CSS applied using GM_addStyle');
        } else {
            const style = document.createElement('style');
            style.id = 'suno-colorchanger-style';
            style.textContent = cssText;
            // 既存のスタイルがあれば削除
            const existingStyle = document.getElementById('suno-colorchanger-style');
            if (existingStyle) {
                existingStyle.remove();
            }
            if (document.head) {
                document.head.appendChild(style);
                console.log('[Suno ColorChanger] CSS applied using style element');
            } else {
                // document.headがまだない場合は待つ
                const observer = new MutationObserver(function(mutations, obs) {
                    if (document.head) {
                        document.head.appendChild(style);
                        console.log('[Suno ColorChanger] CSS applied after document.head appeared');
                        obs.disconnect();
                    }
                });
                observer.observe(document.documentElement, { childList: true });
            }
        }
    } catch (e) {
        console.error('[Suno ColorChanger] Error applying CSS:', e);
    }

    // すべての入力欄の背景色を変更する関数
    function changeInputBackgrounds() {
        let foundCount = 0;
        
        // Song Title: 暗いオレンジ（複数のセレクタで検索）
        const songTitleInputs = document.querySelectorAll('input[placeholder="Song Title (Optional)"], input[placeholder*="Song Title"]');
        songTitleInputs.forEach(input => {
            foundCount++;
            // 背景色を強制的に設定
            input.classList.remove('bg-transparent');
            input.style.removeProperty('background');
            input.style.setProperty('background-color', '#402300', 'important');
            input.style.setProperty('background', '#402300', 'important');
            input.style.backgroundColor = '#402300';
            // さらに確実にするため、直接style属性に追加
            const currentStyle = input.getAttribute('style') || '';
            if (!currentStyle.includes('#402300')) {
                input.setAttribute('style', currentStyle + '; background-color: #402300 !important; background: #402300 !important;');
            }
        });
        if (songTitleInputs.length > 0) {
            console.log('[Suno ColorChanger] Song Title inputs found:', songTitleInputs.length);
        }
        
        // Lyrics: 暗い水色（より確実に検出）
        // 方法1: placeholderで検索
        const lyricsTextareasByPlaceholder = document.querySelectorAll('textarea[placeholder*="Write some lyrics"], textarea[placeholder*="Write some lyrics or a prompt"], textarea[placeholder*="or leave blank for instrumental"]');
        lyricsTextareasByPlaceholder.forEach(textarea => {
            // maxlength="1000"の場合は除外（Stylesの可能性がある）
            const maxlength = textarea.getAttribute('maxlength');
            if (maxlength === '1000') {
                // placeholderで確認
                const placeholder = textarea.getAttribute('placeholder') || '';
                if (!placeholder.includes('Write some lyrics') && !placeholder.includes('or leave blank')) {
                    return; // Stylesの可能性があるのでスキップ
                }
            }
            // 背景色を強制的に設定
            textarea.classList.remove('bg-transparent');
            textarea.style.removeProperty('background');
            textarea.style.setProperty('background-color', '#0f232d', 'important');
            textarea.style.setProperty('background', '#0f232d', 'important');
            textarea.style.backgroundColor = '#0f232d';
            // さらに確実にするため、直接style属性に追加
            const currentStyle = textarea.getAttribute('style') || '';
            if (!currentStyle.includes('#0f232d')) {
                textarea.setAttribute('style', currentStyle + '; background-color: #0f232d !important; background: #0f232d !important;');
            }
            // 親要素の背景色も確認
            let parent = textarea.parentElement;
            for (let i = 0; i < 3 && parent; i++) {
                if (parent.style) {
                    parent.style.setProperty('background-color', 'transparent', 'important');
                }
                parent = parent.parentElement;
            }
        });
        if (lyricsTextareasByPlaceholder.length > 0) {
            console.log('[Suno ColorChanger] Lyrics textareas found (by placeholder):', lyricsTextareasByPlaceholder.length);
        }
        
        // 方法2: 親要素に"Lyrics"というテキストが含まれているtextareaを検索
        const allTextareasForLyrics = document.querySelectorAll('textarea');
        allTextareasForLyrics.forEach(textarea => {
            const placeholder = textarea.getAttribute('placeholder') || '';
            // 既に処理済みの場合はスキップ
            if (placeholder.includes('Write some lyrics') || placeholder.includes('or leave blank')) {
                return;
            }
            
            // 親要素に"Lyrics"というテキストが含まれているか確認（最大10階層まで）
            let parent = textarea.parentElement;
            let foundLyrics = false;
            for (let i = 0; i < 10 && parent; i++) {
                if (parent.textContent && parent.textContent.includes('Lyrics') && 
                    !parent.textContent.includes('Styles')) {
                    foundLyrics = true;
                    break;
                }
                parent = parent.parentElement;
            }
            
            if (foundLyrics) {
                // maxlength="1000"の場合はStylesの可能性があるのでスキップ
                const maxlength = textarea.getAttribute('maxlength');
                if (maxlength === '1000') {
                    return;
                }
                // 背景色を強制的に設定
                textarea.classList.remove('bg-transparent');
                textarea.style.removeProperty('background');
                textarea.style.setProperty('background-color', '#0f232d', 'important');
                textarea.style.setProperty('background', '#0f232d', 'important');
                textarea.style.backgroundColor = '#0f232d';
                // さらに確実にするため、直接style属性に追加
                const currentStyle = textarea.getAttribute('style') || '';
                if (!currentStyle.includes('#0f232d')) {
                    textarea.setAttribute('style', currentStyle + '; background-color: #0f232d !important; background: #0f232d !important;');
                }
            }
        });
        if (allTextareasForLyrics.length > 0) {
            console.log('[Suno ColorChanger] Lyrics textareas found (by parent):', allTextareasForLyrics.length);
        }
        
        // Styles: 暗い緑色（より確実に検出）
        // すべてのtextareaをチェック
        const allTextareas = document.querySelectorAll('textarea');
        allTextareas.forEach(textarea => {
            const placeholder = textarea.getAttribute('placeholder') || '';
            const maxlength = textarea.getAttribute('maxlength');
            
            // Lyricsのtextareaは除外（既に処理済み）
            if (placeholder.includes('Write some lyrics') || placeholder.includes('or leave blank')) {
                // 親要素に"Lyrics"が含まれている場合も除外
                let parent = textarea.parentElement;
                for (let i = 0; i < 5 && parent; i++) {
                    if (parent.textContent && parent.textContent.includes('Lyrics') && 
                        !parent.textContent.includes('Styles')) {
                        return;
                    }
                    parent = parent.parentElement;
                }
            }
            
            // Stylesのtextareaを判定
            let isStylesTextarea = false;
            
            // 方法1: 親要素に"Styles"というテキストが含まれているか確認（最優先、最大15階層まで）
            let parent = textarea.parentElement;
            for (let i = 0; i < 15 && parent; i++) {
                if (parent.textContent && parent.textContent.includes('Styles')) {
                    // "Lyrics"も含まれている場合は除外
                    if (!parent.textContent.includes('Lyrics') || 
                        (parent.textContent.indexOf('Styles') < parent.textContent.indexOf('Lyrics'))) {
                        isStylesTextarea = true;
                        break;
                    }
                }
                parent = parent.parentElement;
            }
            
            // 方法2: maxlength="1000"で、かつLyricsでないtextareaはStyles
            if (!isStylesTextarea && maxlength === '1000' && !placeholder.includes('Write some lyrics')) {
                isStylesTextarea = true;
            }
            
            // 方法3: placeholderにカンマが含まれている（スタイル名のリスト形式）
            if (!isStylesTextarea && placeholder.includes(',')) {
                isStylesTextarea = true;
            }
            
            // 方法4: 特定のキーワードが含まれている
            if (!isStylesTextarea) {
                const styleKeywords = ['accordions', 'rap parts', 'cinematic rock', 'memorable melodies', 
                                     'bro country', 'bro-country', 'québécois', 'vibraphone', 'massive', 
                                     'synths', 'phonk', 'pluck', 'layered vocals'];
                if (styleKeywords.some(keyword => placeholder.toLowerCase().includes(keyword.toLowerCase()) || 
                    (textarea.value && textarea.value.toLowerCase().includes(keyword.toLowerCase())))) {
                    isStylesTextarea = true;
                }
            }
            
            if (isStylesTextarea) {
                // 背景色を強制的に設定（複数の方法で確実に適用）
                textarea.classList.remove('bg-transparent');
                // 既存のスタイルを削除
                textarea.style.removeProperty('background');
                textarea.style.removeProperty('background-color');
                // 新しいスタイルを設定
                textarea.style.setProperty('background-color', '#143214', 'important');
                textarea.style.setProperty('background', '#143214', 'important');
                textarea.style.backgroundColor = '#143214';
                // さらに確実にするため、直接設定
                const currentStyle = textarea.getAttribute('style') || '';
                if (!currentStyle.includes('#143214')) {
                    textarea.setAttribute('style', currentStyle + '; background-color: #143214 !important; background: #143214 !important;');
                }
            }
        });
        const stylesCount = Array.from(allTextareas).filter(t => {
            const placeholder = t.getAttribute('placeholder') || '';
            const maxlength = t.getAttribute('maxlength');
            return maxlength === '1000' && !placeholder.includes('Write some lyrics');
        }).length;
        if (stylesCount > 0) {
            console.log('[Suno ColorChanger] Styles textareas found:', stylesCount);
        }
        
        // input要素もチェック
        const allInputs = document.querySelectorAll('input');
        allInputs.forEach(input => {
            const placeholder = input.getAttribute('placeholder') || '';
            const value = input.value || '';
            if (placeholder.toLowerCase().includes('style') || 
                (value && (value.includes('massive') || value.includes('synths')))) {
                // 背景色を強制的に設定
                input.classList.remove('bg-transparent');
                input.style.removeProperty('background');
                input.style.setProperty('background-color', '#143214', 'important');
                input.style.setProperty('background', '#143214', 'important');
                input.style.backgroundColor = '#143214';
                // さらに確実にするため、直接style属性に追加
                const currentStyle = input.getAttribute('style') || '';
                if (!currentStyle.includes('#143214')) {
                    input.setAttribute('style', currentStyle + '; background-color: #143214 !important; background: #143214 !important;');
                }
            }
        });
        
        // デバッグ情報を出力
        if (foundCount > 0) {
            console.log('[Suno ColorChanger] Total inputs processed:', foundCount);
        }
    }

    // スクリプトが読み込まれたことを確認
    console.log('[Suno ColorChanger] Script loaded, version 1.9');
    
    // ページ読み込み時に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[Suno ColorChanger] DOMContentLoaded event fired');
            changeInputBackgrounds();
        });
    } else {
        console.log('[Suno ColorChanger] DOM already loaded, running immediately');
        changeInputBackgrounds();
    }

    // 動的に追加される要素に対応するため、MutationObserverを使用
    const observer = new MutationObserver(function(mutations) {
        let shouldRun = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || 
                            node.querySelector('input, textarea')) {
                            shouldRun = true;
                        }
                    }
                });
            }
        });
        if (shouldRun) {
            changeInputBackgrounds();
        }
    });

    // body要素の変更を監視
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['placeholder', 'value']
    });

    // 遅延表示に対応するため、定期的にチェック（50msごと、最大120秒間）
    let checkCount = 0;
    const maxChecks = 2400; // 120秒間（50ms × 2400回）
    const intervalId = setInterval(function() {
        changeInputBackgrounds();
        checkCount++;
        if (checkCount >= maxChecks) {
            clearInterval(intervalId);
        }
    }, 50);
    
    // ページが完全に読み込まれた後にも実行
    window.addEventListener('load', function() {
        setTimeout(changeInputBackgrounds, 500);
        setTimeout(changeInputBackgrounds, 1000);
        setTimeout(changeInputBackgrounds, 2000);
        setTimeout(changeInputBackgrounds, 3000);
        setTimeout(changeInputBackgrounds, 5000);
        setTimeout(changeInputBackgrounds, 10000);
    });
    
    // フォーカスイベントでも実行（ユーザーが入力欄をクリックした時）
    document.addEventListener('focusin', function(e) {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
            setTimeout(changeInputBackgrounds, 100);
        }
    }, true);
    
    // スクリプトが実行されていることを確認するためのメッセージ
    console.log('[Suno ColorChanger] Initialization complete. Monitoring for input fields...');

})();

