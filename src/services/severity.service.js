import httpService from './http.service.js'

export default {
    listForTicketModule (params) {
        return httpService.get(`tickets/severities/ticket-package/${params.ticket_package}/oem/${params.oem}/technology/${params.technology}`)
    },
    list (params) {
        return httpService.get('severities', params)
    },
    get (id) {
        return httpService.get(`severities/${id}`)
    },
    edit (id) {
        return httpService.get(`severities/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`severities/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`severities/${id}`, params)
        }
        return httpService.post(`severities`, params)
    }
}
