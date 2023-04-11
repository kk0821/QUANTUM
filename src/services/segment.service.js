import httpService from './http.service.js'

export default {
    list () {
        return httpService.get('segment')
    },
    get (id) {
        return httpService.get(`segment/${id}`)
    },
    edit (id) {
        return httpService.get(`segment/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`segment/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`segment/${id}`, params)
        }
        return httpService.post('segment', params)
    }
}
