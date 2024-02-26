import discordClient from "../../lib/discord.js"
import { getAllRegistrationRecords } from "../../lib/nocodb.js"
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

const update = async (event) => {
	const discord = await discordClient
	const guilds = await discord.guilds.fetch()
	const attendeePartialGuild = await guilds.get(discordAttendeeGuildID)
	if (!attendeePartialGuild) {
		return
	}
	const attendeeGuild = await attendeePartialGuild.fetch()

	const rows = await getAllRegistrationRecords()
	const matchingUsers = rows.map(row => {
		const discord = row[Constants.DiscordHandleColumn] ?? ''
		return {
			discord: discord.indexOf('#') === -1 ? `${discord}#0` : discord,
			badge: discordAirtableBadgeMap[`${event.toUpperCase()} ${row[Constants.BadgeTypeColumn]}`]
		}
	})


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
			.filter(({ member, role }) => {
				return Array.from(member.roles.cache.keys()).indexOf(role.id) == -1
			})
			.map(({ member, role }) => {
				return member.roles.add(role, `Added from bot at ${new Date().toLocaleString()}`)
			})
	)
}

const getDiscordEvents = async (event) => {
	const thisUpdate = () => update(event)
	const client = await discordClient
	client.on(`guildMemberAdd`, thisUpdate)
	client.on(`guildMemberUpdate`, thisUpdate)
	client.on(`guildMemberRemove`, thisUpdate)
	client.on(`guildMemberChunk`, thisUpdate)
	client.on(`roleCreate`, thisUpdate)
	client.on(`roleDelete`, thisUpdate)
	client.on(`roleUpdate`, thisUpdate)
	return new Promise(() => {})
}

const updateTimer = async (event) => {
	setInterval(() => update(event), 1000 * 60)
	return new Promise(() => {})
}

const run = () => Promise.all([
	update('nwif'), getDiscordEvents('nwif'), updateTimer('nwif'),
	update('scif'), getDiscordEvents('scif'), updateTimer('scif')
])

export default run
