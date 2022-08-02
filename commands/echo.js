const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "echo",
	command: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Replies with your input!')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The input to echo back')
				.setRequired(true)),

	execute(interaction) {
		interaction.reply({content:"No"})
	}
}
