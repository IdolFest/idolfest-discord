import { setupFeatures } from "./lib/features/all.js"

setupFeatures().then(
	() => {
		process.exit(0)
	},
	err => {
		console.error(`ERROR:`, err)
		process.exit(1)
	}
)
