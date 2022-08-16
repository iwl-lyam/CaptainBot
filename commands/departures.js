const {apikey, appid} = require("../config.json")
const {api} = require("../util")
const fetch = require("node-fetch")


module.exports = {
	name: "departures",

	async execute(interaction) {

		await api(`/interactions/${interaction.id}/${interaction.token}/callback`, { body: {type: 5} }, false)

		if (interaction.options["amount"] > 10 && interaction.options["amount"]) return api(`/webhooks/${appid}/${interaction.token}`, {method: "POST", body: {content:"Amount must be below 10!"}})

		const link = `https://airlabs.co/api/v9/schedules?api_key=${apikey}&dep_iata=${interaction.options["iata"]}`
		console.log(link)
		fetch(link).then(p => p.json()).then(res => {
			let r = res.response
			let f = {}
			let embeds = []
			let amount = interaction.options["amount"] || 5
			let gates = []

			if (!r[0]) return api(`/webhooks/${appid}/${interaction.token}`, {body: {content: "The specified airport was not found."}})
			let actual = 1
			
			for (let i = 0; i < amount; i++) {
				f = r[i]
				if (!f) continue
				if ((f['dep_time_ts'] || f['dep_time_ts'] || 0) < Math.floor(Date.now() / 1000)) {
					amount++
					continue
				}
				if (f['cs_flight_iata'] || !(f['flight_icao'] || f['flight_iata'])) {
					amount++
					continue
				}
				if (gates.includes((f['dep_terminal'] || "")+(f['dep_gate'] || ""))) {
					amount++
					continue
				}
				gates.push((f['dep_terminal'] || "")+(f['dep_gate'] || ""))
				let e = {
					title: "Page " + actual,
					fields: [
						{ name: "Airline", value: f['airline_icao'] || f['airline_iata'] || "None", inline: true },
						{ name: "Flight ICAO", value: f['flight_icao'] || f['flight_iata'] || "None", inline: true },
						{ name: "Departure", value: `Terminal ${f['dep_terminal'] || "N/A"} (gate ${f['dep_gate'] || "N/A"})`, inline: true },
						{ name: `Arrival at ${f['arr_iata'] || "N/A"} (${f['arr_icao']||"N/A"})` , value: `Terminal ${f['arr_terminal'] || "N/A"} (gate ${f['arr_gate'] || "N/A"})`, inline: true },
						{ name: "Arrival baggage belt", value: f['arr_baggage'] || "Not decided", inline: true },
						{ name: "ETD (Estimated Time of Departure)", value: f['dep_estimated_ts'] || f['dep_time_ts'] ? "<t:" + (f['dep_estimated_ts'] || f['dep_time_ts']) + ">" : "N/A", inline: true },
						{ name: "ETA (Estimated Time of Arrival)", value: f['arr_estimated_ts'] || f['arr_time_ts'] ? "<t:" + (f['arr_estimated_ts'] || f['arr_time_ts']) + ">" : "N/A", inline: true },
						{ name: "Delayed", value: (f['delayed'] || "N/A") + " minutes", inline: true },
						{ name: "Status", value: f['status'] || "N/A", inline: true }
					],
					color: 5635925
				}
				embeds.push(e)
				actual++
			}

			if (embeds.length > 10) return api(`/webhooks/${appid}/${interaction.token}`, {body:{content: "Amount must be below 10!"}})
			
			api(`/webhooks/${appid}/${interaction.token}`, {body:{content: "Departures are in order of Scheduled Time of Departure (instead of estimated), so they might appear out of order even though they aren't", embeds: embeds}})

		})		
	}
}
