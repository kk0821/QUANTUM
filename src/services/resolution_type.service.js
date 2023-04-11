import httpService from './http.service.js'

const route = 'resolution-type'

export default {
    list (type, parameters) {
        return httpService.get(route, { params: { type, filter: JSON.stringify(parameters) }})
    },
    get (id) {
        return httpService.get(`${route}/${id}`)
    },
    delete (id) {
        return httpService.delete(`${route}/${id}`)
    },
    save (id, params) {
        if (id) {
            return  httpService.patch(`${route}/${id}`, params)
        }
        return httpService.post(route, params)
    },
}
