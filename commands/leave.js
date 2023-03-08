const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Make 4oak.bot leave the current voice channel'),
	async execute(interaction, player) {
        player.destroy();
		await interaction.reply('until next time!');
	},
};