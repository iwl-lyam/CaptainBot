const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const fetch = require('node-fetch')
const {apikey} = require("../config.json")

module.exports = {
	name: "flightinfo",
	command: new SlashCommandBuilder()
		.setName('flightinfo')
		.setDescription('Information for a flight')
		.addStringOption(option => option.setName("iata").setDescription("IATA code of the flight"))
		.addStringOption(option => option.setName("icao").setDescription("ICAO code of the flight"))
		.addStringOption(option => option.setName("reg").setDescription("Registration number of the aircraft")),

	async execute(interaction) {
		let id = interaction.options.getString('iata') || interaction.options.getString('icao') || interaction.options.getString('reg')
		if (!id) return interaction.reply("You must pass one of the following parameters: IATA code, ICAO code or registration number of the aircraft!")
		interaction.reply(id)
		
	}
}