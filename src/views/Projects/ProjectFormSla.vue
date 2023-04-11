<template>
  <slot name="separator" />
  <div class="mt-10 sm:mt-0">
    <div class="md:grid md:grid-cols-4 md:gap-6">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3 class="text-lg font-medium leading-6 text-gray-900">SLA</h3>
          <p class="mt-1 text-sm text-gray-600">SLA settings for this project</p>
          <p class="mt-1 text-sm text-gray-600 font-bold italic">IMPORTANT: If your project is a Hardware one, please remove any SLA assignment in the project in order to store the changes</p>
        </div>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-3">
        <form action="#" method="POST">
          <div class="shadow sm:rounded-md">
            <div class="px-4 py-5 bg-white sm:p-6">
              <DataTable
                :value="tableProjectSLA"
                :paginator="false"
                dataKey="id"
                :rowHover="true"
                responsiveLayout="scroll"
              >
                <template #empty>
                  No SLA assigned
                </template>
                <Column field="name" header="SLA">
                  <template #body="{data}">
                    {{ data.name }}&nbsp;{{ data.resolution.name }}{{ data.availability.name }}
                  </template>
                </Column>
                <Column field="technology" header="Technology">
                  <template #body="{data}">
                    {{ data.technology.name }}
                  </template>
                </Column>
                <Column field="details" header="Severity">
                  <template #body="{data}">
                    <span
                      v-for="(severity, $index) in data.details"
                      :key="severity.id"
                    >
                      {{ severity.name }}<span v-if="$index + 1 !== data.details.length">, </span>
                    </span>
                  </template>
                </Column>
                <Column field="expirationDate" header="Expiration date">
                  <template #body="{data}">
                    {{ data.expirationDate ? (new Date(data.expirationDate[0]).toLocaleDateString() + ' | ' + new Date(data.expirationDate[1]).toLocaleDateString()) : 'Does not expire' }}
                  </template>
                </Column>
                <Column :exportable="false" v-if="!readOnly">
                  <template #body="data">
                    <button type="button" @click="($event) => remove(data, $event)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                      <TrashIcon class="h-6 w-6" aria-hidden="true" />
                      <span class="sr-only">Remove</span>
                    </button>
                  </template>
                </Column>
              </DataTable>
            </div>
            <div class="px-4 py-5 bg-white sm:p-6" v-if="!readOnly">
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-5 lg:col-span-3">
                  <Listbox as="div" v-model="selectedSLA" :disabled="readOnly">
                    <ListboxLabel class="block text-sm font-medium text-gray-700"> SLA </ListboxLabel>
                    <div class="relative mt-1">
                      <ListboxButton
                        class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                        :class="[ readOnly ? 'disabled:opacity-75':'']"
                      >
                        <span class="block truncate" v-if="selectedSLA.name">{{ selectedSLA.name }}</span>
                        <span class="block truncate" v-else>Select SLA</span>
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
                              v-for="sla in listSLA"
                              :key="sla.id"
                              :value="sla"
                              as="template"
                              @click="changeSLA"
                          >
                            <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-4 pr-4']">
                              <div class="flex items-center">
                                <span :class="['ml-3 truncate', selected && 'font-semibold']">{{ sla.name }}</span>
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
                  <Listbox as="div" v-model="selectedSLATechnology" :disabled="readOnly" aria-required="true">
                    <ListboxLabel class="block text-sm font-medium text-gray-700">Technology</ListboxLabel>
                    <div class="relative mt-1">
                      <ListboxButton
                        class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                        :class="[ readOnly ? 'disabled:opacity-75':'']"
                      >
                        <div>
                          <span class="block truncate" v-if="selectedSLATechnology.description">{{ selectedSLATechnology.description }}</span>
                          <span class="block truncate" v-else>Select Technology</span>
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
                              v-for="technology in listTechnology"
                              :key="technology.id"
                              :value="technology"
                              as="template"
                          >
                            <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                              <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ technology.description }}</span>
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
                  <label class="block text-sm font-medium text-gray-700">SLA with expiration date</label>
                  <InputSwitch v-model="expiration" class="mt-2" @change="clearExpirationDate" />
                </div>
                <div class="col-span-6 sm:col-span-5 lg:col-span-3">
                  <Calendar
                    class="mt-1 max-h-60 w-full py-1 text-base focus:outline-none sm:text-sm"
                    v-model="expirationDate"
                    selectionMode="range"
                    dateFormat="dd/mm/yy"
                    :disabled="!expiration"
                  />
                </div>
              </div>
            </div>
            <div class="px-4 py-5 bg-white sm:p-6" v-if="selectedSLA.id">
              <DataTable
                :value="selectedSLA.details"
                :paginator="false"
                dataKey="id"
                :rowHover="true"
                v-model:selection="selectedSLASeverity"
                responsiveLayout="scroll"
              >
                <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
                <Column header="Name" field="severity">
                  <template #body="{data}">
                    {{ data.severity.code }}
                  </template>
                </Column>
                <Column header="Response" field="time_response">
                  <template #body="{data}">
                    {{ data.time_response }}&nbsp;
                    {{ data.time_response_unit.nomenclature }}
                  </template>
                </Column>
                <Column header="Recovery" field="time_recovery">
                  <template #body="{data}">
                    {{ data.time_recovery }}&nbsp;
                    {{ data.time_recovery_unit.nomenclature }}
                  </template>
                </Column>
              </DataTable>
            </div>
            <div class="px-4 py-5 bg-white sm:p-6" v-if="selectedSLA.id && selectedSLASeverity.length">
              <DataTable
                :value="selectedSLASeverity"
                :paginator="false"
                dataKey="id"
                :rowHover="true"
                responsiveLayout="scroll"
              >
                <template #header>
                  <div class="sm:flex sm:items-center">
                    <div class="sm:flex-auto">
                      <h1 class="text-xl font-semibold text-gray-900">Resolutions</h1>
                      <p class="mt-2 text-sm font-normal text-gray-700">From the severity criteria for this SLA, please select resolution.</p>
                    </div>
                    <div class="mt-4 sm:mt-0 sm:ml-16 inline-flex items-center sm:flex-none">
                      <Listbox as="div" v-model="selectedSLASeverityResolutions" :disabled="readOnly" aria-required="true">
                        <ListboxLabel class="block text-sm font-medium text-gray-700">Resolution</ListboxLabel>
                        <div class="relative mt-1">
                          <ListboxButton
                            class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                            :class="[ readOnly ? 'disabled:opacity-75':'']"
                          >
                            <div>
                              <span class="block truncate" v-if="selectedSLASeverityResolutions.name">{{ selectedSLASeverityResolutions.name }}</span>
                              <span class="block truncate" v-else>Select Resolution</span>
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
                                  v-for="resolution in slaSeverityResolutions"
                                  :key="resolution.id"
                                  :value="resolution"
                                  as="template"
                              >
                                <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                  <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ resolution.name }}</span>
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
                </template>
                <ColumnGroup type="header">
                    <Row>
                        <Column field="severity" header="Severity" :rowspan="2" çlass="items-center" />
                        <Column header="Resolutions" :colspan="slaSeverityResolutions.length" çlass="items-center" />
                    </Row>
                    <Row>
                        <Column
                          v-for="resolution in slaSeverityResolutions"
                          :key="resolution.id"
                          :header="resolution.name"
                          :field="resolution.name"
                          selectionMode="single"
                          class="items-center"
                        />
                    </Row>
                </ColumnGroup>
                <Column field="severity">
                  <template #body="{data}">
                    {{ data.severity.code }}
                  </template>
                </Column>
                <Column
                  v-for="resolution in slaSeverityResolutions"
                  :key="resolution.id"
                  :field="resolution.name"
                  :class="{ 'col-selected': selectedSLASeverityResolutions.name === resolution.name }"
                >
                  <template #body="{data}">
                    <span
                      v-for="r in data.resolutions.filter(r => r.name === resolution.name)"
                    >
                      {{ r.time }} {{ r.unit.nomenclature }}<span v-if="r.precision">, {{ r.precision }}%</span>
                      <br/>
                    </span>
                  </template>
                </Column>
              </DataTable>
            </div>
            <div class="px-4 py-5 bg-white sm:p-6" v-if="selectedSLA.id && selectedSLASeverity.length">
              <DataTable
                :value="selectedSLASeverity"
                :paginator="false"
                dataKey="id"
                :rowHover="true"
                responsiveLayout="scroll"
              >
                <template #header>
                  <div class="sm:flex sm:items-center">
                    <div class="sm:flex-auto">
                      <h1 class="text-xl font-semibold text-gray-900">Availabilities</h1>
                      <p class="mt-2 text-sm font-normal text-gray-700">From the severity criteria for this SLA, please select availability.</p>
                    </div>
                    <div class="mt-4 sm:mt-0 sm:ml-16 inline-flex items-center sm:flex-none">
                      <Listbox as="div" v-model="selectedSLASeverityAvailability" :disabled="readOnly" aria-required="true">
                        <ListboxLabel class="block text-sm font-medium text-gray-700">Availabilities</ListboxLabel>
                        <div class="relative mt-1">
                          <ListboxButton
                            class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                            :class="[ readOnly ? 'disabled:opacity-75':'']"
                          >
                            <div>
                              <span class="block truncate" v-if="selectedSLASeverityAvailability.name">{{ selectedSLASeverityAvailability.name }}</span>
                              <span class="block truncate" v-else>Select Availability</span>
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
                                  v-for="availability in slaSeverityAvailabilities"
                                  :key="availability.id"
                                  :value="availability"
                                  as="template"
                              >
                                <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                  <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ availability.name }}</span>
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
                </template>
                <ColumnGroup type="header">
                    <Row>
                        <Column field="severity" header="Severity" :rowspan="2" çlass="items-center" />
                        <Column header="Availabilities" :colspan="slaSeverityAvailabilities.length" çlass="items-center" />
                    </Row>
                    <Row>
                        <Column
                          v-for="availability in slaSeverityAvailabilities"
                          :key="availability.id"
                          :header="availability.name"
                          :field="availability.name"
                          class="items-center"
                        />
                    </Row>
                </ColumnGroup>
                <Column field="severity">
                  <template #body="{data}">
                    {{ data.severity.code }}
                  </template>
                </Column>
                <Column
                  v-for="(availability, $idx) in slaSeverityAvailabilities"
                  :key="availability.id"
                  :field="availability.name"
                  :class="{ 'col-selected': selectedSLASeverityAvailability.name === availability.name }"
                >
                  <template #body="{data}">
                    {{
                      data.availabilities && data.availabilities.length && data.availabilities[$idx]
                        ? data.availabilities[$idx].unit.name : availability.unit.name
                    }}
                  </template>
                </Column>
              </DataTable>
            </div>
            <div
              class="px-4 py-5 bg-white sm:p-6"
              v-if="selectedSLA.id && selectedSLASeverity.length
                && selectedSLASeverityAvailability.name
                && selectedSLASeverityResolutions.name
                && selectedSLATechnology.id"
            >
              <button
                  type="submit"
                  @click="(event) => addProjectSLA(event)"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
                >Select this SLA configuration for the project</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, computed } from "vue";

import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'

import Calendar from 'primevue/calendar';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import DataTable from 'primevue/datatable';
import InputSwitch from 'primevue/inputswitch';
import Row from 'primevue/row';

import { CheckIcon, ChevronUpDownIcon, TrashIcon } from '@heroicons/vue/24/solid'

import slaService from "@/services/sla.service";
import technologyService from "@/services/technology.service";
import resolver from "@/utils/_resolver.ts";
import { notifyError } from "@/utils/notify_error.ts";

import { loading } from '@/store/loading'

const selectedSLA = ref({})
const selectedSLATechnology = ref({})
const selectedSLASeverity = ref([])
const selectedSLASeverityResolutions = ref({})
const selectedSLASeverityAvailability = ref({})
const projectSLA = ref([])
const listTechnology = ref([])
const listSLA = ref([])
const expiration = ref(false)
const expirationDate = ref([])

const props = defineProps({
  sla: {
    type: Array
  },
  projectType: {
    type: Object
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])

onBeforeMount(() => {
  loading.show()
  resolver.all({
    sla: slaService.list(),
    technology: technologyService.list(),
  }).then(resp => {
    listSLA.value = resp.sla.data
    listTechnology.value = resp.technology.data
    formatProjectSLA(props.sla)

    loading.hide()
  })
})

const slaSeverityResolutions = computed(() =>
    selectedSLASeverity.value.length
      ? selectedSLASeverity.value[0].resolutions.reduce((a, b) => {
          if (!a.length || a[a.length - 1].name !== b.name) {
            a.push(b)
          }
          return a
        }, [])
      : []
)

const slaSeverityAvailabilities = computed(() =>
    selectedSLASeverity.value.length
      ? selectedSLASeverity.value[0].availabilities
      : []
)

const tableProjectSLA = computed(() => projectSLA.value.filter(pSla => !pSla.deletedAt))

const changeSLA = () => {
  selectedSLASeverity.value = []
}

const clearExpirationDate = () => {
  if (!expiration.value) {
    expirationDate.value = []
  }
}

const formatProjectSLA = (sla) => {
  if (!sla || !sla.length) {
    return;
  }

  for (const item of sla) {

    projectSLA.value.push({
      old: item.id,
      id: item.sla_id,
      name: item.sla_name,
      expirationDate: item.valid_from ? [
        `${item.valid_from.split('T')[0]}  00:00:01`,
        `${item.valid_until.split('T')[0]}  00:00:01`
      ] : undefined,
      technology: {
        id: item.technology.id,
        name: item.technology.description
      },
      details: item.info.map(severity => ({
        id: severity.id,
        severity_id: severity.severity_id,
        name: severity.severity.code
      })),
      availability: {
        id: item.info[0].availability.availability_id,
        name: item.info[0].availability.name
      },
      resolution: {
        id: item.info[0].resolution.resolution_id,
        name: item.info[0].resolution.name
      }
    })
  }

  sendData()
}

const compareSla = (id) => id === selectedSLA.value.id
const compareTechnology = (id) => id === selectedSLATechnology.value.id
const compareDate = (date) => {
  return !expiration.value && !date || (date && expiration.value && (oldDateInside(date[0]) || oldDateInside(date[1]) || dateInside(date)))
}

const gt = (date) => new Date(date).getTime()
const oldDateInside = (oldDate) => {
  return gt(expirationDate.value[0]) <= gt(oldDate) && gt(expirationDate.value[1]) >= gt(oldDate)
}
const dateInside = (oldDate) => {
  return gt(oldDate[0]) <= gt(expirationDate.value[0]) && gt(oldDate[1]) >= gt(expirationDate.value[1])
}

const addProjectSLA = (event) => {
  event.preventDefault()
  if (expiration.value) {
    if (expirationDate.value.length === 0) {
      return notifyError('Enter expiration date')
    }
    if (!expirationDate.value[0] || !expirationDate.value[1]){
      return notifyError('You must enter a date range for the \'expiration date\' field')
    }
  }

  const exist = projectSLA.value.find(sla => {
    return !sla.deletedAt
        && compareTechnology(sla.technology.id)
        && compareDate(sla.expirationDate)
        && sla.details.filter(s => selectedSLASeverity.value.map(severity => { return severity.severity_id }).includes(s.severity_id)).length
  })
  if (exist) {
    return notifyError('SLA for this technology has already been declared in the expiration date range')
  }

  projectSLA.value.push({
    id: selectedSLA.value.id,
    name: selectedSLA.value.name,
    expirationDate: expiration.value ? expirationDate.value : undefined,
    technology: {
      id: selectedSLATechnology.value.id,
      name: selectedSLATechnology.value.description
    },
    details: selectedSLASeverity.value.map(severity => ({
      id: severity.id,
      severity_id: severity.severity_id,
      name: severity.severity.code
    })),
    availability: {
      id: selectedSLASeverityAvailability.value.id,
      name: selectedSLASeverityAvailability.value.name
    },
    resolution: {
      id: selectedSLASeverityResolutions.value.id,
      name: selectedSLASeverityResolutions.value.name
    }
  })
  selectedSLA.value = {}
  selectedSLATechnology.value = {}
  selectedSLASeverity.value = []
  selectedSLASeverityResolutions.value = {}
  selectedSLASeverityAvailability.value = {}
  expiration.value = false
  expirationDate.value = []
  sendData()
}

const remove = (SLA, event) => {
  event.preventDefault()
  if (SLA.data && SLA.data.old) {
    SLA.data.deletedAt = new Date()
  } else {
    const idx = projectSLA.value.findIndex((sla) =>  sla.id === SLA.id)
    projectSLA.value.splice(idx, 1)
  }
  sendData()
}

const sendData = () => {
  emit('change', { projectSLA: projectSLA.value })
}
</script>

<style>
  .col-selected {
    background: #EEF2FF !important;
    color: #312E81 !important;
    font-weight: bold;
  }
</style>
