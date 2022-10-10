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
const discordBadgeChannelId = assertToken(`DISCORD_BADGE_CHANNEL_ID`)


const Discord = {
	botToken: discordBotToken,
	attendeeGuildID: discordAttendeeGuildID,
	staffGuildID: discordStaffGuildID,
	airtableBadgeMap: discordAirtableBadgeMap,
	badgeChannelId: discordBadgeChannelId,
}

const airtableAPIToken = assertToken(`AIRTABLE_API_TOKEN`)
const airtableBaseID = assertToken(`AIRTABLE_BASE_ID`)
const Airtable = {
	apiToken: airtableAPIToken,
	baseID: airtableBaseID,
}

export {
	Discord,
	Airtable,
	discordAirtableBadgeMap,
	discordAttendeeGuildID,
	discordBotToken,
	discordStaffGuildID,
	discordBadgeChannelId,
	airtableAPIToken,
	airtableBaseID,
}
