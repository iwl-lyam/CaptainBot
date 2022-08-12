const {api} = require("../util")

module.exports = {
	name: "help",
	
	execute(interaction) {
		const row = {
			type: 1,
			components: [
				{
					type: 3,
					custom_id: "select",
					options: [
						{ label: "No IATA/ICAO flight code", description: "Where to find the IATA/ICAO flight codes", value: "flights" },
						{ label: "No IATA/ICAO airport code", description: "Where to find the IATA/ICAO airport codes", value: "airports" },
						{ label: "Not found", description: "Your flight/airport was not found by the bot", value: "notfound" }
					],
					placeholder: "Help options"
				}
			]
		}
		if (interaction.type === 2) {
			let body = { type: 4, data: {components: [row]}}
			// console.log(body.components[0])
			api(`/interactions/${interaction.id}/${interaction.token}/callback`, {body: body})
		} else {
			if (interaction.data.values[0] == "flights") api(`/interactions/${interaction.id}/${interaction.token}/callback`, {body: {type: 7, data: {content: `A flight code is the airline designator, xx(a), and the numeric flight number, n(n)(n)(n), plus an optional one-letter "operational suffix" (s). The full format of a flight code is xx(a)n(n)(n)(n)(s).\nFor example, for an American Airlines flight with flight number of 1234 would have the IATA code of AA1234.\nIf you are at an airport or on a flight, you can usually find your flight's IATA code on your boarding pass at the top. If you don't know a flight though, you can use a flight tracking service like FlightRadar24 or our departures command to find a flight.`}}}) 
			else if (interaction.data.values[0] == "airports") api(`/interactions/${interaction.id}/${interaction.token}/callback`, {body: {type: 7, data: {content: `An airport code consists of three letters or four letters (IATA and ICAO respectively) which usually (but not always) show the region the airport is in. You can find codes on the list at https://en.wikipedia.org/wiki/Lists_of_airports_by_IATA_and_ICAO_code or searching the airport online.\nFor example at London Heathrow, the IATA code is LHR.`}}})
			else if (interaction.data.values[0] == "notfound") api(`/interactions/${interaction.id}/${interaction.token}/callback`, {body: {type: 7, data: {content: `We're sorry that your plane/airport was not found. To get aviation data, we use AirLabs (one of the most widely used aviation APIs), although unfortunately they seem to have many inaccuracies in their data particually with smaller airlines and flights in the eastern hemisphere. If I had more time to work with in the bot jam this bot was created with, I would have applied and payed for the FlightTracker24 API which is a lot more reliable. Once again, we're really sorry this happened as it's out of our control.`}}})
		}
	}
}