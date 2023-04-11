import httpService from './http.service.js'

export default {
    filter (branch) {
        return httpService.get(`/group-emails/filter/branch/${branch}`)
    }
}