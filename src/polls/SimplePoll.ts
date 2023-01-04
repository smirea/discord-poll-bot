import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    inlineCode,
    userMention,
} from 'discord.js';
import _ from 'lodash';

import AbstractPoll from './AbstractPoll';

import type { APIEmbedField, ButtonInteraction, InteractionReplyOptions } from 'discord.js';

export default class SimplePoll extends AbstractPoll<ButtonInteraction> {
    protected vote(interaction: ButtonInteraction) {
        const choiceId = interaction.customId;
        const userVote = this.getOrCreateUserVote(interaction.user);

        if (userVote.choices.includes(choiceId)) {
            userVote.choices = userVote.choices.filter(x => x !== choiceId);
        } else {
            userVote.choices.push(choiceId);
            userVote.choices = this.getSortedChoices(userVote.choices);
        }
    }

    getSortedChoices(choices: string[]) {
        return _.sortBy(choices, id => _.findIndex(this.choices, { id }));
    }

    public createMessage(): Omit<InteractionReplyOptions, 'flags'> {
        const rows: ActionRowBuilder[] = [];

        for (const chunk of _.chunk(this.choices, 5)) {
            rows.push(
                new ActionRowBuilder().addComponents(
                    ...chunk.map(({ id, name }) =>
                        new ButtonBuilder()
                            .setCustomId(id)
                            .setLabel(name)
                            .setStyle(ButtonStyle.Secondary),
                    ),
                ),
            );
        }

        const userTallies = this.getUserTallies();
        const optionTallies = this.getOptionTallies();

        const embedFields: APIEmbedField[] = [
            {
                name: 'Options',
                value: Object.values(this.choices)
                    .map(x => '— ' + x.name)
                    .join('\n'),
            },
        ];

        if (userTallies.length) {
            embedFields.push({
                name: 'Votes by user',
                value: userTallies.join('\n'),
            });
        }

        if (optionTallies.length) {
            embedFields.push({
                name: 'Votes by option',
                value: optionTallies.join('\n'),
            });
        }

        return {
            components: [...rows] as any,
            embeds: [
                new EmbedBuilder()
                    .setTitle(this.config.title)
                    .setDescription(this.config.description || null)
                    .setFields(embedFields),
            ],
        };
    }

    getUserTallies() {
        return Object.values(this.votes)
            .filter(x => x.choices.length)
            .map(v => {
                const list = v.choices.map(this.getChoiceName);
                return (
                    `\`[${v.choices.length.toString().padStart(2)}]\` ` +
                    userMention(v.user.id) +
                    ': ' +
                    list.join(', ')
                );
            });
    }

    getOptionTallies() {
        const groups = _.groupBy(
            Object.values(this.votes)
                .filter(x => x.choices.length)
                .map(x => x.choices.map(value => ({ value, user: x.user })))
                .flat(),
            'value',
        );

        return _.sortBy(Object.values(groups), x =>
            _.findIndex(this.choices, { id: x[0].value }),
        ).map(
            list =>
                '[' +
                inlineCode(list.length.toString().padStart(2)) +
                '] ' +
                this.getChoiceName(list[0].value) +
                ': ' +
                _.sortBy(list, 'user.tag')
                    .map(x => userMention(x.user.id))
                    .join(', '),
        );
    }
}
