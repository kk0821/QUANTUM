import httpService from './http.service.js'

export default {
    list (params) {
        return httpService.get('network-elements', params)
    },
    get (id) {
        return httpService.get(`network-elements/${id}`)
    },
    edit (id) {
        return httpService.get(`network-elements/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`network-elements/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`network-elements/${id}`, params)
        }
        return httpService.post(`network-elements`, params)
    },
    filterByProject (params) {
        return httpService.get(`/network-elements/filter/project/${params.project}/technology/${params.technology}/oem/${params.oem}` + (params.query ? '/' + params.query : ''))
    },
    filter (params) {
        return httpService.get(`/network-elements/filter/technology/${params.technology}/oem/${params.oem}` + (params.query ? '/' + params.query : ''))
    }
}
