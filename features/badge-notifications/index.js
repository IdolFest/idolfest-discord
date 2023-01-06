import discordClient from "../../lib/discord.js"
import { getRegistrationTable, getAllRecords } from "../../lib/airtable.js"
import { discordBadgeChannelIdNwif, discordBadgeChannelIdScif, nodeEnv } from "../../lib/options.js"

const Constants = {
	PaidBadgesTable: `Paid Badges Only`,
	CountryColumn: `Country`,
	BadgeTypeColumn: `Badge Type`,
	HowHeardColumn: `How did you hear about us?`,
	IdColumn: `ID`,
}

const update = async (event) => {

	let discordBadgeChannelId = discordBadgeChannelIdNwif

	if (event.toLowerCase() === 'scif') {
		discordBadgeChannelId = discordBadgeChannelIdScif
	}

	const discord = await discordClient

	const channel = await discord.channels.fetch(discordBadgeChannelId)

	const messages = await channel.messages.fetch({ limit: 1 })
	const lastBadgeId = messages.first().content.split(`ID: `)[1]?.trim()
	
	if (!lastBadgeId) {
		console.log(`ERROR: Please ensure the last message in the channel has a badge ID!`)
		return
	}

	const registrationTable = await getRegistrationTable(event)
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
		const possibleWarning = nodeEnv === 'development' ? '⚠️ BOT TEST ⚠️\n\n' : ''
		const message = possibleWarning + `🎉🎉🎉 WE JUST SOLD A ${event.toUpperCase()} BADGE!\nBadge type: ${badge.fields[Constants.BadgeTypeColumn]}\nAttendee country: ${badge.fields[Constants.CountryColumn]}\nHow did they hear about us??: ${badge.fields[Constants.HowHeardColumn] || ``}\n_ID: ${badge.fields[Constants.IdColumn]}_`
		channel.send(message)
	})
}

const updateTimer = async (event) => {
	setInterval(() => update(event), 1000 * 60)
	return new Promise(() => {})
}

const run = () => Promise.all([update('nwif'), updateTimer('nwif'), update('scif'), updateTimer('scif')])

export default run
