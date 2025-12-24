// ==UserScript==
// @name         Suno Input Fields Color Customizer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Suno.comの入力欄の背景色をカスタマイズ（Song Title: オレンジ、Lyrics: 水色、Styles: 緑）
// @author       You
// @match        https://suno.com/create
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // CSSスタイルシートを追加して背景色を強制的に適用
    const style = document.createElement('style');
    style.textContent = `
        /* Song Title: 暗いオレンジ */
        input[placeholder="Song Title (Optional)"] {
            background-color: #402300 !important;
            background: #402300 !important;
        }
        input[placeholder="Song Title (Optional)"]:focus {
            background-color: #402300 !important;
            background: #402300 !important;
        }
        /* Lyrics: 暗い水色 */
        textarea[placeholder*="Write some lyrics"],
        textarea[placeholder*="Write some lyrics or a prompt"] {
            background-color: #0f232d !important;
            background: #0f232d !important;
        }
        textarea[placeholder*="Write some lyrics"]:focus,
        textarea[placeholder*="Write some lyrics or a prompt"]:focus {
            background-color: #0f232d !important;
            background: #0f232d !important;
        }
        /* Styles: 暗い緑色 - より広範囲なセレクタ */
        textarea[maxlength="1000"] {
            background-color: #143214 !important;
            background: #143214 !important;
        }
        textarea[maxlength="1000"]:focus {
            background-color: #143214 !important;
            background: #143214 !important;
        }
        /* ただし、Lyricsのtextareaは除外 */
        textarea[placeholder*="Write some lyrics"][maxlength="1000"] {
            background-color: #0f232d !important;
            background: #0f232d !important;
        }
        textarea[placeholder*="Write some lyrics"][maxlength="1000"]:focus {
            background-color: #0f232d !important;
            background: #0f232d !important;
        }
    `;
    document.head.appendChild(style);

    // すべての入力欄の背景色を変更する関数
    function changeInputBackgrounds() {
        // Song Title: 暗いオレンジ
        const songTitleInput = document.querySelector('input[placeholder="Song Title (Optional)"]');
        if (songTitleInput) {
            songTitleInput.classList.remove('bg-transparent');
            songTitleInput.style.setProperty('background-color', '#402300', 'important');
            songTitleInput.style.setProperty('background', '#402300', 'important');
        }
        
        // Lyrics: 暗い水色
        const lyricsTextarea = document.querySelector('textarea[placeholder*="Write some lyrics"], textarea[placeholder*="Write some lyrics or a prompt"]');
        if (lyricsTextarea) {
            lyricsTextarea.classList.remove('bg-transparent');
            lyricsTextarea.style.setProperty('background-color', '#0f232d', 'important');
            lyricsTextarea.style.setProperty('background', '#0f232d', 'important');
        }
        
        // Styles: 暗い緑色（より確実に検出）
        // すべてのtextareaをチェック
        const allTextareas = document.querySelectorAll('textarea');
        allTextareas.forEach(textarea => {
            const placeholder = textarea.getAttribute('placeholder') || '';
            const maxlength = textarea.getAttribute('maxlength');
            
            // Lyricsのtextareaは除外（既に処理済み）
            if (placeholder.includes('Write some lyrics')) {
                return;
            }
            
            // Stylesのtextareaを判定
            let isStylesTextarea = false;
            
            // 方法1: maxlength="1000"で、かつLyricsでないtextareaはStyles
            if (maxlength === '1000' && !placeholder.includes('Write some lyrics')) {
                isStylesTextarea = true;
            }
            
            // 方法2: 親要素に"Styles"というテキストが含まれているか確認（最大10階層まで）
            if (!isStylesTextarea) {
                let parent = textarea.parentElement;
                for (let i = 0; i < 10 && parent; i++) {
                    if (parent.textContent && parent.textContent.includes('Styles') && 
                        !parent.textContent.includes('Write some lyrics')) {
                        isStylesTextarea = true;
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
            
            // 方法3: placeholderにカンマが含まれている（スタイル名のリスト形式）
            if (!isStylesTextarea && placeholder.includes(',')) {
                isStylesTextarea = true;
            }
            
            // 方法4: 特定のキーワードが含まれている
            if (!isStylesTextarea) {
                const styleKeywords = ['accordions', 'rap parts', 'cinematic rock', 'memorable melodies', 
                                     'bro-country', 'québécois', 'vibraphone', 'massive', 'synths'];
                if (styleKeywords.some(keyword => placeholder.includes(keyword) || textarea.value.includes(keyword))) {
                    isStylesTextarea = true;
                }
            }
            
            if (isStylesTextarea) {
                textarea.classList.remove('bg-transparent');
                textarea.style.setProperty('background-color', '#143214', 'important');
                textarea.style.setProperty('background', '#143214', 'important');
            }
        });
        
        // input要素もチェック
        const allInputs = document.querySelectorAll('input');
        allInputs.forEach(input => {
            const placeholder = input.getAttribute('placeholder') || '';
            const value = input.value || '';
            if (placeholder.toLowerCase().includes('style') || 
                (value && (value.includes('massive') || value.includes('synths')))) {
                input.classList.remove('bg-transparent');
                input.style.setProperty('background-color', '#143214', 'important');
                input.style.setProperty('background', '#143214', 'important');
            }
        });
    }

    // ページ読み込み時に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', changeInputBackgrounds);
    } else {
        changeInputBackgrounds();
    }

    // 動的に追加される要素に対応するため、MutationObserverを使用
    const observer = new MutationObserver(function(mutations) {
        changeInputBackgrounds();
    });

    // body要素の変更を監視
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['placeholder', 'value']
    });

    // 遅延表示に対応するため、定期的にチェック（200msごと、最大20秒間）
    let checkCount = 0;
    const maxChecks = 100; // 20秒間（200ms × 100回）
    const intervalId = setInterval(function() {
        changeInputBackgrounds();
        checkCount++;
        if (checkCount >= maxChecks) {
            clearInterval(intervalId);
        }
    }, 200);

})();

