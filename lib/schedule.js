import { scheduleUrl } from "./options.js"
import fetch from 'node-fetch'

let defaultEventsByIdResponse = { events: {} }
let lastEventsByIdResponse = null

const getEventsById = async () => {
	try {
		const response = await fetch(`${scheduleUrl}/schedule-by-id`)
		const data = await response.json()
		lastEventsByIdResponse = data
		return data
	} catch {
		return lastEventsByIdResponse || defaultEventsByIdResponse
	}
}

export default getEventsById
export { getEventsById }
