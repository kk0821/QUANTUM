import httpService from './http.service.js'

export default {
    listForTicketModule (ticket_package) {
        return httpService.get(`tickets/oems/ticket-package/${ticket_package}`)
    },
    list (params) {
        return httpService.get('oems', params)
    },
    get (id) {
        return httpService.get(`oems/${id}`)
    },
    edit (id) {
        return httpService.get(`oems/${id}/edit`)
    },
    delete (id) {
        return httpService.delete(`oems/${id}`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`oems/${id}`, params)
        }
        return httpService.post(`oems`, params)
    }
}
