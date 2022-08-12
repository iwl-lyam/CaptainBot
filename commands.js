const {api} = require("./util")

let departures = {
	"name": "departures",
	"description": "Get departure times at an airport",
	"options": [
		{
			"type": 3,
			"name": "iata",
			"description": "IATA code of the airport"
		},
		{
			"type": 4,
			"name": "amount",
			"description": "Amount of departures to show"
		}
	]
}
let flightinfo = {
  "name": "flightinfo",
  "description": "Information for a flight",
  "options": [
    {
      "type": 3,
      "name": "iata",
      "description": "IATA code of the flight"
    },
    {
      "type": 3,
      "name": "icao",
      "description": "ICAO code of the flight"
    }
  ]
}
let help = {
  "name": "help",
  "description": "Help with commands",
  "options": []
}

function refresh() {
	console.log("Refreshing global application commands:")

	api("/applications/1004089749046317177/commands", {
		method: "POST",
		body: departures
	}, true).then(e=>console.log(e.name))
	api("/applications/1004089749046317177/commands", {
		method: "POST",
		body: flightinfo
	}, true).then(e=>console.log(e.name))
	api("/applications/1004089749046317177/commands", {
		method: "POST",
		body: help
	}, true).then(e=>console.log(e.name))
}
module.exports = refresh
