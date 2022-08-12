const {token} = require("./config.json")
const fetch = require("node-fetch")

async function getApi(endpoint, json) {
	let s = await fetch("https://discord.com/api/v10"+endpoint, {
		method: "GET",
		headers: {
			Authorization: "Bot " + token,
			"Content-Type": "application/json"
		}
	})
	if (json) return await s.json()
}
async function api(endpoint, options, json) {
	let s = await fetch("https://discord.com/api/v10"+endpoint, {
		method: options.method || "POST",
		headers: {
			Authorization: "Bot " + token,
			"Content-Type": "application/json",
			...options.headers
		},
		body: JSON.stringify(options.body)
	})
	if (json) return await s.json()
}

module.exports = {
	getApi,
	api
}