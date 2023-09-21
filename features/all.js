import NewBadges from "./new-badges/index.js"
import ScheduleEvents from "./schedule-events/index.js"

const allFeatures = [NewBadges, ScheduleEvents]

export const setupFeatures = async () => {
	return Promise.all(allFeatures.map(feature => feature()))
}
