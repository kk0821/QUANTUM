<template>
  <div>
    <div class="py-4 sm:mt-0">
      <div class="md:grid md:grid-cols-4 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Information</h3>
            <p class="mt-1 text-sm text-gray-600">Basic project information.</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-3">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-6">

                  <div class="col-span-6 sm:col-span-3">
                    <base-input
                        :id="'name'"
                        :autocomplete="'name-project'"
                        v-model="project.name"
                        label="Name"
                        type="text"
                        :is-disabled="!canEdit"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <base-input
                        :id="'description'"
                        :autocomplete="'description'"
                        v-model="project.description"
                        label="Description"
                        type="text"
                        :is-disabled="!canEdit"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-3 lg:col-span-3">
                    <Listbox as="div" v-model="selectedProjectType" :disabled="!canEdit">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Project type </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit ? 'disabled:opacity-75':'']">
                          <span class="block truncate">{{ selectedProjectType.description }}</span>
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
                                v-for="project_type in projectTypes"
                                :key="project_type.id"
                                :value="project_type"
                                as="template"
                            >
                              <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ project_type.description }}</span>
                                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amerinode-blue-600">
                                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>

                  <div class="col-span-6 sm:col-span-3 lg:col-span-3">
                    <Listbox as="div" v-model="selectedStatus" :disabled="!canEdit">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Status </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit ? 'disabled:opacity-75':'']">
                          <span class="block truncate">{{ selectedStatus.name }}</span>
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
                                v-for="status in statuses"
                                :key="status.id"
                                :value="status"
                                as="template"
                            >
                              <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ status.name }}</span>
                                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amerinode-blue-600">
                                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>

                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="hidden sm:block" aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-gray-200" />
      </div>
    </div>

    <div class="mt-10 sm:mt-0">
      <div class="md:grid md:grid-cols-4 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Branch</h3>
            <p class="mt-1 text-sm text-gray-600">Configuration of the branch where the project is located.</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-3">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-6">

                  <div class="col-span-6 sm:col-span-5 lg:col-span-3">
                    <Listbox as="div" v-model="selectedCountry" :disabled="!canEdit">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Country </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit ? 'disabled:opacity-75':'']">
                          <span class="block truncate">{{ selectedCountry.name }}</span>
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
                                v-for="country in countries"
                                :key="country.id"
                                :value="country"
                                as="template"
                                @click="changeCompany"
                            >
                              <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-4 pr-4']">
                                <div class="flex items-center">
                                  <img :src="country.flag_url" alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
                                  <span :class="['ml-3 truncate', selected && 'font-semibold']">{{ country.name }}</span>
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
                  </div>

                  <div class="col-span-6 sm:col-span-5 lg:col-span-3">
                    <Listbox as="div" v-model="selectedCompany" :disabled="!canEdit || isLoadingCompany" aria-required="true">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Company </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit || isLoadingCompany ? 'disabled:opacity-75':'']">
                          <div v-if="isLoadingCompany">

                            <div class="flex items-center">
                              <div>
                                <svg role="status" class="mr-2 w-5 h-5 text-blue-200 animate-spin dark:text-blue-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                                </svg>
                              </div>
                              <div class="ml-1">
                                <p class="text-sm text-gray-600">Getting available companies...</p>
                              </div>
                            </div>

                          </div>
                          <div v-else>
                            <span class="block truncate">{{ selectedCompany.description }}</span>
                          </div>
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
                                v-for="company in companies"
                                :key="company.id"
                                :value="company"
                                as="template"
                            >
                              <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ company.description }}</span>
                                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amerinode-blue-600">
                                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>

                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="hidden sm:block" aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-gray-200" />
      </div>
    </div>

    <div class="mt-10 sm:mt-0">
      <div class="md:grid md:grid-cols-4 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Contracted network elements</h3>
            <p class="mt-1 text-sm text-gray-600">Selection of the network elements that will be available when creating a ticket</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-3">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6">
                    <DataTable :value="networkElements" :paginator="true" :rows="10" :resizableColumns="true" columnResizeMode="fit"
                               dataKey="id" :rowHover="true" v-model:selection="selectedNetworkElements" v-model:filters="filters" filterDisplay="menu" :loading="isLoadingNetworkElements"
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25,50]"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                               :globalFilterFields="['name','guard_name','oem.description','technology.description']" responsiveLayout="scroll">
                      <template #header>
                        <div class="lg:flex lg:items-center">
                          <div class="lg:flex-auto">
                            <h1 class="text-xl font-semibold text-gray-900">Network elements</h1>
                            <p class="mt-2 text-sm font-normal text-gray-700">This is the list of network elements you can assign to the project</p>
                          </div>
                          <div class="mt-4 lg:mt-0 lg:ml-16 inline-flex items-center lg:flex-none">
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                          </div>
                        </div>
                      </template>
                      <template #empty>
                        No network elements found.
                      </template>
                      <template #loading>
                        <div class="grid place-items-center h-screen">
                          <svg role="status" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                          </svg>
                        </div>
                      </template>
                      <Column selectionMode="multiple" class="sm:min-w-0 sm:max-w-[3px]" v-if="canEdit"></Column>
                      <Column field="name" header="Name" sortable class="min-w-[10rem] sm:max-w-full">
                        <template #body="{data}">
                          {{data.name}}
                          <dl class="font-normal lg:hidden">
                            <dt class="sr-only">Vendor</dt>
                            <dd class="mt-1 truncate text-gray-700">{{ data.oem.description }}</dd>
                            <dt class="sr-only sm:hidden">Technology</dt>
                            <dd class="mt-1 truncate text-gray-500 sm:hidden">{{ data.technology.description }}</dd>
                          </dl>
                        </template>
                        <template #filter="{filterModel}">
                          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
                        </template>
                      </Column>
                      <Column field="oem.description" header="Vendor" sortable class="min-w-[10rem] hidden lg:table-cell">
                        <template #body="{data}">
                          {{data.oem.description}}
                        </template>
                        <template #filter="{filterModel}">
                          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by Vender"/>
                        </template>
                      </Column>
                      <Column field="technology.description" header="Technology" sortable class="min-w-[14rem] hidden sm:table-cell">
                        <template #body="{data}">
                          {{data.technology.description}}
                        </template>
                        <template #filter="{filterModel}">
                          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by technology"/>
                        </template>
                      </Column>
                    </DataTable>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <ProjectFormSla
        :sla="project.sla"
        :read-only="!canEdit"
        @change="projectSLAUpdate"
    >
      <template #separator>
        <div class="hidden sm:block" aria-hidden="true">
          <div class="py-5">
            <div class="border-t border-gray-200" />
          </div>
        </div>
      </template>
    </ProjectFormSla>

    <div class="hidden sm:block" aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-gray-200" />
      </div>
    </div>

    <div class="mt-10 sm:mt-0">
      <div class="md:grid md:grid-cols-4 md:gap-6">
        <div class="md:col-span-1"></div>
        <div class="mt-5 md:mt-0 md:col-span-3">
          <form action="#" method="POST">
            <div>
              <div v-show="canEdit" class="px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
                  :class="[ !enableSave ? 'disabled:opacity-25':'']"
                  :disabled="!enableSave"
                  @click="(event) => sendData(event)"
                >Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, toRefs, onBeforeMount } from "vue";
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import BaseInput from '@/components/BaseInput.vue'
import countryService from "@/services/country.service";
import companyService from "@/services/company.service";
import projectTypeService from "@/services/project_type.service";
import network_elementService from "@/services/network_element.service";
import resolver from "@/utils/_resolver.ts";
import { useSetInitialSelect, useSetFirstElement } from '@/composables/listbox_items'
import { useStatus } from "@/composables/types";
import { loading } from '@/store/loading'
import ProjectFormSla from '@/views/Projects/ProjectFormSla.vue'


const selectedStatus = ref({})
const selectedCountry = ref({})
const selectedCompany = ref({})
const selectedProjectType = ref({})
const selectedNetworkElements = ref([])
const isLoadingCompany = ref(true)
const isLoadingNetworkElements = ref(false)
const countries = ref([])
const companies = ref([])
const networkElements = ref([])
const projectTypes = ref()
const projectSLA = ref([])
const { statuses } = useStatus()
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
  'oem.description': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
  'technology.description': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
})

const props = defineProps({
  project: {
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
  return data.project.value.name
      && data.project.value.description
      && ((selectedProjectType.value.service_type?.code === 'SW' && projectSLA.value.length) || ((selectedProjectType.value.service_type?.code === 'HW' && projectSLA.value.length === 0)))
      && selectedCountry.value.id
      && selectedCompany.value.id
      && selectedStatus.value.id
      && selectedNetworkElements.value.length
})

const loadCompany = (setOld) => {
  companyService.byCountry(selectedCountry.value.id).then(x => {
    companies.value = x.data
    if (setOld) {
      useSetInitialSelect(companies.value, data.project.value.branch.company.id, selectedCompany)
    } else {
      useSetFirstElement(companies.value, selectedCompany)
    }
    isLoadingCompany.value = false
  })
}

const changeCompany = () => {
  isLoadingCompany.value = true
  loadCompany();
}

const projectSLAUpdate = (event) => {
  projectSLA.value = event.projectSLA
}

const sendData = (event) => {
  event.preventDefault()
  emit('save', {
    project: data.project.value,
    project_type: selectedProjectType.value,
    country: selectedCountry.value,
    company: selectedCompany.value,
    network_elements: selectedNetworkElements.value,
    status: selectedStatus.value,
    projectSLA: projectSLA.value
  })
}

onBeforeMount(() => {
  loading.show()
  resolver.all({
    projectType: projectTypeService.list(),
    country: countryService.withBranches(),
    network_elements: network_elementService.list(),
  }).then(resp => {
    projectTypes.value = resp.projectType.data
    countries.value = resp.country.data
    networkElements.value = resp.network_elements.data
    if (data.project.value.id) {
      selectedNetworkElements.value = data.project.value.network_elements
      useSetInitialSelect(statuses.value, data.project.value.status, selectedStatus)
      useSetInitialSelect(projectTypes.value, data.project.value.project_type?.id, selectedProjectType)
      useSetInitialSelect(countries.value, data.project.value.branch?.country.id, selectedCountry)
      loadCompany(true)
    } else {
      useSetFirstElement(statuses.value, selectedStatus)
      useSetFirstElement(projectTypes.value, selectedProjectType)
      useSetFirstElement(countries.value, selectedCountry)
      loadCompany()
    }
    loading.hide()
  })
})
</script>
