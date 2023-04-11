import httpService from './http.service.js'

export default {
    list (parameters) {
        return httpService.get('location', { params: { filter: JSON.stringify(parameters) }})
    },
    get (id) {
        return httpService.get(`location/${id}`)
    },
    delete (id) {
        return httpService.delete(`location/${id}`)
    },
    save (id, params) {
        if (id) {
            return  httpService.patch(`location/${id}`, params)
        }
        return httpService.post(`location`, params)
    },
}
