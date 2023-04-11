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
        title="Invitation"
        sub-title="You have been assigned to handle this ticket."
        :rows="[
          { label: 'ticket-accept-user-name', col: 6, query: { md: 2 } },
          { label: 'ticket-accept-user-email', col: 6, query: { md: 2 } },
          { label: 'ticket-accept-user-role', col: 6, query: { md: 2 } },
          { label: 'ticket-accept-user-info', col: 6 },
          { label: 'ticket-accept-info', col: 6 },
          { label: 'ticket-table', col: 6 }
        ]"
        separation
      >
        <template #ticket-accept-user-name>
          <base-input
            id="ticket-accept-user-name"
            v-model="assigned.name"
            label="Assigned name"
            type="text"
            is-disabled
          />
        </template>
        <template #ticket-accept-user-email>
          <base-input
            id="ticket-accept-user-email"
            v-model="assigned.email"
            label="Assigned email"
            type="text"
            is-disabled
          />
        </template>
        <template #ticket-accept-user-role>
          <base-input
            id="ticket-accept-user-role"
            v-model="assigned.role"
            label="Assigned role"
            type="text"
            is-disabled
          />
        </template>
        <template #ticket-accept-user-info>
          <base-input
            id="ticket-accept-user-info"
            v-model="assigned.info"
            label="Assigned information"
            type="text"
            is-disabled
          />
        </template>
        <template #ticket-accept-info>
          <base-input
            id="ticket-accept-info"
            v-model="acceptInformation"
            label="Indicate the necessary information or comment when accepting this ticket"
            type="text"
            is-required
          />
        </template>
        <template #ticket-table>
          <DataTable
            v-if="vector.length"
            :value="vector"
            :paginator="false"
            dataKey="id"
            :rowHover="true"
            responsiveLayout="scroll"
          >
            <Column field="name" header="Name">
              <template #body="{data}">
                {{ data.name }}
              </template>
            </Column>
            <Column field="email" header="Email">
              <template #body="{data}">
                {{ data.email }}
              </template>
            </Column>
            <Column field="roles" header="Roles">
              <template #body="{data}">
                <span
                  v-for="(role, $index) in data.roles"
                  :key="role.id"
                >
                  {{ role.name }}<span v-if="$index + 1 !== data.roles.length">, </span>
                </span>
              </template>
            </Column>
            <Column :exportable="false">
              <template #body="data">
                <button
                  type="button" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
                  v-if="!data.data.selected"
                  @click="($event) => acceptUser(data, true, $event)"
                >
                  <CheckCircleIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="sr-only">Accept</span>
                </button>
                <button
                  type="button" class="bg-white rounded-full p-1 mr-2 text-green-400 hover:bg-green-100 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
                  v-else
                  @click="($event) => acceptUser(data, false, $event)"
                >
                  <CheckCircleIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="sr-only">No Accept</span>
                </button>
              </template>
            </Column>
          </DataTable>
        </template>
      </FormPanel>
      <div class="mt-10 sm:mt-0">
        <div class="md:grid md:grid-cols-4 md:gap-6">
          <div class="md:col-span-1"></div>
          <div class="mt-5 md:mt-0 md:col-span-3">
            <form action="#" method="POST">
              <div>
                <div class="px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
                    :class="[disabledAction ? 'disabled:opacity-25':'']"
                    :disabled="disabledAction"
                    @click="(event) => saveData(event)"
                  >Make these changes permanent</button>
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
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { CheckCircleIcon } from '@heroicons/vue/24/solid'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import FormPanel from '@/components/FormPanel.vue'
import BaseInput from '@/components/BaseInput.vue'
import TicketHeader from '@/components/TicketHeader.vue'
import { loading } from '@/store/loading'
import ticketsService from '@/services/tickets.service.js'
import { notifyError } from '@/utils/notify_error.ts'
import { notifySuccess } from '@/utils/notify_success';
import TicketsForm from '@/views/Tickets/TicketsForm.vue'
import { useTrace } from './composable/trace'
import { useLoadTicket } from './composable/load_ticket'
import { useCan } from './composable/can_action'

const route = useRoute()
const router = useRouter()

const assigned = ref({
  name: '',
  email: '',
  role: '',
  info: ''
})
const acceptInformation = ref('')
const vector = ref([])
const ticketId = ref(route.params.ticketId)

const trace = useTrace({ description: 'Assign Technician', pathName: 'TicketsAccept'})
const { canAction } = useCan()
const { ticketData, project, oldSelectors, oldFiles } = useLoadTicket(ticketId.value, (data) => {
  if (!canAction('acceptM', data)) {
    notifyError('The ticket is not available to be accept or you do not have the permissions to perform this action')
    return router.push({ name: "TicketsList" })
  }

  loading.show()
  ticketsService.getInvitationtManager(ticketId.value)
    .then(x => {
      if (x.data.invitation) {
        assigned.value.name = x.data.invitation.reported_by.name
        assigned.value.email = x.data.invitation.reported_by.email
        let roles = ''
        x.data.invitation.reported_by.roles.forEach(item => { roles = roles + (!roles ? '' : ', ') + item.name })
        assigned.value.role = roles
        assigned.value.info = x.data.invitation.note
      }

      x.data.technicals.forEach(technical => {
        vector.value.push({
          id: technical.user.id,
          email: technical.user.email,
          name: technical.user.name,
          roles: technical.user.roles,
          selected: false
        })
      })

      loading.hide()
    })
    .catch((err) => {
      loading.hide()
      notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : 'An error occurred when consulting the information to accept the ticket')
    })
})

const disabledAction = computed(() => !vector.value.find(u => u.selected === true) || !acceptInformation.value)

const acceptUser = (user, accept, event) => {
  event.preventDefault()

  if (accept) {
    const accepted = vector.value.find(u => u.selected === true)
    if (accepted) accepted.selected = false
  }
  user.data.selected = accept
}

const saveData = (event) => {
  event.preventDefault()

  ticketsService.acceptInvitationByManager(ticketId.value, {
    acceptInformation: acceptInformation.value,
    acceptUser: vector.value.find(u => u.selected === true).id
  })
    .then(x => {
      notifySuccess('Update ticket', x.data)
      router.push({ name: "TicketsList" })
    })
    .catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
}

</script>
