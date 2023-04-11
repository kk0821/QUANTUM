<template>
  <div>
    <div class="px-4 py-4 sm:px-6 lg:px-8">
      <breadcrumbs :trace-route="trace" />
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <DataTable
                  :value="itemsMasterList"
                  dataKey="id"
                  :loading="loading"
                  :paginator="true"
                  :rows="5"
                  v-model:filters="filters"
                  :rowHover="true"
                  filterDisplay="menu"
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  :rowsPerPageOptions="[5,10,25]"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                  :globalFilterFields="['part_number','description','branch.country.name','branch.company.description','oem.description','details.technology.description','status']"
                  responsiveLayout="scroll"
                  removableSort
              >
                <template #header>
                  <div class="md:flex md:items-center">
                    <div class="md:flex-auto">
                      <h1 class="text-xl font-semibold text-gray-900">Items master</h1>
                      <p class="mt-2 text-sm font-normal text-gray-700">A list of all the items master available.</p>
                    </div>
                    <div class="mt-4 sm:mt-0 sm:ml-16 inline-flex items-center sm:flex-none">
                      <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                      <router-link to="/elements/items-master/create" class="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-amerinode-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-amerinode-blue-500 focus:ring-offset-2 sm:w-auto">
                        <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add Item master
                      </router-link>
                    </div>
                  </div>
                </template>
                <template #empty>
                  No item master found.
                </template>
                <template #loading>
                  <div class="grid place-items-center h-screen">
                    <svg role="status" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                  </div>
                </template>
                <Column field="part_number" header="Part Number" sortable class="min-w-[8rem] sm:max-w-full">
                  <template #body="{data}">
                    <span class="font-bold">{{data.part_number}}</span>
                    <dl class="font-normal lg:hidden">
                      <dt class="sr-only">Type</dt>
                      <dd class="mt-1 truncate text-gray-500 italic"><span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium uppercase" :class="data.type === 'item' ? 'bg-gray-100 text-gray-800': 'bg-amber-100 text-amber-800'">{{data.type}}</span></dd>
                      <dt class="sr-only">Description</dt>
                      <dd class="mt-1 truncate text-gray-700">{{ data.description }}</dd>
                      <dt class="sr-only">OEM</dt>
                      <dd class="mt-1 truncate text-gray-500">{{ data.oem.description }}</dd>
                      <dt class="sr-only">Technology</dt>
                      <dd class="mt-1 truncate text-gray-500">{{ data.details?.technology?.description }}</dd>
                      <dt class="sr-only">Controller Type</dt>
                      <dd class="mt-1 truncate text-gray-400">Controller type: {{ data.details?.controller_type?.name }}</dd>
                      <dt class="sr-only">Network Element</dt>
                      <dd class="mt-1 truncate text-gray-500">{{ data.details?.network_element?.name }}</dd>
                      <dt class="sr-only">SLA</dt>
                      <dd class="mt-1 truncate text-gray-500 italic">SLA {{ data.sla_time }} {{data.sla_unit?.nomenclature}}</dd>
                      <dt class="sr-only">Company</dt>
                      <dd class="mt-1 truncate text-gray-500">
                        <div class="flex items-center">
                          <div>
                            <img :id="data.branch?.country?.id" class="inline-block h-4 w-4 rounded-full" :src="data.branch?.country?.flag_url" alt="" />
                          </div>
                          <div class="ml-3">
                            <p>{{ data.branch?.company?.description }}</p>
                          </div>
                        </div>
                      </dd>
                    </dl>
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by number ticket"/>
                  </template>
                </Column>
                <Column field="description" header="Description" sortable class="min-w-[10rem] hidden lg:table-cell">
                  <template #body="{data}">
                    <span class="text-xs font-semibold">{{ data.description }}</span>
                    <dl class="font-normal">
                      <dt class="sr-only">SLA</dt>
                      <dd class="mt-1 truncate text-gray-700 italic">SLA {{ data.sla_time }} {{data.sla_unit?.nomenclature}}</dd>
                      <dt class="sr-only">Controller Type</dt>
                      <dd class="mt-1 truncate text-gray-400">Controller type: {{ data.details?.controller_type?.name }}</dd>
                      <dt class="sr-only">Network Element</dt>
                      <dd class="mt-1 truncate text-gray-500">{{ data.details?.network_element?.name }}</dd>
                    </dl>
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by description"/>
                  </template>
                </Column>
                <Column field="branch.country.name" header="Branch" sortable class="min-w-[10rem] hidden md:table-cell 2xl:hidden">
                  <template #body="{data}">
                    <span class="text-xs font-semibold">{{ data.branch?.country?.name }}</span>
                    <dl class="font-normal">
                      <dt class="sr-only">Company</dt>
                      <dd class="mt-1 truncate text-gray-700">{{ data.branch?.company?.description }}</dd>
                    </dl>
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by country"/>
                  </template>
                </Column>
                <Column field="branch.country.name" header="Country" sortable class="min-w-[5rem] hidden 2xl:table-cell">
                  <template #body="{data}">
                    <span class="text-xs">{{data.branch?.country?.name}}</span>
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by country"/>
                  </template>
                </Column>
                <Column field="branch.company.description" header="Company" sortable class="min-w-[5rem] hidden 2xl:table-cell">
                  <template #body="{data}">
                    {{ data.branch?.company?.description }}
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by company"/>
                  </template>
                </Column>
                <Column field="oem.description" header="OEM" sortable class="min-w-[10rem] hidden lg:table-cell">
                  <template #body="{data}">
                    {{data.oem.description}}
                    <dl v-if="data.details?.technology?.description" class="font-normal">
                      <dt class="sr-only">Technology</dt>
                      <dd class="mt-1 truncate text-gray-700">{{ data.details.technology.description }}</dd>
                    </dl>
                  </template>
                  <template #filter="{filterModel}">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by oem"/>
                  </template>
                </Column>
                <Column field="type" header="Type" sortable :filterMenuStyle="{'width':'14rem'}" class="min-w-[8rem] hidden lg:table-cell">
                  <template #body="{data}">
                    <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium uppercase" :class="data.type === 'item' ? 'bg-gray-100 text-gray-800': 'bg-amber-100 text-amber-800'">{{data.type}}</span>
                  </template>
                  <template #filter="{filterModel}">
                    <Dropdown v-model="filterModel.value" :options="typesItemMaster" placeholder="Any" class="p-column-filter" :showClear="true">
                      <template #value="slotProps">
                        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium uppercase" :class="slotProps.value === 'item' ? 'bg-gray-100 text-gray-800': 'bg-amber-100 text-amber-800'" v-if="slotProps.value">{{slotProps.value}}</span>
                        <span v-else>{{slotProps.placeholder}}</span>
                      </template>
                      <template #option="slotProps">
                        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium uppercase" :class="slotProps.option === 'item' ? 'bg-gray-100 text-gray-800': 'bg-amber-100 text-amber-800'">{{slotProps.option}}</span>
                      </template>
                    </Dropdown>
                  </template>
                </Column>
                <Column field="status" header="Status" sortable :filterMenuStyle="{'width':'14rem'}" class="min-w-[8rem]">
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
                      <router-link :to="{ name: 'ItemsMasterShow', params: { itemMasterId: slotProps.data.id }}" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <EyeIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">show</span>
                      </router-link>
                      <router-link :to="{ name: 'ItemsMasterEdit', params: { itemMasterId: slotProps.data.id }}" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
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
                  title="Remove item master"
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
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext'
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import ItemsMasterService from '@/services/items_master.service.js'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import DialogConfirm from '@/components/DialogConfirm.vue'

const itemsMasterList = ref([])
const itemMaster = ref({})
const loading = ref(true)
const openDialogConfirm = ref(false)
const messageDelete = ref('')
const statuses = ref([
  'active', 'inactive'
]);
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Items Master', pathName: 'ItemsMasterListPage', isLink: true, current: true }
]

const typesItemMaster = ref([
  'consumable', 'item'
]);

const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'part_number': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'description': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'branch.country.name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'branch.company.description': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'oem.description': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'type': {value: null, matchMode: FilterMatchMode.EQUALS},
  'status': {value: null, matchMode: FilterMatchMode.EQUALS},
})

const loadData = () => {
  ItemsMasterService.list()
  .then(x => {
    itemsMasterList.value = x.data
  })
  .catch(err => { notifyError((err.code === 'ERR_BAD_REQUEST') ? err.response.data.message : err.message) })
  .finally(() => {
     setTimeout(() => {
       loading.value = false
     }, 500)
  })
}

onMounted(() => {
  loadData()
})

function confirmDelete(data) {
  itemMaster.value = data
  messageDelete.value = `Are you sure you want remove this item master: '${itemMaster.value.part_number} - ${itemMaster.value.description}'?`
  openDialogConfirm.value = true
}

const deleteRegister = () => {
  closeDeleteDialog()
  ItemsMasterService.delete(itemMaster.value.id).then(x => {
    notifySuccess('Update', x.data)
    loadData()
  }).catch(err => { notifyError((err.code === 'ERR_BAD_REQUEST') ? err.response.data.message : err.message) })
}

const closeDeleteDialog = () => {
  openDialogConfirm.value = false
}
</script>
