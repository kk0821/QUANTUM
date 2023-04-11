<template>
  <div>
    <div class="py-4 sm:mt-0">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Information</h3>
            <p class="mt-1 text-sm text-gray-600">Descriptive information of the network element</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-6">

                  <div class="col-span-6">
                    <base-input
                        :id="'name-network-element'"
                        :autocomplete="'name-network-element'"
                        v-model="networkElement.name"
                        label="Name"
                        type="text"
                        :is-disabled="!canEdit"
                        :is-required="true"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-3">
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

                  <div class="col-span-6 sm:col-span-3">
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
              <div v-show="canEdit" class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                    type="submit"
                    @click="(event) => sendData(event)"
                    :disabled="!enableSave"
                    :class="[ !enableSave ? 'disabled:opacity-75' : '']"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import {ref, toRefs, onBeforeMount, computed} from 'vue'
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import BaseInput from '@/components/BaseInput.vue'
import technologyService from '@/services/technology.service'
import oemService from '@/services/oem.service'
import { loading } from '@/store/loading'
import { useSetInitialSelect, useSetFirstElement } from '@/composables/listbox_items'
import { useStatus } from "@/composables/types";
import resolver from '@/utils/_resolver.ts'

const selectedStatus = ref({})
const selectedTechnology = ref({})
const selectedOem = ref({})
const listTechnology = ref([])
const listOem = ref([])
const { statuses } = useStatus()

const props = defineProps({
  networkElement: {
    type: Object
  },
  canEdit: {
    type: Boolean,
    default: true
  },
})

const data = toRefs(props)
const emit = defineEmits(['save'])

const enableSave = computed(() => {
  return data.networkElement.value.name
      && selectedOem.value.id
      && selectedTechnology.value.id
      && selectedStatus.value.id
})

const sendData = (event) => {
  event.preventDefault()
  emit('save', {
    network_element: data.networkElement.value,
    technology: selectedTechnology.value,
    oem: selectedOem.value,
    status: selectedStatus.value
  })
}

onBeforeMount(() => {
  loading.show()
  resolver.all({
    technology: technologyService.list(),
    oem: oemService.list(),
  }).then(resp => {
    listTechnology.value = resp.technology.data
    listOem.value = resp.oem.data
    if (data.networkElement.value.id) {
      useSetInitialSelect(statuses.value, data.networkElement.value.status, selectedStatus)
      useSetInitialSelect(listTechnology.value, data.networkElement.value.technology.id, selectedTechnology)
      useSetInitialSelect(listOem.value, data.networkElement.value.oem.id, selectedOem)
    } else {
      useSetFirstElement(statuses.value, selectedStatus)
      useSetFirstElement(listTechnology.value, selectedTechnology)
      useSetFirstElement(listOem.value, selectedOem)
    }
    loading.hide()
  })
})

</script>
