import discordClient from "./lib/discord.js"
import { getRegistrationTable, getAllRecords } from "./lib/airtable.js"

const run = async () => {
	const discord = await discordClient
	const guilds = await discord.guilds.fetch()
	console.log(`Guildy`, guilds)

	const registrationTable = await getRegistrationTable()
	const rows = await getAllRecords(
		registrationTable.select({
			view: `Grid view`,
		})
	)
	console.log(`Table:`, rows)
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
