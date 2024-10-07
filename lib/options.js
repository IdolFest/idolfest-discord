import { config as dotenv } from "dotenv"
dotenv()

const assertToken = (str, validate = x => typeof x !== 'undefined', map = x => x) => {
	const value = process.env[str]
	if (!validate(value)) {
		console.info('blah', value, process.env)
		throw new Error(`Invalid environment variable for ${str}`)
	}
	return map(value)
}

const discordBotToken = assertToken(`DISCORD_BOT_TOKEN`)
const discordAttendeeGuildID = assertToken(`DISCORD_ATTENDEE_GUILD_ID`)
const discordStaffGuildID = assertToken(`DISCORD_STAFF_GUILD_ID`)
const discordAirtableBadgeMap = assertToken(
	`DISCORD_AIRTABLE_BADGE_MAP`,
	x => x,
	x => JSON.parse(x)
)
const discordBadgeStatsChannelId = assertToken(`DISCORD_BADGE_STATS_CHANNEL_ID`)
const discordBadgeStatsChannelId2 = assertToken(`DISCORD_BADGE_STATS_CHANNEL_ID2`)

const Discord = {
	botToken: discordBotToken,
	attendeeGuildID: discordAttendeeGuildID,
	staffGuildID: discordStaffGuildID,
	airtableBadgeMap: discordAirtableBadgeMap,
	badgeStatsChannelId: discordBadgeStatsChannelId,
}

const nocodbApiToken = assertToken('NOCODB_API_TOKEN')
const nocodbRegTableUrl = assertToken('NOCODB_REG_TABLE_URL')

const scheduleUrl = assertToken(`SCHEDULE_URL`)
const nodeEnv = assertToken(`NODE_ENV`)
const scheduleSyncEnabled = assertToken('SCHEDULE_SYNC_ENABLED') === 'true'

export {
	Discord,
	discordAirtableBadgeMap,
	discordAttendeeGuildID,
	discordBotToken,
	discordStaffGuildID,
	discordBadgeStatsChannelId,
	discordBadgeStatsChannelId2,
	nocodbApiToken,
	nocodbRegTableUrl,
	scheduleUrl,
	scheduleSyncEnabled,
	nodeEnv
}
