const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('pause song'),
	async execute(interaction, player) {
        player.pause();
		await interaction.reply('pausing song');
	},
};