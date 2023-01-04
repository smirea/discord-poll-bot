import createCommand from './createCommand';

const TestCommand = createCommand({
    name: 'test',
    description: 'a new test',
    run(interaction) {
        return interaction.reply({
            ephemeral: true,
            content: 'I hear you',
        });
    },
});

export default TestCommand;
