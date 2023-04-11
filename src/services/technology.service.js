import httpService from './http.service.js'

export default {
    listForTicketModule (params) {
        return httpService.get(`tickets/technologies/ticket-package/${params.ticket_package}/oem/${params.oem}`)
    },
    list (params) {
        return httpService.get('technologies', params)
    },
    get (id) {
        return httpService.get(`technologies/${id}`)
    },
    edit (id) {
        return httpService.get(`technologies/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`technologies/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`technologies/${id}`, params)
        }
        return httpService.post(`technologies`, params)
    }
}
