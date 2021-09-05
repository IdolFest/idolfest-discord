import { Discord as DiscordOptions } from "./options.js"
import { Client, Intents } from "discord.js"
import { once } from "events"

const getClient = new Promise(resolve => {
	const client = new Client({
		intents: [Intents.FLAGS.GUILDS],
	})

	client.once(`ready`, () => {
		console.log(`Discord is connected`)
	})

	client.login(DiscordOptions.botToken)
	resolve(client)
}).then(async client => {
	await once(client, `ready`)
	return client
})

export default getClient
