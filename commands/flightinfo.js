const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const fetch = require('node-fetch')
const {apikey} = require("../config.json")

module.exports = {
	name: "flightinfo",
	command: new SlashCommandBuilder()
		.setName('flightinfo')
		.setDescription('Information for a flight')
		.addStringOption(option => option.setName("icao").setDescription("ICAO code of the flight"))
		.addStringOption(option => option.setName("iata").setDescription("IATA code of the flight")),

	async execute(interaction) {
		let id = interaction.options.getString('icao') || interaction.options.getString('iata')
		if (!id) return interaction.reply("You must pass a flight ICAO or IATA code to identify the aircraft!")
		await interaction.deferReply()
		let icao = !!interaction.options.getString('icao')
		let reg = !!interaction.options.getString('iata')
		let link = `https://airlabs.co/api/v9/flights?api_key=${apikey}&${icao ? "flight_icao="+id : "flight_iata="+id}`
		let link2 = `https://airlabs.co/api/v9/flight?api_key=${apikey}&${icao ? "flight_icao="+id : "flight_iata="+id}`

console.log(link)
		fetch(link).then(r => r.json()).then(async res => {
			let flight = res.response[0]
			if (!flight) return interaction.editReply("There are no flights with this ICAO/IATA!")
			
			interaction.editReply({
				embeds: [ new EmbedBuilder()
						.setTitle("Current flight information for " + id)
						.setFields(
							{ name: "Country", value: flight.flag, inline: true },
							{ name: "Registration", value: flight.reg_number, inline: true },
							{ name: "IACO 24-bit hex", value: flight.hex, inline: true },
							{ name: "Altitude", value: Math.floor(flight.alt * 3.28084) + " ft", inline: true },
							{ name: "Speed", value: Math.floor(flight.speed / 1.852) + " kt", inline: true },
							{ name: "Heading", value: flight.dir + "°", inline: true },
							{ name: "Co-ordinates", value: `${flight.lat},${flight.lng}`, inline: true },
							{ name: "Flight Number", value: flight.flight_number.toString(), inline: true },
							{ name: "Flight ICAO", value: flight.flight_icao, inline: true },
							{ name: "Flight IATA", value: flight.flight_iata, inline: true },
							{ name: "Origin", value: `${flight.dep_iata} (${flight.dep_icao})`, inline: true },
							{ name: "Destination", value: `${flight.arr_iata} (${flight.arr_icao})`, inline: true },
							{ name: "Airline", value: `${flight.airline_icao} (${flight.dep_iata})`, inline: true },
							{ name: "Aircraft", value: `${flight.aircraft_icao}`, inline: true },
							{ name: "Status", value: `${flight.status}`, inline: true },
							{ name: "Last updated", value: `<t:${flight.updated}>`, inline: true }
						)
				]
			})
		})
		
	}
}