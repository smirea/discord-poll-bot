import { Client, GatewayIntentBits } from 'discord.js';
import _ from 'lodash';

import PollCommand from './commands/PollCommand';
import RankedChoicePollCommand from './commands/RankedChoicePoll';
import TestCommand from './commands/TestCommand';
import config from './config';

const commands = [PollCommand, RankedChoicePollCommand, TestCommand];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
    ],
});

export default client;

void client.login(config.discord.bot.token);

client.on('ready', async () => {
    if (!client.user || !client.application) {
        return;
    }

    await client.application.commands.set(commands);
    console.log(`${client.user.username} is online`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        const cmd = _.find(commands, {
            name: interaction.message.interaction!.commandName,
        })!;
        cmd.handleButton!(interaction);
        return;
    }

    if (interaction.isModalSubmit()) {
        const cmd = _.find(commands, {
            name: interaction.message!.interaction!.commandName,
        })!;
        cmd.handleModal!(interaction);
        return;
    }

    if (interaction.isStringSelectMenu()) {
        const cmd = _.find(commands, {
            name: interaction.message.interaction!.commandName,
        })!;
        cmd.handleSelect!(interaction);
        return;
    }

    if (interaction.isCommand()) {
        const cmd = _.find(commands, { name: interaction.commandName });

        if (!cmd) {
            await interaction.reply({
                ephemeral: true,
                content: `No idea what this command is: \`${interaction.commandName}\``,
            });
            return;
        }

        await cmd.run(interaction);
        return;
    }
});
