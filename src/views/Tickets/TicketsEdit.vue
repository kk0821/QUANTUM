<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pt-5 pb-5 border-b border-gray-200">
          <ticket-header
              v-if="ticketData.id && ticketData.statusTicket"
              :ticket="ticketData"
              :project="project"
          />
        </div>
      </div>
      <div class="mx-auto" v-if="project && projectSame">
        <TicketsForm
          v-if="ticketData.id"
          :ticket="ticketData"
          :project="project"
          :ticket-package-id="ticketPackage.id"
          :old-selectors="oldSelectors"
          :old-files="oldFiles"
          @save="saveData"/>
      </div>
      <div v-else>
        <alert
            v-show="!project || !projectSame"
            :title="'Attention'"
            :message="messages"
            :alert-type="'warning'"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'

import Alert from '@/components/Alert.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import resolver from "@/utils/_resolver.ts";
import { encryptStorage } from "@/services/http.service";
import ticketsService from "@/services/tickets.service.js"
import { loading } from '@/store/loading'
import { loadingButton } from '@/store/loadingButton'
import { notifyError } from "@/utils/notify_error.ts";
import { notifySuccess } from "@/utils/notify_success";
import TicketHeader from '@/components/TicketHeader.vue'
import TicketsForm from '@/views/Tickets/TicketsForm.vue'

const route = useRoute()
const router = useRouter()

const ticketData = ref({
  identify: '1',
  created_at: new Date().toLocaleString(),
  creator: {},
  project: {},
  status: undefined,
  additional_information: { },
  statusTicket: undefined,
  technical_assigned: undefined,
  detail: {
    controllerIp: undefined,
    problemTitle: undefined,
    impactedService: 0,
    frontOffice: undefined,
    backOffice: undefined,
    kpi: undefined,
    activitiesBefore: undefined,
    resolutionActions: undefined,
    failFirstTime: undefined
  }
})
const ticketId = ref('')
const projectSelected = ref(encryptStorage.getItem('project') ? encryptStorage.getItem('project') : undefined)
const project = ref({
  branch: {
    country: {
      flag_url: ''
    }
  }})
const projectSame = ref(true)
const ticketPackage = ref({})
const oldSelectors = ref({})
const oldFiles = ref([])
const messages = ref([])

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Tickets', pathName: 'TicketsList', isLink: true, current: false },
  { description: 'Edit', pathName: 'TicketsEdit', isLink: false, current: true }
]

let saveData = () => {}
if (projectSelected.value) {
  saveData = (event) => {
    loadingButton.show()
    ticketsService.save(ticketId.value, {
      'ticket': event.ticket,
      'selectors': event.selectors,
      'listFiles': event.listFiles,
      'project': projectSelected.value.id
    }).then(x => {
      notifySuccess('Update', x.data)
      router.push({ name: "TicketsList" })
    }).catch(err => {
      notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message)
    }).finally(() => {
      loadingButton.hide()
    })
  }

  onBeforeMount( () => {
    ticketId.value = route.params.ticketId
    loading.show()
    resolver.all({
      ticket: ticketsService.edit(ticketId.value),
      ticket_package: ticketsService.checkTicketPackage(projectSelected.value.id)
    }).then(x => {

      if (projectSelected.value.project_type.service_type.code === "HW") {
        messages.value.push('You can only create a ticket if the selected project is of type Software')
        notifyError('You can only create a ticket if the selected project is of type Software')
      }

      project.value = x.ticket.data.project
      ticketPackage.value = x.ticket_package.data
      ticketData.value.identify = x.ticket.data.code_identify
      ticketData.value.created_at_tz = x.ticket.data.created_at_tz
      ticketData.value.id = x.ticket.data.id
      ticketData.value.status = x.ticket.data.status_id
      ticketData.value.statusTicket = x.ticket.data.status
      ticketData.value.creator = x.ticket.data.creator
      ticketData.value.technical_assigned = x.ticket.data.technical_assigned ? x.ticket.data.technical_assigned.user : undefined

      if (projectSelected.value.id !== x.ticket.data.project.id) {
        projectSame.value = false
        messages.value.push('The ticket does not belong to the selected project. To edit the ticket, you must select the project of the ticket')
        notifyError('The ticket does not belong to the selected project. To edit the ticket, you must select the project of the ticket')
      } else {
        ticketData.value.additional_information = {
          list: x.ticket.data.additional_information.list,
          work: x.ticket.data.additional_information.work,
          phone: x.ticket.data.additional_information.phone,
          whatsapp: x.ticket.data.additional_information.whatsapp,
          additional: x.ticket.data.additional_information.additional
        }

        ticketData.value.detail = {
          siteIp: x.ticket.data.details.site_ip,
          controllerIp: x.ticket.data.details.controller_ip,
          problemTitle: x.ticket.data.details.problem_title,
          problemDescription: x.ticket.data.details.problem_description,
          problemRemedy: x.ticket.data.details.remedy,
          problemSoftwareRelease: x.ticket.data.details.software_release,
          impactedService: x.ticket.data.details.impacted_service,
          affectedUsers: x.ticket.data.details.affected_users,
          affectedRegion: x.ticket.data.details.affected_region,
          frontOffice: x.ticket.data.details.front_office,
          backOffice: x.ticket.data.details.back_office,
          kpi: x.ticket.data.details.kpi,
          activitiesBefore: x.ticket.data.details.activities_before,
          resolutionActions: x.ticket.data.details.resolution_actions,
          failFirstTime: x.ticket.data.details.fail_first_time
        }

        oldSelectors.value = {
          networkElement: x.ticket.data.details.network_element_id,
          controllerElement: x.ticket.data.details.controller_element_id,
          sites: x.ticket.data.details.sites,
          technology: x.ticket.data.details.technology_id,
          severity: x.ticket.data.details.severity_id,
          oem: x.ticket.data.details.oem_id,
          category: x.ticket.data.details.tier1,
          categoryChildren: x.ticket.data.details.tier2,
          impactedService: x.ticket.data.details.impacted_service_id
        }

        oldFiles.value = x.ticket.data.ticket_files.map(file => ({
          id: file.id,
          name: file.name,
          path: file.path
        }))
      }
      loading.hide()
    })
    .catch(() => {
      loading.hide()
      notifyError('An error occurred while obtaining ticket information')
    })
  })
} else {
  messages.value.push('To edit ticket you need an assigned project')
  notifyError('To edit ticket you need an assigned project')
}
</script>
