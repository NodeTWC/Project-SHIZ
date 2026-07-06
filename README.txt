PROJECT SHIZ Version 3.4.2 Modular Edition
FixStart Debug Package

Startボタンが動かない原因を特定しやすいように、イベント・Engine・initにエラー表示を追加した版です。

追加された挙動:
- Start押下時に Terminal へ "Start command accepted." を表示
- Engine内部で止まった場合 Terminal に "Engine stopped : ..." を表示
- イベント登録エラーは "EVENT ERROR" として表示
- initエラーは "INIT ERROR" として表示

配置方法:
1. ZIP内の index.html を上書き
2. ZIP内の js/ フォルダを丸ごと上書き
3. ブラウザでスーパーリロード（Ctrl + F5）
4. Startを押して、TerminalまたはConsoleの表示を確認
