const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const fetch = require('node-fetch')
const {apikey} = require("../config.json")


module.exports = {
	name: "departures",
	
	command: new SlashCommandBuilder()
		.setName('departures')
		.addStringOption(option => option.setName("iata").setDescription("IATA of target airport").setRequired(true))				
		.addIntegerOption(option => option.setName("amount").setDescription("Amount of departures to show"))
		.setDescription('Get departure times at an airport'),

	async execute(interaction) {
		if (interaction.options.getInteger("amount") > 10 && interaction.options.getInteger("amount")) return interaction.reply({content:"Amount must be below 10!"})

		interaction.deferReply()
		
		fetch(`https://airlabs.co/api/v9/schedules?api_key=${apikey}&dep_iata=${interaction.options.getString("iata")}`).then(p => p.json()).then(res => {
			let r = res.response
			let f = {}
			let embeds = []
			let amount = interaction.options.getInteger("amount") || 5
			let actual = 1
			
			for (let i = 0; i < amount; i++) {
				f = r[i]
				if (f['cs_flight_iata']) {
					amount++
					continue
				}
				console.log("stuff")
				let e = new EmbedBuilder()
					.setTitle("Page " + (actual))
					.setFields(
						{ name: "Airline ICAO", value: f['airline_icao'], inline: true },
						{ name: "Flight number", value: f['flight_number'], inline: true },
						{ name: "Departure", value: `Terminal ${f['dep_terminal'] || "N/A"} (gate ${f['dep_gate'] || "N/A"}) @ <t:${f['dep_estimated_ts'] || f['dep_time_ts']}>`, inline: true },
						{ name: "Arrival at " + f['arr_iata'], value: `Terminal ${f['arr_terminal'] || "N/A"} (gate ${f['arr_gate'] || "N/A"}) @ <t:${f['arr_estimated_ts'] || f['arr_time_ts']}>`, inline: true },
						{ name: "Delayed", value: f['delay'] || "N/A", inline: true },
						{ name: "Status", value: f['status'] }
					)
				embeds.push(e)
				actual++
			}

			if (embeds.length > 10) return interaction.editReply({content: "Amount must be below 10!"})
			
			
			interaction.editReply({content: "Departures", embeds: embeds})
		})		
	}
}
