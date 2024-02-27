import { config as dotenv } from "dotenv"
dotenv()

const assertToken = (str, validate = x => !!x, map = x => x) => {
	const value = process.env[str]
	if (!validate(value)) {
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
const discordBadgeChannelIdNwif = assertToken(`DISCORD_BADGE_CHANNEL_ID_NWIF`)
const discordBadgeChannelIdScif = assertToken(`DISCORD_BADGE_CHANNEL_ID_SCIF`)


const Discord = {
	botToken: discordBotToken,
	attendeeGuildID: discordAttendeeGuildID,
	staffGuildID: discordStaffGuildID,
	airtableBadgeMap: discordAirtableBadgeMap,
	badgeChannelIdNwif: discordBadgeChannelIdNwif,
	badgeChannelIdScif: discordBadgeChannelIdScif
}

const nocodbApiToken = assertToken('NOCODB_API_TOKEN')
const nocodbRegTableUrl = assertToken('NOCODB_REG_TABLE_URL')

const scheduleUrl = assertToken(`SCHEDULE_URL`)
const nodeEnv = assertToken(`NODE_ENV`)

export {
	Discord,
	discordAirtableBadgeMap,
	discordAttendeeGuildID,
	discordBotToken,
	discordStaffGuildID,
	discordBadgeChannelIdNwif,
	discordBadgeChannelIdScif,
	nocodbApiToken,
	nocodbRegTableUrl,
	scheduleUrl,
	nodeEnv
}
