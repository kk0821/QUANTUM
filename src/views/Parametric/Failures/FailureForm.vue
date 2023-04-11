<template>
  <div>
    <div class="py-4 sm:mt-0">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Information</h3>
            <p class="mt-1 text-sm text-gray-600">Descriptive information of the failure.</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-1 gap-6">
                  <div>
                    <base-input
                        :id="'failure-failure'"
                        :autocomplete="'failure-failure'"
                        v-model="failure.failure"
                        label="Failure"
                        type="text"
                        :is-disabled="!canEdit"
                        :is-required="true"
                    />
                  </div>
                </div>
              </div>
              <div v-if="canEdit" class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                    type="submit"
                    :disabled="!enableSave"
                    @click="(event) => sendData(event)"
                    :class="[ !enableSave ? 'disabled:opacity-75' : '']"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="py-4 sm:mt-0">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Substages</h3>
            <p class="mt-1 text-sm text-gray-600">Related Substage of the failure.</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="shadow overflow-hidden sm:rounded-md">
            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6">
                  <DataTable
                    :value="equipmentSubstages"
                    :paginator="true"
                    :rows="10"
                    :resizableColumns="true"
                    columnResizeMode="fit"
                    dataKey="id"
                    :rowHover="true"
                    v-model:selection="selectedEquipmentSubstages"
                    v-model:filters="filters"
                    filterDisplay="menu"
                    :loading="loading"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5,10,25,50]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    :globalFilterFields="['substage.description']"
                    responsiveLayout="scroll"
                  >
                    <template #header>
                      <div class="lg:flex lg:items-center">
                        <div class="lg:flex-auto">
                          <h1 class="text-xl font-semibold text-gray-900">Substages available</h1>
                          <p class="mt-2 text-sm font-normal text-gray-700">
                            You can select one or more sub-stages in the following table. You currently have ({{selectedEquipmentSubstages.length}}) substages selected
                          </p>
                        </div>
                        <div class="mt-4 lg:mt-0 lg:ml-16 inline-flex items-center lg:flex-none">
                          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </div>
                      </div>
                    </template>
                    <template #empty>
                      No substages found.
                    </template>
                    <template #loading>
                      <div class="grid place-items-center h-screen">
                        <svg role="status" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                      </div>
                    </template>
                    <Column selectionMode="multiple" class="sm:min-w-0 sm:max-w-[3px]"></Column>

                    <Column field="equipment_type" header="Equipment Type" sortable class="min-w-[10rem] sm:max-w-full">
                      <template #body="{data}">
                        {{data.equipment_type?.description}}
                      </template>
                    </Column>

                    <Column field="substage" header="Substage" sortable class="min-w-[14rem] hidden sm:table-cell">
                      <template #body="{data}">
                        {{data.substage?.description}}
                      </template>
                    </Column>

                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, toRefs, onBeforeMount, computed} from "vue";
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import BaseInput from '@/components/BaseInput.vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import failureService from "@/services/failure.service.js"

const selectedEquipmentSubstages = ref([])
const equipmentSubstages = ref()
let loading = ref(false)

let filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
})

onBeforeMount(() => {
  loading.value = true
  failureService.listEquipmentSubstage()
    .then(resp => {
      equipmentSubstages.value = resp.data
      if (data.failure.value.id) {
        const attachedIds = data.failure.value.equipment_substages.map(x => x.id)
        selectedEquipmentSubstages.value = equipmentSubstages.value.filter(x => attachedIds.includes(x.id))
      }
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 400)
    })
})

const props = defineProps({
  failure: {
    type: Object
  },
  canEdit: {
    type: Boolean,
    default: true
  },
})

const emit = defineEmits(['save'])
const data = toRefs(props)

const enableSave = computed(() => {
  return data.failure.value.failure
      && selectedEquipmentSubstages.value.length > 0
})

const sendData = (event) => {
  event.preventDefault()
  emit('save', {
    equipment_substage_ids: selectedEquipmentSubstages.value.map(x => x.id),
    failure: data.failure.value.failure
  })
}
</script>
