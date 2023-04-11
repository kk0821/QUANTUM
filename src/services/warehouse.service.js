import httpService from './http.service.js'

export default {
    list () {
        return httpService.get('warehouse')
    },
    get (id) {
        return httpService.get(`warehouse/${id}`)
    },
    edit (id) {
        return httpService.get(`warehouse/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`warehouse/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`warehouse/${id}`, params)
        }
        return httpService.post('warehouse', params)
    }
}
