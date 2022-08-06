const {SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder} = require('discord.js')

module.exports = {
	name: "help",
	command: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Help with commands"),
	execute(interaction) {
		const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId("select")
					.setPlaceholder("Help options")
					.addOptions(
						{ label: "No IATA/ICAO flight code", description: "Where to find the IATA/ICAO flight codes", value: "flights" },
						{ label: "No IATA/ICAO airport code", description: "Where to find the IATA/ICAO airport codes", value: "airports" },
						{ label: "Not found", description: "Your flight/airport was not found by the bot", value: "notfound" }
					)
			)
		if (interaction.isChatInputCommand()) {
			interaction.reply({ components: [row] })
		} else {
			if (interaction.values[0] == "flights") interaction.update(`A flight code is the airline designator, xx(a), and the numeric flight number,j n(n)(n)(n), plus an optional one-letter "operational suffix" (s). The full format of a flight code is xx(a)n(n)(n)(n)(s).\nFor example, for an American Airlines flight with flight number of 1234 would have the IATA code of AA1234.\nIf you are at an airport or on a flight, you can usually find your flight's IATA code on your boarding pass at the top. If you don't know a flight though, you can use a flight tracking service like FlightRadar24 or our departures command to find a flight.`) 
			else if (interaction.values[0] == "airports") interaction.update(`An airport code consists of three letters or four letters (IATA and ICAO respectively) which usually (but not always) show the region the airport is in. You can find codes on the list at https://en.wikipedia.org/wiki/Lists_of_airports_by_IATA_and_ICAO_code or searching the airport online.\nFor example at London Heathrow, the IATA code is LHR.`)
			else if (interaction.values[0] == "notfound") interaction.update(`We're sorry that your plane/airport was not found. To get aviation data, we use AirLabs (one of the most widely used aviation APIs), although unfortunately they seem to have many inaccuracies in their data particually with smaller airlines and flights in the eastern hemisphere. If I had more time to work with in the bot jam this bot was created with, I would have applied and payed for the FlightTracker24 API which is a lot more reliable. Once again, we're really sorry this happened as it's out of our control.`)
		}
	}
}