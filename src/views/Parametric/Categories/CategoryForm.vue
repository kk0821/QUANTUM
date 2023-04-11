<template>
  <div>
    <div class="py-4 sm:mt-0">
      <div class="md:grid md:grid-cols-4 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Information</h3>
            <p class="mt-1 text-sm text-gray-600">Descriptive information of the category.</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-3">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-6">

                  <div class="col-span-6 md:col-span-6 lg:col-span-3">
                    <Listbox as="div" v-model="selectedModule" :disabled="!canEdit">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Module </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit ? 'disabled:opacity-75':'']">
                          <span class="block truncate">{{ selectedModule.name }}</span>
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
                                v-for="module in listModules"
                                :key="module.id"
                                :value="module"
                                as="template"
                                @click="updateParents"
                            >
                              <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ module.name }}</span>
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

                  <div class="col-span-6 md:col-span-6 lg:col-span-3">
                    <Listbox as="div" v-model="selectedCategoryType" :disabled="!canEdit">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Category type </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit ? 'disabled:opacity-75':'']">
                          <span class="block truncate">{{ selectedCategoryType.name }}</span>
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
                                v-for="category_type in listCategoryTypes"
                                :key="category_type.id"
                                :value="category_type"
                                as="template"
                                @click="updateParents"
                            >
                              <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ category_type.name }}</span>
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

                  <div class="col-span-6 md:col-span-6 lg:col-span-6">
                    <base-input
                        :id="'description-project-type'"
                        :autocomplete="'description-project-type'"
                        v-model="category.name"
                        label="Description"
                        type="text"
                        :is-disabled="!canEdit"
                        :is-required="true"
                    />
                  </div>

                  <div class="col-span-6 lg:col-span-3">
                    <label class="block text-sm font-medium text-gray-700">This category has parent?</label>
                    <InputSwitch v-model="hasParent" :disabled="!canEdit" class="mt-2" />
                  </div>

                  <div v-show="hasParent" class="col-span-6 md:col-span-6 lg:col-span-3">
                    <Listbox as="div" v-model="selectedParentCategory" :disabled="!canEdit || isLoadingParents" aria-required="true">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Parent category </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit || isLoadingParents ? 'disabled:opacity-75':'']">
                          <div v-if="isLoadingParents">

                            <div class="flex items-center">
                              <div>
                                <svg role="status" class="mr-2 w-5 h-5 text-blue-200 animate-spin dark:text-blue-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                                </svg>
                              </div>
                              <div class="ml-1">
                                <p class="text-sm text-gray-600">Getting parent categories...</p>
                              </div>
                            </div>

                          </div>
                          <div v-else-if="selectedParentCategory.id">
                            <span class="block truncate">{{ selectedParentCategory.name }}</span>
                          </div>
                          <div v-else>
                            <span class="block truncate">Select parent category</span>
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
                                v-for="parent in parentCategories"
                                :key="parent.id"
                                :value="parent"
                                as="template"
                            >
                              <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ parent.name }}</span>
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

                  <div class="col-span-6 md:col-span-6 lg:col-start-1 lg:col-span-3">
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
import {ref, toRefs, onBeforeMount, computed} from "vue";
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import InputSwitch from 'primevue/inputswitch'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import resolver from "@/utils/_resolver.ts";
import { loading } from '@/store/loading'
import { useSetInitialSelect, useSetFirstElement } from '@/composables/listbox_items'
import { useStatus } from "@/composables/types";
import BaseInput from '@/components/BaseInput.vue'
import moduleService from "@/services/module.service";
import categoryService from "@/services/category.service";
import categoryTypeService from "@/services/category_type.service";

const selectedStatus = ref({})
const selectedModule = ref({})
const selectedParentCategory = ref({})
const selectedCategoryType = ref({})
const listModules = ref()
const listCategoryTypes = ref()
const parentCategories = ref()
const isLoadingParents = ref(true)
const hasParent = ref(false)
const { statuses } = useStatus()

const props = defineProps({
  category: {
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
  return data.category.value.name
      && selectedModule.value.id
      && selectedCategoryType.value.id
      && selectedStatus.value.id
      && (!hasParent.value || (hasParent.value && selectedParentCategory.value.id))
})

onBeforeMount(() => {
  loading.show()
  resolver.all({
    categories_types: categoryTypeService.list(),
    modules: moduleService.list(),
  }).then(resp => {
    listModules.value = resp.modules.data
    listCategoryTypes.value = resp.categories_types.data

    if (data.category.value.id) {
      useSetInitialSelect(statuses.value, data.category.value.status, selectedStatus)
      useSetInitialSelect(listModules.value, data.category.value.module?.id, selectedModule)
      useSetInitialSelect(listCategoryTypes.value, data.category.value.category_type?.id, selectedCategoryType)
      if (data.category.value.parent) {
        hasParent.value = true
      }
    } else {
      useSetFirstElement(statuses.value, selectedStatus)
      useSetFirstElement(listModules.value, selectedModule)
      useSetFirstElement(listCategoryTypes.value, selectedCategoryType)
    }

    loadParentCategories()
    loading.hide()
  })
})

function loadParentCategories() {
  categoryService.parents(selectedModule.value.id, selectedCategoryType.value.id, data.category.value?.id).then(x => {
    parentCategories.value = x.data
    selectedParentCategory.value = {}
    if (parentCategories.value.length) {
      if (data.category.value.parent) {
        for (const [index, item] of Object.entries(parentCategories.value)) {
          if (item.id === data.category.value.parent.id) {
            selectedParentCategory.value = parentCategories.value[index]
          }
        }
      }
      if (!selectedParentCategory.value.id) {
        selectedParentCategory.value = parentCategories.value[0]
      }
    }
    isLoadingParents.value = false
  })
}

function updateParents() {
  isLoadingParents.value = true
  loadParentCategories();
}

const sendData = (event) => {
  event.preventDefault()
  emit('save', {
    category: data.category.value,
    module: selectedModule.value,
    category_type: selectedCategoryType.value,
    parent: (hasParent.value && selectedParentCategory.value) ? selectedParentCategory.value : undefined,
    status: selectedStatus.value
  })
}
</script>
