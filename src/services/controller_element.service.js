import httpService from './http.service.js'

export default {
    list (params) {
        return httpService.get('controller-elements', params)
    },
    get (id) {
        return httpService.get(`controller-elements/${id}`)
    },
    edit (id) {
        return httpService.get(`controller-elements/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`controller-elements/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`controller-elements/${id}`, params)
        }
        return httpService.post(`controller-elements`, params)
    },
    filter (params) {
        return httpService.get(`/controller-elements/filter/technology/${params.technology}/oem/${params.oem}/branch/${params.branch}` + (params.query ? '/' + params.query : ''))
    }
}
