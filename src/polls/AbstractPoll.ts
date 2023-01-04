import _ from 'lodash';

import type {
    AnySelectMenuInteraction,
    ButtonInteraction,
    InteractionReplyOptions,
    ModalSubmitInteraction,
    User,
} from 'discord.js';

type Votes = Record<string, { user: User; choices: string[] }>;
type Choices = Array<{ id: string; name: string }>;

export default abstract class AbstractPoll<
    VoteInteraction extends ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction,
> {
    choices: Choices;
    votes: Votes = {};

    constructor(public config: { title: string; description?: string; choices: string }) {
        this.choices = this.config.choices
            .split(/\s*;\s*/)
            .map((name, index) => ({ name, id: this.getChoiceId(index) }));
    }

    protected abstract vote(interaction: VoteInteraction): false | void | Promise<false | void>;

    public abstract createMessage(): Omit<InteractionReplyOptions, 'flags'>;

    async handleVote(interaction: VoteInteraction) {
        if (this.vote(interaction) === false) return;
        await interaction.message!.edit(this.createMessage());
        await interaction.deferUpdate();
    }

    getChoiceId(index: number) {
        return 'choice_' + index;
    }

    getOrCreateUserVote(user: User) {
        let userVote = this.votes[user.id];

        if (!userVote) {
            userVote = this.votes[user.id] = {
                user,
                choices: [],
            };
        }

        return userVote;
    }

    getChoiceName = (choiceId: string) => _.find(this.choices, { id: choiceId })!.name;
}
