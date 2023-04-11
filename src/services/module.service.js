import httpService from './http.service.js'

export default {
    list (params) {
        return httpService.get('modules', params)
    },
    get (id) {
        return httpService.get(`modules/${id}`)
    },
    edit (id) {
        return httpService.get(`modules/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`modules/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`modules/${id}`, params)
        }
        return httpService.post(`modules`, params)
    }
}
