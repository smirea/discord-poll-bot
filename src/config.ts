import path from 'path';

import dotenv from 'dotenv';

const root = __dirname.includes('/build/')
    ? path.join(__dirname, '..', '..')
    : path.join(__dirname, '..');

dotenv.config({ path: path.join(root, '.env.local') });
dotenv.config({ path: path.join(root, '.env') });

const config = {
    server: {
        port: env('number', 'PORT', 3000),
    },
    discord: {
        app: {
            id: env('string', 'DISCORD_APP_ID'),
            publicKey: env('string', 'DISCORD_APP_PUBLIC_KEY'),
        },
        bot: {
            token: env('string', 'DISCORD_BOT_TOKEN'),
            guildId: env('string', 'DISCORD_BOT_GUILD_ID'),
        },
    },
};

export default config;

global.console = new console.Console({
    stdout: process.stdout,
    stderr: process.stderr,
    groupIndentation: 4,
});

function env<T extends 'string' | 'number'>(
    type: T,
    name: string,
    defaultValue?: any,
): T extends 'number' ? number : string {
    const value = process.env[name] ?? defaultValue;
    if (value == null || value === '') throw new Error(`process.env.${name} is empty`);

    switch (type) {
        case 'number': {
            const v = parseFloat(value);
            if (Number.isNaN(v)) throw new Error(`process.env.${name} is not a number`);
            return v as any;
        }
        case 'string':
            return value;
        default:
            throw new Error(`env type "${type}" not handled`);
    }
}
