import httpService from './http.service.js'

export default {
    list () {
        return httpService.get('controller-types')
    },
    get (id) {
        return httpService.get(`controller-types/${id}`)
    },
    edit (id) {
        return httpService.get(`controller-types/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`controller-types/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`controller-types/${id}`, params)
        }
        return httpService.post('controller-types', params)
    }
}
