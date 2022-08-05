const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	name: "airline",
	command: new SlashCommandBuilder()
		.setName("airline")
		.setDescription("Get information about an airline")
		.addStringOption(option => option.setName("iata").setDescription("IATA code of the airline"))
		.addStringOption(option => option.setName("callsign").setDescription("Airline's callsign"))
		.addStringOption(option => option.setName("name").setDescription("Name of the airline")),

	execute(interaction) {
		interaction.reply("no")
	}
}