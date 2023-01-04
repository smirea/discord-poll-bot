import { ApplicationCommandOptionType } from 'discord.js';
import _ from 'lodash';
import SimplePoll from 'src/polls/SimplePoll';

import createCommand from './createCommand';

const polls: Record<string, SimplePoll> = {};

const PollCommand = createCommand({
    name: 'poll',
    description: 'Create a simple poll',

    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'title',
            description: 'The name of your poll',
            required: true,
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'choices',
            description: 'List choices, separated by semicolons (;)',
            required: true,
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'description',
            description: 'Optional description',
        },
    ] as const,

    run(interaction) {
        const { args } = interaction;
        const choiceList = args.choices.split(/\s*;\s*/).filter(x => x);

        if (choiceList.length <= 1) {
            return interaction.reply({
                ephemeral: true,
                content: 'You must enter more than once choice',
            });
        }

        polls[interaction.id] = new SimplePoll(args);

        return interaction.reply(polls[interaction.id].createMessage());
    },

    handleButton(interaction) {
        const poll = polls[interaction.message.interaction?.id ?? 'noop'];

        if (!poll) {
            return interaction.reply({
                ephemeral: true,
                content: 'I cannot find this poll anymore 🐼',
            });
        }

        return poll.handleVote(interaction);
    },
});

export default PollCommand;
