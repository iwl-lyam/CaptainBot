const { token } = require('./config.json');
const {WebSocket} = require("ws")
const fetch = require("node-fetch")
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
	let commandName = payload.d.data.name
	eval(`require("./commands/${commandName}.js").execute(payload.d)`)
}

// OLD CODE

// const fs = require('node:fs');
// const path = require('node:path');
// const { Client, Collection, GatewayIntentBits } = require('discord.js');

// const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// client.commands = new Collection();
// const commandsPath = path.join(__dirname, 'commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// for (const file of commandFiles) {
// 	const filePath = path.join(commandsPath, file);
// 	const command = require(filePath);
// 	client.commands.set(command.name, command);
// }

// client.once('ready', () => {
// 	console.log('Ready!');
// });

// client.on('interactionCreate', async interaction => {
// 	const command = client.commands.get(interaction.commandName || "help");

// 	if (!command) return;

// 	try {
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(error);
// 		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// 	}
// });

// client.login(token)



