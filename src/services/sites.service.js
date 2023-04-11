import httpService from './http.service.js'

export default {
    list (parameters) {
        return httpService.get('sites', { params: { filter: JSON.stringify(parameters) }})
    },
    get (id) {
        return httpService.get(`sites/${id}`)
    },
    edit (id) {
        return httpService.get(`sites/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`sites/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`sites/${id}`, params)
        }
        return httpService.post(`sites`, params)
    },
    filter (params) {
        return httpService.get(`sites/filter/branch/${params.branch}/${params.oem}` + (params.query ? '/' + params.query : ''))
    },
    filterById (parameters) {
        return httpService.post(`sites/filter/ids`, parameters)
    },
}
