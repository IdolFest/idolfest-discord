import { AirtableNwif as NwifOptions, AirtableScif as ScifOptions } from "./options.js"
import Airtable from "airtable"

const existingClients = {};

const getClient = async (options) => {
	if (existingClients[options.baseID]) {
		return existingClients[options.baseID]
	}
	const client = new Airtable({ apiKey: options.apiToken })
	existingClients[options.BaseID] = client
	return client
}

const getBase = async (options) => {
	const client = await getClient(options)
	const base = client.base(options.baseID)
	return base
}

const getRegistrationTable = async (event) => {
	let options = NwifOptions
	if (event.toLowerCase() === 'scif') {
		options = ScifOptions
	}
	const base = await getBase(options)
	const table = base(`Registration`)
	return table
}

const getAllRecords = query =>
	new Promise((resolve, reject) => {
		let allRecords = []
		query.eachPage(
			(records, fetchNextPage) => {
				records.forEach(record => allRecords.push(record))
				fetchNextPage()
			},
			err => {
				if (err) {
					reject(err)
				} else {
					resolve(allRecords)
				}
			}
		)
	})

export default getClient
export { getClient, getAllRecords, getBase, getRegistrationTable }
