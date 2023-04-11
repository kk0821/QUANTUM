import httpService from './http.service.js'

export default {
    list (params) {
        return httpService.get('category-types', params)
    },
    get (id) {
        return httpService.get(`category-types/${id}`)
    },
    edit (id) {
        return httpService.get(`category-types/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`category-types/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`category-types/${id}`, params)
        }
        return httpService.post(`category-types`, params)
    }
}
