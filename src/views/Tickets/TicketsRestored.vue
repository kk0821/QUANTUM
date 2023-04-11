<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pt-5 pb-5 border-b border-gray-200">
          <ticket-header v-if="ticketData.id" :ticket="ticketData" :project="project" />
        </div>
      </div>
      <div class="mx-auto">
        <TicketsForm
          v-if="ticketData.id"
          :ticket="ticketData"
          :project="project"
          :ticket-package-id="ticketData.ticketPackageId"
          :old-selectors="oldSelectors"
          :old-files="oldFiles"
          :can-edit="false"
          hidden-panel
        />
      </div>
      <FormPanel
        title="Restored service"
        sub-title="The restoration of the service affected in the incident has been attended to and confirmed."
        :rows="[
          { label: 'ticket-restored-info', col: 6 }
        ]"
        separation
      >
        <template #ticket-restored-info>
          <base-input
            id="ticket-restored-info"
            v-model="restoredInformation"
            label="Give a comment about service restoration"
            type="text"
            is-required
          />
        </template>
      </FormPanel>
      <div class="mt-10 sm:mt-0">
        <div class="lg:grid lg:grid-cols-6 lg:gap-6">
          <div class="lg:col-span-4"></div>
          <div class="mt-5 lg:mt-0 lg:col-span-2">
            <form action="#" method="POST">
              <div>
                <div class="px-4 py-3 text-right sm:px-6">
                  <LoadingButton
                      :is-loading="loadingButton.state"
                      :enable-save="enableSave"
                      background-color="bg-amerinode-blue-600"
                      :action-click="(event) => saveData(event)"
                  >
                    Indicate service restored
                  </LoadingButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import {computed, ref} from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import FormPanel from '@/components/FormPanel.vue'
import BaseInput from '@/components/BaseInput.vue'
import TicketHeader from '@/components/TicketHeader.vue'
import TicketsForm from '@/views/Tickets/TicketsForm.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import ticketsService from '@/services/tickets.service.js'
import { loading } from '@/store/loading'
import { loadingButton } from '@/store/loadingButton'
import { notifyError } from '@/utils/notify_error.ts'
import { notifySuccess } from '@/utils/notify_success'
import { useTrace } from './composable/trace'
import { useLoadTicket } from './composable/load_ticket'
import { useCan } from './composable/can_action'

const route = useRoute()
const router = useRouter()

const restoredInformation = ref('')
const ticketId = ref(route.params.ticketId)

const trace = useTrace({ description: 'Restored service', pathName: 'TicketsRestored'})
const { canAction } = useCan()
const { ticketData, project, oldSelectors, oldFiles } = useLoadTicket(ticketId.value, (data) => {
  if (!canAction('restored', data)) {
    notifyError('The ticket is not available to restore service or you do not have the permissions to perform this action')
    return router.push({ name: "TicketsList" })
  }
})

const enableSave = computed(() => {
  return !!(restoredInformation.value)
})

const saveData = (event) => {
  event.preventDefault()
  loadingButton.show()
  ticketsService.restoredServices(ticketId.value, {
    restoredInformation: restoredInformation.value
  }).then(x => {
    notifySuccess('Update ticket', x.data)
    router.push({ name: "TicketsList" })
  }).catch(err => {
    notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message)
  }).finally(() => {
    loadingButton.hide()
  })
}

</script>
