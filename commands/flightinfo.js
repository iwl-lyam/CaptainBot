const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js')
const fetch = require('node-fetch')
const {apikey} = require("../config.json")
const maps = require("staticmaps")

module.exports = {
	name: "flightinfo",
	command: new SlashCommandBuilder()
		.setName('flightinfo')
		.setDescription('Information for a flight')
		.addStringOption(option => option.setName("icao").setDescription("ICAO code of the flight"))
		.addStringOption(option => option.setName("reg").setDescription("Registration number of the aircraft")),

	async execute(interaction) {
		let id = interaction.options.getString('icao') || interaction.options.getString('reg')
		if (!id) return interaction.reply("You must pass a flight ICAO code or registration number of the aircraft!")
		await interaction.deferReply()
		let icao = !!interaction.options.getString('icao')
		let reg = !!interaction.options.getString('reg')
		let link = `https://airlabs.co/api/v9/flights?api_key=${apikey}&${icao ? "flight_icao="+id+"&" : ""}${reg ? "reg_number="+id+"&" : ""}`

		fetch(link).then(r => r.json()).then(async res => {
			if (res.response[1]) return interaction.editReply("There are multiple flights with this ICAO/reg!")
			if (!res.response[0]) return interaction.editReply("There are no flights with this ICAO/reg!")
			let flight = res.response[0]

			const options = {
			  width: 600,
			  height: 400
			};
			const map = new maps(options);
			
			const marker = {
				img: `https://banner2.cleanpng.com/20190712/kzt/kisspng-google-maps-pin-location-computer-icons-dn-salonu-dn-salonlar-nirvana-dav-5d28cfd8ce5b01.1405064115629557368452.jpg`, // can also be a URL
			  width: 900,
			  height: 900,
			  coord : [13.437524,52.4945528]
			};
			map.addMarker(marker);
			
			await map.render()
			map.image.save("./"+id+".png").then(() => {

				const mapimg = new AttachmentBuilder(`../${id}.png`);
				interaction.editReply({
					embeds: [ new EmbedBuilder()
							.setTitle("Current flight information for " + id)
							.setFields(
								{ name: "Country", value: flight.flag, inline: true },
								{ name: "Altitude", value: Math.floor(flight.alt * 3.28084) + " ft", inline: true },
								{ name: "Speed", value: Math.floor(flight.speed / 1.852) + " kt", inline: true },
								{ name: "Heading", value: flight.dir + "°", inline: true }
							)
						 	.setImage(`attachment://${id}.png`)
					],
					files: [mapimg]
				})
			})
		})
		
	}
}