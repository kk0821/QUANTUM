<template>
  <div>
    <div class="py-4 sm:mt-0">
      <div class="md:grid md:grid-cols-4 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Information</h3>
            <p class="mt-1 text-sm text-gray-600">Descriptive information of the controller element</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-3">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-6">

                  <div class="col-span-6 lg:col-span-3">
                    <base-input
                        :id="'name-controller-element'"
                        :autocomplete="'name-controller-element'"
                        v-model="controllerElement.name"
                        label="Name"
                        type="text"
                        :is-disabled="!canEdit"
                        :is-required="true"
                    />
                  </div>
                  <div class="col-span-6 lg:col-span-3">
                    <base-input
                        :id="'code-controller-element'"
                        :autocomplete="'code-controller-element'"
                        v-model="controllerElement.code"
                        label="Code"
                        type="text"
                        :is-disabled="!canEdit"
                        :is-required="true"
                    />
                  </div>
                  <div class="col-span-6 lg:col-span-3">
                    <base-input
                        :id="'address-controller-element'"
                        :autocomplete="'address-controller-element'"
                        v-model="controllerElement.address"
                        label="Address"
                        type="text"
                        :is-disabled="!canEdit"
                        :is-required="true"
                    />
                  </div>
                  <div class="col-span-6 lg:col-span-3">
                    <base-input
                        :id="'ip-controller-element'"
                        :autocomplete="'ip-controller-element'"
                        v-model="controllerElement.ip_address"
                        label="IP Address"
                        type="text"
                        :is-disabled="!canEdit"
                        :is-required="true"
                    />
                  </div>

                  <div class="col-span-6 lg:col-span-3">
                    <Listbox as="div" v-model="selectedOem" :disabled="!canEdit">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> OEM </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit ? 'disabled:opacity-75':'']">
                          <span class="block truncate">{{ selectedOem.description }}</span>
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
                                v-for="oem in listOem"
                                :key="oem.id"
                                :value="oem"
                                as="template"
                            >
                              <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ oem.description }}</span>
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

                  <div class="col-span-6 lg:col-span-3">
                    <Listbox as="div" v-model="selectedTechnology" :disabled="!canEdit">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Technology </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit ? 'disabled:opacity-75':'']">
                          <span class="block truncate">{{ selectedTechnology.description }}</span>
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
            <p class="mt-1 text-sm text-gray-600">Configuration of the branch where the controller is located.</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-3">
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

                  <div class="col-span-6 lg:col-span-3">
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
import {ref, toRefs, onBeforeMount } from 'vue'
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import BaseInput from '@/components/BaseInput.vue'
import countryService from '@/services/country.service'
import companyService from '@/services/company.service'
import technologyService from '@/services/technology.service'
import oemService from '@/services/oem.service'
import resolver from '@/utils/_resolver.ts'
import { loading } from '@/store/loading'
import { useSetInitialSelect, useSetFirstElement } from '@/composables/listbox_items'
import { useStatus } from "@/composables/types";
const selectedCountry = ref({})
const selectedCompany = ref({})
const selectedStatus = ref({})
const selectedTechnology = ref({})
const selectedOem = ref({})

const listTechnology = ref([])
const listOem = ref([])
const countries = ref()
const companies = ref()
const isLoadingCompany = ref(true)
const { statuses } = useStatus()

const props = defineProps({
  controllerElement: {
    type: Object
  },
  canEdit: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['save'])
const data = toRefs(props)

const sendData = (event) => {
  event.preventDefault()
  emit('save', {
    controllerElement: data.controllerElement.value,
    country: selectedCountry.value.id,
    company: selectedCompany.value.id,
    technology: selectedTechnology.value.id,
    oem: selectedOem.value.id,
    status: selectedStatus.value.id
  })
}

const changeCompany = () => {
  isLoadingCompany.value = true
  loadCompany();
}

const loadCompany = (setOld) => {
  companyService.byCountry(selectedCountry.value.id).then(x => {
    companies.value = x.data
    if (setOld) {
      useSetInitialSelect(companies.value, data.controllerElement.value.branch.company.id, selectedCompany)
    } else {
      useSetFirstElement(companies.value, selectedCompany)
    }
    isLoadingCompany.value = false
  })
}

onBeforeMount(() => {
  loading.show()
  resolver.all({
    technology: technologyService.list(),
    oem: oemService.list(),
    country: countryService.withBranches(),
  }).then(resp => {
    listTechnology.value = resp.technology.data
    listOem.value = resp.oem.data
    countries.value = resp.country.data

    if (data.controllerElement.value.id) {
      useSetInitialSelect(statuses.value, data.controllerElement.value.status, selectedStatus)
      useSetInitialSelect(listTechnology.value, data.controllerElement.value.technology.id, selectedTechnology)
      useSetInitialSelect(listOem.value, data.controllerElement.value.oem.id, selectedOem)
      useSetInitialSelect(countries.value, data.controllerElement.value.branch.country.id, selectedCountry)
      loadCompany(true)
    } else {
      useSetFirstElement(statuses.value, selectedStatus)
      useSetFirstElement(listTechnology.value, selectedTechnology)
      useSetFirstElement(listOem.value, selectedOem)
      useSetFirstElement(countries.value, selectedCountry)
      loadCompany()
    }
    loading.hide()
  })
})
</script>
