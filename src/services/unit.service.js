import httpService from './http.service.js'

export default {
    list (params) {
        return httpService.get('units', params)
    },
    byType (type) {
        return httpService.get(`units/byType/${type}`)
    },
    get (id) {
        return httpService.get(`units/${id}`)
    },
    edit (id) {
        return httpService.get(`units/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`units/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`units/${id}`, params)
        }
        return httpService.post(`units`, params)
    }
}
