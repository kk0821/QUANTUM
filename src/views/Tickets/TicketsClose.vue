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
        title="Close ticket"
        sub-title="Once the solution report is approved, proceed to close the ticket and finish the process."
        :rows="[
          { label: 'ticket-close-info-media', col: 6 },
          { label: 'ticket-close-info', col: 6 },
        ]"
        separation
      >
        <template #ticket-close-info-media>
          <TicketsFiles
              v-if="ticketData.id"
              title="Solution report"
              :ticket-id="ticketData.id"
              :old-files="[]"
              canEdit
              :project-id="project.id"
              :file-limit="1"
              type="closed-info"
              @change="updateListFiles"
          />
        </template>
        <template #ticket-close-info>
          <base-input
            id="ticket-close-info"
            v-model="closeInformation"
            label="Final comment to close the ticket"
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
                    Close ticket
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
import TicketsFiles from '@/views/Tickets/TicketsFiles.vue'
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

const closeInformation = ref('')
const ticketId = ref(route.params.ticketId)
const listFiles = ref([])

const trace = useTrace({ description: 'Close ticket', pathName: 'TicketsRestored'})
const { canAction } = useCan()
const { ticketData, project, oldSelectors, oldFiles } = useLoadTicket(ticketId.value, (data) => {
  if (!canAction('close', data)) {
    notifyError('The ticket is not available to be closed or you do not have the permissions to perform this action')
    return router.push({ name: "TicketsList" })
  }
})

const updateListFiles = ($event) => {
  listFiles.value = $event.list
}

const enableSave = computed(() => {
  return !!(closeInformation.value && listFiles.value.length)
})

const saveData = (event) => {
  event.preventDefault()
  loadingButton.show()
  ticketsService.closeTicket(ticketId.value, {
    closeInformation: closeInformation.value,
    listFiles: listFiles.value
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
