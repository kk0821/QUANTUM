import httpService from './http.service.js'

export default {
    list (params) {
        return httpService.get('tickets-package', params)
    },
    get (id) {
        return httpService.get(`tickets-package/${id}`)
    },
    edit (id) {
        return httpService.get(`tickets-package/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`tickets-package/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`tickets-package/${id}`, params)
        }
        return httpService.post(`tickets-package`, params)
    }
}
