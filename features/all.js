import NewBadges from "./new-badges/index.js"
import ScheduleEvents from "./schedule-events/index.js"
import BadgeNotifications from "./badge-notifications/index.js"

const allFeatures = [NewBadges, BadgeNotifications, ScheduleEvents]

export const setupFeatures = async () => {
	return Promise.all(allFeatures.map(feature => feature()))
}
