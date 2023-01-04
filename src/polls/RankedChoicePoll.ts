import {
    ActionRowBuilder,
    bold,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    inlineCode,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    userMention,
} from 'discord.js';
import _ from 'lodash';
import rankedChoiceAlgorithm from 'src/utils/rankedChoiceAlgorithm';

import AbstractPoll from './AbstractPoll';

import type {
    APIEmbedField,
    ButtonInteraction,
    InteractionReplyOptions,
    ModalSubmitInteraction,
} from 'discord.js';

/**
 * Couldn't find a better UX with the tools available right now
 * - cannot put a Text field inside a message
 * - cannot easily re-order options in anything else other than a text field
 * - selects are too clunky to wait for each one to update after each selection, annoying af to reorder
 */
export default class RankedChoicePoll extends AbstractPoll<ModalSubmitInteraction> {
    protected async vote(interaction: ModalSubmitInteraction) {
        const userVote = this.getOrCreateUserVote(interaction.user);

        const votes = interaction.fields
            .getTextInputValue('vote')
            .toUpperCase()
            .replace(/[^a-z]/gi, '')
            .split('');

        const validVotes = _.range(this.choices.length).map(i => String.fromCharCode(65 + i));
        const invalid: string[] = [];
        for (const ch of votes) {
            if (!validVotes.includes(ch)) invalid.push(ch);
        }

        const counts = _.countBy(votes.filter(x => validVotes.includes(x)));
        const duplicates: string[] = [];
        for (const [ch, count] of Object.entries(counts)) {
            if (count !== 1) duplicates.push(ch);
        }

        if (!invalid.length && !duplicates.length) {
            userVote.choices = votes.map(letter => this.getChoiceId(letter.charCodeAt(0) - 65));
            return;
        }

        const fields: APIEmbedField[] = [];
        if (duplicates.length) {
            fields.push({
                name: '❌ Fraudulent duplicate votes: ',
                value: duplicates.join(', '),
            });
        }
        if (invalid.length) {
            fields.push({
                name: '❌ No write-in votes allowed: ',
                value: _.uniq(invalid).join(', '),
            });
        }
        await interaction.reply({
            ephemeral: true,
            embeds: [
                new EmbedBuilder()
                    .setTitle('🚨 Could not submit your votes')
                    .setColor('Red')
                    .setFields([
                        ...fields,
                        {
                            name: '📝 Allowed votes:',
                            value: validVotes.join(', '),
                        },
                    ]),
            ],
        });
        return false;
    }

    async handleOpenModal(interaction: ButtonInteraction) {
        const references = Object.values(this.choices)
            .map((x, i) => String.fromCharCode(65 + i) + ' — ' + x.name)
            .join('\n');
        await interaction.showModal(
            new ModalBuilder()
                .setCustomId('modal')
                .setTitle(this.config.title)
                .setComponents([
                    new ActionRowBuilder().setComponents(
                        new TextInputBuilder()
                            .setCustomId('vote')
                            .setLabel('Submit your vote')
                            .setPlaceholder('Your preferences, in order, e.g: B A C D')
                            .setStyle(TextInputStyle.Short),
                    ) as any,
                    new ActionRowBuilder().setComponents(
                        new TextInputBuilder()
                            .setCustomId('idontcare')
                            .setLabel('References (do not edit)')
                            .setPlaceholder(references)
                            .setStyle(TextInputStyle.Paragraph)
                            .setValue(references),
                    ) as any,
                ]),
        );
    }

    public createMessage(): Omit<InteractionReplyOptions, 'flags'> {
        const embedFields: APIEmbedField[] = [
            {
                name: 'Options',
                value: Object.values(this.choices)
                    .map((x, i) => inlineCode(`[${String.fromCharCode(65 + i)}]`) + ' ' + x.name)
                    .join('\n'),
            },
        ];

        if (!_.isEmpty(this.votes)) {
            const indexedVotes = _.map(this.votes, 'choices');
            const election = rankedChoiceAlgorithm(indexedVotes);

            embedFields.push({
                name: `${_.size(this.votes)} Submissions`,
                value: Object.values(this.votes)
                    .map(
                        ({ user, choices }) =>
                            inlineCode('[' + choices.length.toString().padStart(2) + ']') +
                            ' ' +
                            userMention(user.id) +
                            ': ' +
                            choices.map(this.getChoiceName).join(', '),
                    )
                    .join('\n'),
            });

            if (election.result) {
                embedFields.push({
                    name: '🎉 Current Winner',
                    value:
                        bold(this.getChoiceName(election.result)) +
                        ` after ${election.rounds.length} rounds`,
                });
            } else {
                embedFields.push({
                    name: '❌ Current Winner',
                    value: 'Cannot figure it out 🐼',
                });
            }
        }

        return {
            components: [
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                        .setCustomId('open-modal')
                        .setLabel('Vote')
                        .setStyle(ButtonStyle.Primary),
                ),
            ] as any,
            embeds: [
                new EmbedBuilder()
                    .setTitle(this.config.title)
                    .setDescription(this.config.description || null)
                    .setFields(embedFields),
            ],
        };
    }
}
