import { scheduleUrl } from "./options.js"
import fetch from 'node-fetch'

const getEventsById = async () => {
	const response = await fetch(`${scheduleUrl}/schedule-by-id`)
	const data = await response.json()
	return data
}

export default getEventsById
export { getEventsById }
