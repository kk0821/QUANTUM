<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pt-5 pb-5 border-b border-gray-200">
          <ticket-header :ticket="ticketData" :project="project" />
        </div>
      </div>
      <div class="mx-auto" v-if="project && ticketPackage.id">
        <TicketsForm
          :ticket="ticketData"
          :project="project"
          :ticket-package-id="ticketPackage.id"
          :file-limit="3"
          @save="saveData" />
      </div>
      <div v-else>
        <alert
            v-show="!project || !ticketPackage.id"
            :title="'Attention'"
            :message="messages"
            :alert-type="'warning'"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from 'vue';
import { useRouter } from 'vue-router'
import { loading } from '@/store/loading'
import { loadingButton } from '@/store/loadingButton'
import { encryptStorage } from '@/services/http.service'
import resolver from '@/utils/_resolver.ts'
import ticketsService from '@/services/tickets.service.js'
import { notifyError } from '@/utils/notify_error.ts'
import { notifySuccess } from '@/utils/notify_success'
import Alert from '@/components/Alert.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import TicketHeader from '@/components/TicketHeader.vue'
import TicketsForm from '@/views/Tickets/TicketsForm.vue'

const router = useRouter()
const ticketData = ref({
  identify: '1',
  created_at: new Date().toLocaleString(),
  creator: encryptStorage.getItem('user'),
  additional_information: { },
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

const project = ref(encryptStorage.getItem('project') ? encryptStorage.getItem('project') : undefined)
const ticketPackage = ref({})
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Tickets', pathName: 'TicketsList', isLink: true, current: false },
  { description: 'Create', pathName: 'TicketsCreate', isLink: false, current: true }
]
const messages = ref([])
let saveData = () => {}
if (project.value) {
  saveData = (event) => {
    loadingButton.show()
    ticketsService.save(0, {
      'ticket': event.ticket,
      'selectors': event.selectors,
      'listFiles': event.listFiles,
      'project': project.value.id,
      'ticketPackageId': event.ticketPackageId,
    }).then(x => {
      notifySuccess('Update', x.data)
      router.push({ name: "TicketsList" })
    }).catch(err =>  {
      notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message)
    }).finally(() => {
      loadingButton.hide()
    })
  }

  onBeforeMount( () => {
    loading.show()
    resolver.all({
      ticket: ticketsService.getNumber(project.value.id),
      ticket_package: ticketsService.checkTicketPackage(project.value.id)
    }).then(x => {

      if (project.value.project_type.service_type.code === "HW") {
        messages.value.push('You can only create a ticket if the selected project is of type Software')
        notifyError('You can only create a ticket if the selected project is of type Software')
      }

      ticketData.value.identify = x.ticket.data.newCode || 1
      ticketData.value.created_at = x.ticket.data.created_at
      ticketPackage.value = x.ticket_package.data

      if (!ticketPackage.value) {
        messages.value.push('No has ticket packages on this branch')
        notifyError('No has ticket packages on this branch')
      }

    }).catch(() => {
      notifyError('An error occurred while obtaining ticket information')
    }).finally(() => {
      loading.hide()
    })
  })

} else {
  messages.value.push('To create ticket you need an assigned project')
  notifyError('To create ticket you need an assigned project')
}

</script>
