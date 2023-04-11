import httpService from './http.service.js'

export default {
    list () {
        return httpService.get('/impacted-services')
    }
}