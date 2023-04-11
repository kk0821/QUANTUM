<template>
  <div>
    <div class="px-4 py-4 sm:px-6 lg:px-8">
      <breadcrumbs :trace-route="trace" />
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <DataTable
                :value="tickets" :paginator="true" :rows="5"
                dataKey="id" :rowHover="true" v-model:filters="filters" filterDisplay="menu" :loading="loading"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5,10,25,50]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                :globalFilterFields="['codeIdentify','sla_status.running_sla','project.name','details.severity.name','details.technology.description','service_type.description','status.description']"
                responsiveLayout="scroll"
              >
                <template #header>
                  <div class="sm:flex sm:items-center">
                    <div class="sm:flex-auto">
                      <h1 class="text-xl font-semibold text-gray-900">Tickets</h1>
                      <p class="mt-2 text-sm font-normal text-gray-700">Tickets available for this user.</p>
                    </div>
                    <div class="mt-4 sm:mt-0 sm:ml-16 inline-flex items-center sm:flex-none">
                      <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                      <router-link
                        v-if="canAction('create', true)"
                        to="/tickets/create"
                        class="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-amerinode-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-amerinode-blue-500 focus:ring-offset-2 sm:w-auto">
                        <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        New tickets
                      </router-link>
                    </div>
                  </div>
                </template>
                <template #empty>
                  No tickets found.
                </template>
                <template #loading>
                  <div class="grid place-items-center h-screen">
                    <svg role="status" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                  </div>
                </template>
                <Column field="codeIdentify" header="Ticket" sortable class="min-w-[5rem] sm:max-w-full">
                  <template #body="{data}">
                    <span class="font-bold">{{data.code_identify}}</span>
                    <dl class="font-normal lg:hidden">
                      <dt class="sr-only">Project</dt>
                      <dd class="mt-1 truncate text-gray-700">{{ data.project.name }}</dd>
                      <dt class="sr-only">Status</dt>
                      <dd class="mt-1 truncate text-gray-500 italic">{{ data.status.description }}</dd>
                      <dt class="sr-only">Branch</dt>
                      <dd class="mt-1 truncate text-gray-500">
                        <div class="flex items-center">
                          <div>
                            <img :id="data.project.branch.country.id" class="inline-block h-4 w-4 rounded-full" :src="data.project.branch.country.flag_url" alt="" />
                          </div>
                          <div class="ml-3">
                            <p>{{ data.project.branch.company.description }}</p>
                          </div>
                        </div>
                      </dd>
                    </dl>
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by number ticket"/>
                  </template>
                </Column>
                <Column field="sla_status.running_sla" header="SLA" sortable class="min-w-[10rem] max-w-[10rem]">
                  <template #body="{data}">
                    <status-sla
                        :sla="data.sla_status"
                        :ticket-id="data.id"
                    />
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by SLA"/>
                  </template>
                </Column>
                <Column field="project.branch.country.name" header="Country" sortable class="min-w-[10rem] hidden lg:table-cell">
                  <template #body="{ data }">
                    <div class="flex-shrink-0 group block">
                      <div class="flex items-center">
                        <div>
                          <img :id="data.project.branch.country.id" class="inline-block h-9 w-9 rounded-full" :src="data.project.branch.country.flag_url" alt="" />
                        </div>
                        <div class="ml-3">
                          <p class="text-sm font-medium">{{ data.project.branch.country.name }}</p>
                          {{ data.project.branch.company.description }}
                        </div>
                      </div>
                    </div>
                  </template>
                </Column>
                <Column field="project.name" header="Project" sortable class="min-w-[10rem] hidden lg:table-cell">
                  <template #body="{ data }">
                    {{ data.project.name }}
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by project"/>
                  </template>
                </Column>
                <Column field="details.severity.name" header="Severity" class="min-w-[4rem] hidden lg:table-cell">
                  <template #body="{data}">
                    {{ data.details.severity.name }}
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by severity"/>
                  </template>
                </Column>
                <Column field="status.description" header="Status" class="min-w-[4rem] hidden lg:table-cell">
                  <template #body="{data}">
                    {{ data.status.description }}
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by status"/>
                  </template>
                </Column>
                <Column class="min-w-[4rem]" :exportable="false">
                  <template #body="slotProps">
                    <div class="ml-4 flex items-center md:ml-6">
                      <router-link :to="{ name: 'TicketsShow', params: { ticketId: slotProps.data.id }}" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <EyeIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">show</span>
                      </router-link>
                      <router-link
                        v-if="canAction('edit', slotProps.data)"
                        :to="{ name: 'TicketsEdit', params: { ticketId: slotProps.data.id }}"
                        class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <PencilIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">edit</span>
                      </router-link>
                      <router-link
                        v-if="canAction('cancel', slotProps.data)"
                        :to="{ name: 'TicketsCancel', params: { ticketId: slotProps.data.id }}"
                        class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <TrashIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">Cancel</span>
                      </router-link>
                      <router-link
                        v-if="canAction('assign', slotProps.data)"
                        :to="{ name: 'TicketsAddUser', params: { ticketId: slotProps.data.id }}"
                        class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <UsersIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">Assign</span>
                      </router-link>
                      <router-link
                        v-if="canAction('accept', slotProps.data)"
                        :to="{ name: 'TicketsAccept', params: { ticketId: slotProps.data.id }}"
                        class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <CheckCircleIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">Accept</span>
                      </router-link>
                      <router-link
                        v-if="canAction('acceptM', slotProps.data)"
                        :to="{ name: 'TicketsManagerAccept', params: { ticketId: slotProps.data.id }}"
                        class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <CheckCircleIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">Accept</span>
                      </router-link>
                      <router-link
                        v-if="canAction('pending', slotProps.data)"
                        :to="{ name: 'TicketsPending', params: { ticketId: slotProps.data.id }}"
                        class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <PauseIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">Stop progress</span>
                      </router-link>
                      <router-link
                          v-if="canAction('pauseRestored', slotProps.data)"
                          :to="{ name: 'TicketsPauseRestored', params: { ticketId: slotProps.data.id }}"
                          class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <PauseIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">Pause restored</span>
                      </router-link>
                      <router-link
                          v-if="canAction('pauseResolved', slotProps.data)"
                          :to="{ name: 'TicketsPauseResolved', params: { ticketId: slotProps.data.id }}"
                          class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <PauseIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">Pause resolved</span>
                      </router-link>
                      <router-link
                        v-if="canAction('inProgress', slotProps.data)"
                        :to="{ name: 'TicketsInProgress', params: { ticketId: slotProps.data.id }}"
                        class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <PlayIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">Continue progress</span>
                      </router-link>
                      <router-link
                        v-if="canAction('restored', slotProps.data)"
                        :to="{ name: 'TicketsRestored', params: { ticketId: slotProps.data.id }}"
                        class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <ForwardIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">Restored service</span>
                      </router-link>
                      <router-link
                        v-if="canAction('resolved', slotProps.data)"
                        :to="{ name: 'TicketsResolved', params: { ticketId: slotProps.data.id }}"
                        class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <CheckBadgeIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">Resolved ticket</span>
                      </router-link>
                      <router-link
                        v-if="canAction('close', slotProps.data)"
                        :to="{ name: 'TicketsClose', params: { ticketId: slotProps.data.id }}"
                        class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <ShieldCheckIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">Close ticket</span>
                      </router-link>
                    </div>
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <DynamicDialog />
</template>

<script setup>
import { onMounted, ref } from 'vue'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import {FilterMatchMode, FilterOperator} from 'primevue/api'
import DynamicDialog from 'primevue/dynamicdialog';
import {
  CheckCircleIcon, EyeIcon, PencilIcon, PlusIcon, TrashIcon, UsersIcon,
  PauseIcon, PlayIcon, ForwardIcon, CheckBadgeIcon, ShieldCheckIcon
} from '@heroicons/vue/24/outline'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ticketsService from '@/services/tickets.service.js'
import { notifyError } from '@/utils/notify_error.ts'
import { useTrace } from './composable/trace'
import { useCan } from './composable/can_action'
import StatusSla from "@/components/StatusSla.vue";
import {encryptStorage} from "@/services/http.service";

const tickets = ref()
const loading = ref(true)
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'status': {value: null, matchMode: FilterMatchMode.EQUALS},
  'codeIdentify': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'sla_status.running_sla': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'project.name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'details.severity.name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'details.technology.description': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'service_type.description': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'status.description': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
})
const trace = useTrace()
const { canAction } = useCan()
const projectSelected = ref(encryptStorage.getItem('project') ? encryptStorage.getItem('project') : undefined)

const loadTable = () => {
  ticketsService.list({
    project_id: (projectSelected.value) ? projectSelected.value.id : null
  })
    .then(resp => {
      tickets.value = resp.data
      loading.value = false
    })
    .catch(err =>  {
      notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message)
      loading.value = false
    })
}

onMounted(() => { loadTable() })
</script>
