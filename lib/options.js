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

const airtableAPITokenNwif = assertToken(`AIRTABLE_API_TOKEN_NWIF`)
const airtableAPITokenScif = assertToken(`AIRTABLE_API_TOKEN_SCIF`)
const airtableBaseIDNwif = assertToken(`AIRTABLE_BASE_ID_NWIF`)
const airtableBaseIDScif = assertToken(`AIRTABLE_BASE_ID_SCIF`)
const AirtableNwif = {
	apiToken: airtableAPITokenNwif,
	baseID: airtableBaseIDNwif,
}
const AirtableScif = {
	apiToken: airtableAPITokenScif,
	baseID: airtableBaseIDScif,
}

const scheduleUrl = assertToken(`SCHEDULE_URL`)
const nodeEnv = assertToken(`NODE_ENV`)

export {
	Discord,
	AirtableNwif,
	AirtableScif,
	discordAirtableBadgeMap,
	discordAttendeeGuildID,
	discordBotToken,
	discordStaffGuildID,
	discordBadgeChannelIdNwif,
	discordBadgeChannelIdScif,
	airtableAPITokenNwif,
	airtableAPITokenScif,
	airtableBaseIDNwif,
	airtableBaseIDScif,
	scheduleUrl,
	nodeEnv
}
