const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const fetch = require('node-fetch')
const {apikey} = require("../config.json")

module.exports = {
	name: "flightinfo",
	command: new SlashCommandBuilder()
}