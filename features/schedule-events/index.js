import discordClient from "../../lib/discord.js"
import { discordAttendeeGuildID, scheduleSyncEnabled } from "../../lib/options.js"
import { getEventsById } from "../../lib/schedule.js"

const convertScheduleTime = (datetime) => {
	return Date.parse(datetime)
}

const getDescription = (discordEvent) => {
	return discordEvent.description.split(`ID: `)[0]?.split(`Panelists: `)[0]?.trim() || ``
}

const getPanelists = (discordEvent) => {
	return discordEvent.description.split(`ID: `)[0]?.split(`Panelists: `)[1]?.trim() || ``
}

const getId = (discordEvent) => {
	if (!discordEvent.description) { return null } 
	return discordEvent.description.split(`ID: `)[1]?.trim()
}

const createDescription = (scheduleEvent) => {
	let description = scheduleEvent.description
	const list = getProhibitedList(scheduleEvent)
	if (list && list.length) {
		description += '\n\n**Prohibited**:'
		list.forEach(prohib => {
			description += '\n* ' + prohib
		})
	}
	if (scheduleEvent.panelists) {
		description += `\n\nPanelists: ${scheduleEvent.panelists}`
	}

	description += `\n\nID: ${scheduleEvent.id}`

	return description
}

function getProhibitedList(panel) {
	let list = []
  
	switch (panel.callMix.toLowerCase()) {
	  case 'all':
		// Nothing!
		break
	  case 'calls only':
		list.push('Mix (calls are okay!)')
		break
	  case 'none':
		list.push('Calls and mix')
		break
	}
  
	switch (panel.recording.toLowerCase()) {
	  case 'all':
		// Nothing!
		break
	  case 'photos':
		list.push('Recorded video (pictures are okay!)')
		break
	  case 'videos': 
		// ... really?
		list.push('Recorded photos (video okay)')
		break
	  case 'none':
		list.push('Video recording and photos')
		break
	}
  
	return list
  
  }
  

const buildDiscordEvent = (scheduleEvent) => {
	return ({
		name: scheduleEvent.title,
		description: createDescription(scheduleEvent),
		scheduledStartTime: convertScheduleTime(scheduleEvent.startTime),
		scheduledEndTime: convertScheduleTime(scheduleEvent.endTime),
		privacyLevel: 2,
		entityType: `EXTERNAL`,
		entityMetadata: {
			location: scheduleEvent.room
		}
	})
}

const compareEvents = (scheduleEvent, discordEvent) => {
	if (
		(convertScheduleTime(scheduleEvent.startTime) == discordEvent.scheduledStartTimestamp) && 
		(convertScheduleTime(scheduleEvent.endTime) == discordEvent.scheduledEndTimestamp) &&
		scheduleEvent.title.trim() == discordEvent.name &&
		scheduleEvent.panelists.trim() == getPanelists(discordEvent) &&
		scheduleEvent.description.trim() == getDescription(discordEvent) &&
		scheduleEvent.room.trim() == discordEvent.entityMetadata.location
	) {
		return true
	}

	if (convertScheduleTime(scheduleEvent.startTime) != discordEvent.scheduledStartTimestamp) {
		console.log(`Start time differs!`, convertScheduleTime(scheduleEvent.startTime), discordEvent.scheduledStartTimestamp)
	}

	if(convertScheduleTime(scheduleEvent.endTime) != discordEvent.scheduledEndTimestamp) {
		console.log(`End time differs!`, convertScheduleTime(scheduleEvent.endTime), discordEvent.scheduledEndTimestamp)
	}
	if (scheduleEvent.title != discordEvent.name) {
		console.log(`Title differs!`, scheduleEvent.title.trim(), discordEvent.name)
	}
	if (scheduleEvent.panelists != getPanelists(discordEvent)) {
		console.log(`Panelists differ!`, scheduleEvent.panelists.trim(), getPanelists(discordEvent))
	}

	if (scheduleEvent.description.trim() != getDescription(discordEvent)) {
		console.log(`Description differs!`, scheduleEvent.description.trim(), getDescription(discordEvent))
	}
	if (scheduleEvent.room != discordEvent.entityMetadata.location) {
		console.log(`Room differs!`, scheduleEvent.room.trim(), discordEvent.entityMetadata.location)
	}

	return false
}

const update = async () => {
	if (!scheduleSyncEnabled) {
		return
	}
	const discord = await discordClient
	const guilds = await discord.guilds.fetch()

	const attendeePartialGuild = await guilds.get(discordAttendeeGuildID)
	if (!attendeePartialGuild) {
		return
	}
	const attendeeGuild = await attendeePartialGuild.fetch()

	const [discordEvents, scheduleEvents] = await Promise.all([
		attendeeGuild.scheduledEvents.fetch(),
		getEventsById().then(result => result.events)
	])

	for (const [discordEventId, discordEvent] of discordEvents) { 
		try {
			const eventId = getId(discordEvent)
			if (!eventId) { 
				console.log(`Unable to find ID for event ${discordEventId}!`)
				continue
			}
			const scheduleEvent = scheduleEvents[eventId]
			if (!scheduleEvent) {
				console.log(`Unable to find ${eventId} in schedule!`)
				continue
			}
			if (!compareEvents(scheduleEvent, discordEvent)) {
				console.log(`Updating ${scheduleEvent.id} event...`)
				await attendeeGuild.scheduledEvents.edit(
					discordEvent, buildDiscordEvent(scheduleEvent)
				)
			}
			delete scheduleEvents[eventId]
		} catch (error) {
			console.log(`Error in ${discordEvent}! ${error}`)
		}
	}

	// go through and add any remaining new events
	Promise.all(
		Object.entries(scheduleEvents).map(async ([id, scheduleEvent]) => {
			// skip creating events in the past
			// Discord will error
			if (convertScheduleTime(scheduleEvent.startTime) < new Date()) {
				return
			}
			console.log(`Creating event ${id}`)
			await attendeeGuild.scheduledEvents.create(
				buildDiscordEvent(scheduleEvent)
			)
		})
	)
	//console.log(`Created ${eventsCreated} new events`)
}

const updateTimer = async () => {
	setInterval(update, 1000 * 60 * 15)
	return new Promise(() => { })
}

const run = () => Promise.all([update(), updateTimer()])

export default run

/*
schedule data example

{
  id: 'sun-ma-7',
  startTime: '2022-10-23T16:30:00-07:00',
  endTime: '2022-10-23T17:00:00-07:00',
  title: 'Closing Ceremony',
  panelists: 'Staff',
  description: "It's time to say goodbye to a wonderful weekend. Let's share our happy memories and talk about what the future has in store!",
  isGuest: true,
  room: 'Main Auditorium'
}

discord event example

 '1028789182304362536' => GuildScheduledEvent {
    id: '1028789182304362536',
    guildId: '934670158725799946',
    channelId: null,
    creatorId: '1022710875909537892',
    name: 'my cool name',
    description: 'foobar\n\nPanelists: Staff\n\nID: sun-ma-7',
    scheduledStartTimestamp: 1665507600000,
    scheduledEndTimestamp: 1665511200000,
    privacyLevel: 'GUILD_ONLY',
    status: 'SCHEDULED',
    entityType: 'EXTERNAL',
    entityId: null,
    userCount: 0,
    creator: ClientUser {
      id: '1022710875909537892',
      bot: true,
      system: false,
      flags: [UserFlags],
      username: 'NWIF Test',
      discriminator: '6578',
      avatar: null,
      banner: undefined,
      accentColor: undefined,
      verified: true,
      mfaEnabled: true
    },
    entityMetadata: { location: 'Class B' },
    image: null
  }
}
*/
