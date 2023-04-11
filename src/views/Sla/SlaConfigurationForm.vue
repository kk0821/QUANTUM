<template>
  <loading-content :is-loading="loading" />
  <form v-show="!loading" class="bg-gray-100 px-5 py-5 z-50">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-4 sm:p-6">
        <div class="mt-3 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

          <div class="sm:col-span-3 md:col-span-3 lg:col-span-2 col-span-6">
            <Listbox as="div" v-model="selectedSeverity" :disabled="modeEdit">
              <ListboxLabel class="block text-sm font-medium text-gray-700"> Severity </ListboxLabel>
              <div class="relative mt-1">
                <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm">
                  <span class="block truncate">{{ selectedSeverity.code }} - {{ selectedSeverity.name }}</span>
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
                        v-for="severity in listSeverity"
                        :key="severity.id"
                        :value="severity"
                        as="template"
                    >
                      <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                        <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ severity.code }} - {{ severity.name }}</span>
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

          <div class="sm:col-span-3 md:col-span-3 lg:col-span-2 col-span-6">
            <grouped-select-input
                type="number"
                min="1"
                step="1"
                :disabled-if="timeResponseDoesNotAllowValues"
                :reset-input-value="timeResponseDoesNotAllowValues"
                autocomplete="time-response"
                label-input="Time response"
                label-select="Time response unit"
                :key-label="'nomenclature'"
                :key-value="'id'"
                :id-select="'time-response-unit'"
                :id-input="'time-response'"
                :only-value="true"
                :options="listTimeUnit"
                v-model="sla.time_response"
                v-model:updated-item="selectedTimeUnitResponse"
                :selected-option="selectedTimeUnitResponse"
                @reset="resetTimeResponse"
            />
          </div>

          <div class="sm:col-span-3 md:col-span-3 lg:col-span-2 col-span-6">
            <grouped-select-input
                type="number"
                min="1"
                step="1"
                :disabled-if="timeRecoveryDoesNotAllowValues"
                :reset-input-value="timeRecoveryDoesNotAllowValues"
                autocomplete="time-recovery"
                label-input="Time recovery"
                label-select="Time recovery unit"
                :key-label="'nomenclature'"
                :key-value="'id'"
                :id-select="'time-recovery-unit'"
                :id-input="'time-recovery'"
                :only-value="true"
                :options="listTimeUnit"
                v-model="sla.time_recovery"
                v-model:updated-item="selectedTimeUnitRecovery"
                :selected-option="selectedTimeUnitRecovery"
                @reset="resetTimeRecovery"
            />
          </div>

          <div v-show="!enableFormResolution" class="col-span-6 md:col-span-6 lg:col-span-3">
            <button
                type="button"
                class="relative block w-full border-2 bg-gray-100 border-gray-300 rounded-lg shadow p-12 text-center hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amerinode-blue-500"
                @click="prepareResolutionForm('new')"
            >
              <CalculatorIcon class="mx-auto h-10 w-10 text-gray-700" aria-hidden="true" />
              <span class="mt-2 block text-sm font-medium text-gray-700"> Create a new resolution </span>
            </button>
          </div>

          <div v-show="enableFormResolution" class="col-span-6 md:col-span-6 lg:col-span-3">

              <form class="space-y-8 divide-y divide-gray-200">
                <div class="bg-gray-100 shadow sm:rounded-lg">
                  <div class="px-2 py-4">

                    <div class="space-y-8 divide-y divide-gray-200">
                      <div class="pt-0">
                        <div class="pb-2 border-b border-gray-200">
                          <div href="#" class="pb-2 flex-shrink-0 group block">
                            <div class="flex items-center">
                              <div>
                                <CalculatorIcon class="mx-auto h-7 w-7 text-gray-700" aria-hidden="true" />
                              </div>
                              <div class="ml-2 pb-0.5">
                                <p class="text-xl font-semibold text-gray-700">{{ titleFormResolution }}</p>
                                <p class="text-xs font-normal text-gray-700 italic"><span class="font-semibold">Important:</span> You can only have 2 items for each type of resolution</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                          <div class="sm:col-span-6 md:col-span-3 xl:col-span-2">
                            <Listbox as="div" v-model="selectedResolutionName">
                              <ListboxLabel class="block text-sm font-medium text-gray-700"> Name </ListboxLabel>
                              <div class="relative mt-1">
                                <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm">
                                  <span class="block truncate">{{ selectedResolutionName.name }}</span>
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
                                        v-for="resolutionName in resolutionNames"
                                        :key="resolutionName.id"
                                        :value="resolutionName"
                                        as="template"
                                    >
                                      <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                        <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ resolutionName.name }}</span>
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

                          <div class="sm:col-span-3 md:col-span-3 xl:col-span-2">
                            <grouped-select-input
                                type="number"
                                min="1"
                                step="1"
                                :disabled-if="resolutionTimeDoesNotAllowValues"
                                :reset-input-value="resolutionTimeDoesNotAllowValues"
                                autocomplete="time-resolution"
                                label-input="Time resolution"
                                label-select="Time resolution unit"
                                :key-label="'nomenclature'"
                                :key-value="'id'"
                                :id-select="'time-resolution-unit'"
                                :id-input="'time-resolution'"
                                :only-value="true"
                                :options="listResolutionUnit"
                                v-model="resolution.time"
                                v-model:updated-item="selectedTimeUnitResolution"
                                :selected-option="selectedTimeUnitResolution"
                                @reset="resetResolution"
                            />
                          </div>

                          <div class="sm:col-span-3 md:col-span-3 xl:col-span-2">
                            <base-input
                                :id="'precision'"
                                :autocomplete="'precision'"
                                v-model="resolution.precision"
                                :disabled-if="resolutionTimeDoesNotAllowValues"
                                label="Precision"
                                type="number"
                            >
                              <template v-slot:suffix>
                                <div class="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none">
                                  <span>%</span>
                                </div>
                              </template>
                            </base-input>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                  <div class="p-3 bg-gray-200">
                    <div class="flex justify-end">
                      <button
                          type="button"
                          @click="hideResolutionForm()"
                          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                        Cancel
                      </button>
                      <button
                          type="submit"
                          :disabled="!canSaveResolution"
                          class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
                          :class="[ !canSaveResolution ? 'disabled:opacity-75' : '']"
                          @click="(event) => saveResolution(event)"
                      >
                        {{ actionButtonFormResolution }}
                      </button>
                    </div>
                  </div>
                </div>
              </form>

          </div>

          <div class="col-span-6 md:col-span-6 lg:col-span-3">
            <DataTable :value="resolutions" rowGroupMode="rowspan" groupRowsBy="name" class="p-datatable-sm"
                       sortMode="single" sortField="name" :sortOrder="1" responsiveLayout="scroll">
              <template #empty>
                No resolutions found.
              </template>
              <template #loading>
                <div class="grid place-items-center h-screen">
                  <svg role="status" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                </div>
              </template>
              <template #header>
                <div class="sm:flex lg:items-center">
                  <div class="sm:flex-auto">
                    <h1 class="text-xl font-semibold text-gray-900">Resolutions</h1>
                    <p class="mt-2 text-sm font-normal text-gray-700">Resolutions associated with the SLA</p>
                    <p class="mt-2 text-xs font-normal text-gray-700 italic"><span class="font-semibold">Important:</span> You can only add up to a maximum of 4 types of resolutions</p>
                  </div>
                </div>
              </template>
              <Column field="name" header="Name">
                <template #body="slotProps">
                  {{slotProps.data.name}}
                </template>
              </Column>
              <Column field="time" header="Time">
                <template #body="slotProps">
                  {{ slotProps.data.time }}
                </template>
              </Column>
              <Column field="unit" header="Unit">
                <template #body="slotProps">
                  {{ slotProps.data.unit.nomenclature }}
                </template>
              </Column>
              <Column field="precision" header="Precision">
                <template #body="slotProps">
                  <span v-if="slotProps.data.precision"> {{ slotProps.data.precision }}%</span>
                </template>
              </Column>
              <Column :exportable="false">
                <template #body="slotProps">
                  <div class="ml-4 flex items-center md:ml-6">
                    <button type="button" @click="(event) => editResolution(slotProps.data, event)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                      <PencilIcon class="h-6 w-6" aria-hidden="true" />
                      <span class="sr-only">edit</span>
                    </button>
                    <button type="button" @click="removeResolution(slotProps.data)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                      <TrashIcon class="h-6 w-6" aria-hidden="true" />
                      <span class="sr-only">delete</span>
                    </button>
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>

          <div v-show="!enableFormAvailability" class="col-span-6 md:col-span-6 lg:col-span-3">
            <button
                type="button"
                class="relative block w-full border-2 bg-gray-100 border-gray-300 rounded-lg shadow p-12 text-center hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amerinode-blue-500"
                @click="prepareAvailabilityForm('new')"
            >
              <ClockIcon class="mx-auto h-10 w-10 text-gray-700" aria-hidden="true" />
              <span class="mt-2 block text-sm font-medium text-gray-700"> Create a new availability </span>
            </button>
          </div>

          <div v-show="enableFormAvailability" class="col-span-6 md:col-span-6 lg:col-span-3">

            <form class="space-y-8 divide-y divide-gray-200">
              <div class="bg-gray-100 shadow sm:rounded-lg">
                <div class="px-2 py-4">

                  <div class="space-y-8 divide-y divide-gray-200">
                    <div class="pt-0">
                      <div class="pb-2 border-b border-gray-200">
                        <div href="#" class="pb-2 flex-shrink-0 group block">
                          <div class="flex items-center">
                            <div>
                              <ClockIcon class="mx-auto h-7 w-7 text-gray-700" aria-hidden="true" />
                            </div>
                            <div class="ml-2 pb-0.5">
                              <p class="text-xl font-semibold text-gray-700">{{ titleFormAvailability }}</p>
                              <p class="text-xs font-normal text-gray-700 italic"><span class="font-semibold">Important:</span> You can only have 1 items for each type of resolution</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                        <div class="sm:col-span-6 md:col-span-3 xl:col-span-3">
                          <Listbox as="div" v-model="selectedAvailabilityName">
                            <ListboxLabel class="block text-sm font-medium text-gray-700"> Name </ListboxLabel>
                            <div class="relative mt-1">
                              <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm">
                                <span class="block truncate">{{ selectedAvailabilityName.name }}</span>
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
                                      v-for="availabilityName in availabilityNames"
                                      :key="availabilityName.id"
                                      :value="availabilityName"
                                      as="template"
                                  >
                                    <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                      <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ availabilityName.name }}</span>
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

                        <div class="sm:col-span-3 md:col-span-3 xl:col-span-3">
                          <Listbox as="div" v-model="selectedTimeUnitAvailability">
                            <ListboxLabel class="block text-sm font-medium text-gray-700"> Unit </ListboxLabel>
                            <div class="relative mt-1">
                              <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm">
                                <span class="block truncate">{{ selectedTimeUnitAvailability.name }}</span>
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
                                      v-for="availabilityUnit in listAvailabilityUnit"
                                      :key="availabilityUnit.id"
                                      :value="availabilityUnit"
                                      as="template"
                                  >
                                    <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                                      <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ availabilityUnit.name }}</span>
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

                </div>
                <div class="p-3 bg-gray-200">
                  <div class="flex justify-end">
                    <button
                        type="button"
                        @click="hideAvailabilityForm()"
                        class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                      Cancel
                    </button>
                    <button
                        type="submit"
                        :disabled="!canSaveAvailability"
                        class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
                        :class="[ !canSaveAvailability ? 'disabled:opacity-75' : '']"
                        @click="(event) => saveAvailability(event)"
                    >
                      {{ actionButtonFormAvailability }}
                    </button>
                  </div>
                </div>
              </div>
            </form>

          </div>

          <div class="col-span-6 md:col-span-6 lg:col-span-3">
            <DataTable :value="availabilities" rowGroupMode="rowspan" groupRowsBy="name" class="p-datatable-sm"
                       sortMode="single" sortField="name" :sortOrder="1" responsiveLayout="scroll">
              <template #empty>
                No availabilities found.
              </template>
              <template #loading>
                <div class="grid place-items-center h-screen">
                  <svg role="status" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                </div>
              </template>
              <template #header>
                <div class="lg:flex lg:items-center">
                  <div class="lg:flex-auto">
                    <h1 class="text-xl font-semibold text-gray-900">Availabilities</h1>
                    <p class="mt-2 text-sm font-normal text-gray-700">Availabilities associated with the SLA</p>
                    <p class="mt-2 text-xs font-normal text-gray-700 italic"><span class="font-semibold">Warning:</span> You can only add up to a maximum of 3 types of availabilities</p>
                  </div>
                </div>
              </template>
              <Column field="name" header="Name">
                <template #body="slotProps">
                  {{slotProps.data.name}}
                </template>
              </Column>
              <Column field="unit" header="Unit">
                <template #body="slotProps">
                  {{ slotProps.data.unit.name }}
                </template>
              </Column>
              <Column :exportable="false">
                <template #body="slotProps">
                  <div class="ml-4 flex items-center md:ml-6">
                    <button type="button" @click="(event) => editAvailability(slotProps.data, event)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                      <PencilIcon class="h-6 w-6" aria-hidden="true" />
                      <span class="sr-only">edit</span>
                    </button>
                    <button type="button" @click="removeAvailability(slotProps.data)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                      <TrashIcon class="h-6 w-6" aria-hidden="true" />
                      <span class="sr-only">delete</span>
                    </button>
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>

        </div>
      </div>
    </div>

  </form>
  <div class="px-5 py-5">
    <div class="flex justify-end">
      <button
          type="button"
          @click="(event) => save(event)"
          :disabled="!canSaveConfiguration"
          :class="[ !canSaveConfiguration ? 'disabled:opacity-75' : '']"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
      >
        Set configuration to SLA
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, inject, onBeforeMount, computed} from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { PencilIcon, TrashIcon, ClockIcon, CalculatorIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import resolver from "@/utils/_resolver.ts";
import {uuid} from '@/utils/uuid.ts'
import { notifyError } from "@/utils/notify_error.ts";
import {isInteger} from '@/utils/validate_types.ts'
import severityService from "@/services/severity.service";
import unitService from "@/services/unit.service";
import BaseInput from '@/components/BaseInput.vue'
import LoadingContent from '@/components/LoadingContent.vue'
import GroupedSelectInput from '@/components/GroupedSelectInput.vue'

const resolutionNames = ref([
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' }
])

const availabilityNames = ref([
  { id: 'A', name: 'A' },
  { id: 'B', name: 'B' },
  { id: 'C', name: 'C' }
])

const resolutionModel = ref({
  "id": "",
  "name": "",
  "time": "",
  "precision": "",
  "unit": {
    "id": "",
    "name": "",
    "unit": "",
    "nomenclature": "",
    "description": "",
    "type": "",
    "factor_conversion": "",
    "weekdays": "",
  }
})

const resolution = ref({})

const availabilityModel = ref({
  "id": "",
  "name": "",
  "unit": {
    "id": "",
    "name": "",
    "unit": "",
    "nomenclature": "",
    "description": "",
    "type": "",
    "factor_conversion": "",
    "weekdays": "",
  }
})

const availability = ref({})

const sla = ref({
  "id": "",
  "sla_id": "",
  "severity_id": "",
  "time_response": "",
  "time_response_unit_id": "",
  "time_recovery": "",
  "time_recovery_unit_id": "",
  "severity": {
    "id": "",
    "code": "",
    "name": "",
    "description": "",
    "status": "",
    "color": "",
  },
  "time_response_unit": {
    "id": "",
    "name": "",
    "unit": "",
    "nomenclature": "",
    "description": "",
    "type": "",
    "factor_conversion": "",
    "weekdays": "",
  },
  "time_recovery_unit": {
    "id": "",
    "name": "",
    "unit": "",
    "nomenclature": "",
    "description": "",
    "type": "",
    "factor_conversion": "",
    "weekdays": "",
  },
  "resolutions": [],
  "availabilities": []
})
const dialogRef = inject('dialogRef');

const listSeverity = ref([])
const listTimeUnit = ref([])
const listResolutionUnit = ref([])
const listAvailabilityUnit = ref([])
const resolutions = ref([])
const availabilities = ref([])

const modeEdit = ref(true)
const modeFormResolution = ref('')
const modeFormAvailability = ref('')
const enableFormResolution = ref(false)
const enableFormAvailability = ref(false)
const loading = ref(true)

const selectedSeverity = ref({})
const selectedTimeUnitResponse = ref('')
const selectedTimeUnitRecovery = ref('')
const selectedTimeUnitResolution = ref('')
const selectedTimeUnitAvailability = ref({})
const selectedResolutionName = ref({})
const selectedAvailabilityName = ref({})
const timeUnitsWithoutValue = ref(["NBD", "N/A"])

onBeforeMount( () => {

  if (dialogRef.value.data.mode === 'edit') {
    sla.value = dialogRef.value.data.slaDetail
    for (const item of sla.value.resolutions) {
      resolutions.value.push(item)
    }
    for (const item of sla.value.availabilities) {
      availabilities.value.push(item)
    }
  } else {
    sla.value.resolutions = []
    sla.value.availabilities = []
  }

  modeEdit.value = (dialogRef.value.data.mode === 'edit')

  resolver.all({
    severities: severityService.list(),
    timeUnits: unitService.byType('time'),
    resolutionUnits: unitService.byType('resolution'),
    availabilityUnits: unitService.byType('availability')
  }).then(resp => {
    listSeverity.value = resp.severities.data
    listTimeUnit.value = resp.timeUnits.data
    listResolutionUnit.value = resp.resolutionUnits.data
    listAvailabilityUnit.value = resp.availabilityUnits.data

    if (modeEdit.value) {
      //Severity
      for (const [index, item] of Object.entries(listSeverity.value)) {
        if (item.id === sla.value.severity.id) {
          selectedSeverity.value = listSeverity.value[index]
        }
      }
      //Time Response
      for (const [index, item] of Object.entries(listTimeUnit.value)) {
        if (item.id === sla.value.time_response_unit.id) {
          selectedTimeUnitResponse.value = listTimeUnit.value[index].id
        }
      }
      //Time Recovery
      for (const [index, item] of Object.entries(listTimeUnit.value)) {
        if (item.id === sla.value.time_recovery_unit.id) {
          selectedTimeUnitRecovery.value = listTimeUnit.value[index].id
        }
      }
    } else {
      listSeverity.value = listSeverity.value.filter(item => !dialogRef.value.data.severitiesRegistered.includes(item.id))
      selectedSeverity.value = listSeverity.value[0]
      selectedTimeUnitResponse.value = listTimeUnit.value[0].id
      selectedTimeUnitRecovery.value = listTimeUnit.value[0].id
    }

    loading.value = false
  })
})

const save = (event) => {
  event.preventDefault()
  let data = {
    sla: {
      id: sla.value.id ? sla.value.id : uuid(),
      sla_id: sla.value.sla_id,
      severity: selectedSeverity.value,
      time_response: sla.value.time_response,
      time_response_unit: listTimeUnit.value[listTimeUnit.value.findIndex((time) =>  time.id === parseInt(selectedTimeUnitResponse.value))],
      time_recovery: sla.value.time_recovery,
      time_recovery_unit: listTimeUnit.value[listTimeUnit.value.findIndex((time) =>  time.id === parseInt(selectedTimeUnitRecovery.value))],
      resolutions: resolutions.value,
      availabilities: availabilities.value
    },
    mode: dialogRef.value.data.mode
  }
  dialogRef.value.close(data);
}

const editResolution = (data, event) => {
  event.preventDefault()
  prepareResolutionForm('edit', data)
}

const editAvailability = (data, event) => {
  event.preventDefault()
  prepareAvailabilityForm('edit', data)
}

const removeResolution = (resolution) => {
  const idx = resolutions.value.findIndex((item) =>  item.id === resolution.id)
  resolutions.value.splice(idx, 1)
}

const removeAvailability = (availability) => {
  const idx = availabilities.value.findIndex((item) =>  item.id === availability.id)
  availabilities.value.splice(idx, 1)
}

const prepareResolutionForm = (mode = 'edit', data = {}) => {
  enableFormResolution.value = true
  modeFormResolution.value = mode

  switch (mode) {
    case 'edit':
      resolution.value = Object.assign({}, data)
      selectedTimeUnitResolution.value = data.unit.id.toString()
      selectedResolutionName.value = resolutionNames.value.filter(item => item.name === data.name)[0]
      break;
    default:
      resetFormResolution()
  }
}

const prepareAvailabilityForm = (mode = 'edit', data = {}) => {
  enableFormAvailability.value = true
  modeFormAvailability.value = mode

  switch (mode) {
    case 'edit':
      availability.value = Object.assign({}, data)
      selectedAvailabilityName.value = availabilityNames.value.filter(item => item.name === data.name)[0]
      selectedTimeUnitAvailability.value = data.unit
      break;
    default:
      resetFormAvailability()
  }
}

const resetFormResolution = () => {
  resolution.value = Object.assign({}, resolutionModel.value)
  resolution.value.id = uuid()
  selectedResolutionName.value = resolutionNames.value[0]
  selectedTimeUnitResolution.value = listResolutionUnit.value[0].id
}

const resetFormAvailability = () => {
  availability.value = Object.assign({}, availabilityModel.value)
  availability.value.id = uuid()
  selectedAvailabilityName.value = availabilityNames.value[0]
  selectedTimeUnitAvailability.value = listAvailabilityUnit.value[0]
}

const resetResolution = () => {
  resolution.value.precision = ''
}

const resetTimeResponse = () => {
  sla.value.time_response = ''
}

const resetTimeRecovery = () => {
  sla.value.time_recovery = ''
}

const hideResolutionForm = () => {
  resetFormResolution()
  enableFormResolution.value = false
}

const hideAvailabilityForm = () => {
  resetFormAvailability()
  enableFormAvailability.value = false
}

const saveResolution = (event) => {
  event.preventDefault()

  //validate types
  let resolutionUnit = listResolutionUnit.value.find(item => item.id === parseInt(selectedTimeUnitResolution.value))
  if (resolutionUnit.nomenclature === 'CD') {
    if (!isInteger(resolution.value.time)) {
      return notifyError('Resolution time must be an integer value')
    }
    if (Number.parseInt(resolution.value.time) <= 0) {
      return notifyError('Resolution time must be greater than 0')
    }
  }

  if (!isInteger(resolution.value.precision)) {
    return notifyError('Precision value must be an integer value')
  }
  if (Number.parseInt(resolution.value.precision) <= 0) {
    return notifyError('Precision value must be greater than 0')
  }

  if (modeFormResolution.value === 'new') {
    let rows = resolutions.value.length ? resolutions.value.filter(r => r.name === selectedResolutionName.value.name) : []
    if (rows.length < 2) {
      const newRow = Object.assign({}, resolution.value)
      newRow.name = selectedResolutionName.value.name
      newRow.unit = listResolutionUnit.value.find(item => item.id === parseInt(selectedTimeUnitResolution.value))
      resolutions.value.push(newRow)
    } else {
      return notifyError('There are already 2 items with the same resolution name')
    }
  } else {
    let rows = resolutions.value.filter(r => r.name === selectedResolutionName.value.name && r.id !== resolution.value.id)
    if (rows.length < 2) {
      for (let item of resolutions.value) {
        if (item.id === resolution.value.id) {
          item.name =selectedResolutionName.value.name
          item.unit = listResolutionUnit.value.find(item => item.id === parseInt(selectedTimeUnitResolution.value))
          item.precision = resolution.value.precision
          item.time = resolution.value.time
        }
      }
    } else {
      return notifyError('There are already 2 items with the same resolution name')
    }
  }
  enableFormResolution.value = false
}

const saveAvailability = (event) => {
  event.preventDefault()
  if (modeFormAvailability.value === 'new') {
    let rows = availabilities.value.length ? availabilities.value.filter(r => r.name === selectedAvailabilityName.value.name) : []
    if (rows.length === 0) {
      const newRow = Object.assign({}, availability.value)
      newRow.name = selectedAvailabilityName.value.name
      newRow.unit = selectedTimeUnitAvailability.value
      availabilities.value.push(newRow)
    } else {
      return notifyError('There are already 1 item with the same availability name')
    }
  } else {
    let rows = availabilities.value.filter(r => r.name === selectedAvailabilityName.value.name && r.id !== availability.value.id)
    if (rows.length === 0) {
      for (let item of availabilities.value) {
        if (item.id === availability.value.id) {
          item.name =selectedAvailabilityName.value.name
          item.unit = selectedTimeUnitAvailability.value
        }
      }
    } else {
      return notifyError('There are already 1 item with the same availability name')
    }
  }
  enableFormAvailability.value = false
}

const resolutionsRegistered = computed(() =>
    resolutions.value.length
        ? resolutions.value.reduce((a, b) => {
          if (!a.length || a[a.length - 1].name !== b.name) {
            a.push(b)
          }
          return a
        }, [])
        : []
)

const availabilitiesRegistered = computed(() =>
    availabilities.value.length
        ? availabilities.value
        : []
)

const titleFormResolution = computed(() =>
    modeFormResolution.value === 'new' ? 'New resolution' : 'Edit resolution'
)

const titleFormAvailability = computed(() =>
    modeFormAvailability.value === 'new' ? 'New availability' : 'Edit availability'
)

const canSaveConfiguration = computed( () => {

      return !!(sla.value.severity &&
          (
              (!timeUnitsWithoutValue.value.includes(listTimeUnit.value.find(item => item.id === parseInt(selectedTimeUnitResponse.value))?.nomenclature) && isInteger(sla.value.time_response) && Number.parseInt(sla.value.time_response) >= 0) ||
              (timeUnitsWithoutValue.value.includes(listTimeUnit.value.find(item => item.id === parseInt(selectedTimeUnitResponse.value))?.nomenclature))
          ) &&
          (
              (!timeUnitsWithoutValue.value.includes(listTimeUnit.value.find(item => item.id === parseInt(selectedTimeUnitRecovery.value))?.nomenclature) && isInteger(sla.value.time_recovery) && Number.parseInt(sla.value.time_recovery) >= 0) ||
              (timeUnitsWithoutValue.value.includes(listTimeUnit.value.find(item => item.id === parseInt(selectedTimeUnitRecovery.value))?.nomenclature))
          ) &&
      selectedTimeUnitResponse.value &&
      selectedTimeUnitRecovery.value &&
      resolutionsRegistered.value.length >= 4 &&
      availabilitiesRegistered.value.length === 3)
    }
)

const actionButtonFormResolution = computed(() =>
    modeFormResolution.value === 'new' ? 'Add resolution to list' : 'Update resolution'
)

const actionButtonFormAvailability = computed(() =>
    modeFormAvailability.value === 'new' ? 'Add availability to list' : 'Update availability'
)

const resolutionTimeDoesNotAllowValues = computed( () =>
  listResolutionUnit.value.length ?
      listResolutionUnit.value.filter(item => item.nomenclature === 'CD')[0].id !== parseInt(selectedTimeUnitResolution.value) : false
)

const timeRecoveryDoesNotAllowValues = computed( () =>
    listTimeUnit.value.length ?
        listTimeUnit.value
            .filter(item =>
              item.nomenclature === 'NBD' ||
              item.nomenclature === 'N/A')
            .filter(item => item.id === parseInt(selectedTimeUnitRecovery.value)).length > 0: false
)

const timeResponseDoesNotAllowValues = computed( () =>
    listTimeUnit.value.length ?
        listTimeUnit.value
            .filter(item =>
                item.nomenclature === 'NBD' ||
                item.nomenclature === 'N/A')
            .filter(item => item.id === parseInt(selectedTimeUnitResponse.value)).length > 0: false
)

const canSaveResolution = computed( () =>
    selectedResolutionName.value &&
    selectedTimeUnitResolution.value &&
    (
        (parseInt(selectedTimeUnitResolution.value) === listResolutionUnit.value.filter(item => item.nomenclature === 'CD')[0].id && resolution.value.precision?.toString().length && resolution.value.time.toString().length) ||
        (parseInt(selectedTimeUnitResolution.value) !== listResolutionUnit.value.filter(item => item.nomenclature === 'CD')[0].id && resolution.value.precision?.toString() === "" && resolution.value.time.toString() === "")
    )
)

const canSaveAvailability = computed( () =>
    selectedAvailabilityName.value &&
    selectedTimeUnitAvailability.value
)

</script>

<style>
  .p-dialog-content {
    padding: 0 !important;
  }
</style>
