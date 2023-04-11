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
        title="Pause restored"
        sub-title="This action will stop the ticket service process until the requirements for it are completed."
        :rows="[
          { label: 'ticket-pause-restored', col: 6 }
        ]"
        separation
      >
        <template #ticket-pause-restored>
          <base-input
            id="ticket-pause-restored"
            v-model="pauseInformation"
            label="Indicates the reason why you are pausing the process"
            type="text"
            is-required
          />
        </template>
      </FormPanel>
      <div class="mt-10 sm:mt-0">
        <div class="lg:grid lg:grid-cols-6 lg:gap-6">
          <div class="lg:col-span-5"></div>
          <div class="mt-5 lg:mt-0 lg:col-span-1">
            <form action="#" method="POST">
              <div>
                <div class="px-4 py-3 text-right sm:px-6">
                  <LoadingButton
                      :is-loading="loadingButton.state"
                      :enable-save="enableSave"
                      background-color="bg-amerinode-blue-600"
                      :action-click="(event) => saveData(event)"
                  >
                    Pause
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

const pauseInformation = ref('')
const ticketId = ref(route.params.ticketId)

const trace = useTrace({ description: 'Pause restored', pathName: 'TicketsPauseRestored'})
const { canAction } = useCan()
const { ticketData, project, oldSelectors, oldFiles } = useLoadTicket(ticketId.value, (data) => {
  if (!canAction('pauseRestored', data)) {
    notifyError('The ticket is not available to pause this status or you do not have the permissions to perform this action')
    return router.push({ name: "TicketsList" })
  }
})

const enableSave = computed(() => {
  return !!(pauseInformation.value)
})

const saveData = (event) => {
  event.preventDefault()
  loadingButton.show()
  ticketsService.pauseRestored(ticketId.value, {
    pauseInformation: pauseInformation.value
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
