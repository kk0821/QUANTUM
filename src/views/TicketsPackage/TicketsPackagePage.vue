<template>
  <div>
    <div class="px-4 py-4 sm:px-6 lg:px-8">
      <breadcrumbs :trace-route="trace" />
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <DataTable
                :value="ticketsPackages" :paginator="true" :rows="5"
                dataKey="id" :rowHover="true" v-model:filters="filters" filterDisplay="menu" :loading="loading"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5,10,25,50]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                :globalFilterFields="['name','technology.description','branch.country.name','branch.company.description']"
                responsiveLayout="scroll"
              >
                <template #header>
                  <div class="sm:flex sm:items-center">
                    <div class="sm:flex-auto">
                      <h1 class="text-xl font-semibold text-gray-900">Tickets package</h1>
                      <p class="mt-2 text-sm font-normal text-gray-700">A list of all Tickets package available.</p>
                    </div>
                    <div class="mt-4 sm:mt-0 sm:ml-16 inline-flex items-center sm:flex-none">
                      <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                      <router-link to="/tickets-package/create" class="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-amerinode-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-amerinode-blue-500 focus:ring-offset-2 sm:w-auto">
                        <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        New tickets package
                      </router-link>
                    </div>
                  </div>
                </template>
                <template #empty>
                  No tickets package found.
                </template>
                <template #loading>
                  <div class="grid place-items-center h-screen">
                    <svg role="status" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                  </div>
                </template>
                <Column field="project.name" header="Project" sortable class="min-w-[10rem] max-w-[15rem]">
                  <template #body="{data}">
                    <div class="flex-shrink-0 group block">
                      <div class="flex items-center">
                        <div>
                          <img :id="data.project.branch.country.id" class="inline-block h-9 w-9 rounded-full" :src="data.project.branch.country.flag_url" alt="" />
                        </div>
                        <div class="ml-3">
                          <p class="text-sm font-medium">{{ data.project.name }}</p>
                          {{ data.project.branch.company.description }}
                        </div>
                      </div>
                    </div>
                  </template>
                </Column>
                <Column field="severity" header="Severities" class="max-w-[7rem]">
                  <template #body="{data}">
                    <span>{{ availableSeverities(data.details) }}</span>
                  </template>
                </Column>
                <Column field="technology" header="Technologies" class="max-w-[8rem]">
                  <template #body="{data}">
                    <span>{{ availableTechnologies(data.details) }}</span>
                  </template>
                </Column>
                <Column field="name" header="Name" sortable class="max-w-[10rem]">
                  <template #body="{data}">
                    {{ data.name }}
                  </template>
                </Column>
                <Column field="service_type.code" header="Service Type" sortable class="max-w-[8rem]">
                  <template #body="{data}">
                    {{ data.service_type.code }}
                  </template>
                </Column>
                <Column field="package" header="Package" class="max-w-[8rem]">
                  <template #body="{data}">
                    {{ data.details.reduce((old, current) => ({ remaining_tickets: old.remaining_tickets + current.remaining_tickets }), { remaining_tickets: 0 }).remaining_tickets }}
                    /{{ data.details.reduce((old, current) => ({ package: old.package + current.package }), { package: 0 }).package }}
                  </template>
                </Column>
                <Column field="valid_from" header="Expiration" class="min-w-[8rem] max-w-[15rem]">
                  <template #body="{data}">
                    <div v-if="data.valid_from" class="flex-shrink-0 group block">
                      <div class="flex items-center">
                        <div>
                          <p>{{ data.valid_from }}</p>
                          <div class="flex place-content-center">
                            <ArrowsUpDownIcon class="h-3 w-3 my-1" aria-hidden="true" />
                          </div>
                          <p>{{ data.valid_until }}</p>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <span class="text-center">N/A</span>
                    </div>
                  </template>
                </Column>
                <Column field="status" header="Status" sortable :filterMenuStyle="{'width':'14rem'}" class="max-w-[9rem]">
                  <template #body="{data}">
                    <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium uppercase" :class="data.status === 'active' ? 'bg-green-100 text-green-800': 'bg-red-100 text-red-800'">{{data.status}}</span>
                  </template>
                  <template #filter="{filterModel}">
                    <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter" :showClear="true">
                      <template #value="slotProps">
                        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium uppercase" :class="slotProps.value === 'active' ? 'bg-green-100 text-green-800': 'bg-red-100 text-red-800'" v-if="slotProps.value">{{slotProps.value}}</span>
                        <span v-else>{{slotProps.placeholder}}</span>
                      </template>
                      <template #option="slotProps">
                        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium uppercase" :class="slotProps.option === 'active' ? 'bg-green-100 text-green-800': 'bg-red-100 text-red-800'">{{slotProps.option}}</span>
                      </template>
                    </Dropdown>
                  </template>
                </Column>
                <Column :exportable="false">
                  <template #body="slotProps">
                    <div class="ml-4 flex items-center md:ml-6">
                      <router-link :to="{ name: 'TicketsPackageShow', params: { ticketPackageId: slotProps.data.id }}" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <EyeIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">show</span>
                      </router-link>
                      <router-link :to="{ name: 'TicketsPackageEdit', params: { ticketPackageId: slotProps.data.id }}" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <PencilIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">edit</span>
                      </router-link>
                      <button v-show="slotProps.data.status === 'active'" type="button" @click="confirmDelete(slotProps.data)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <TrashIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">Cancelar</span>
                      </button>
                    </div>
                  </template>
                </Column>
              </DataTable>
              <dialog-confirm
                :showDialog="ticketPackageModal.show"
                :title="'Inactive tickets package'"
                :message="ticketPackageModal.msg"
                @executeAction="deleteRegister"
                @closeDialog="confirmDelete"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { FilterMatchMode } from 'primevue/api';

import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, ArrowsUpDownIcon } from '@heroicons/vue/24/outline'

import DialogConfirm from '@/components/DialogConfirm.vue'
import { notifyError } from "@/utils/notify_error.ts";
import { notifySuccess } from "@/utils/notify_success";
import ticketsPackageService from "@/services/tickets_package.service.js"
import Breadcrumbs from '@/components/Breadcrumbs.vue'

const ticketsPackages = ref()
const ticketPackageModal = ref({
  show: false,
  msg: '',
  id: undefined
})
const loading = ref(true)

let statuses = ref([
  'active', 'inactive'
]);

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Tickets package', pathName: 'TicketsPackageList', isLink: false, current: true }
]

const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'status': {value: null, matchMode: FilterMatchMode.EQUALS},
})

const confirmDelete = (data) => {
  console.log(data)
  if (data) {
    ticketPackageModal.value.show = true
    ticketPackageModal.value.id = data.id
    ticketPackageModal.value.msg = `Are you sure you want to inactive the tickets package?. Contract reference: "${data.name}"`
  } else {
    ticketPackageModal.value.show = false
    ticketPackageModal.value.id = undefined
    ticketPackageModal.value.msg = ''
  }
}

const deleteRegister = () => {
  ticketsPackageService.delete(ticketPackageModal.value.id)
    .then(x => {
      ticketsPackages.value.find(ticketPackage => {
        return ticketPackage.id === ticketPackageModal.value.id
      }).status = 'inactive'
      notifySuccess('Deleted', x.data)
      confirmDelete()
    }).catch(err => {
      notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message)
      confirmDelete()
    })
}

const loadTable = () => {
  ticketsPackageService.list()
    .then(resp => {
      ticketsPackages.value = resp.data
      loading.value = false
    }).catch(err => {
      loading.value = false
    })
}

const availableTechnologies = (data) => {
  let arrTechnologies = []
  let technologies = ''
  data.forEach(detail => {
    detail.technologies.forEach(item => {
      if (arrTechnologies.indexOf(item.description) === -1) arrTechnologies.push(item.description)
    })
  })
  arrTechnologies.forEach(function (value, i) {
    technologies = technologies.concat(value, (i + 1 < arrTechnologies.length) ? ', ': '')
  })
  return technologies
}

const availableSeverities = (data) => {
  let arrSeverities = []
  let severities = ''
  data.forEach(detail => {
    detail.severities.forEach(item => {
      if (arrSeverities.indexOf(item.code) === -1) arrSeverities.push(item.code)
    })
  })
  arrSeverities.forEach(function (value, i) {
    severities = severities.concat(value, (i + 1 < arrSeverities.length) ? ', ': '')
  })
  return severities
}

onMounted(() => { loadTable() })
</script>
