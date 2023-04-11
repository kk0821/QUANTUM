<template>
  <div>
  <form class="bg-gray-100 px-5 py-5">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="grid grid-cols-1 sm:grid-cols-6">
        <div class="col-span-6">
          <DataTable :value="slaTicket" :resizableColumns="true" columnResizeMode="fit"
                     dataKey="id" :rowHover="true" :loading="loading" responsiveLayout="scroll">
            <template #header>
              <div class="lg:flex lg:items-center">
                <div class="lg:flex-auto">
                  <h1 class="text-xl font-semibold text-gray-900">SLA running</h1>
                  <p class="mt-2 text-sm font-normal text-gray-700">These are the SLAs processed on the current ticket</p>
                </div>
              </div>
            </template>
            <template #empty>
              No SLA found.
            </template>
            <template #loading>
              <div class="grid place-items-center h-screen">
                <svg role="status" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
              </div>
            </template>
            <Column field="running_sla_name" header="Name" class="min-w-[8rem] sm:max-w-full">
              <template #body="{data}">
                <span class="text-gray-600 sm:font-semibold lg:font-normal">{{data.running_sla_name}}</span>
                <dl class="font-normal lg:hidden">
                  <dt class="sr-only">Time elapsed</dt>
                  <dd class="mt-1 truncate text-gray-500 italic">{{ data.time_elapsed }}</dd>
                  <dt class="sr-only">Start</dt>
                  <dd class="mt-1 truncate text-gray-500 italic">{{ formatDate(data.created_at_tz, true, true) }}</dd>
                  <dt class="sr-only">End</dt>
                  <dd class="mt-1 truncate text-gray-500 italic">{{ formatDate(data.due_date_tz, true, true) }}</dd>
                </dl>
              </template>
            </Column>
            <Column field="status_sla" header="Status" class="min-w-[8rem]">
              <template #body="{data}">
                <span
                    class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium uppercase cursor-pointer"
                    :class="[
                      data.status_sla === 'on_time' ? 'bg-green-100 text-green-800' : '',
                      data.status_sla === 'late' ? 'bg-red-100 text-red-800' : '',
                      data.status_sla === 'at_risk' ? 'bg-amber-100 text-amber-800' : '',
                      data.status_sla === 'pause' ? 'bg-gray-200 text-gray-800' : '']"
                >
                  <div class="flex items-center">
                    <div>
                      <ArrowPathRoundedSquareIcon v-show="data.status_sla === 'on_time'" class="h-4 w-4" aria-hidden="true" />
                      <XMarkIcon v-show="data.status_sla === 'late'" class="h-4 w-4" aria-hidden="true" />
                      <BellAlertIcon v-show="data.status_sla === 'at_risk'" class="h-4 w-4" aria-hidden="true" />
                      <PauseIcon v-show="data.status_sla === 'pause'" class="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div class="ml-1">
                      <p>{{sanitizeStatus(data.status_sla)}}</p>
                    </div>
                  </div>
                </span>
              </template>
            </Column>
            <Column field="time_elapsed" header="Time elapsed" class="min-w-[14rem] hidden lg:table-cell">
              <template #body="{data}">
                {{data.time_elapsed}}
              </template>
            </Column>
            <Column field="created_at_tz" header="Start" class="min-w-[10rem] hidden lg:table-cell">
              <template #body="{data}">
                {{ formatDate(data.created_at_tz_formatted, true, true) }}
              </template>
            </Column>
            <Column field="due_date_tz" header="End" class="min-w-[10rem] hidden lg:table-cell">
              <template #body="{data}">
                {{ formatDate(data.due_date_tz_formatted, true, true) }}
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </form>
  </div>
</template>
<script setup>
import {inject, onBeforeMount, ref} from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ticketsService from "@/services/tickets.service";
import {notifyError} from "@/utils/notify_error";
import { formatDate } from '@/utils/format_date.ts'
import { BellAlertIcon, ArrowPathRoundedSquareIcon, PauseIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const dialogRef = inject('dialogRef');
const loading = ref(true)
const slaTicket = ref()
const ticketId = ref()
const statuses = ref([
  { id: 'on_time', name: 'On Time' },
  { id: 'pause', name: 'Pause' },
  { id: 'at_risk', name: 'At Risk' },
  { id: 'late', name: 'Late' }
])

onBeforeMount( () => {
  ticketId.value = dialogRef.value.data.ticketId
  ticketsService.getSlaTicket(ticketId.value)
      .then(resp => {
        slaTicket.value = resp.data
        loading.value = false
      })
      .catch(err =>  {
        notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message)
        loading.value = false
      })

})

function sanitizeStatus(status)
{
  let statusSanitized = status
  statuses.value.forEach((element) => {
    if (element.id === status) {
      statusSanitized = element.name
    }
  })
  return statusSanitized
}
</script>

<style>
.p-dialog-content {
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-bottom: 0 !important;
}
.p-dialog-footer {
  padding-top: 1.5rem !important;
}
</style>
