const { token } = require('./config.json');
const {WebSocket} = require("ws")
const commands = require("./commands.js")

const GATEWAY = "wss://gateway.discord.gg/?v=10&encoding=json"

let gateway = new WebSocket(GATEWAY)

gateway.on('close', function error(data) {
	console.log(data)
})

gateway.on('message', function message(data) {
  let payload = JSON.parse(data.toString())

	switch (payload.op) {
		case 10:
			console.log("R 10 HELLO")
			gateway.send(JSON.stringify({"op": 1,"d": 251}))
			console.log("S 1 HB")
			gateway.send(JSON.stringify({
			  "op": 2,
			  "d": {
			    "token": token,
			    "intents": 513,
			    "properties": {
			      "os": "linux",
			      "browser": "funlib",
			      "device": "funlib"
			    }
				}
			}))
			console.log("S 2 IDENT")
			setInterval(() => {
				gateway.send(JSON.stringify({"op": 1,"d": 251}))
				console.log("S 1 HB")
			}, payload.d.heartbeat_interval)
			break;

		case 0:
			if (payload.t === "READY") {
				console.log("R 0 EVENT/READY")
				commands()
			}
			else if (payload.t === "INTERACTION_CREATE") interaction(payload)
			else console.log("R 0 EVENT")
			break;

		case 11:
			console.log("R 11 ACK")
			break;
	}
});

function interaction(payload) {
	let commandName = payload.d.data.name || "help"
	let options = {}
	if (payload.d.data.options) payload.d.data.options.forEach(option => options[option.name] = option.value)
	payload.d.options = options
	eval(`require("./commands/${commandName}.js").execute(payload.d)`)
}
