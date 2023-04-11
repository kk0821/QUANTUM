import httpService from './http.service.js'

export default {
    list (params) {
        return httpService.get('countries', params)
    },
    withBranches (params) {
        return httpService.get('countries/withBranches', params)
    },
    available (params) {
        return httpService.get('countries/available', params)
    },
    get (id) {
        return httpService.get(`countries/${id}`)
    },
    edit (id) {
        return httpService.get(`countries/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`countries/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`countries/${id}`, params)
        }
        return httpService.post(`countries`, params)
    }
}
