#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { execSync, spawnSync, spawn } from 'child_process';

const version = "1.0.0"
const usage = `Adds specified files (or all if none specified) to git staging and commits (if -m used) or starts a \
verbose commit.`;

const argv = yargs(hideBin(process.argv))
  .strict()
  .usage("$0", usage)
  .version(version)
  .alias('help', 'h')
  .alias('version', 'v')
  .option( 'amend', { alias: 'a', type: 'boolean', description: 'Flag to ammend previous commit' })
  .option( 'branch', { alias: 'b', type: 'string', description: 'swich to this branch first, then continue' })
  .option( 'file', { alias: 'f', type: 'array', description: 'List of files to add, defaults to `.`' })
  .option( 'fileSkip', { alias: 'F', type: 'array', description: 'List of files to IGNORE' })
  .option( 'interactive', { alias: 'i', type: 'boolean', description: 'Use Patch mode of git add' })
  .option( 'message', { alias: 'm', type: 'string', description: 'Message to pass to commit. Omit for -v' })
  .option( 'no-verify', {alias: 'n', type: 'boolean', description: 'Passed through to git commit' })
  .option( 'skip', { alias: 's', type: 'boolean', description: 'Skip Adding files' })
  .option( 'talisman', { alias: 't', type: 'boolean', description: 'Run Talisman interactive scan' })
  .option( 'push', { alias: 'p', type: 'boolean', description: 'Flag to push after commit' })
  .option( 'pullRequest', { alias: 'r', type: 'boolean', description: 'Flag to start a PR after commit' })
  .option( 'updateOnly', { alias: 'u', type: 'boolean', description: 'Flag to ignore untracked files' })
  .example( 'gac', 'Adds all files/subfolder files, then opens a verbose commit' )
  .example( 'gac -b new-stuff', 'Switch (and create if necessary) to `new-stuff` branch, add all files/subfolder files, then open verbose commit' )
  .example( 'gac -a', 'Adds all files/subfolder files, then opens the LAST commit in ammend/verbose' )
  .example( 'gac -ua', 'Adds TRACKED files/subfolder files, then opens the LAST commit in amment/verbose' )
  .example( 'gac -f myFile', 'Adds `myFile` to stage, then opens verbose commit' )
  .example( 'gac -nf myFile', 'Adds `myFile` to stage, skips verification, then opens verbose commit' )
  .example( 'gac -sp', 'Only pushes to origin' )
  .example( 'gac -sa', 'Opens last commit as ammend in verbose mode' )
  .example( 'gac -a -f myFile', 'Removes all files from last commit, adds only myFile, opens new commit with prior ' +
    'message in amend mode' )
  .parseSync();

const eOpt = { encoding: 'utf8' };
const sOpt = { stdio: [ 'inherit', 'inherit', 'pipe' ] } ;

(async () => {
  const customFileAmendFlag = argv.amend && (argv.file || argv.fileSkip);
  if (argv.branch) {
    execSync(`git switch -c ${argv.branch}`)
  }
  if (!argv.skip) {
    // if an Amend commit is being done with a file listing, need to be sure we're getting the new listing
    if (customFileAmendFlag) {
      execSync('git reset --soft HEAD^', eOpt);
      execSync('git restore --staged .', eOpt);
    }

    let files = '.';
    if (argv.file) {
      files = argv.file.join(' ');
    }

    if (argv.updateOnly) {
      execSync(`git add -u ${files}`, eOpt);
    } else if (argv.interactive) {
      execSync(`git add -p ${files}`, sOpt);
    } else {
      execSync(`git add ${files}`, eOpt);
    }

    if (argv.fileSkip) {
      execSync(`git reset ${argv.fileSkip.join(' ')}`, eOpt);
    }

    if (customFileAmendFlag) {
      execSync('git commit --no-edit -c ORIG_HEAD', eOpt);
    }
  }

  if (argv.talisman) {
    const result = spawnSync('talisman',[ '--interactive', '--githook', 'pre-commit' ], sOpt);
    if (result.error) {
      console.log('Error calling Talisman. Ensure it is installed.');
    }
  }

  let childArgs = ['commit', '--verbose'];
  if (argv.amend) {
    childArgs.push('--amend');
  }
  if (argv.message) {
    childArgs.push(`-m ${argv.message}`);
  }
  if (argv.noVerify) {
    childArgs.push('-n');
  }

  let errors = '';
  const git = spawn('git', childArgs, sOpt);
  git.stderr.on('data', (data) => {
    errors+=data;
    console.log(data.toString('utf8'));
  });
  git.on('close', (code) => {
    if (code === 0
      || errors === ''
      || errors.includes('No changes detected')
    ) {
      if (argv.push){
        let cmd = 'git push';
        if (argv.amend) {
          cmd += ' -f';
        }
        execSync(cmd);
      }
      if(argv.pullRequest)
        spawn('hub', ['pull-request', '-p', '-c'], sOpt);
    }
  });
})();
