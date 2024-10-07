import discordClient from "../../lib/discord.js"
import { getAllRegistrationRecords } from "../../lib/nocodb.js"
import { discordAttendeeGuildID, discordBadgeStatsChannelId, discordBadgeStatsChannelId2 } from "../../lib/options.js"

const Constants = {
	BadgeTypeColumn: "Badge Type"
}

const update = async (event) => {
	const discord = await discordClient
	const guilds = await discord.guilds.fetch()
	const attendeePartialGuild = await guilds.get(discordAttendeeGuildID)
	if (!attendeePartialGuild) {
		return
	}
	const attendeeGuild = await attendeePartialGuild.fetch()
	

	const rows = await getAllRegistrationRecords()
	const allCounts = {
		"6 to 12": 0,
		"Attendee": 0,
		"Spirit": 0,
		"Sponsor": 0, 
		"Super Sponsor": 0
	}
	rows.forEach(row => {
		if (typeof allCounts[row[Constants.BadgeTypeColumn]] !== 'undefined') {
			++allCounts[row[Constants.BadgeTypeColumn]]
		}
	})
	attendeeGuild.channels.resolve(discordBadgeStatsChannelId).setName(`Slv: ${allCounts.Attendee} - Gld: ${allCounts.Sponsor} - Pr: ${allCounts["Super Sponsor"]}`)
	attendeeGuild.channels.resolve(discordBadgeStatsChannelId2).setName(`Child: ${allCounts["6 to 12"]} - Spirit: ${allCounts.Spirit}`)


}

const updateTimer = async (event) => {
	setInterval(() => update(event), 1000 * 60 * 5)
	return new Promise(() => {})
}

const run = () => Promise.all([
	update('nwif'), updateTimer('nwif')
])

export default run
