import NewBadges from "./new-badges/index.js"
import ScheduleEvents from "./schedule-events/index.js"
import BadgeStats from "./badge-stats/index.js"

const allFeatures = [NewBadges, ScheduleEvents, BadgeStats]

export const setupFeatures = async () => {
	return Promise.all(allFeatures.map(feature => feature()))
}
