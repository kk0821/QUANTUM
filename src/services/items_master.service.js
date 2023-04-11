import httpService from './http.service.js'

export default {
    list () {
        return httpService.get('items-master')
    },
    get (id) {
        return httpService.get(`items-master/${id}`)
    },
    edit (id) {
        return httpService.get(`items-master/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`items-master/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`items-master/${id}`, params)
        }
        return httpService.post('items-master', params)
    }
}
