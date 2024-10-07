import discordClient from "../../lib/discord.js"
import { getAllRegistrationRecords } from "../../lib/nocodb.js"
import { discordStaffGuildID, discordBadgeStatsChannelId, discordBadgeStatsChannelId2 } from "../../lib/options.js"

const Constants = {
	BadgeTypeColumn: "Badge Type",
	PaymentTypeColumn: "Payment Type"
}

const update = async (event) => {
	const discord = await discordClient
	const guilds = await discord.guilds.fetch()
	const staffPartialGuild = await guilds.get(discordStaffGuildID)
	if (!staffPartialGuild) {
		return
	}
	const staffGuild = await staffPartialGuild.fetch()
	

	const rows = await getAllRegistrationRecords()
	const allCounts = {
		"6 to 12": 0,
		"Attendee": 0,
		"Spirit": 0,
		"Sponsor": 0, 
		"Super Sponsor": 0
	}
	rows.forEach(row => {
		if (typeof allCounts[row[Constants.BadgeTypeColumn]] !== 'undefined' && 
			row[Constants.PaymentTypeColumn] !== "Comped"
		) {
			++allCounts[row[Constants.BadgeTypeColumn]]
		}
	})
	staffGuild.channels.resolve(discordBadgeStatsChannelId).setName(`Slv: ${allCounts.Attendee} - Gld: ${allCounts.Sponsor} - Pr: ${allCounts["Super Sponsor"]}`)
	staffGuild.channels.resolve(discordBadgeStatsChannelId2).setName(`Child: ${allCounts["6 to 12"]} - Spirit: ${allCounts.Spirit}`)


}

const updateTimer = async (event) => {
	setInterval(() => update(event), 1000 * 60 * 5)
	return new Promise(() => {})
}

const run = () => Promise.all([
	update('nwif'), updateTimer('nwif')
])

export default run
