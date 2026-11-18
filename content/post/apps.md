+++
description = ""
tags = ["apps"]
title = "Apps"
url = "/apps"
comments = false
showMeta = false
showActions = false
+++

These are small, free web apps I've built. They run entirely in your browser: there's nothing to install, no account to create and no ads. Your progress and settings are saved in your browser, not on a server. More apps are on the way.

<style>
/* The theme sets 1rem = 10px. */
/* The top margin spaces the first card from the intro; between cards it collapses into the 4.8rem below. */
.app-card { margin: 3.2rem 0 4.8rem; border: 1px solid #e3e7ea; border-radius: 18px; background: #fff; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.04); }
.app-card > a { display: block; border-bottom: 1px solid #e3e7ea; }
.app-card .app-shot { display: block; width: 100%; height: auto; }
.app-card-body { padding: 2.4rem 2.8rem 2.8rem; }
.app-card h2 { margin: 0; font-size: 2.6rem; line-height: 1.3; }
.app-card h2 a, .app-card h2 a:visited { color: #349ef3; }
/* Scoped under .post .post-content to outrank the theme's paragraph spacing. */
.post .post-content .app-card .app-card-body > p { margin: 0 0 2rem; }
.post .post-content .app-card .app-card-body > p.app-tagline { margin: .4rem 0 1.6rem; font-family: "Open Sans", sans-serif; font-size: 1.7rem; font-weight: 600; letter-spacing: -.01em; color: #909ba2; line-height: 1.5; }
.app-tech { margin: 0 0 2.4rem; padding: 1.4rem 1.8rem; border-left: 4px solid #349ef3; border-radius: 8px; background: #f4f8fb; font-size: 1.4rem; line-height: 1.75; }
.app-tech strong { color: #4a4a4a; }
.app-actions { display: flex; flex-wrap: wrap; gap: 1rem; padding-top: 2.4rem; border-top: 1px solid #e3e7ea; }
.app-card a.app-btn, .app-card a.app-btn:visited { display: inline-flex; align-items: center; gap: .6rem; min-height: 44px; padding: 0 2rem; border: 2px solid #349ef3; border-radius: 8px; font-family: "Open Sans", sans-serif; font-size: 1.5rem; font-weight: 700; line-height: 1; text-decoration: none; transition: background-color .15s, color .15s; }
.app-card a.app-btn-primary, .app-card a.app-btn-primary:visited { background: #349ef3; color: #fff; }
.app-card a.app-btn-primary:hover { background: #1f86d8; border-color: #1f86d8; color: #fff; text-decoration: none; }
.app-card a.app-btn-secondary, .app-card a.app-btn-secondary:visited { background: #fff; color: #349ef3; }
.app-card a.app-btn-secondary:hover { background: #eef6fe; color: #1f86d8; text-decoration: none; }
@media (max-width: 500px) { .app-card-body { padding: 2rem 1.8rem 2.2rem; } .app-card h2 { font-size: 2.2rem; } }
</style>

<div class="app-card">
<a href="/words/"><img class="app-shot" src="/img/apps/words.jpg" alt="The Words landing page, showing a flashcard for the word 'ball'" width="1280" height="860" loading="lazy"></a>
<div class="app-card-body">
<h2 id="words"><a href="/words/">Words</a></h2>
<p class="app-tagline">Daily flashcards for the words you'll use most</p>
<p>Learn the most common words in English, French, Spanish, German or Japanese in just a few minutes a day. Words is a flashcard app with spaced repetition: each day it mixes a few new words with the ones you're due to review, and it explains them in the language of your choice. It works offline and can be installed on your phone like a native app.</p>
<div class="app-tech"><strong>Tech stack:</strong> HTML, CSS and JavaScript modules with no build step, an installable offline web app (service worker), the browser's speech synthesis for pronunciation, localStorage</div>
<div class="app-actions">
<a class="app-btn app-btn-primary" href="/words/"><span aria-hidden="true">🚀</span>Live app</a>
<a class="app-btn app-btn-secondary" href="https://github.com/mco-gh/words" target="_blank" rel="noopener"><span aria-hidden="true">💻</span>Source code</a>
</div>
</div>
</div>

<div class="app-card">
<a href="/chess/"><img class="app-shot" src="/img/apps/chess.jpg" alt="The Chess landing page, with a colorful chess board mid-game, a color picker and a Start a game button" width="1280" height="860" loading="lazy"></a>
<div class="app-card-body">
<h2 id="chess"><a href="/chess/">Chess</a></h2>
<p class="app-tagline">Your move, wherever you are</p>
<p>Play chess with anyone, wherever they are. Pick white or black, start a game and send your friend the code: there's nothing to sign up for. Tap or drag the pieces and they glide across the board, with every legal move marked for you. Add a chess clock with your own time and increment if you like, turn on video or chat while you play, and recolor the board and pieces to taste. Moves travel directly between your two browsers.</p>
<div class="app-tech"><strong>Tech stack:</strong> HTML, CSS and JavaScript modules with no build step, a small hand-written rules engine, WebRTC data and media channels (PeerJS), inline SVG pieces with CSS transitions, localStorage</div>
<div class="app-actions">
<a class="app-btn app-btn-primary" href="/chess/"><span aria-hidden="true">🚀</span>Live app</a>
<a class="app-btn app-btn-secondary" href="https://github.com/mco-gh/chess" target="_blank" rel="noopener"><span aria-hidden="true">💻</span>Source code</a>
</div>
</div>
</div>

<div class="app-card">
<a href="/bg/"><img class="app-shot" src="/img/apps/bg.jpg" alt="The BG landing page, with a colorful backgammon board, a color picker and a Start a game button" width="1280" height="860" loading="lazy"></a>
<div class="app-card-body">
<h2 id="bg"><a href="/bg/">BG</a></h2>
<p class="app-tagline">Backgammon with a friend, anywhere</p>
<p>Play backgammon with anyone, wherever they are. Start a game, pick your color and send your friend the code: there's nothing to sign up for. The dice tumble, the checkers glide, and you can turn on video or chat while you play. Moves travel directly between your two browsers, and you can recolor the board and checkers to taste.</p>
<div class="app-tech"><strong>Tech stack:</strong> HTML, CSS and JavaScript modules with no build step, WebRTC data and media channels (PeerJS), CSS container units and transitions for the board, localStorage</div>
<div class="app-actions">
<a class="app-btn app-btn-primary" href="/bg/"><span aria-hidden="true">🚀</span>Live app</a>
<a class="app-btn app-btn-secondary" href="https://github.com/mco-gh/bg" target="_blank" rel="noopener"><span aria-hidden="true">💻</span>Source code</a>
</div>
</div>
</div>

<div class="app-card">
<a href="/four/"><img class="app-shot" src="/img/apps/four.jpg" alt="The Four landing page, with a blue board of red and yellow discs mid-game, a choice of who goes first and a Start a game button" width="1280" height="860" loading="lazy"></a>
<div class="app-card-body">
<h2 id="four"><a href="/four/">Four</a></h2>
<p class="app-tagline">Four in a row, wherever you are</p>
<p>Play four in a row with anyone, wherever they are. Choose who goes first, start a game and send your friend the code: there's nothing to sign up for. Discs drop and bounce into place, the winning four light up, and a running score keeps track over rematches. Turn on video or chat while you play, and recolor the board and discs to taste. Moves travel directly between your two browsers, and you can install it on your phone like a native app.</p>
<div class="app-tech"><strong>Tech stack:</strong> HTML, CSS and JavaScript modules with no build step, WebRTC data and media channels (PeerJS) with a TURN relay fallback, CSS container units and the Web Animations API for the board, an installable offline web app (service worker), localStorage</div>
<div class="app-actions">
<a class="app-btn app-btn-primary" href="/four/"><span aria-hidden="true">🚀</span>Live app</a>
<a class="app-btn app-btn-secondary" href="https://github.com/mco-gh/four" target="_blank" rel="noopener"><span aria-hidden="true">💻</span>Source code</a>
</div>
</div>
</div>

<div class="app-card">
<a href="/mm/"><img class="app-shot" src="/img/apps/mm.jpg" alt="The MM landing page, with a board of colored guesses and scoring pegs below a hidden code, a level picker and a Start a game button" width="1280" height="860" loading="lazy"></a>
<div class="app-card-body">
<h2 id="mm"><a href="/mm/">MM</a></h2>
<p class="app-tagline">Crack the code, wherever you are</p>
<p>A code-breaking race for two. You each hide a secret row of colored pegs, then race to crack each other's code. Every guess tells you how many pegs are the right color in the right place, and how many are the right color in the wrong place. Fewest tries wins. Pick from three levels, start a game and send your friend the code: there's nothing to sign up for. Your code never leaves your browser until the round is over, and each side's code is checked against a fingerprint at the end, so nobody can fib. Turn on video or chat while you play, and install it on your phone like a native app.</p>
<div class="app-tech"><strong>Tech stack:</strong> HTML, CSS and JavaScript modules with no build step, WebRTC data and media channels (PeerJS) with a TURN relay fallback, SHA-256 commitments (Web Crypto) for fair play, an installable offline web app (service worker), sessionStorage and localStorage</div>
<div class="app-actions">
<a class="app-btn app-btn-primary" href="/mm/"><span aria-hidden="true">🚀</span>Live app</a>
<a class="app-btn app-btn-secondary" href="https://github.com/mco-gh/mm" target="_blank" rel="noopener"><span aria-hidden="true">💻</span>Source code</a>
</div>
</div>
</div>

<div class="app-card">
<a href="/riffle/"><img class="app-shot" src="/img/apps/riffle.jpg" alt="A solved Riffle puzzle: the letter strip coloured by word, GREATLY, DOUBLE and SLOPE found, and a Perfect riffle result with a colour barcode to share" width="1280" height="860" loading="lazy"></a>
<div class="app-card-body">
<h2 id="riffle"><a href="/riffle/">Riffle</a></h2>
<p class="app-tagline">Three words, shuffled like cards. Pull them apart.</p>
<p>A new word puzzle every day. Three words have been riffled together like a deck of cards: each keeps its letters in order, but they're mixed in with the others. Tap letters from left to right to pull out any word you can find, and clear the strip in as few words as possible. Par is 3, and a long word that wasn't hidden can put you under par. Grab easy words too soon and you may strand letters you can't use. When you're done, share your result as a colour barcode that doesn't give away the answer.</p>
<div class="app-tech"><strong>Tech stack:</strong> HTML, CSS and JavaScript modules with no build step, daily puzzles generated in the browser from a seeded random number generator, the public-domain ENABLE word list, localStorage</div>
<div class="app-actions">
<a class="app-btn app-btn-primary" href="/riffle/"><span aria-hidden="true">🚀</span>Live app</a>
<a class="app-btn app-btn-secondary" href="https://github.com/mco-gh/riffle" target="_blank" rel="noopener"><span aria-hidden="true">💻</span>Source code</a>
</div>
</div>
</div>

<div class="app-card">
<a href="/talk/"><img class="app-shot" src="/img/apps/talk.jpg" alt="The Talk landing page, with a language picker and a Start a call button" width="1280" height="860" loading="lazy"></a>
<div class="app-card-body">
<h2 id="talk"><a href="/talk/">Talk</a></h2>
<p class="app-tagline">Video calls that translate your voice as you speak</p>
<p>Video call a friend who speaks another language. Talk translates what each of you says as you speak, in a voice that sounds like yours, with captions on screen. It works in English, French, German and Spanish. Send your friend a link to start: the call runs directly between your two browsers. Translation uses Google's Gemini with your own API key, and only one of you needs one.</p>
<div class="app-tech"><strong>Tech stack:</strong> HTML, CSS and JavaScript modules with no build step, WebRTC (PeerJS), Google's Gemini 3.5 Live Translate over a WebSocket, Web Audio (AudioWorklet), localStorage</div>
<div class="app-actions">
<a class="app-btn app-btn-primary" href="/talk/"><span aria-hidden="true">🚀</span>Live app</a>
<a class="app-btn app-btn-secondary" href="https://github.com/mco-gh/talk" target="_blank" rel="noopener"><span aria-hidden="true">💻</span>Source code</a>
</div>
</div>
</div>

<div class="app-card">
<a href="/bookshelf/"><img class="app-shot" src="/img/apps/bookshelf.jpg" alt="The Bookshelf landing page, showing a photo of a shelf of games and puzzle books" width="1280" height="860" loading="lazy"></a>
<div class="app-card-body">
<h2 id="bookshelf"><a href="/bookshelf/">Bookshelf</a></h2>
<p class="app-tagline">Turn a photo of your shelf into a clickable catalogue</p>
<p>Turn a photo of a bookshelf into an interactive catalogue. Upload a picture and every spine becomes a hotspot: hover over it to see the title, or click for details and places to find the book. Scanning uses Anthropic's Claude with your own API key, and you can try it first on an example shelf without one.</p>
<div class="app-tech"><strong>Tech stack:</strong> HTML, CSS and JavaScript modules with no build step, Anthropic's Claude API (Claude Opus 5.5 vision) called from the browser with your key, IndexedDB</div>
<div class="app-actions">
<a class="app-btn app-btn-primary" href="/bookshelf/"><span aria-hidden="true">🚀</span>Live app</a>
<a class="app-btn app-btn-secondary" href="https://github.com/mco-gh/bookshelf" target="_blank" rel="noopener"><span aria-hidden="true">💻</span>Source code</a>
</div>
</div>
</div>
