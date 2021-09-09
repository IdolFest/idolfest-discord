import discordClient from "../../lib/discord.js"
import { getRegistrationTable, getAllRecords } from "../../lib/airtable.js"
import { discordAttendeeGuildID, discordAirtableBadgeMap } from "../../lib/options.js"

const Constants = {
	DiscordRolesTable: `Discord Roles`,
	DiscordHandleColumn: `Discord Handle`,
	BadgeTypeColumn: `Badge Type`,
}

const getRolesByName = async attendeeGuild => {
	const attendeeRolesMap = await attendeeGuild.roles.fetch()
	const attendeeRoles = {}
	attendeeRolesMap.forEach(role => {
		attendeeRoles[role.name] = role
	})
	return attendeeRoles
}

const getMembersByName = async attendeeGuild => {
	const attendeeMembersMap = await attendeeGuild.members.fetch()
	const attendeeMembers = {}
	attendeeMembersMap.forEach(member => {
		const shortName = `${member.user.username}#${member.user.discriminator}`
		attendeeMembers[shortName] = member
	})
	return attendeeMembers
}

const update = async () => {
	const discord = await discordClient
	const guilds = await discord.guilds.fetch()
	const attendeeGuild = await guilds.get(discordAttendeeGuildID).fetch()

	const registrationTable = await getRegistrationTable()
	const rows = await getAllRecords(
		registrationTable.select({
			view: Constants.DiscordRolesTable,
		})
	)
	const matchingUsers = Array.from(rows).map(row => ({
		discord: row.fields[Constants.DiscordHandleColumn],
		badge: discordAirtableBadgeMap[row.fields[Constants.BadgeTypeColumn]],
	}))

	if (!matchingUsers || matchingUsers.length === 0) {
		return
	}

	const roles = await getRolesByName(attendeeGuild)
	const members = await getMembersByName(attendeeGuild)

	return Promise.all(
		matchingUsers
			.map(user => {
				const member = members[user.discord]
				const role = roles[user.badge]
				if (!member || !role) {
					return null
				}
				return {
					member,
					role,
				}
			})
			.filter(x => !!x)
			.map(({ member, role }) => {
				return member.roles.add(role, `Added from bot at ${new Date().toLocaleString()}`)
			})
	)
}

const getDiscordEvents = async () => {
	const client = await discordClient
	client.on(`guildMemberAdd`, update)
	client.on(`guildMemberUpdate`, update)
	client.on(`guildMemberRemove`, update)
	client.on(`guildMemberChunk`, update)
	client.on(`roleCreate`, update)
	client.on(`roleDelete`, update)
	client.on(`roleUpdate`, update)
	return new Promise(() => {})
}

const updateTimer = async () => {
	setInterval(update, 1000 * 60)
	return new Promise(() => {})
}

const run = () => Promise.all([update(), getDiscordEvents(), updateTimer()])

export default run
