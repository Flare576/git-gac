# git-gac

A Git Add Commit tool that streamlines your git workflow by combining file staging and committing into a single command.

## Installation

```bash
npm install -g git-gac
```

## Usage

After installation, you can use any of these equivalent commands:
- `gac` - The short form
- `git-gac` - The full name  
- `git gac` - Git integration (works automatically!)

### Basic Examples

```bash
# Add all files and open interactive commit
gac

# Add all files and commit with message
gac -m "Fix bug in user authentication"

# Switch to branch, add files, and commit
gac -b feature-branch -m "Add new feature"

# Add specific files only
gac -f src/app.js src/utils.js

# Amend the last commit
gac -a

# Push after commit
gac -m "Ready for review" -p
```

### All Options

- `-a, --amend` - Amend the previous commit
- `-b, --branch` - Switch to this branch first, then continue
- `-f, --file` - List of specific files to add (defaults to all)
- `-F, --fileSkip` - List of files to ignore/skip
- `-i, --interactive` - Use git add's patch mode
- `-m, --message` - Commit message (omit for verbose commit editor)
- `-n, --no-verify` - Skip git hooks during commit
- `-s, --skip` - Skip adding files (commit only)
- `-t, --talisman` - Run Talisman security scan
- `-p, --push` - Push to origin after successful commit
- `-r, --pullRequest` - Create pull request after commit (requires hub)
- `-u, --updateOnly` - Only add tracked files (ignore untracked)

### Advanced Examples

```bash
# Interactive staging then commit
gac -i

# Amend last commit with new files
gac -a -f newfile.js

# Add all except certain files
gac -F package-lock.json -F *.log

# Branch, commit, and push in one command
gac -b hotfix -m "Critical security fix" -p

# Update only tracked files and push
gac -u -m "Update dependencies" -p
```

## Migration from Homebrew

If you previously installed via Homebrew:

```bash
brew uninstall flare576/scripts/gac
npm install -g git-gac
```

All your existing `gac` commands will work exactly the same!

## License

MIT