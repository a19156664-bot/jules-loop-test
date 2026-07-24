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



