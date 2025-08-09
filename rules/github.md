# Rules to work with GitHub

**Syntax**: `[optional]` for optional arguments, `{mandatory}` for mandatory arguments.

---

**gh: next issue**: find issues labelled "ready for agent", if there's only one issue then remove the "ready for agent" label and add the "in progress" label to the issue, make a branch from the latest version of main in the remote, implement the issue and then open a PR. if there is more than one then list the names of the issues along with the issue number and wait for me to tell you which one to pick up.

**gh: merge pr [number]**: merge the current pr we're working on (the one in the context). if this is ambiguous don't do anything and ask for a pr number. optionally this can be asked with a explicit pr number like "gh: merge pr 3". either way if you know which pr to merge, verify all checks pass and merge the pr using the squash strategy and deleting the branch. remove any workflow labels from the PR itself and report which issues (if any) are linked to this PR.

**gh: complete task {issue-number}**: mark a task as fully complete by verifying all checklist items are done, checking if all associated PRs are merged (warn and ask to proceed if unmerged PRs exist), removing "in progress" and "ready for agent" labels, adding "completed" label, and closing the issue.

**gh: check task {issue-number}**: show task status including checklist completion, associated PRs and their status, and current labels.

**gh: audit workflow**: find and report issues/PRs with inconsistent labels or incomplete workflows (closed issues with "in progress", merged PRs with workflow labels, etc.).
