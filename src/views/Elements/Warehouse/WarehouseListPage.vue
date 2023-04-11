<template>
  <div>
    <div class="px-4 py-4 sm:px-6 lg:px-8">
      <breadcrumbs :trace-route="trace" />
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <DataTable
                  :value="warehouseList"
                  dataKey="id"
                  :loading="loading"
                  :paginator="true"
                  :rows="5"
                  v-model:filters="filters"
                  removableSort
                  sortField="name"
                  :sortOrder="1"
                  :rowHover="true"
                  filterDisplay="menu"
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  :rowsPerPageOptions="[5,10,25]"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                  :globalFilterFields="['warehouse','branch.country.name','branch.company.description']"
                  responsiveLayout="scroll"
                  columnResizeMode="expand"
                  :scrollable="true"
              >
                <template #header>
                  <div class="sm:flex sm:items-center">
                    <div class="sm:flex-auto">
                      <h1 class="text-xl font-semibold text-gray-900">Warehouse</h1>
                      <p class="mt-2 text-sm font-normal text-gray-700">A list of all the warehouse elements available.</p>
                    </div>
                    <div class="mt-4 sm:mt-0 sm:ml-16 inline-flex items-center sm:flex-none">
                      <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                      <router-link to="/elements/warehouse/create" class="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-amerinode-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-amerinode-blue-500 focus:ring-offset-2 sm:w-auto">
                        <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add warehouse
                      </router-link>
                    </div>
                  </div>
                </template>
                <template #empty>
                  No warehouses found.
                </template>
                <template #loading>
                  <div class="grid place-items-center h-screen">
                    <svg role="status" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                  </div>
                </template>
                <Column field="warehouse" header="Warehouse" sortable style="min-width: 240px; max-width: 240px;">
                  <template #body="{data}">
                    <span class="text-xs font-semibold">{{ data.warehouse }}</span>
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by warehouse"/>
                  </template>
                </Column>
                <Column field="branch.country.name" header="Country" sortable style="min-width: 240px; max-width: 240px;">
                  <template #body="{data}">
                    <span class="text-xs">{{data.branch?.country?.name}}</span>
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by country"/>
                  </template>
                </Column>
                <Column field="branch.company.description" header="Company" sortable style="min-width: 180px; max-width: 180px;">
                  <template #body="{data}">
                    {{ data.branch?.company?.description }}
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by company"/>
                  </template>
                </Column>
                <Column field="main" header="Type" style="min-width: 130px;">
                  <template #body="{data}">
                    <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium uppercase bg-lime-100 text-lime-800" v-if="data.main">Main</span>
                    <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium uppercase bg-cyan-100 text-cyan-800" v-if="data.is_virtual">Virtual</span>
                    <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium uppercase bg-amber-100 text-amber-800" v-if="data.lab">Lab</span>
                  </template>
                </Column>
                <Column field="status" header="Status" sortable :filterMenuStyle="{'width':'14rem'}" class="min-w-[6rem]">
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
                      <router-link :to="{ name: 'WarehouseShow', params: { warehouseId: slotProps.data.id }}" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <EyeIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">show</span>
                      </router-link>
                      <router-link :to="{ name: 'WarehouseEdit', params: { warehouseId: slotProps.data.id }}" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <PencilIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">edit</span>
                      </router-link>
                      <button type="button" @click="confirmDelete(slotProps.data)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <TrashIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">delete</span>
                      </button>
                    </div>
                  </template>
                </Column>
              </DataTable>
              <dialog-confirm
                  :showDialog="openDialogConfirm"
                  :title="'Remove warehouse'"
                  :message="messageDelete"
                  @executeAction="deleteRegister"
                  @closeDialog="closeDeleteDialog"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import DialogConfirm from '@/components/DialogConfirm.vue'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import WarehouseService from '@/services/warehouse.service.js'

const warehouseList = ref([])
const warehouse = ref({})
const loading = ref(true)
const statuses = ref([
  'active', 'inactive'
]);
const openDialogConfirm = ref(false)
const messageDelete = ref("")

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Warehouse', pathName: 'WarehouseListPage', isLink: true, current: true }
]

const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'warehouse': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'branch.country.name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'branch.company.description': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'status': {value: null, matchMode: FilterMatchMode.EQUALS},
})

onMounted(() => {
  loading.value = true;
  WarehouseService.list()
    .then(x => {
      warehouseList.value = x.data
      loading.value = false
    })
    .catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
})

function confirmDelete(data) {
  warehouse.value = data
  messageDelete.value = "Are you sure you want remove this warehouse '"+warehouse.value.warehouse+"'?"
  openDialogConfirm.value = true
}

const deleteRegister = () => {
  closeDeleteDialog()
  WarehouseService.delete(warehouse.value.id).then(x => {
    notifySuccess('Update', x.data)
    const idx = warehouseList.value.findIndex((item) => item.id === warehouse.value.id)
    warehouseList.value.splice(idx, 1)
    warehouse.value = {}
  }).catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
}

const closeDeleteDialog = () => {
  openDialogConfirm.value = false
}
</script>
