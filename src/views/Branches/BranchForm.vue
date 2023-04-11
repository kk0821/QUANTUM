<template>
  <div>
    <div class="py-4 sm:mt-0">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Information</h3>
            <p class="mt-1 text-sm text-gray-600">Relationship of the company with the country where the branch is located.</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-6">

                  <div class="col-span-6 lg:col-span-3">
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
                                @click="changeTimezone"
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

                  <div class="col-span-6 lg:col-span-3">
                    <Listbox as="div" v-model="selectedCompany" :disabled="!canEdit" aria-required="true" >
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Company </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit  ? 'disabled:opacity-75':'']">
                          <span class="block truncate">{{ selectedCompany.description }}</span>
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

                  <div class="col-span-6 sm:col-span-5 lg:col-span-3">
                    <Listbox as="div" v-model="selectedTimezone" :disabled="!canEdit || isLoadingTimezone" aria-required="true">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Timezone </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit || isLoadingTimezone ? 'disabled:opacity-75':'']">
                          <div v-if="isLoadingTimezone">

                            <div class="flex items-center">
                              <div>
                                <svg role="status" class="mr-2 w-5 h-5 text-blue-200 animate-spin dark:text-blue-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                                </svg>
                              </div>
                              <div class="ml-1">
                                <p class="text-sm text-gray-600">Getting available timezones...</p>
                              </div>
                            </div>

                          </div>
                          <div v-else>
                            <span class="block truncate">{{ selectedTimezone }}</span>
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
                                v-for="timezone in timezones"
                                :key="timezone"
                                :value="timezone"
                                as="template"
                            >
                              <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ timezone }}</span>
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

                  <div class="col-span-6 sm:col-span-3">
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

                  <div class="col-span-6 sm:col-span-3">
                    <label class="block text-sm font-medium text-gray-700">Has technical laboratory?</label>
                    <InputSwitch v-model="branch.has_technical_lab" :disabled="!canEdit" class="mt-2"/>
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
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Work schedule</h3>
            <p class="mt-1 text-sm text-gray-600">Branch work schedule assignment</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form action="#" method="POST">
            <div class="shadow overflow-hidden sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6">
                    <DataTable
                        :value="branch.schedules"
                        :resizableColumns="true"
                        removableSort
                        columnResizeMode="fit"
                        dataKey="id"
                        :rowHover="true"
                        v-model:filters="filters"
                        filterDisplay="menu"
                        :loading="isLoadingScheduler"
                        responsiveLayout="scroll"

                    >
                      <template #header>
                        <div class="lg:flex lg:items-center">
                          <div class="lg:flex-auto">
                            <h1 class="text-xl font-semibold text-gray-900">Calendar settings</h1>
                            <p class="mt-2 text-sm font-normal text-gray-700">List of working hours assigned to this branch</p>
                          </div>
                        </div>
                      </template>
                      <template #empty>
                        No work schedules found.
                      </template>
                      <template #loading>
                        <div class="grid place-items-center h-screen">
                          <svg role="status" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                          </svg>
                        </div>
                      </template>
                      <Column field="day_name" header="Day Name" sortable class="min-w-[5rem] max-w-[5rem] sm:max-w-full">
                        <template #body="{data}">
                          <span class="hidden xl:block">{{data.day_name}}</span>
                          <dl class="font-normal xl:hidden">
                            <dt class="sr-only">Day</dt>
                            <dd class="mt-1 truncate text-gray-700 font-bold">{{ data.day_name }}</dd>
                            <dt class="sr-only">Start working hour</dt>
                            <dd class="mt-1 truncate text-gray-500">Start: {{ data.start_working_hours }}</dd>
                            <dt class="sr-only">End working hour</dt>
                            <dd class="mt-1 truncate text-gray-500">End: {{ data.end_working_hours }}</dd>
                          </dl>
                        </template>
                        <template #filter="{filterModel}">
                          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by day name" />
                        </template>
                      </Column>
                      <Column field="start_working_hours" header="Start working hour" class="min-w-[8rem] hidden xl:table-cell">
                        <template #body="{data}">
                          <base-input
                              :id="'schedule_start_'+data.id"
                              type="time"
                              :is-required="true"
                              v-model="data.start_working_hours"
                              :show-label="false"
                              :is-disabled="!canEdit"
                              step="900"
                          />
                        </template>
                      </Column>
                      <Column field="day_name" header="End working hour" class="min-w-[8rem] hidden xl:table-cell">
                        <template #body="{data}">
                          <base-input
                              :id="'schedule_end_'+data.id"
                              type="time"
                              :is-required="true"
                              v-model="data.end_working_hours"
                              :show-label="false"
                              :is-disabled="!canEdit"
                              step="900"
                          />
                          <span class="validity"></span>
                        </template>
                      </Column>
                      <Column field="laborable_day" header="Laborable Day" class="min-w-[5rem]">
                        <template #body="{data}">
                          <InputSwitch :id="'schedule_laborable_day_'+data.id" v-model="data.laborable_day" :disabled="!canEdit"/>
                        </template>
                      </Column>
                    </DataTable>
                  </div>
                </div>
              </div>
              <div v-show="canEdit" class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button type="submit" @click="(event) => sendData(event)" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import {ref, toRefs, onBeforeMount } from "vue";
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { notifyError } from "@/utils/notify_error";
import { loading } from '@/store/loading'
import resolver from "@/utils/_resolver.ts";
import { useSetInitialSelect, useSetFirstElement } from '@/composables/listbox_items'
import { useStatus } from "@/composables/types";
import countryService from "@/services/country.service";
import companyService from "@/services/company.service";
import branchService from "@/services/branch.service";
import BaseInput from '@/components/BaseInput.vue'

const isLoadingTimezone = ref(true)
const isLoadingScheduler = ref(false)
const selectedStatus = ref({})
const selectedCountry = ref({})
const selectedCompany = ref({})
const selectedTimezone = ref({})
const countries = ref()
const companies = ref()
const timezones = ref()
const { statuses } = useStatus()
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'day_name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
})

onBeforeMount(() => {
  loading.show()

  resolver.all({
    country: countryService.list(),
    company: companyService.list(),
  }).then(resp => {
    countries.value = resp.country.data
    companies.value = resp.company.data
    if (data.branch.value.id) {
      useSetInitialSelect(statuses.value, data.branch.value.status, selectedStatus)
      useSetInitialSelect(countries.value, data.branch.value.country?.id, selectedCountry)
      useSetInitialSelect(companies.value, data.branch.value.company?.id, selectedCompany)
      loadTimezones(true)
    } else {
      useSetFirstElement(statuses.value, selectedStatus)
      useSetFirstElement(countries.value, selectedCountry)
      useSetFirstElement(companies.value, selectedCompany)
      loadTimezones()
    }
    loading.hide()
  }).catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })

})

const props = defineProps({
  branch: {
    type: Object
  },
  canEdit: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['save'])
const data = toRefs(props)

const loadTimezones = (setOld) => {
  branchService.timezonesByCountry(selectedCountry.value.id).then(x => {
    timezones.value = x.data
    if (setOld) {
      useSetInitialSelect(timezones.value, data.branch.value?.timezone, selectedTimezone)
    } else {
      useSetFirstElement(timezones.value, selectedTimezone)
    }
    isLoadingTimezone.value = false
  })
}

const changeTimezone = () =>{
  isLoadingTimezone.value = true
  loadTimezones();
}

const sendData = (event) => {
  event.preventDefault()
  emit('save', {
    data: data.branch.value,
    timezone: selectedTimezone.value,
    country: selectedCountry.value.id,
    company: selectedCompany.value.id,
    schedules: data.branch.value.schedules,
    status: selectedStatus.value
  })
}
</script>
