import httpService from './http.service.js'

export default {
    list (type, parameters) {
        return httpService.get('city-source', { params: { type, filter: JSON.stringify(parameters) }})
    },
    get (id) {
        return httpService.get(`city-source/${id}`)
    },
    delete (id) {
        return httpService.delete(`city-source/${id}`)
    },
    save (id, params) {
        if (id) {
            return  httpService.patch(`city-source/${id}`, params)
        }
        return httpService.post(`city-source`, params)
    },
}
