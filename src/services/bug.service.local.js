import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = (process.env.NODE_ENV !== 'development')
? '/api/bug'
: '//localhost:3000/api/bug';

export const bugService = {
    query,
    getById,
    save,
    remove,
	getDefaultFilter
}



async function query(filterBy = {}) {
    var { data: bugs } = await axios.get(BASE_URL)

	if (filterBy.title) {
		const regExp = new RegExp(filterBy.title, 'i')
		bugs = bugs.filter(bug => regExp.test(bug.title+bug.description))
	}
    
	if (filterBy.severity) {
		bugs = bugs.filter(bug => bug.severity == filterBy.severity)
	}
	return bugs
}

async function getById(bugId) {
    const url = BASE_URL + bugId
    
    var { data: bug } = await axios.get(url)
    return bug
}

async function remove(bugId) {
    const url = BASE_URL + bugId + '/remove'
    var { data: res } = await axios.get(url)
    return res
}

async function save(bug) {
    const queryParams = 
        `?_id=${bug._id || ''}&title=${bug.title}&severity=${bug.severity}&description=${bug.description}&createdAt=${bug.createdAt}`
    const url = BASE_URL + 'save' + queryParams 

    const { data: savedbug } = await axios.get(url)
    return savedbug
}

function getDefaultFilter() {
	return { title: '', severity: '' }
}