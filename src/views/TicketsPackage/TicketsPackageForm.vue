<template>
  <div>
    <div class="py-4 sm:mt-0">
      <div class="md:grid md:grid-cols-4 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Information</h3>
            <p class="mt-1 text-sm text-gray-600">Basic tickets package information.</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-3">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-6">

                  <div class="col-span-6 lg:col-span-3">
                    <base-input
                        :id="'contract-reference'"
                        :autocomplete="'contract-reference'"
                        v-model="ticketsPackage.name"
                        label="Contract reference"
                        type="text"
                        :is-disabled="!canEdit"
                    />
                  </div>

                  <div class="col-span-6 lg:col-span-3">
                    <Listbox as="div" v-model="selectedProject" :disabled="!canEdit || ticketPackageConsumed">
                      <ListboxLabel class="block text-sm font-medium text-gray-700">Project</ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-amerinode-blue-500 focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 sm:text-sm">
                          <span class="flex items-center">
                            <img :src="selectedProject?.branch?.country.flag_url" alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
                            <span class="ml-3 block truncate">{{ selectedProject?.name }} | {{ selectedProject?.branch?.company?.description }} | {{ selectedProject?.project_type?.service_type?.code }}</span>
                          </span>
                          <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>

                        <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                          <ListboxOptions class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            <ListboxOption
                                as="template"
                                v-for="item in listProjects"
                                :key="item.id"
                                :value="item"
                                v-slot="{ active, selected }"
                                @click="changeServiceType"
                            >
                              <li :class="[active ? 'text-white bg-amerinode-blue-600' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                                <div class="flex items-center">
                                  <img :src="item.branch.country.flag_url" alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
                                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">{{ item.name }} | {{ item.branch.company.description }} | {{ item.project_type.service_type.code }}</span>
                                </div>
                                <span v-if="selected" :class="[active ? 'text-white' : 'text-amerinode-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
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

                  <div class="col-span-6 lg:col-start-1 lg:col-span-3">
                    <label class="block text-sm font-medium text-gray-700">Tickets package with expiration date</label>
                    <InputSwitch v-model="expiration" :disabled="!canEdit" class="mt-3" />
                  </div>

                  <div v-show="expiration" class="col-span-6 sm:col-span-5 lg:col-span-3">
                    <label class="block text-sm font-medium text-gray-700">Date range</label>
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

    <div class="py-4 sm:mt-0">
      <div class="md:grid md:grid-cols-4 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Details</h3>
            <p class="mt-1 text-sm text-gray-600">Configure the detail of the ticket package, indicate the tickets quantity by technology, vendor and/or severity.</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-3">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6" v-if="detailsTable.length">
                <DataTable
                  :value="detailsTable"
                  :paginator="false"
                  dataKey="id"
                  :rowHover="true"
                  responsiveLayout="scroll"
                >
                  <Column
                      field="package"
                      header="Ticket quantity">
                    <template #body="{data}">
                      <span v-if="canEdit">{{ data.package }}</span>
                      <span v-else>{{ data.package - data.consumed }}/{{ data.package }}</span>
                    </template>
                  </Column>
                  <Column v-show="isSoftwareService"
                      field="severity"
                      header="Severities">
                    <template #body="{data}">
                      <span
                          v-for="(severity) in data.severity.reduce((old, current) => {
                        if (old.indexOf(current.code) === -1) old.push(current.code)
                        return old
                      }, [])"
                      >{{ severity }}&nbsp;</span>
                    </template>
                  </Column>
                  <Column
                      field="technology"
                      header="Technologies">
                    <template #body="{data}">
                      <span
                          v-for="(technology) in data.technology.reduce((old, current) => {
                            if (old.indexOf(current.description) === -1) old.push(current.description)
                            return old
                          }, [])"
                      >{{ technology }}&nbsp;</span>
                    </template>
                  </Column>
                  <Column
                      field="oem"
                      header="Vendors">
                    <template #body="{data}">
                      <span
                          v-for="(oem) in data.oem.reduce((old, current) => {
                            if (old.indexOf(current.description) === -1) old.push(current.description)
                            return old
                          }, [])"
                      >{{ oem }}&nbsp;</span>
                    </template>
                  </Column>

                  <Column :exportable="false" v-if="canEdit">
                    <template #body="data">
                      <button type="button" @click="($event) => editDetail(data, $event)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <PencilIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="sr-only">edit</span>
                      </button>
                      <button type="button" @click="($event) => removeDetail(data, $event)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        <TrashIcon class="h-6 w-6" aria-hidden="true" v-if="!data.data.consumed"/>
                        <InformationCircleIcon class="h-6 w-6" aria-hidden="true" v-else />
                        <span class="sr-only">Remove</span>
                      </button>
                    </template>
                  </Column>
                </DataTable>
              </div>
              <div class="bg-white py-6 px-6" v-if="canEdit">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6" v-if="onEditDetail">
                    <p class="mt-1 text-sm text-gray-600 font-medium">Edit quantity tickets of this setting</p>
                    <p class="mt-1 text-sm text-gray-600" v-if="consumed">This setting has consumed {{ consumed }} ticket{{ consumed > 1 ? 's' : '' }}.</p>
                  </div>
                  <div class="col-span-6 lg:col-span-3">
                    <base-input
                        :id="'package'"
                        :autocomplete="'package'"
                        v-model="ticketQuantity"
                        label="Tickets quantity"
                        type="number"
                    />
                  </div>
                  <div class="col-span-6 lg:col-span-3">
                    <label class="mb-1 block text-sm font-medium text-gray-700">Technologies</label>
                    <MultiSelect v-model="selectedTechnology" :options="listTechnology" optionLabel="description" placeholder="Select technology" :filter="true" class="w-full">
                      <template #value="slotProps">
                        <div
                            class="inline-flex py-0.5 px-2.5 mr-0.5 bg-gray-200 rounded-md text-gray-700"
                            v-for="option of slotProps.value" :key="option.id"
                        >
                          <div>{{option.description}}</div>
                        </div>
                        <template v-if="!slotProps.value || slotProps.value.length === 0">
                          Select technologies
                        </template>
                      </template>
                      <template #option="slotProps">
                        <div class="flex-shrink-0 group block">
                          <div class="flex items-center">
                            <div class="ml-3">
                              <p class="text-sm font-medium">{{ slotProps.option.description }}</p>
                            </div>
                          </div>
                        </div>
                      </template>
                    </MultiSelect>
                  </div>
                  <div v-show="isSoftwareService" class="col-span-6 lg:col-span-3">
                    <label class="mb-1 block text-sm font-medium text-gray-700">Severities</label>
                    <MultiSelect v-model="selectedSeverity" :options="listSeverity" optionLabel="name" placeholder="Select severities" :filter="true" class="w-full">
                      <template #value="slotProps">
                        <div
                            class="inline-flex py-0.5 px-2.5 mr-0.5 bg-gray-200 rounded-md text-gray-700"
                            v-for="option of slotProps.value" :key="option.code"
                        >
                          <div>{{option.code}}</div>
                        </div>
                        <template v-if="!slotProps.value || slotProps.value.length === 0">
                          Select severities
                        </template>
                      </template>
                      <template #option="slotProps">
                        <div class="flex-shrink-0 group block">
                          <div class="flex items-center">
                            <div class="mt-1">
                              <span class="inline-block h-5 w-5 rounded-full" v-bind:style="{ 'background-color': slotProps.option.color}" />
                            </div>
                            <div class="ml-3">
                              <p class="text-sm font-medium">{{ slotProps.option.code }}</p>
                            </div>
                          </div>
                        </div>
                      </template>
                    </MultiSelect>
                  </div>

                  <div class="col-span-6 lg:col-span-3">
                    <label class="mb-1 block text-sm font-medium text-gray-700">Vendors</label>
                    <MultiSelect v-model="selectedOem" :options="listOem" optionLabel="description" placeholder="Select vendor" :filter="true" class="w-full">
                      <template #value="slotProps">
                        <div
                            class="inline-flex py-0.5 px-2.5 mr-0.5 bg-gray-200 rounded-md text-gray-700"
                            v-for="option of slotProps.value" :key="option.code"
                        >
                          <div>{{option.description}}</div>
                        </div>
                        <template v-if="!slotProps.value || slotProps.value.length === 0">
                          Select vendors
                        </template>
                      </template>
                      <template #option="slotProps">
                        <div class="flex-shrink-0 group block">
                          <div class="flex items-center">
                            <div class="ml-3">
                              <p class="text-sm font-medium">{{ slotProps.option.description }}</p>
                            </div>
                          </div>
                        </div>
                      </template>
                    </MultiSelect>
                  </div>
                </div>
              </div>
              <div class="px-4 py-5 bg-white sm:p-6"
                v-if="canEdit && enableSavePackageDetail"
              >
                <button
                    v-if="!onEditDetail"
                    type="submit"
                    @click="(event) => addDetail(event)"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
                  >Add setting</button>
                <button
                  v-if="onEditDetail"
                  type="submit"
                  @click="(event) => updateDetail(event)"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
                  >Update setting</button>
                &nbsp;
                <button
                    v-if="onEditDetail"
                    type="submit"
                    @click="(event) => cancelUpdateDetail(event)"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-400 hover:bg-amerinode-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-300"
                  >Cancel edit</button>
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

    <div class="mt-10 sm:mt-0" v-if="canEdit">
      <div class="md:grid md:grid-cols-4 md:gap-6">
        <div class="md:col-span-1"></div>
        <div class="mt-5 md:mt-0 md:col-span-3">
          <form action="#" method="POST">
            <div>
              <div class="px-4 py-3 text-right sm:px-6">
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
import { CheckIcon, ChevronUpDownIcon, InformationCircleIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'

import BaseInput from '@/components/BaseInput.vue'
import MultiSelect from 'primevue/multiselect'
import InputSwitch from 'primevue/inputswitch'
import Calendar from 'primevue/calendar'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { useStatus } from "@/composables/types"
import countryService from "@/services/country.service"
import companyService from "@/services/company.service"
import severityService from "@/services/severity.service"
import technologyService from "@/services/technology.service"
import oemService from "@/services/oem.service"
import serviceTypeService from "@/services/service_type.service"
import projectService from "@/services/project.service";
import resolver from "@/utils/_resolver.ts"
import { loading } from '@/store/loading'
import { notifyError } from "@/utils/notify_error";
import { useSetInitialSelect, useSetFirstElement } from '@/composables/listbox_items'

const selectedServiceType = ref({})
const selectedStatus = ref({})
const selectedProject = ref({})
const selectedSeverity = ref([])
const selectedTechnology = ref([])
const selectedOem = ref([])
const countries = ref()
const companies = ref()
const listProjects = ref()
const listServiceType = ref([])
const listTechnology = ref([])
const listSeverity = ref([])
const listOem = ref([])
const expiration = ref(false)
const expirationDate = ref([])
const details = ref([])
const onEditDetail = ref(0)
const consumed = ref(undefined)
const ticketQuantity = ref(undefined)
const { statuses } = useStatus()

const props = defineProps({
  ticketsPackage: {
    type: Object
  },
  canEdit: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['save'])
const data = toRefs(props)

const enableSave = computed(() => {
  return data.ticketsPackage.value.name
    && details.value.length
    && selectedProject.value.id
    && (onEditDetail.value === 0 && !ticketQuantity.value
        && ((selectedSeverity.value.length === 0 && isSoftwareService) || (!isSoftwareService))
        && selectedTechnology.value.length === 0
        && selectedOem.value.length === 0)
})

const enableSavePackageDetail = computed(() => {

  return !!(ticketQuantity.value > 0
      && ((selectedSeverity.value.length && isSoftwareService.value) || (!isSoftwareService.value))
      && selectedTechnology.value.length
      && selectedOem.value.length)
})

const isSoftwareService = computed( () => {
  return (selectedServiceType.value.code === 'SW')
})

const detailsTable = computed(() => details.value.filter(detail => !detail.deletedAt))
const ticketPackageConsumed = computed(() => details.value ? details.value.filter(detail => detail.consumed > 0).length > 0 : false)

const changeServiceType = () => {
  selectedServiceType.value = selectedProject.value.project_type.service_type
}

const isDuplicateSetting = (id) => {

  const severities = isSoftwareService.value ? details.value.filter(d =>
      !d.deletedAt
      && d.severity.filter(s => selectedSeverity.value.map(severity => { return severity.id }).includes(s.id)).length
      && (d.id !== id)
  ) : details.value.filter(d =>
      !d.deletedAt
      && (d.id !== id)
  )

  if (severities && severities.length) {
    const technologies = severities.filter(d =>
        !d.deletedAt
        && d.technology.filter(s => selectedTechnology.value.map(technology => { return technology.id }).includes(s.id)).length
        && (d.id !== id)
    )

    if (technologies && technologies.length) {
      const oems = technologies.filter(d =>
          !d.deletedAt
          && d.oem.filter(s => selectedOem.value.map(oem => { return oem.id }).includes(s.id)).length
          && (d.id !== id)
      )

      if (oems && oems.length) {
        return true
      }
    }
  }

  return false
}

const sendData = (event) => {
  event.preventDefault()

  if (expiration.value && (!expirationDate.value[0] || !expirationDate.value[1])) {
    return notifyError('Fill in expiration date')
  }

  if (isSoftwareService.value) {
    const emptySeverities = isSoftwareService.value ? details.value.filter(d =>
        !d.deletedAt
        && d.severity.length === 0
    ) : []

    if (emptySeverities.length) {
      return notifyError('The type of service of the selected project is of the Software type and for this it is mandatory that you assign severities for each ticket package detail')
    }
  }

  emit('save', {
    ticketsPackage: data.ticketsPackage.value,
    details: details.value,
    project: selectedProject.value,
    expirationDate: expiration.value ? expirationDate.value : undefined,
    serviceType: selectedServiceType.value,
    status: selectedStatus.value,
  })
}

const resetDetail = () => {
  consumed.value = undefined
  ticketQuantity.value = undefined
  onEditDetail.value = 0
  selectedTechnology.value = []
  selectedSeverity.value = []
  selectedOem.value = []
}

const addDetail = (event) => {
  event.preventDefault()
  if (!ticketQuantity.value > 0 || (!selectedSeverity.value.length && !isSoftwareService) || !selectedTechnology.value.length || !selectedOem.value.length) {
    return notifyError('Incomplete setting')
  }

  if (isDuplicateSetting()) {
    return notifyError('Duplicate setting')
  } else {
    if ((consumed.value || 1) > ticketQuantity.value) {
      return notifyError(`Minimum quantity tickets required ${(consumed.value || 1)}`)
    }
    details.value.push({
      id: new Date().getTime(),
      technology: selectedTechnology.value,
      severity: selectedSeverity.value,
      oem: selectedOem.value,
      package: ticketQuantity.value,
      deletedAt: null
    })
    resetDetail()
  }
}

const updateDetail = (event) => {
  event.preventDefault()

  if (!ticketQuantity.value || (!selectedSeverity.value.length && !isSoftwareService) || !selectedTechnology.value.length || !selectedOem.value.length) {
    return notifyError('Incomplete setting')
  }

  if (isDuplicateSetting(onEditDetail.value)) {
    return notifyError('Duplicate setting')
  } else {
    if ((consumed.value || 1) > ticketQuantity.value) {
      return notifyError(`Minimum quantity tickets required ${(consumed.value || 1)}`)
    }
    const detail = details.value.find((d) =>  d.id === onEditDetail.value)
    if (detail) {
      detail.package = ticketQuantity.value
      detail.technology = selectedTechnology.value
      detail.severity = selectedSeverity.value
      detail.oem = selectedOem.value
    }
    resetDetail()
  }
}

const cancelUpdateDetail = (event) => {
  event.preventDefault()
  resetDetail()
}

const editDetail = (detail, event) => {
  event.preventDefault()
  selectedTechnology.value = detail.data.technology
  selectedSeverity.value = detail.data.severity
  selectedOem.value = detail.data.oem
  ticketQuantity.value = detail.data.package
  consumed.value = detail.data.consumed
  onEditDetail.value = detail.data.id
}

const removeDetail = (detail, event) => {
  event.preventDefault()
  if (detail.data && detail.data.old) {
    if (detail.data.consumed) {
      return notifyError('Tickets consumed. Can\'t delete this setting')
    }
    detail.data.deletedAt = new Date()
  } else {
    const idx = details.value.findIndex((d) =>  d.id === detail.data.id)
    details.value.splice(idx, 1)
  }
  resetDetail()
}

const loadDetails = (oldDetails) => {
  for (const detail of oldDetails) {
    let severities = detail.severities.reduce((old, current) => {
      if (old.indexOf(current) === -1) old.push(current)
      return old
    }, [])
    let technologies = detail.technologies.reduce((old, current) => {
      if (old.indexOf(current) === -1) old.push(current)
      return old
    }, [])
    let vendors = detail.oems.reduce((old, current) => {
      if (old.indexOf(current) === -1) old.push(current)
      return old
    }, [])
    details.value.push({
      old: true,
      id: detail.id,
      technology: technologies,
      severity: severities,
      oem: vendors,
      package: detail.package,
      consumed: detail.tickets_consumed
    })
  }
}

onBeforeMount(() => {
  loading.show()
  resolver.all({
    severities: severityService.list(),
    technology: technologyService.list(),
    oems: oemService.list(),
    service_type: serviceTypeService.list(),
    projects: projectService.listWithBranchOnly(),
  }).then(resp => {
    listServiceType.value = resp.service_type.data
    listSeverity.value = resp.severities.data
    listTechnology.value = resp.technology.data
    listOem.value = resp.oems.data
    listProjects.value = resp.projects.data
    if (data.ticketsPackage.value.id) {
      expiration.value = Boolean(data.ticketsPackage.value.valid_from)
      if (expiration.value) {
        expirationDate.value = [
          new Date(data.ticketsPackage.value.valid_from),
          new Date(data.ticketsPackage.value.valid_until)
        ]
      }
      useSetInitialSelect(listServiceType.value, data.ticketsPackage.value.service_type.id, selectedServiceType)
      useSetInitialSelect(statuses.value, data.ticketsPackage.value.status, selectedStatus)
      useSetInitialSelect(listProjects.value, data.ticketsPackage.value.project.id, selectedProject)
      loadDetails(data.ticketsPackage.value.details)
    } else {
      useSetFirstElement(statuses.value, selectedStatus)
      useSetFirstElement(listProjects.value, selectedProject)
      changeServiceType()
    }

    loading.hide()
  })
})

</script>

<style>
  .col-selected {
    background: #EEF2FF !important;
    color: #312E81 !important;
    font-weight: bold;
  }
  .p-multiselect-panel .p-multiselect-items {
    padding: 0 !important;
  }
  .p-multiselect-panel .p-multiselect-items .p-multiselect-item {
    padding: 0.5rem 1rem;
  }
</style>
