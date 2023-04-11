<template>
  <div>
    <div class="py-4 sm:mt-0">
      <div class="md:grid md:grid-cols-4 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Information</h3>
            <p class="mt-1 text-sm text-gray-600">Descriptive information of the item master</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-3">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-6">

                  <div class="col-span-6 lg:col-span-3">
                    <base-input
                        :id="'name-items-master'"
                        :autocomplete="'name-items-master'"
                        v-model="itemMaster.part_number"
                        label="Part Number"
                        type="text"
                        :is-disabled="!canEdit"
                        :is-required="true"
                        :class="{ 'bg-red-100': canEdit && !itemMaster.part_number }"
                    />
                  </div>
                  <div class="col-span-6 lg:col-span-3">
                    <base-input
                        :id="'description-items-master'"
                        :autocomplete="'description-items-master'"
                        v-model="itemMaster.description"
                        label="Description"
                        type="text"
                        :is-disabled="!canEdit"
                        :is-required="true"
                        :class="{ 'bg-red-100': canEdit && !itemMaster.description }"
                    />
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

                  <div class="col-span-6 lg:col-span-3">
                    <grouped-select-input
                      type="number"
                      autocomplete="time-response"
                      label-input="Time sla"
                      label-select="Unit sla"
                      :disabled-if="unitDoesNotAllowValues"
                      :reset-input-value="unitDoesNotAllowValues"
                      :key-label="'nomenclature'"
                      :key-value="'id'"
                      :id-select="'time-sla'"
                      :id-input="'unit-sla'"
                      :only-value="true"
                      :options="listTimeUnit"
                      v-model="itemMaster.sla_time"
                      v-model:updated-item="selectedTimeUnit"
                      :selected-option="selectedTimeUnit"
                      :required="!unitDoesNotAllowValues"
                      :disabled="!canEdit"
                    />
                  </div>

                  <div class="col-span-6 lg:col-span-3">
                    <Listbox as="div" v-model="selectedOem" :disabled="!canEdit" aria-required="true">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> OEM </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit ? 'disabled:opacity-75':'']">
                          <div>
                            <span class="block truncate">{{ selectedOem.description }}</span>
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
                                v-for="oem in listOem"
                                :key="oem.id"
                                :value="oem"
                                as="template"
                                @click="changeNetworkElement"
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
            <p class="mt-1 text-sm text-gray-600">Configuration of the branch where the item master is located</p>
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
            <h3 class="text-lg font-medium leading-6 text-gray-900">Item detail</h3>
            <p class="mt-1 text-sm text-gray-600">Definition of the item master</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-3">
          <form action="#" method="POST">
            <div class="shadow sm:rounded-md">
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="grid grid-cols-6 gap-6">

                  <div class="col-span-6">
                    <label class="block text-sm font-medium text-gray-700">Item master is consumable?</label>
                    <InputSwitch v-model="itemMaster.consumable" :disabled="!canEdit" class="mt-2"/>
                  </div>

                  <div class="col-span-6 lg:col-span-3" v-if="!itemMaster.consumable">
                    <Listbox as="div" v-model="selectedSegment" :disabled="!canEdit" aria-required="true">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Segment </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit ? 'disabled:opacity-75':'']">
                          <div>
                            <span class="block truncate">{{ selectedSegment.name }}</span>
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
                                v-for="segment in listSegments"
                                :key="segment.id"
                                :value="segment"
                                as="template"
                            >
                              <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ segment.name }}</span>
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

                  <div class="col-span-6 lg:col-span-3" v-if="!itemMaster.consumable">
                    <Listbox as="div" v-model="selectedTechnology" :disabled="!canEdit" aria-required="true">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Technology </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit ? 'disabled:opacity-75':'']">
                          <div>
                            <span class="block truncate">{{ selectedTechnology.description }}</span>
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
                                @click="changeNetworkElement"
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

                  <div class="col-span-6 lg:col-span-3" v-if="!itemMaster.consumable">
                    <Listbox as="div" v-model="selectedControllerType" :disabled="!canEdit" aria-required="true">
                      <ListboxLabel class="block text-sm font-medium text-gray-700"> Controller Type </ListboxLabel>
                      <div class="relative mt-1">
                        <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                                       :class="[ !canEdit ? 'disabled:opacity-75':'']">
                          <div>
                            <span class="block truncate">{{ selectedControllerType.name }}</span>
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
                                v-for="node in listControllerTypes"
                                :key="node.id"
                                :value="node"
                                as="template"
                            >
                              <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ node.name }}</span>
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

                  <div class="col-span-6 lg:col-span-3" v-if="!itemMaster.consumable">
                    <Combobox
                        v-model="selectedNetworkElement"
                        :disabled="!canEdit"
                    >
                      <ComboboxLabel class="block text-sm font-medium text-gray-700">Network Element</ComboboxLabel>
                      <div class="relative mt-1">
                        <ComboboxInput
                          class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                          :class="{
                            'bg-amerinode-blue-100': !selectedOem.id || !selectedTechnology.id,
                            'disabled:opacity-75': !canEdit,
                            'bg-red-100': canEdit && !selectedNetworkElement.id
                          }"
                          @change="queryNetworkElementList = $event.target.value"
                          :displayValue="(networkElement) => networkElement?.name ? networkElement.name : ''"
                          :disabled="!canEdit || isLoadingNetworkElement"
                        />
                        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                          <div v-if="isLoadingNetworkElement">
                            <svg role="status" class="mr-2 w-5 h-5 text-blue-200 animate-spin dark:text-blue-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                            </svg>
                          </div>
                          <ChevronUpDownIcon v-else class="h-5 w-5 text-gray-400" aria-hidden="true"/>
                        </ComboboxButton>
                        <TransitionRoot
                          leave-active-class="transition duration-100 ease-in"
                          leave-from-class="opacity-100"
                          leave-to-class="opacity-0"
                          @after-leave="queryNetworkElementList = ''"
                        >
                          <ComboboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            <ComboboxOption
                              v-if="filteredNetworkElement.length === 0"
                              disabled
                              as="template"
                            >
                              <li class="text-gray-900 relative cursor-default select-none py-2 pl-10 pr-4 opacity-75">
                                <span class="font-normal block truncate">
                                  No results found for; OEM: {{ selectedOem.description }}; Technology: {{ selectedTechnology.description }}
                                </span>
                              </li>
                            </ComboboxOption>
                            <ComboboxOption
                                v-for="networkElement in filteredNetworkElement"
                                v-slot="{ active, selected }"
                                :key="networkElement"
                                :value="networkElement"
                                as="template"
                            >
                              <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ networkElement.name }}</span>
                                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amerinode-blue-600">
                                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                              </li>
                            </ComboboxOption>
                          </ComboboxOptions>
                        </TransitionRoot>
                      </div>
                    </Combobox>
                  </div>

                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="mt-10 sm:mt-0" v-if="canEdit">
      <div class="grid grid-cols-6 gap-2">
        <div class="mt-5 lg:mt-0 col-span-6" v-if="!enableSave">
          <h1 class="font-semibold text-gray-900 text-sm pt-4 text-end relative">Fields with red background are required.</h1>
        </div>
        <div class="lg:mt-0 col-span-6 md:col-start-5 md:col-span-2 lg:col-start-5 lg:col-span-2 xl:col-start-6 xl:col-span-1">
          <form action="#" method="POST">
            <div>
              <div class="py-3 px-6 md:px-0 text-right">
                <div>
                  <LoadingButton
                      :is-loading="loadingButton.state"
                      :enable-save="enableSave"
                      background-color="bg-amerinode-blue-600"
                      :action-click="(event) => sendData(event)"
                  >
                    Save
                  </LoadingButton>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, toRefs, onBeforeMount } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxLabel,
  ComboboxOptions,
  ComboboxOption,
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  TransitionRoot
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import InputSwitch from 'primevue/inputswitch'
import LoadingButton from "@/components/LoadingButton.vue";
import BaseInput from '@/components/BaseInput.vue'
import GroupedSelectInput from '@/components/GroupedSelectInput.vue'
import countryService from '@/services/country.service'
import companyService from '@/services/company.service'
import oemService from '@/services/oem.service'
import technologyService from '@/services/technology.service'
import networkElementsService from '@/services/network_element.service'
import segmentService from '@/services/segment.service'
import ControllerTypesService from '@/services/controller_types.service'
import unitService from "@/services/unit.service";
import { useSetInitialSelect, useSetFirstElement } from '@/composables/listbox_items'
import resolver from '@/utils/_resolver.ts'
import { loading } from '@/store/loading'
import { loadingButton } from '@/store/loadingButton'
import { notifyError } from '@/utils/notify_error'
import { useStatus } from "@/composables/types";

const selectedNetworkElement = ref({})
const listNetworkElement  = ref([])
const queryNetworkElementList = ref('')
const selectedCountry = ref({})
const selectedCompany = ref({})
const selectedSegment = ref({})
const selectedOem = ref({})
const selectedTechnology = ref({})
const selectedControllerType = ref({})
const selectedTimeUnit = ref('')
const selectedStatus = ref({})
const countries = ref([])
const companies = ref([])
const listOem = ref([])
const listTechnology = ref([])
const listSegments = ref([])
const listControllerTypes = ref([])
const listTimeUnit = ref([])
const isLoadingCompany = ref(true)
const isLoadingNetworkElement = ref(true)
const { statuses } = useStatus()

const props = defineProps({
  itemMaster: {
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
  return !!(data.itemMaster.value.part_number
      && data.itemMaster.value.description
      && selectedCountry.value.id
      && selectedCompany.value.id
      && selectedOem.value.id
      && selectedTimeUnit.value
      && (data.itemMaster.value.consumable || (
          !data.itemMaster.value.consumable
          && selectedSegment.value.id
          && selectedTechnology.value.id
          && selectedControllerType.value.id
          && selectedNetworkElement.value.id
      )))
})

const unitDoesNotAllowValues = computed( () => {
  if (!listTimeUnit.value.length) return false
  const cdUnit = listTimeUnit.value.find(item => item.nomenclature === 'CD')
  return cdUnit ? cdUnit.id !== Number(selectedTimeUnit.value) : false
})

const sendData = (event) => {
  event.preventDefault()
  loadingButton.show()
  emit('save', {
    itemMaster: {
      part_number: data.itemMaster.value.part_number,
      description: data.itemMaster.value.description,
      consumable: data.itemMaster.value.consumable,
      sla_time: data.itemMaster.value.sla_time
    },
    country: selectedCountry.value.id,
    company: selectedCompany.value.id,
    oem: selectedOem.value.id,
    segment: selectedSegment.value.id,
    technology: selectedTechnology.value.id,
    controllerType: selectedControllerType.value.id,
    networkElement: selectedNetworkElement.value.id,
    timeUnit: Number(selectedTimeUnit.value),
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
      useSetInitialSelect(companies.value, data.itemMaster.value.branch.company.id, selectedCompany)
    } else {
      useSetFirstElement(companies.value, selectedCompany)
    }
    isLoadingCompany.value = false
  })
}

const changeNetworkElement = () => {
  selectedNetworkElement.value = {}
  isLoadingNetworkElement.value = true
  loadNetworkElement()
}

const filteredNetworkElement = computed(() =>  {
  return queryNetworkElementList.value === ''
      ? listNetworkElement.value
      : listNetworkElement.value.filter((network) => {
        return network.name.toLowerCase().includes(queryNetworkElementList.value.toLowerCase())
      })
})

const loadNetworkElement = (setOld) => {
  return networkElementsService.filter({
    oem: selectedOem.value.id,
    technology: selectedTechnology.value.id
  }).then(x => {
    isLoadingNetworkElement.value = false
    listNetworkElement.value = x.data
    if (setOld && data.itemMaster.value.type === 'item' && data.itemMaster.value.details.id) {
      useSetInitialSelect(listNetworkElement.value, data.itemMaster.value.details.network_element_id, selectedNetworkElement)
    }
  }).catch((e) => {
    notifyError('Error filtering network elements, please contact your provider"')
  })
}

onBeforeMount(() => {
  loading.show()
  resolver.all({
    country: countryService.list(),
    oem: oemService.list(),
    technology: technologyService.list(),
    segment: segmentService.list(),
    controllerTypes: ControllerTypesService.list(),
    listTimeUnit: unitService.byType('items-master')
  }).then(resp => {
    countries.value = resp.country.data
    listOem.value = resp.oem.data
    listTechnology.value = resp.technology.data
    listSegments.value = resp.segment.data
    listControllerTypes.value = resp.controllerTypes.data
    listTimeUnit.value = resp.listTimeUnit.data

    if (data.itemMaster.value.id) {
      useSetInitialSelect(countries.value, data.itemMaster.value.branch?.country.id, selectedCountry)
      useSetInitialSelect(listOem.value, data.itemMaster.value.oem_id, selectedOem)
      useSetInitialSelect(statuses.value, data.itemMaster.value.status, selectedStatus)
      loadCompany(true)
      selectedTimeUnit.value = String(data.itemMaster.value.sla_unit_id)
      data.itemMaster.value.consumable = data.itemMaster.value.type === 'consumable'
      if (!data.itemMaster.value.consumable && data.itemMaster.value.details.id) {
        useSetInitialSelect(listTechnology.value, data.itemMaster.value.details.technology_id, selectedTechnology)
        useSetInitialSelect(listSegments.value, data.itemMaster.value.details.segment_id, selectedSegment)
        useSetInitialSelect(listControllerTypes.value, data.itemMaster.value.details.controller_type_id, selectedControllerType)
        loadNetworkElement(true)
      } else {
        useSetFirstElement(listTechnology.value, selectedTechnology)
        loadNetworkElement()
        useSetFirstElement(listSegments.value, selectedSegment)
        useSetFirstElement(listControllerTypes.value, selectedControllerType)
      }
    } else {
      useSetFirstElement(countries.value, selectedCountry)
      useSetFirstElement(listOem.value, selectedOem)
      useSetFirstElement(statuses.value, selectedStatus)
      useSetFirstElement(listTechnology.value, selectedTechnology)
      useSetFirstElement(listSegments.value, selectedSegment)
      useSetFirstElement(listControllerTypes.value, selectedControllerType)
      loadCompany()
      loadNetworkElement()
      selectedTimeUnit.value = String((listTimeUnit.value[0] || {}).id)
    }
    loading.hide()
  })
})
</script>
