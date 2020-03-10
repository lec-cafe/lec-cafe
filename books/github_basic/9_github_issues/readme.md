---
permalink: /github_issues
---

# GitHub Issueの活用

## GitHub Issue 

GitHub Isseuは、GitHub上で提供される、タスク管理の機能です。

GitHubのIssuesのタブからIssueの機能を利用する事ができます。
`New issue` のボタンから新しいIssueを登録することができ、
開発上で必要なタスク等をメモすることができます。

Issueには担当者（Assignees) を設定したり、分類用のLabelを設定したりすることも可能で、
一旦作成されたIssueには、コメントを付与することも可能です。

### Issueの関連付け

Issueにはそれぞれ番号が割り振られます。

あるIssueの中で別のIssueの番号を記述して、IssueとIssueを相互に紐づけることができます。

Issueの番号を記述する際には `#52` の様に番号の前に `#` を付与して記述します。

`#52` のような番号を記述した側のIssueでは、
Issue番号に自動的にリンクが付与され、 
記述された側のIssue (#52) の方では、リンクを付与した側のIssueの情報が表示されます。

## Issueの自動Close 

作業が完了したIssueはCloseすることでIssueの一覧から非表示にすることができます。

IssueはIssueの画面上からCloseする他にもGitの操作で自動的にClose処理を行うことも可能になっています。

例えばコミットコメントに `fix #52` と記述して送信されたコミットを、

GitHubのmasterブランチにPushすると #52のIssueは自動的にCloseされます。

Pull Requestでも本文の欄に `fix #52` と記述することで、
Pull Requestがマージされた際に自動的にIssueをCloseするよう設定することが可能です。

