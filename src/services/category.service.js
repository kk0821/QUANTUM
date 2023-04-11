import httpService from './http.service.js'

export default {
    list (params) {
        return httpService.get('categories', params)
    },
    get (id) {
        return httpService.get(`categories/${id}`)
    },
    edit (id) {
        return httpService.get(`categories/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`categories/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`categories/${id}`, params)
        }
        return httpService.post(`categories`, params)
    },
    parents (module, type, parent_id) {
        return httpService.get(`/categories/filter/parents/module/${module}/type/${type}/except${parent_id ? '/' + parent_id : ''}`)
    },
    children (module, type, category) {
        return httpService.get(`/categories/filter/children/module/${module}/type/${type}/category/${category}`)
    }
}
