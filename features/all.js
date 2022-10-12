import NewBadges from "./new-badges/index.js"
import BadgeNotifications from "./badge-notifications/index.js"

const allFeatures = [NewBadges, BadgeNotifications]

export const setupFeatures = async () => {
	return Promise.all(allFeatures.map(feature => feature()))
}
