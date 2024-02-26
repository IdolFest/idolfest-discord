import { nocodbApiToken, nocodbRegTableUrl } from "./options.js"
import axios from 'axios'


const getAllRegistrationRecords = async query => {
    let allRecords = [], isLastPage = false, offset=0
    const pageSize = 100, whereQuery = '(Registration Status,eq,Confirmed)'
    while (!isLastPage) {
        const thisData = await axios.get(`${nocodbRegTableUrl}?offset=${offset}&limit=${pageSize}&where=${whereQuery}`, {headers: {'xc-token': nocodbApiToken}})
        if (thisData.status !== 200) {
            throw new Error('Non-200 response from nocodb:', thisData.status)
        }
        allRecords.push(...thisData.data.list)
        isLastPage = thisData.data.pageInfo.isLastPage
        offset += pageSize
    }

    return allRecords
    
}

export { getAllRegistrationRecords }
