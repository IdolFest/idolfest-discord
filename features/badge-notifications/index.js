import discordClient from "../../lib/discord.js"
import { getRegistrationTable, getAllRecords } from "../../lib/airtable.js"
import { discordBadgeChannelId } from "../../lib/options.js"

const Constants = {
	PaidBadgesTable: `Paid Badges Only`,
	CountryColumn: `Country`,
	BadgeTypeColumn: `Badge Type`,
	HowHeardColumn: `How did you hear about us?`,
	IdColumn: `ID`,
}

const update = async () => {
	const discord = await discordClient

	const channel = await discord.channels.fetch(discordBadgeChannelId)

	const messages = await channel.messages.fetch({ limit: 1 })
	const lastBadgeId = messages.first().content.split(`ID: `)[1]?.trim()
	
	if (!lastBadgeId) {
		console.log(`ERROR: Please ensure the last message in the channel has a badge ID!`)
		return
	}

	const registrationTable = await getRegistrationTable()
	const rows = await getAllRecords(
		registrationTable.select({
			fields: [
				Constants.CountryColumn, 
				Constants.BadgeTypeColumn, 
				Constants.HowHeardColumn,
				Constants.IdColumn
			],
			view: Constants.PaidBadgesTable,
			sort: [{
				field: Constants.IdColumn, 
				direction: `asc`
			}],
			filterByFormula: `ID > ${parseInt(lastBadgeId)}`
		})
	)

	rows.map((badge) => {
		const message = `🎉🎉🎉 WE JUST SOLD A BADGE!\nBadge type: ${badge.fields[Constants.BadgeTypeColumn]}\nAttendee country: ${badge.fields[Constants.CountryColumn]}\nHow did they hear about us??: ${badge.fields[Constants.HowHeardColumn] || ``}\n_ID: ${badge.fields[Constants.IdColumn]}_`
		channel.send(message)
	})
}

const updateTimer = async () => {
	setInterval(update, 1000 * 60)
	return new Promise(() => {})
}

const run = () => Promise.all([update(), updateTimer()])

export default run
