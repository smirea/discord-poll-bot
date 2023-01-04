import { ApplicationCommandType } from 'discord.js';
import _ from 'lodash';

import type {
    ApplicationCommandDataResolvable,
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ButtonInteraction,
    CommandInteraction,
    ModalSubmitInteraction,
    StringSelectMenuInteraction,
} from 'discord.js';

interface Handlers {
    handleButton?: (interaction: ButtonInteraction) => any;
    handleSelect?: (interaction: StringSelectMenuInteraction) => any;
    handleModal?: (interaction: ModalSubmitInteraction) => any;
}

export default function createCommand<Options extends readonly ApplicationCommandOptionData[]>(
    options: Handlers & {
        readonly name: string;
        readonly description: string;
        readonly options?: Options;
        run: (
            interaction: CommandInteraction & {
                args: {
                    [K in Options[number]['name']]: OptionType<Options[number] & { name: K }>;
                };
            },
        ) => any;
    },
) {
    return {
        ...options,
        type: ApplicationCommandType.ChatInput,
        run: interaction => {
            const child = Object.create(interaction);
            child.args = Object.fromEntries(
                interaction.options.data.map(item => [item.name, item.value]),
            );
            return options.run(child);
        },
    } as ApplicationCommandDataResolvable &
        Handlers & {
            run: (interaction: CommandInteraction) => any;
        };
}

type OptionType<Option extends ApplicationCommandOptionData> = Option extends {
    required: true;
}
    ? OptionBaseType<Option>
    : OptionBaseType<Option> | undefined;

type OptionBaseType<Option extends ApplicationCommandOptionData> =
    Option['type'] extends ApplicationCommandOptionType.String
        ? string
        : Option['type'] extends ApplicationCommandOptionType.Number
        ? number
        : Option['type'] extends ApplicationCommandOptionType.Boolean
        ? boolean
        : unknown;
