const {token} = require("./config.json")
const fetch = require("node-fetch")
const consola = require("consola")

async function getApi(endpoint, json) {
	let s = await fetch("https://discord.com/api/v10"+endpoint, {
		method: "GET",
		headers: {
			Authorization: "Bot " + token,
			"Content-Type": "application/json"
		}
	})
	if (s.ok) consola.success(`GET ${endpoint} ${s.status} ${s.statusText}`)
	else consola.warn(`GET ${endpoint} ${s.status} ${s.statusText}`)
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

	if (s.ok) consola.success(`${options.method||"POST"} ${endpoint} ${s.status} ${s.statusText}`)
	else consola.warn(`${options.method||"POST"} ${endpoint} ${s.status} ${s.statusText}`)
	
	if (json) return await s.json()
}

module.exports = {
	getApi,
	api
}