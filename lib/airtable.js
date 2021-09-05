import { Airtable as AirtableOptions } from "./options.js"
import Airtable from "airtable"

const getClient = new Promise(resolve => {
	const client = new Airtable({ apiKey: AirtableOptions.apiToken })
	resolve(client)
})

const getBase = async () => {
	const client = await getClient
	const base = client.base(AirtableOptions.baseID)
	return base
}

const getRegistrationTable = async () => {
	const base = await getBase()
	const table = base(`Registration`)
	return table
}

const getAllRecords = query =>
	new Promise((resolve, reject) => {
		let allRecords = []
		query.eachPage(
			(records, fetchNextPage) => {
				console.log(`page of recrods`, records)
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
