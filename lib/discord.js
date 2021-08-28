import { Discord as DiscordOptions } from "./options.js"
import { Client, Intents } from "discord.js"

const client = new Client({
	intents: [Intents.FLAGS.GUILDS],
})

client.once(`ready`, () => {
	console.log(`Discord is connected`)
})

client.login(DiscordOptions.botToken)

export default client
