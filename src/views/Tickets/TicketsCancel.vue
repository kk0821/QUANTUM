<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pt-5 pb-5 border-b border-gray-200">
          <ticket-header
              v-if="ticketData.id && ticketData.statusTicket"
              :ticket="ticketData"
              :project="project" />
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
          :can-edit="false"
          hidden-panel
        />
        <FormPanel
            title="Cancel ticket"
            sub-title="Indicate the reason why you want to perform the action of cancel ticket"
            :rows="['ticket-cancel']"
            :grid="{ cols: 3 }"
            separation
        >
          <template #ticket-cancel>
            <base-input
                id="ticket-cancel"
                v-model="cancelMotive"
                label="The reason"
                type="text"
                is-required
            />
          </template>
        </FormPanel>
        <div class="mt-10 sm:mt-0">
          <div class="md:grid md:grid-cols-4 md:gap-6">
            <div class="md:col-span-3">
              <alert
                  title="Attention"
                  message="Remember that this action is irreversible, once the ticket has been canceled it cannot be attended"
                  alert-type="warning"
              />
            </div>
            <div class="mt-5 md:mt-0 md:col-span-1">
              <form action="#" method="POST">
                <div>
                  <div class="px-4 py-3 text-right sm:px-6">
                    <LoadingButton
                        :is-loading="loadingButton.state"
                        :enable-save="enableSave"
                        background-color="bg-amerinode-blue-600"
                        :action-click="(event) => sendData(event)"
                    >
                      Cancel ticket
                    </LoadingButton>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
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
import {computed, onBeforeMount, ref} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCan } from './composable/can_action'
import Alert from '@/components/Alert.vue'
import BaseInput from '@/components/BaseInput.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import FormPanel from '@/components/FormPanel.vue'
import TicketHeader from '@/components/TicketHeader.vue'
import TicketsForm from '@/views/Tickets/TicketsForm.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import resolver from '@/utils/_resolver.ts'
import ticketsService from '@/services/tickets.service.js'
import { loading } from '@/store/loading'
import { loadingButton } from '@/store/loadingButton'
import { encryptStorage } from '@/services/http.service'
import { notifyError } from '@/utils/notify_error.ts'
import { notifySuccess } from '@/utils/notify_success'
//import {useCan} from "@/views/Tickets/composable/can_action";
const route = useRoute()
const router = useRouter()
const { canAction } = useCan()

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
const ticketPackage = ref({})
const projectSame = ref(true)
const cancelMotive = ref('')
const ticketId = ref('')
const projectSelected = ref(encryptStorage.getItem('project') ? encryptStorage.getItem('project') : undefined)
const project = ref({
  branch: {
    country: {
      flag_url: ''
    }
  }})
const oldSelectors = ref({})
const oldFiles = ref([])
const user = ref(encryptStorage.getItem('user') ? encryptStorage.getItem('user') : {})
const roles = user.value.roles || []
const messages = ref([])

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Tickets', pathName: 'TicketsList', isLink: true, current: false },
  { description: 'Show', pathName: 'TicketsCancel', isLink: false, current: true }
]

const sendData = ($event) => {
  $event.preventDefault()
  loadingButton.show()
  ticketsService.delete(ticketId.value, {
    reason: cancelMotive.value
  }).then((x) => {
    notifySuccess('Deleted', x.data)
    router.push({ name: "TicketsList" })
  }).catch(err => {
    notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message)
  }).finally(() => {
    loadingButton.hide()
  })
}

/*const can = {
  status: ['New','In Progress','Restored','Pending','Assigned'],
  roles: {
    Reports: (ticket) => ticket.creator_id === user.value.id && ticket.status.description === 'New',
    All: true,
    Amerinode: true,
    Operations: (ticket) => ticket.technicals.find(u => {
      return u.user_id === user.value.id && u.status === 'active'
    }) && ['Assigned', 'In Progress', 'Pending'].indexOf(ticket.status.description) !== -1,

  }
}*/

/*const canAction = (ticket) => {
  const byStatus = can.status.indexOf(ticket.status.description) !== -1
  let byRole = false
  if (byStatus) {
    roles.forEach(r => {
      byRole = byRole || ( typeof can.roles[r.name] === 'function'
        ? Boolean(can.roles[r.name](ticket)) : Boolean(can.roles[r.name])
      )
    })
  }

  return byStatus && byRole
}*/

const enableSave = computed(() => {
  return !!(cancelMotive.value)
})

onBeforeMount( () => {
  ticketId.value = route.params.ticketId
  loading.show()

  if (!projectSelected.value) {
    notifyError('In order to cancel this ticket, you must be assigned to the associated project')
    router.push({ name: "TicketsList" })
    return loading.hide()
  } else {
    resolver.all({
      ticket: ticketsService.get(ticketId.value),
      ticket_package: ticketsService.checkTicketPackage(projectSelected.value.id)
    }).then(x => {
      if (!canAction('cancel', x.ticket.data)) {
        notifyError('The ticket is not available to be canceled or you do not have the permissions to perform this action')
        router.push({ name: "TicketsList" })
        return loading.hide()
      }
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
        messages.value.push('The ticket does not belong to the selected project. To cancel the ticket, you must select the project of the ticket')
        notifyError('The ticket does not belong to the selected project. To cancel the ticket, you must select the project of the ticket')
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
        .catch((e) => {
          loading.hide()
          notifyError('An error occurred while obtaining ticket information')
        })
  }

})
</script>
