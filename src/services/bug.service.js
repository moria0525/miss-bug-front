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
    remove,
    save,
    getEmptyBug,
    getDefaultFilter
}

async function query(filterBy = {}) {
    var { data: bugs } = await axios.get(BASE_URL, {params: filterBy})
    return bugs
}



async function getById(bugId) {
    const url = BASE_URL + bugId

    var { data: bug } = await axios.get(url)
    return bug
}

async function remove(bugId) {
    const url = BASE_URL + bugId
    var { data: res } = await axios.delete(url)
    return res
}

async function save(bug) {
    const method = bug._id ? 'put' : 'post'
    const { data: savedBug } = await axios[method](BASE_URL, bug)
    return savedBug
}
function getEmptyBug(title = '', severity = '') {  
    return { title, severity}
}

function getDefaultFilter() {
return { title: '', severity: ''/*, pageIdx: undefined*/ }
}