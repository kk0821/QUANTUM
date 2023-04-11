import httpService from './http.service.js'

const route = 'failure'

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
    restore (id) {
        return httpService.patch(`${route}/${id}/restore`)
    },
    save (id, params) {
        if (id) {
            return  httpService.patch(`${route}/${id}`, params)
        }
        return httpService.post(route, params)
    },
    listEquipmentSubstage (id) {
        return httpService.get('equipment-substage')
    }
}
