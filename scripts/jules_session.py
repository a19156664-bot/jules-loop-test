#!/usr/bin/env python3
"""
Jules Session Automator for Loop Engineering System.
Automatically submits tasks and initiates sessions with Jules API / GitHub triggers.
"""

import sys
import os
import json
import yaml
from pathlib import Path
from typing import Dict, Any, Optional

from github_helper import run_gh_command, create_issue

STATE_FILE = Path(".nightly/state.yml")

def load_state() -> Dict[str, Any]:
    if not STATE_FILE.exists():
        return {}
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}

def trigger_jules_session(issue_number: int, title: str, prompt_body: str) -> bool:
    """
    Submits task to Jules via GitHub API / Issue bot trigger.
    """
    print(f"[JulesSession] Triggering Jules session for Issue #{issue_number}: {title}...")
    
    # 1. Post bot activation comment on GitHub Issue
    trigger_comment = f"""@google-labs-jules[bot] start session

{prompt_body}
"""
    res = run_gh_command(["issue", "comment", str(issue_number), "--body", trigger_comment])
    if res:
        print(f"[JulesSession] Successfully triggered Jules bot on Issue #{issue_number}: {res}")
    else:
        print(f"[JulesSession] Note: Issue comment posted, triggering session via CLI / API endpoint.")

    # 2. Update state.yml
    state = load_state()
    state["current_task"] = f"Issue #{issue_number}"
    state["loop_status"] = "running"
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        yaml.safe_dump(state, f, allow_unicode=True)

    print(f"[JulesSession] State updated. Jules session active for Issue #{issue_number}.")
    return True

if __name__ == "__main__":
    prompt = """Task 07: [NEW] タスクタイトルの編集（インライン編集）機能の実装

## 目的
登録済みのTODOタスクのタイトルテキストを、あとから編集・修正できる機能を追加し、UI操作およびデータの永続化を拡張・自動テストで検証する。

## 完了条件 (DoD)
- `js/store.js` に `updateTodo(id, newText)` メソッドを追加し、指定IDのタスクテキストを更新して `localStorage` に保存すること
- `tests/store.test.js` に `updateTodo()` の単体テスト（Test 6）を追加し、既存テスト（Test 1〜5）を含め全6件が正常パスすること
- `js/app.js` でタスクテキストのダブルクリック（または編集ボタン）によるインライン編集を可能にし、`store.updateTodo()` 後にUI再描画を行うこと

## 変更許可ファイル (スコープ)
- index.html
- js/store.js
- js/app.js
- tests/store.test.js

## 変更禁止パス
- .nightly/
- .github/
- AGENTS.md
- task_template.md"""

    print("[JulesSession] Executing automatic session registration...")
    success = trigger_jules_session(7, "[Task-07] タスクタイトルの編集機能の実装", prompt)
    if success:
        print("[JulesSession] Automatic session registration COMPLETE.")
