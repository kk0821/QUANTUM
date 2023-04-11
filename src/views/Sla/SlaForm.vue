<template>
  <form class="space-y-6" action="#" method="POST">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="md:grid md:grid-cols-3 md:gap-6">
          <div class="md:col-span-3">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Information</h3>
            <p class="mt-1 text-sm text-gray-500">Basic SLA information.</p>
          </div>
          <div class="mt-5 space-y-6 md:mt-0 md:col-span-3">
            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6 sm:col-span-3">
                <base-input
                    :id="'name'"
                    :autocomplete="'name-project'"
                    v-model="sla.name"
                    label="Name"
                    type="text"
                    :is-disabled="!canEdit"
                />
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
              <div class="col-span-6">
                <SlaConfigurationList
                    :details="sla.details"
                    :read-only="!canEdit"
                    @change="SLADetailsUpdate"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
      <div v-show="canEdit" class="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
            type="submit"
            @click="(event) => sendData(event)"
            :disabled="!canSave"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
            :class="[ !canSave ? 'disabled:opacity-75' : '']"
        >
          Save SLA configuration
        </button>
      </div>
    </div>

  </form>

</template>
<script setup>
import {ref, toRefs, onBeforeMount, onBeforeUpdate, computed } from "vue";
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import BaseInput from '@/components/BaseInput.vue'
import SlaConfigurationList from '@/views/Sla/SlaConfigurationList.vue'

let loaded = ref(false)
let selectedStatus = ref({})
const slaDetails = ref([])

const statuses = ref([
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' }
])
onBeforeUpdate( () => {
  if (data.modeEdit.value) {
    if (!loaded.value) {
      assignStatus()
      emit('isLoading', false)
      loaded.value = true
    }
  }
})
onBeforeMount(() => {
  if (!data.modeEdit.value) {
    assignStatus()
    emit('isLoading', false)
  }
})

const props = defineProps({
  sla: {
    type: Object
  },
  canEdit: {
    type: Boolean,
    default: true
  },
  assignList: {
    type: Boolean,
    default: false
  },
  slaId: {
    type: String,
    default: ''
  },
  modeEdit: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['save', 'isLoading'])
const data = toRefs(props)

function assignStatus() {
  if (data.assignList.value) {
    //Assign status
    statuses.value.forEach((element, index) => {
      if (element.id === data.sla.value.status) {
        selectedStatus.value = element
      }
    })
  } else {
    selectedStatus.value = statuses.value[0]
  }
}

const sendData = (event) => {
  event.preventDefault()
  emit('save', {
    sla: data.sla.value,
    status: selectedStatus.value
  })
}
const SLADetailsUpdate = (event) => {
  slaDetails.value = event.slaDetails
}

const canSave = computed(() =>
    data.sla.value.details.length >= 2 &&
    data.sla.value.name &&
    selectedStatus.value
)

</script>
