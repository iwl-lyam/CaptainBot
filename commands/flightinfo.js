const fetch = require('node-fetch')
const { apikey, appid } = require("../config.json")
const {api} = require("../util")

module.exports = {
	name: "flightinfo",

	async execute(interaction) {
		let id = interaction.options['icao'] || interaction.options['iata']
		if (!id) return api(`/interactions/${interaction.id}/${interaction.token}/callback`, {body: {content:"You must pass a flight ICAO or IATA code to identify the aircraft!"}})
		
		await api(`/interactions/${interaction.id}/${interaction.token}/callback`, { body: {type: 5} }, false)		
		
		let icao = !!interaction.options['icao']
		let link = `https://airlabs.co/api/v9/flights?api_key=${apikey}&${icao ? "flight_icao=" + id : "flight_iata=" + id}`

		fetch(link).then(r => r.json()).then(async res => {
			let flight = res.response[0]
			if (!flight) return api(`/webhooks/${appid}/${interaction.token}`, {body:{content:"There are no flights with this ICAO/IATA! (or, the service we are using doesn't cover this flight)"}})

			let embed = {
				title: "Current flight information for " + id,
				fields: [
					{ name: "Country", value: flight.flag, inline: true },
					{ name: "Registration", value: flight.reg_number, inline: true },
					{ name: "IACO 24-bit hex", value: flight.hex, inline: true },
					{ name: "Altitude", value: Math.floor(flight.alt * 3.28084) + " ft", inline: true },
					{ name: "Speed", value: Math.floor(flight.speed / 1.852) + " kt", inline: true },
					{ name: "Heading", value: flight.dir + "°", inline: true },
					{ name: "Co-ordinates", value: `${flight.lat},${flight.lng}`, inline: true },
					{ name: "Flight Number", value: flight.flight_number.toString(), inline: true },
					{ name: "Flight ICAO", value: flight.flight_icao, inline: true },
					{ name: "Flight IATA", value: flight.flight_iata || "N/A", inline: true },
					{ name: "Origin", value: `${flight.dep_iata} (${flight.dep_icao})`, inline: true },
					{ name: "Destination", value: `${flight.arr_iata} (${flight.arr_icao})`, inline: true },
					{ name: "Airline", value: `${flight.airline_icao} (${flight.airline_iata})`, inline: true },
					{ name: "Aircraft", value: `${flight.aircraft_icao}`, inline: true },
					{ name: "Status", value: `${flight.status}`, inline: true },
					{ name: "Last updated", value: `<t:${flight.updated}>`, inline: true }
				],
				color: 11163050
			}
		
			api(`/webhooks/${appid}/${interaction.token}`, {
				body: {
					embeds: [embed]
				}
			})
		})

	}
}