import discordClient from "../../discord.js"
import { getRegistrationTable, getAllRecords } from "../../airtable.js"

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

export default run
