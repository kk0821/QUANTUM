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
        title="Users"
        sub-title="List users assigned on this ticket."
        :rows="[{label: 'ticket-table', col: 6}, 'ticket-add', 'ticket-add-btn', {label: 'ticket-add-input', col: 6}]"
        :grid="{ cols: 6 }"
        separation
      >
        <template #ticket-table>
          <DataTable
            v-if="tableUsers.length"
            :value="tableUsers"
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
                <button type="button" @click="($event) => removeUser(data, $event)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                  <TrashIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="sr-only">Remove</span>
                </button>
              </template>
            </Column>
          </DataTable>
        </template>
        <template #ticket-add v-if="usersOptions.length">
          <Listbox as="div" v-model="selectedUser">
            <ListboxLabel class="block text-sm font-medium text-gray-700">Users</ListboxLabel>
            <div class="relative mt-1">
              <ListboxButton
                class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
              >
                <span class="block truncate" v-if="selectedUser.name">{{ selectedUser.name }}</span>
                <span class="block truncate" v-else>Select user</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              <transition
                  leave-active-class="transition duration-100 ease-in"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
              >
                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption
                      v-slot="{ active, selected }"
                      v-for="user in usersOptions"
                      :key="user.id"
                      :value="user"
                      as="template"
                  >
                    <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-4 pr-4']">
                      <div class="flex items-center">
                        <span :class="['ml-3 truncate', selected && 'font-semibold']">{{ user.name }}</span>
                      </div>
                      <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-4 text-amerinode-blue-600">
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </template>
        <template #ticket-add-btn>
          <br/>
          <button
            v-show="usersOptions.length"
            type="submit"
            @click="(event) => addUser(event)"
            :class="[ !selectedUser.id ? 'disabled:opacity-25':'']"
            :disabled="!selectedUser.id"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
          >Select this user for the ticket</button>
        </template>
        <template #ticket-add-input>
          <base-input
            id="ticket-info"
            v-model="userInformation"
            label="Indicate the necessary information for the assigned technicians"
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
                    Make these changes permanent
                  </LoadingButton>
                  <!--<button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
                    :class="[ !tableUsers.length || !userInformation ? 'disabled:opacity-25':'']"
                    :disabled="!tableUsers.length || !userInformation"
                    @click="(event) => saveData(event)"
                  >Make these changes permanent</button>-->
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
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'

import { CheckIcon, ChevronUpDownIcon, TrashIcon } from '@heroicons/vue/24/solid'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import FormPanel from '@/components/FormPanel.vue'
import BaseInput from '@/components/BaseInput.vue'
import TicketHeader from '@/components/TicketHeader.vue'
import TicketsForm from '@/views/Tickets/TicketsForm.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import resolver from '@/utils/_resolver.ts'
import ticketsService from '@/services/tickets.service.js'
import userService from '@/services/user.service'
import { loading } from '@/store/loading'
import { loadingButton } from '@/store/loadingButton'
import { notifyError } from '@/utils/notify_error.ts'
import { notifySuccess } from '@/utils/notify_success'
import { useTrace } from './composable/trace'
import { useLoadTicket } from './composable/load_ticket'
import { useCan } from './composable/can_action'

const route = useRoute()
const router = useRouter()
const ticketId = ref(route.params.ticketId)
const users = ref([])
const usersSelected = ref([])
const selectedUser = ref({})
const userInformation = ref('')
const trace = useTrace({ description: 'Assign Technician', pathName: 'TicketsAddUser'})
const { canAction } = useCan()
const { ticketData, project, oldSelectors, oldFiles } = useLoadTicket(ticketId.value, (data) => {
  if (!canAction('assign', data)) {
    notifyError('The ticket is not available to be assigned or you do not have the permissions to perform this action')
    return router.push({ name: "TicketsList" })
  }

  loading.show()
  resolver.all({
    technicals: ticketsService.getTechnicals(ticketId.value),
    users: userService.usersTechnicals()
  }).then(x => {
      users.value = x.users.data
      x.technicals.data.technicals.forEach(technical => {
        usersSelected.value.push({
          id: technical.user.id,
          email: technical.user.email,
          name: technical.user.name,
          roles: technical.user.roles,
          old: true
        })
      })

      if (x.technicals.data.invitation) {
        userInformation.value = x.technicals.data.invitation.note
      }

      loading.hide()
    })
    .catch(() => {
      loading.hide()
      notifyError('An error occurred while getting ticket assignment information')
    })
})

const tableUsers = computed(() => usersSelected.value.filter(user => !user.deletedAt))
const usersOptions = computed(() => users.value.filter(user => {
  return !usersSelected.value.find(us => us.id === user.id && !us.deletedAt)
}))

const addUser = (event) => {
  event.preventDefault()
  if (usersSelected.value.find(user => selectedUser.value.id === user.id && !user.deletedAt)) {
    notifyError('This user was previously assigned')
  }

  usersSelected.value.push({
    id: selectedUser.value.id,
    email: selectedUser.value.email,
    name: selectedUser.value.name,
    roles: selectedUser.value.roles
  })

  selectedUser.value = {}
}

const removeUser = (user, event) => {
  event.preventDefault()

  if (user.data && user.data.old) {
    user.data.deletedAt = new Date()
  } else {
    const idx = usersSelected.value.findIndex((us) =>  us.id === user.data.id)
    usersSelected.value.splice(idx, 1)
  }
}

const enableSave = computed(() => {
  return !!(userInformation.value && tableUsers.value.length)
})

const saveData = (event) => {
  event.preventDefault()
  loadingButton.show()
  ticketsService.addUsers(ticketId.value, {
    mapUsers: usersSelected.value.map(user => ({ id: user.id, deletedAt: user.deletedAt, old: user.old })),
    userInformation: userInformation.value
  }).then(x => {
    notifySuccess('Update users', x.data)
    router.push({ name: "TicketsList" })
  }).catch(err => {
    notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message)
  }).finally(() => {
    loadingButton.hide()
  })
}
</script>
