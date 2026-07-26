# TODOリストアプリ開発 マスターロードマップ (ROADMAP.md)

本ロードマップは、完成したループエンジニアリングシステム（器）の試験運用として、「リッチなTODOリストアプリ」を開発するための全タスク分解計画書です。

---

## 🎯 プロジェクト目標
- **成果物**: ビルド不要でブラウザで即動作する、リッチなモダンUIのTODOリストアプリ（Vanilla HTML/CSS/JS）
- **ステータス**: 🎉 **全タスク完走・開発完了**

---

## 📋 タスク分解キュー (全5タスク)

### [x] Task 01: [NEW] 基本HTML構造とダークモードCSSデザインシステムの構築
- **DoD (完了条件)**:
  - [x] `index.html` および `style.css` を作成すること
  - [x] モダンなダークテーマ（CSS変数、カードUI、Google Fonts）が適用されていること
  - [x] モバイル・PC対応のレスポンシブレイアウトが構成されていること

---

### [x] Task 02: [NEW] タスクデータモデルとLocalStorage永続化モジュールの作成
- **DoD (完了条件)**:
  - [x] `js/store.js` を作成し、タスクの保存・取得・更新・削除APIを実装すること
  - [x] ブラウザの `localStorage` への自動保存と読み込みが機能すること

---

### [x] Task 03: [NEW] タスク追加・UI描画・完了切替ロジックの実装
- **DoD (完了条件)**:
  - [x] `js/app.js` を作成し、入力フォームからのタスク追加とDOMレンダリングを実装すること
  - [x] チェックボックス操作で完了/未完了の状態が切り替えられ、打ち消し線アニメーションが適用されること

---

### [x] Task 04: [NEW] タスク削除機能とフィルター（すべて/未完了/完了済み）の実装
- **DoD (完了条件)**:
  - [x] 各タスクの削除ボタンで該当タスクが削除されること
  - [x] 「すべて」「未完了」「完了済み」のフィルタータブ切り替えで表示が絞り込まれること

---

### [x] Task 05: [NEW] 単体テスト・自動検証スクリプトの追加
- **DoD (完了条件)**:
  - [x] `tests/store.test.js` （ロジック検証用）を作成すること
  - [x] テストが正常に全件パスし、画面上でエラーなく動作が完結すること

---

### [x] Task 06: [NEW] 完了済みタスクの一括削除（Clear Completed）機能の実装
- **DoD (完了条件)**:
  - [x] `js/store.js` に `clearCompletedTodos()` メソッドを追加し、`completed: true` のタスクのみをクリア・保存すること
  - [x] `tests/store.test.js` に `clearCompletedTodos()` の単体テストを追加し、既存テスト含め全件パスすること
  - [x] `index.html` に「完了済みを削除」ボタン (`#btn-clear-completed`) を追加し、`js/app.js` でクリック時に `clearCompletedTodos()` とUI再描画を実行すること

---

### [x] Task 07: [NEW] タスクタイトルの編集（インライン編集）機能の実装
- **DoD (完了条件)**:
  - [x] `js/store.js` に `updateTodo(id, newText)` メソッドを追加し、指定IDのタスクテキストを更新して `localStorage` に保存すること
  - [x] `tests/store.test.js` に `updateTodo()` の単体テスト（Test 6）を追加し、既存テスト（Test 1〜5）を含め全6件が正常パスすること
  - [x] `js/app.js` にて、タスクタイトルのダブルクリック（または編集UI）でタイトル入力変更を可能にし、`store.updateTodo()` 後にUI再描画を行うこと

---

### [x] Task 08: [NEW] タスクの優先度（Priority: High, Medium, Low）設定と表示・フィルタリング機能
- **DoD (完了条件)**:
  - [x] `js/store.js` の `addTodo` および `updateTodo` にて優先度（`priority`: `'high'`, `'medium'`, `'low'`。デフォルトは `'medium'`）を保存可能にし、`updatePriority(id, priority)` を実装すること
  - [x] `tests/store.test.js` に `updatePriority()` および優先度保存の単体テスト（Test 7）を追加し、既存テスト（Test 1〜6）を含め全7件が正常パスすること
  - [x] `index.html` および `js/app.js` に優先度選択UIおよびバッジ表示・ソート/フィルタ切替機能を追加すること

---

### [x] Task 09: [NEW] 期限日（DueDate）設定と期限切れ（Overdue）自動判定・表示機能
- **DoD (完了条件)**:
  - [x] `js/store.js` の `addTodo` および `updateTodo` にて期限日（`dueDate`: YYYY-MM-DD文字列またはnull）を保存可能にし、期限切れ判定 `isOverdue(todo, currentDate)` メソッドを実装・提供すること
  - [x] `tests/store.test.js` に `dueDate` の保存と `isOverdue()` 判定の単体テスト（Test 8）を追加し、既存テスト（Test 1〜7）を含め全8件が正常パスすること
  - [x] `index.html`, `js/app.js`, `style.css` にて期限日入力フィールドを追加し、期限切れタスクには視覚的警告表示（赤色ハイライト等）を行うこと

---

### [x] Task 10: [NEW] 一括削除時の削除確認ダイアログ（Confirmation Window）機能の実装
- **DoD (完了条件)**:
  - [x] `js/app.js` にて「すべて削除」および「完了済みを削除」ボタン押下時、削除確認ダイアログ（`window.confirm` 等）でユーザー確認を挟み、OK時のみ削除を実行すること
  - [x] キャンセル選択時にはタスクが削除されず維持されること
  - [x] `tests/store.test.js` に削除ロジックの不変検証テスト（Test 9）を追加し、全9件の単体テストが正常パスすること

---

### [x] Task 11: [NEW] 入力フォームのUIレイアウト修正（「追加」ボタン等の枠内美整列）
- **DoD (完了条件)**:
  - [x] `style.css` および `index.html` にてフォーム要素（入力、優先度、期限日、追加ボタン）のCSS Grid / Flexbox配置を改善し、ボタンが枠外へ食み出さず美しく整列すること
  - [x] PC・モバイルの両環境で枠内に収まるレスポンシブ配置を確保すること
  - [x] 既存の全9件の単体テストが継続して全件合格すること

---

### [x] Task 12: [NEW] カラーテーマ切替機能（ダーク / ライト / パステルグリーン）の実装
- **DoD (完了条件)**:
  - [x] `index.html` および `js/app.js` にテーマ選択UIを追加し、選択テーマ（`dark`, `light`, `pastel-green`）を `localStorage` に保存・復元すること
  - [x] `style.css` に CSS 変数テーマ（`:root`, `[data-theme="light"]`, `[data-theme="pastel-green"]`）を定義し、UIの色合いがスムーズに切り替わること
  - [x] `tests/store.test.js` にテーマ設定の保存・取得の単体テスト（Test 10）を追加し、全10件が正常パスすること

---

### [x] Task 13: [NEW] ライト・パステルグリーンテーマ時の入力文字可視性（コントラスト）およびボタンUI改善
- **DoD (完了条件)**:
  - [x] `style.css` にて入力フィールド（input[type="text"], input[type="date"], select）およびボタン（.btn-clear-all, .btn-clear-completed）の背景・文字・枠線色を全テーマ（dark, light, pastel-green）のCSS変数に完全統合すること
  - [x] ライトモードおよびパステルグリーンモード選択時に入力文字・ラベル・選択肢がクッキリ100%可視化されること
  - [x] 全削除・完了済み削除ボタンのデザインを統一・スタイリングすること
  - [x] 既存の全10件の単体テストが継続して合格すること

---

### [x] Task 14: [NEW] フォント切替機能（メイリオ / Noto Sans JP / 源ノ角ゴシック）の実装
- **DoD (完了条件)**:
  - [x] `index.html` および `js/app.js` にフォント選択UI (#font-select) を追加し、選択フォント（メイリオ, Noto Sans JP, 源ノ角ゴシック）を `localStorage` に保存・復元すること
  - [x] `style.css` にフォント定義を組み込み、選択したフォントが即座にアプリ全体へ反映されること
  - [x] `tests/store.test.js` にフォント設定の保存・取得検証テスト（Test 11）を追加し、全11件の単体テストが正常パスすること

---

## 🚀 Eisenhower Matrix 大規模バージョンアップ (Task 15 〜 Task 19)

### [x] Task 15: [NEW] 4-Quadrant Eisenhower Matrix Data Model & Font Clean-up (工程 ①, ⑤)
- **DoD (完了条件)**:
  - [x] `js/store.js` のデータモデルを4象限 (`do_first`, `schedule`, `delegate`, `memo`) 構造へ拡張し、完了タスクを「タスク完了箱」へ移動・表示制御すること
  - [x] `index.html`, `style.css`, `js/app.js` にてフォント切替UIを削除し、アイゼンハワーマトリクス4象限カードレイアウトを構築すること
  - [x] `tests/store.test.js` に4象限移行の単体テスト（Test 12）を追加し、全テストがパスすること

---

### [x] Task 16: [NEW] HTML5 Drag & Drop Implementation for Quadrants (工程 ②)
- **DoD (完了条件)**:
  - [x] 象限内でのタスクの上下並び替え、および象限間（Do First ⇄ Schedule ⇄ Delegate ⇄ Memo）のドラッグ＆ドロップ移動を実装すること
  - [x] ドラッグ中の視覚的ハイライトアニメーションおよび移動後の `store` 自動保存を実装すること

---

### [x] Task 17: [NEW] Negative Impression Improvement Sheet Modal with Print & Timer (工程 ③)
- **DoD (完了条件)**:
  - [x] タスククリックで「ネガティブ想起改善シート」モーダルを表示し、No 1-10 の明示化内容・困難度/満足度スコア入力、5秒後行動タイマー、印刷機能を実装すること
  - [x] 入力データをタスクごとに LocalStorage へ永続保存・復元可能にすること
  - [x] `tests/store.test.js` にシートデータ保存テスト（Test 13）を追加し、全テストがパスすること

---

### [x] Task 18: [NEW] Interactive Quadrant Column Resizing (工程 ④)
- **DoD (完了条件)**:
  - [x] 4つの象限カラム間にマウスドラッグ用のリサイザーバーを配置し、ユーザーが象限の横幅を動的に拡大・縮小調整可能にすること

---

### [x] Task 19: [NEW] Top-to-Bottom Window Blind Shutter Effect for Privacy (工程 ⑥)
- **DoD (完了条件)**:
  - [x] 各象限のヘッダーに「ブラインドボタン」を配置し、押下時に窓のブラインドのように上から下へ滑らかにカバーが降りてタスク内容をお洒落に伏せるアニメーションを実装すること
  - [x] 再押下でブラインドが巻き上がり、タスク一覧が復元表示されること

---

## 🔧 緊急修復 ＆ UI大画面化バージョンアップ (Task 20, Task 21)

### [x] Task 20: [NEW] Fix Task Addition Logic and Quadrant Rendering Bug (Bug Fix)
- **DoD (完了条件)**:
  - [x] `js/app.js` および `js/store.js` にて、フォーム入力からの「追加」ボタン押下時に指定象限（`do_first`, `schedule`, `delegate`, `memo`）のDOMリストへ即座にタスクカードが正しく追加・描画されるように修正すること
  - [x] カウンター件数と描画タスク数が100%一致すること
  - [x] 全13件の単体テストが100%グリーンでパスすること

---

### [x] Task 21: [NEW] Full-Screen Eisenhower Matrix Desktop UI Redesign (UI Redesign)
- **DoD (完了条件)**:
  - [x] `style.css` および `index.html` から小枠コンテナ制限 (`max-width: 1200px` 囲み) を廃止し、見本画像2のようにパソコン画面全体 (100vw / 100vh) を使った4象限メインの大画面ボードレイアウトへ刷新すること
  - [x] 上部入力ヘッダーをスッキリ配置し、画面主要領域に4つの象限（Do First, Schedule, Delegate, Memo）が堂々と大画面で広がるプロ仕様のデザインにすること
  - [x] 全テーマ (Dark, Light, Pastel Green) で大画面レスポンシブ配置を美しく維持すること

---

## ⚙️ UX強化 ＆ 高度カスタマイズ・機能拡張 (Task 22 〜 Task 25)

### [x] Task 22: [NEW] Task Name Editing via F2 Shortcut Key (F2キー編集機能) (項目 ①)
- **DoD (完了条件)**:
  - [x] タスクカードフォーカス・選択時に `F2` キー押下でタスク名をインライン編集モードへ切り替え、Enterキーまたはフォーカスアウトで即座に保存・更新可能にすること

---

### [x] Task 23: [NEW] Intra-Quadrant Task Drag & Drop Reordering (同一枠内上下並び替え) (項目 ②)
- **DoD (完了条件)**:
  - [x] 同じ象限枠内でのタスクカードの上下ドラッグ＆ドロップ移動・順序並び替えに対応し、並び順を `LocalStorage` に永続保存すること

---

### [x] Task 24: [NEW] Settings Modal (Gear Icon ⚙️) with Custom Font Selection (設定モーダル＆フォント選択) (項目 ③)
- **DoD (完了条件)**:
  - [x] ヘッダーに歯車 ⚙️ アイコンの設定ボタンおよび設定モーダルを追加し、フォント選択（メイリオ、游ゴシック、BIZ UDゴシック）でアプリ全体のUIフォントを即座に変更・永続化すること

---

### [x] Task 25: [NEW] Enhanced Blind Feature with Scroll-Wheel Opacity & Rich Shutter Animation (ブラインド濃さ調整＆超リッチ化) (項目 ④)
- **DoD (完了条件)**:
  - [x] ブラインドカバー上でマウスホイールを回転させることで濃さ（不透明度 30%〜100%）を無段階調整可能にすること
  - [x] ブラインドシャッターのアニメーションおよびテクスチャを重厚感ある最高品質の質感へリッチ化すること

---

## 🔔 モーダル視認性修復・リサイズ ＆ Chatwork連携 (Task 26 〜 Task 28)

### [x] Task 26: [NEW] Fix Negative Sheet Modal Opacity & Contrast for High Visibility (背景透過除去・視認性修復) (項目 ②)
- **DoD (完了条件)**:
  - [x] ネガティブ想起改善シートモーダルの背景不透明度 (`background: var(--card-bg)`, `opacity: 1`) を修正し、背後要素の文字やアイコンの透け・重なりを完全排除すること
  - [x] 全テーマでクリアかつ非常に見やすい視認性を確保すること

---

### [x] Task 27: [NEW] Interactive Resizable Window for Negative Impression Sheet (モーダルサイズ変更) (項目 ①)
- **DoD (完了条件)**:
  - [x] ネガティブ想起改善シートウィンドウをマウスドラッグ操作で縦横自由にサイズ変更（リサイズ）可能にすること

---

### [x] Task 28: [NEW] Chatwork Remind Notification Feature for Due/Overdue Tasks (Chatworkリマインド自動/手動送信) (項目 ③)
- **DoD (完了条件)**:
  - [x] 期限が設定されているタスクのうち「期限当日」および「期限超過」タスクを自動抽出し、指定の Chatwork API (`TOKEN: e8e8e25a...`, `ROOM: 385392979`) へ通知メッセージを送信する機能を実装すること
  - [x] UIに「🔔 リマインド送信」ボタンを追加し、手動送信および毎日AM6:00チェック自動送信に対応すること
  - [x] 単体テスト (Test 15) を追加し全15件のテストが100%グリーンでパスすること

---

## 🛠️ Chatworkリマインド通信100%安定化 (Task 29)

### [x] Task 29: [NEW] Guaranteed Chatwork Notification via Hidden Form & Iframe Submission (CORS/OPTIONS 100%回避)
- **DoD (完了条件)**:
  - [x] `index.html` に隠し iframe (`#chatwork-iframe`) と隠し フォーム (`#chatwork-form`) を設置し、CORS / OPTIONS プリフライト制限を受けない HTML5 フォーム送信メカニズムを構築すること
  - [x] `js/store.js` / `js/app.js` にて、リマインド送信時に期限当日・超過タスクの本文を隠しフォーム経由で即座に `submit()` 送信可能にすること
  - [x] 全16件の単体テストが100%グリーンでパスすること

---

## 🛠️ Chatworkリマインド送信修復・レスポンス正常判定 (Task 30)

### [ ] Task 30: [FIX] Fix Chatwork API Remind Transmission & Response Status Handling
- **DoD (完了条件)**:
  - [ ] `sendChatworkReminder()` から、認証ヘッダーを送信できず誤った成功フラグを返していた隠し `<form>` 送信処理を撤廃（または無効化）すること
  - [ ] 必須の HTTP ヘッダー `X-ChatWorkToken: e8e8e25a481d270457a2fd7adb4e0af9` を確実に付与した `fetch()`（直接および CORS プロキシ経由の順次トライ、またはカスタムエンドポイント経由）にて Chatwork API へ `application/x-www-form-urlencoded` 形式で送信すること
  - [ ] Chatwork API のレスポンスが HTTP 200 でかつ `message_id` を含む場合にのみ `{ success: true }` を返し、失敗時は詳細なエラー理由を返却・画面表示すること
  - [ ] `tests/store.test.js` の全16件の単体テストが100%グリーンで合格すること



---



