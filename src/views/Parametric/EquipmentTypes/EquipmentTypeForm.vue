<template>
  <div>
    <div class="py-4 sm:mt-0">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Information</h3>
            <p class="mt-1 text-sm text-gray-600">Descriptive information of the equipment type.</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-2 gap-6">

                  <div class="col-span-6 lg:col-span-3">
                    <base-input
                        :id="'code-equipment-type'"
                        :autocomplete="'code-equipment-type'"
                        v-model="equipmentType.code"
                        label="Code"
                        type="text"
                        :is-disabled="!canEdit"
                        :is-required="true"
                    />
                  </div>
                  <div class="col-span-6 lg:col-span-3">
                    <base-input
                        :id="'description-equipment-type'"
                        :autocomplete="'description-equipment-type'"
                        v-model="equipmentType.description"
                        label="Description"
                        type="text"
                        :is-disabled="!canEdit"
                        :is-required="true"
                    />
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
</template>
<script setup>
import {ref, toRefs, onBeforeMount, computed} from "vue";
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import BaseInput from '@/components/BaseInput.vue'
import { useSetInitialSelect, useSetFirstElement } from '@/composables/listbox_items'
import { useStatus } from "@/composables/types";

const { statuses } = useStatus()
const selectedStatus = ref({})

const props = defineProps({
  equipmentType: {
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
  return data.equipmentType.value.code
      && data.equipmentType.value.description
})

const sendData = (event) => {
  event.preventDefault()
  emit('save', {
    equipment_type: data.equipmentType.value,
    status: selectedStatus.value.id,
  })
}

onBeforeMount( () => {
  if (data.equipmentType.value.id) {
    useSetInitialSelect(statuses.value, data.equipmentType.value.status, selectedStatus)
  } else {
    useSetFirstElement(statuses.value, selectedStatus)
  }
})

</script>
