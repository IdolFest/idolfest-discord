import NewBadges from "./new-badges/index.js"

const allFeatures = [NewBadges]

export const setupFeatures = async () => {
	return Promise.all(allFeatures.map(feature => feature()))
}
