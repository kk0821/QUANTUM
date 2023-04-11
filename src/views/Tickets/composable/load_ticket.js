
import { ref } from "vue";

import { encryptStorage } from '@/services/http.service'
import ticketsService from '@/services/tickets.service.js'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error.ts'

export function useLoadTicket(ticketId, callBack) {
  const ticketData = ref({
    identify: '1',
    created_at: new Date().toLocaleString(),
    created_at_tz: '',
    creator: {},
    technical_assigned: undefined,
    additional_information: {},
    status: undefined,
    statusTicket: {},
    detail: {
      controllerIp: undefined,
      problemTitle: undefined,
      impactedService: 0,
      frontOffice: undefined,
      backOffice: undefined,
      kpi: undefined,
      activitiesBefore: undefined,
      resolutionActions: undefined,
      failFirstTime: undefined,
    },
    ticketPackageId: undefined,
  })

  const project = ref(encryptStorage.getItem('project') ? encryptStorage.getItem('project') : undefined)
  const oldSelectors = ref({})
  const oldFiles = ref([])

  loading.show()
  ticketsService.get(ticketId)
    .then(x => {
      loading.hide()
      project.value = x.data.project
      ticketData.value.ticketPackageId = x.data.tickets_package_ticket[0].details.ticket_package_id
      ticketData.value.identify = x.data.code_identify
      ticketData.value.created_at = new Date(x.data.created_at).toLocaleString()
      ticketData.value.created_at_tz = x.data.created_at_tz ? x.data.created_at_tz : ''
      ticketData.value.id = x.data.id
      ticketData.value.status = x.data.status_id
      ticketData.value.statusTicket = x.data.status
      ticketData.value.creator = x.data.creator
      ticketData.value.technical_assigned = x.data.technical_assigned ? x.data.technical_assigned.user : undefined

      ticketData.value.additional_information = {
        list: x.data.additional_information.list,
        work: x.data.additional_information.work,
        phone: x.data.additional_information.phone,
        whatsapp: x.data.additional_information.whatsapp,
        additional: x.data.additional_information.additional
      }

      ticketData.value.detail = {
        siteIp: x.data.details.site_ip,
        controllerIp: x.data.details.controller_ip,
        problemTitle: x.data.details.problem_title,
        problemDescription: x.data.details.problem_description,
        problemRemedy: x.data.details.remedy,
        problemSoftwareRelease: x.data.details.software_release,
        impactedService: x.data.details.impacted_service,
        affectedUsers: x.data.details.affected_users,
        affectedRegion: x.data.details.affected_region,
        frontOffice: x.data.details.front_office,
        backOffice: x.data.details.back_office,
        kpi: x.data.details.kpi,
        activitiesBefore: x.data.details.activities_before,
        resolutionActions: x.data.details.resolution_actions,
        failFirstTime: x.data.details.fail_first_time
      }

      oldSelectors.value = {
        networkElement: x.data.details.network_element_id,
        controllerElement: x.data.details.controller_element_id,
        sites: x.data.details.sites,
        technology: x.data.details.technology_id,
        severity: x.data.details.severity_id,
        oem: x.data.details.oem_id,
        category: x.data.details.tier1,
        categoryChildren: x.data.details.tier2,
        impactedService: x.data.details.impacted_service_id
      }

      oldFiles.value = x.data.ticket_files.map(file => ({
        id: file.id,
        name: file.name,
        path: file.path,
        type: file.type
      }))

      return x.data
    })
    .then(x => callBack && typeof callBack === 'function' ? callBack(x) : undefined)
    .catch((e) => {
      loading.hide()
      notifyError('An error occurred while obtaining ticket information')
    })

  return { ticketData, project, oldSelectors, oldFiles }
}
