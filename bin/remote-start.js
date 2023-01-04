const { execSync } = require('child_process');

const commands = [
    // 'git fetch',
    // 'git reset --hard origin/master',
    // 'git pull',
    // 'NODE_ENV= yarn --frozen-lockfile',
    'yarn build',
    'yarn start',
];

for (const command of commands) {
    console.log('');
    console.log('-'.repeat(40));
    console.log('$>', command);
    console.log('-'.repeat(40));
    execSync(command, { stdio: 'inherit' });
}
