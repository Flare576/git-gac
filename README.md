# gac

Git Add/Commit (gac) is a command I started with as a small alias and evolved into what it is now, a slick script that
simplifies my git interactions.

## Installation

```
brew install flare576/scripts/gac
```

## Usage

My most common usages are
```
gac -a # amend previous commit after adding all changes
gac -f my.js src/firstSet.js tests/ofChanges # Create new commit using the files listed
gac # Create new commit after adding all changed files
gac -u # ignore untracked files during add/commit

