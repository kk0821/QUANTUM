import httpService from './http.service.js'

export default {
    list (params) {
        return httpService.get('impacted-services', params)
    },
    get (id) {
        return httpService.get(`impacted-services/${id}`)
    },
    edit (id) {
        return httpService.get(`impacted-services/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`impacted-services/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`impacted-services/${id}`, params)
        }
        return httpService.post(`impacted-services`, params)
    }
}
