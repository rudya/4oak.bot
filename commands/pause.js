const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('pause song')
		.addStringOption(option =>
            option.setName('state')
                .setDescription('on or off')
                .setRequired(true)),
	async execute(interaction, player) {
		const input = interaction.options.data[0].value;
        player.pause(input);
		await interaction.reply('pausing song');
	},
};