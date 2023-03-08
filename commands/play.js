const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play music from a given YT url')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('youtube link')
                .setRequired(true)),
	async execute(interaction, player) {
        const input = interaction.options.data[0].value;
        const voiceChannel = interaction.member.voice.channel;
        player.play(voiceChannel);
		await interaction.reply('playing song: ' + input);
	},
};