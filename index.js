import getDiscordClient from "./lib/discord.js"

const run = async () => {
	const discord = await getDiscordClient()
	const guilds = await discord.guilds.fetch()
	guilds.each(guild => console.log(`GUILD '${guild.id}' named '${guild.name}':`, guild))
	console.log(`Discord client is ready: `, guilds)
}

run().then(
	() => {
		process.exit(0)
	},
	err => {
		console.error(`ERROR:`, err)
		process.exit(1)
	}
)
