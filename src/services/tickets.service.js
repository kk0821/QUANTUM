import httpService from './http.service.js'

export default {
    list (params) {
        return httpService.get('tickets', { params: params })
    },
    get (id) {
        return httpService.get(`tickets/${id}`)
    },
    getNumber (projectId) {
        return httpService.get(`number/${projectId}`)
    },
    checkTicketPackage (projectId) {
        return httpService.get(`check-ticket-package/${projectId}`)
    },
    edit (id) {
        return httpService.get(`tickets/${id}/edit`)
    },
    delete (id, payload) {
        return httpService.post(`tickets/${id}/delete`, payload)
    },
    getTechnicals (id) {
        return httpService.get(`tickets/${id}/getTechnicals`)
    },
    getInvitationt (id) {
        return httpService.get(`tickets/${id}/getInvitationt`)
    },
    getInvitationtManager (id) {
        return httpService.get(`tickets/${id}/getInvitationtManager`)
    },
    lastPending (id) {
        return httpService.get(`tickets/${id}/lastPending`)
    },
    addUsers (id, payload) {
        return httpService.put(`tickets/${id}/addUsers`, payload)
    },
    acceptInvitation (id, payload) {
        return httpService.put(`tickets/${id}/acceptInvitation`, payload)
    },
    acceptInvitationByManager (id, payload) {
        return httpService.put(`tickets/${id}/acceptInvitationByManager`, payload)
    },
    stopProgress (id, payload) {
        return httpService.put(`tickets/${id}/stopProgress`, payload)
    },
    pauseRestored (id, payload) {
        return httpService.put(`tickets/${id}/pauseRestored`, payload)
    },
    pauseResolved (id, payload) {
        return httpService.put(`tickets/${id}/pauseResolved`, payload)
    },
    continueProgress (id, payload) {
        return httpService.put(`tickets/${id}/continueProgress`, payload)
    },
    restoredServices (id, payload) {
        return httpService.put(`tickets/${id}/restoredServices`, payload)
    },
    resolvedTicket (id, payload) {
        return httpService.put(`tickets/${id}/resolvedTicket`, payload)
    },
    closeTicket (id, payload) {
        return httpService.put(`tickets/${id}/closeTicket`, payload)
    },
    statusHistory (id) {
        return httpService.get(`tickets/${id}/statusHistory`)
    },
    save (id, params) {
        if(id) {
            return  httpService.put(`tickets/${id}/${params.project}`, params)
        }
        return httpService.post(`tickets/${params.project}`, params)
    },
    uploadFiles (projectId, files, ticketId) {
        const formData = new FormData();
        files.forEach((file, idx) => {
            formData.append(`file_${idx}`, file)
        });
        formData.append("fileNumber", files.length);
        return httpService.post(`tickets/${projectId}/upload` + (ticketId ? '/' + ticketId : ''), formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
    },
    showFile (params) {
        return httpService.post('tickets/file/show', params, { responseType: 'blob' })
            .then(x => {
                if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE variant
                    window.navigator.msSaveOrOpenBlob(
                        new Blob([x.data],
                            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
                        ),
                        params.name
                    );
                } else {
                    const url = window.URL.createObjectURL(new Blob([x.data],
                        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', params.name)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }
            })
    },
    deleteFile (params) {
        return httpService.post('tickets/file/delete', params)
    },
    getSlaTicket (id) {
        return httpService.get(`tickets/${id}/getSla`)
    },
}
