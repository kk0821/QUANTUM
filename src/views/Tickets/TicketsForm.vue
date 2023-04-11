<template>
  <div>
    <FormPanel
      title="Contact information"
      sub-title="Contact details"
      :rows="[
        { label: 'email-list', col: 6 },
        { label: 'creator-work-phone', col: 6, query: { md: 3, lg: 2 }},
        { label: 'creator-mobile-phone', col: 6, query: { md: 3, lg: 2 }},
        { label: 'creator-mobile-whatsapp', col: 6, query: { md: 3, lg: 2 }},
        { label: 'creator-additional-information', col: 6 }
      ]"
      separation :canHidden="!canEdit"
      :default-hidden="hiddenPanel === true || (Array.isArray(hiddenPanel) && hiddenPanel.indexOf('header') !== -1)"
    >
      <template #email-list>
        <DataTable
          v-if="ticket.additional_information.list && ticket.additional_information.list.length"
          :value="ticket.additional_information.list"
          :paginator="false"
          dataKey="id"
          :rowHover="true"
          responsiveLayout="scroll"
          class="mb-4"
        >
          <Column field="emails" header="Email">
            <template #body="{ data }">
              {{ data.emails }}
            </template>
          </Column>
          <Column :exportable="false" v-if="canEdit">
            <template #body="{ data }">
              <button type="button" @click="($event) => removeEmailList(data, $event)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                <TrashIcon class="h-6 w-6" aria-hidden="true"/>
                <span class="sr-only">Remove</span>
              </button>
            </template>
          </Column>
        </DataTable>
        <Combobox v-model="selectedEmailList" v-if="canEdit">
          <ComboboxLabel class="block text-sm font-medium text-gray-700">Notify the following Email Distribution Lists / Groups</ComboboxLabel>
          <div class="relative mt-1">
            <ComboboxInput
              class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
              :class="{ 'disabled:opacity-75': !canEdit }"
              @change="queryEmailList = $event.target.value"
              :displayValue="(email) => email.emails"
              :disabled="!canEdit"
            />
            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
            </ComboboxButton>
            <TransitionRoot
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                @after-leave="queryEmailList = ''"
            >
              <ComboboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ComboboxOption
                    v-if="newEmailList"
                    :value="newEmailList"
                    v-slot="{ active }"
                >
                  <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-4 pr-4']">
                    <span class="font-normal block truncate">Add new email <span class="font-medium">{{ queryEmailList }}</span></span>
                  </li>
                </ComboboxOption>
                <ComboboxOption
                  v-for="emailGroupList in filteredEmails"
                  v-slot="{ active, selected }"
                  :key="emailGroupList"
                  :value="emailGroupList"
                  as="template"
                >
                  <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-4 pr-4']">
                    <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ emailGroupList.emails }}</span>
                  </li>
                </ComboboxOption>
              </ComboboxOptions>
            </TransitionRoot>
          </div>
        </Combobox>
      </template>
      <template #creator-work-phone>
        <base-input
          id="ticket-additional_information-work"
          v-model="ticket.additional_information.work"
          label="Creator Work Phone"
          type="text"
          :is-disabled="!canEdit"
        />
      </template>
      <template #creator-mobile-phone>
        <base-input
          :id="'ticket-additional_information-phone'"
          v-model="ticket.additional_information.phone"
          label="Creator Mobile Phone"
          type="text"
          :is-disabled="!canEdit"
        />
      </template>
      <template #creator-mobile-whatsapp>
        <label class="block text-sm font-medium text-gray-700">Has Whatsapp?</label>
        <InputSwitch
          v-model="ticket.additional_information.whatsapp"
          :disabled="!canEdit"
          class="mt-3" />
      </template>
      <template #creator-additional-information>
        <base-input
          :id="'ticket-additional_information-additional'"
          v-model="ticket.additional_information.additional"
          label="Ticket Additional Contact Instruction"
          type="text"
          :is-disabled="!canEdit"
        />
      </template>
    </FormPanel>

    <FormPanel
      title="Site details"
      sub-title="Details of the site where the incident occurred"
      :rows="[
        'selected-oem', 'selected-technology', { label: 'selected-network-element', col: 6 }, { label: 'selected-controller-element', col: 6 },
        { label: 'detail-controller-ip', col: 6 }, { label: 'selected-sites', col: 6 }, { label: 'detail-site-ip', col: 6 }
      ]"
      separation :canHidden="!canEdit" :grid="{ cols: 6 }" :hiddenRows="hiddenRows"
      :default-hidden="hiddenPanel === true || (Array.isArray(hiddenPanel) && hiddenPanel.indexOf('site') !== -1)"
    >
      <template #selected-oem>
        <Listbox as="div" v-model="selectedOem" :disabled="!canEdit" aria-required="true">
          <ListboxLabel class="block text-sm font-medium text-gray-700">OEM</ListboxLabel>
          <div class="relative mt-1">
            <ListboxButton
                class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                :class="{ 'bg-red-100': canEdit && !selectedOem.id }"
            >
              <span class="block truncate" v-if="!selectedOem.id">Select OEM</span>
              <template v-else>
                <span class="block truncate">{{ selectedOem.description }}</span>
              </template>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>
            <TransitionRoot
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
            </TransitionRoot>
          </div>
        </Listbox>
      </template>
      <template #selected-technology>
        <Listbox
            as="div"
            v-model="selectedTechnology"
            :disabled="!canEdit || isLoadingTechnology"
            aria-required="true"
        >
          <ListboxLabel class="block text-sm font-medium text-gray-700">Technology</ListboxLabel>
          <div class="relative mt-1">
            <ListboxButton
                class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                :class="{ 'bg-red-100': canEdit && !selectedTechnology.id, 'disabled:opacity-75': !canEdit || isLoadingTechnology }"
            >
              <div v-if="isLoadingTechnology">
                <div class="flex items-center">
                  <div>
                    <svg role="status" class="mr-2 w-5 h-5 text-blue-200 animate-spin dark:text-blue-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                    </svg>
                  </div>
                  <div class="ml-1">
                    <p class="text-sm text-gray-600">Getting technologies...</p>
                  </div>
                </div>
              </div>
              <span class="block truncate" v-if="!selectedTechnology.id && !isLoadingTechnology">Select Technology</span>
              <template v-else>
                <span class="block truncate">{{ selectedTechnology.description }}</span>
              </template>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>
            <TransitionRoot
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
            </TransitionRoot>
          </div>
        </Listbox>
      </template>
      <template #selected-network-element v-if="selectedOem.id && selectedTechnology.id">
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
                'bg-red-100': canEdit && (selectedOem.id && selectedTechnology.id) && !selectedNetworkElement.id
              }"
              @change="queryNetworkElementList = $event.target.value"
              :displayValue="(networkElement) => networkElement.name"
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
      </template>
      <template #selected-controller-element v-if="selectedOem.id && selectedTechnology.id">
        <Combobox
          v-model="selectedControllerElement"
          :disabled="!canEdit"
        >
          <ComboboxLabel class="block text-sm font-medium text-gray-700">Controller Element</ComboboxLabel>
          <div class="relative mt-1">
            <ComboboxInput
              class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
              :class="{
                'bg-amerinode-blue-100': canEdit && (!selectedOem.id || !selectedTechnology.id),
                'disabled:opacity-75': !canEdit,
                'bg-red-100': canEdit && (selectedOem.id && selectedTechnology.id) && !selectedControllerElement.id
              }"
              @change="queryControllerElementList = $event.target.value"
              :displayValue="(controller) => controller.name ? `${controller.name} - ${controller.code} - ${controller.ip_address}` : ''"
              autocomplete="off"
              :disabled="!canEdit || isLoadingControllerElement"
            />
            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
              <div v-if="isLoadingControllerElement">
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
                @after-leave="queryControllerElementList = ''"
            >
              <ComboboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ComboboxOption
                  v-if="!filteredControllerElement.length"
                  disabled
                  as="template"
                >
                  <li class="text-gray-900 relative cursor-default select-none py-2 pl-10 pr-4 opacity-75">
                    <span class="font-normal block truncate">
                      No results found for; OEM: {{ selectedOem.description }}; Technology: {{ selectedTechnology.description }}; Branch: {{ project.branch.country.name }} - {{ project.branch.company.description }}
                    </span>
                  </li>
                </ComboboxOption>
                <ComboboxOption
                  v-for="controllerElement in filteredControllerElement"
                  v-slot="{ active, selected }"
                  :key="controllerElement"
                  :value="controllerElement"
                  as="template"
                >
                  <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                    <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">
                      {{ `${controllerElement.name} - ${controllerElement.code} - ${controllerElement.ip_address}` }}
                    </span>
                    <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amerinode-blue-600">
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ComboboxOption>
              </ComboboxOptions>
            </TransitionRoot>
          </div>
        </Combobox>
      </template>
      <template #detail-controller-ip v-if="selectedOem.id && selectedTechnology.id && selectedControllerElement.id">
        <base-input
          id="detail-controller-ip"
          v-model="ticket.detail.controllerIp"
          label="Controller IP Access Information"
          :class="{ 'bg-red-100': canEdit && !ticket.detail.controllerIp }"
          type="text"
          :is-disabled="!canEdit"
        />
      </template>
      <template #selected-sites v-if="selectedOem.id && selectedTechnology.id">
        <DataTable
          v-if="listSelectedSites && listSelectedSites.length"
          :value="listSelectedSites"
          :paginator="false"
          dataKey="id"
          :rowHover="true"
          responsiveLayout="scroll"
        >
          <Column field="name" header="Sites">
            <template #body="{ data }">
              {{ `${data.code} - ${data.name}` }}
            </template>
          </Column>
          <Column :exportable="false" v-if="canEdit">
            <template #body="{ data }">
              <button type="button" @click="($event) => removeSiteList(data, $event)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                <TrashIcon class="h-6 w-6" aria-hidden="true"/>
                <span class="sr-only">Remove</span>
              </button>
            </template>
          </Column>
        </DataTable>
        <Combobox
            v-model="selectedSites"
            :disabled="!canEdit"
        >
          <ComboboxLabel class="block text-sm font-medium text-gray-700">Sites</ComboboxLabel>
          <div class="relative mt-1">
            <ComboboxInput
              class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
              @change="changeSite"
              :displayValue="(site) => site.code ? `${site.code} - ${site.name}` : ''"
              autocomplete="off"
              :disabled="!canEdit"
            />
            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
            </ComboboxButton>
            <transition
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
              <ComboboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ComboboxOption
                  v-if="!filteredSites.length"
                  disabled as="template"
                >
                  <li class="text-gray-900 relative cursor-default select-none py-2 pl-10 pr-4 opacity-75">
                    <span class="font-normal block truncate">
                      No results found for; OEM: {{ selectedOem.description }}; Branch: {{ project.branch.country.name }} - {{ project.branch.company.description }}
                    </span>
                  </li>
                </ComboboxOption>
                <ComboboxOption
                  v-for="site in filteredSites"
                  v-slot="{ active, selected }"
                  :key="site"
                  :value="site"
                  as="template"
                >
                  <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                    <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ `${site.code} - ${site.name}` }}</span>
                    <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amerinode-blue-600">
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ComboboxOption>
              </ComboboxOptions>
            </transition>
          </div>
        </Combobox>
      </template>
      <template #detail-site-ip v-if="selectedOem.id && selectedTechnology.id && listSelectedSites.length">
        <base-input
          id="detail-site-ip"
          v-model="ticket.detail.siteIp"
          label="Site IP Access Information"
          type="text"
          :is-disabled="!canEdit"
        />
      </template>
    </FormPanel>

    <FormPanel
      title="Problem Details"
      sub-title="Describe problem severity and details."
      :rows="[
        { label: 'selected-severity', col: 6, query: { sm: 3, md: 3, lg: 2 }},
        { label: 'ticket-detail-problem-title', col: 6, query: { md: 6, lg: 4 } },
        { label: 'ticket-detail-problem-description', col: 6 },
        'ticket-detail-problem-remedy',
        'ticket-detail-problem-software-release',
        { label: 'evidence-file', col: 6 }
      ]"
      separation :canHidden="!canEdit" :grid="{ cols: 6 }"
      :default-hidden="hiddenPanel === true || (Array.isArray(hiddenPanel) && hiddenPanel.indexOf('problem') !== -1)"
    >
      <template #selected-severity>
        <Listbox
            as="div"
            v-model="selectedSeverity"
            :disabled="!canEdit || isLoadingSeverity"
            aria-required="true">
          <ListboxLabel class="block text-sm font-medium text-gray-700">Severity</ListboxLabel>
          <div class="relative mt-1">
            <ListboxButton
              class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
              :class="{ 'bg-red-100': canEdit && !selectedSeverity.id, 'disabled:opacity-75': !canEdit || isLoadingSeverity  }"
            >
              <div v-show="isLoadingSeverity">
                <div class="flex items-center">
                  <div>
                    <svg role="status" class="mr-2 w-5 h-5 text-blue-200 animate-spin dark:text-blue-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                    </svg>
                  </div>
                  <div class="ml-1">
                    <p class="text-sm text-gray-600">Getting severities...</p>
                  </div>
                </div>
              </div>
              <span class="block truncate" v-if="!selectedSeverity.id && !isLoadingSeverity">Select severity</span>
              <template v-else>
                <span class="block truncate" v-show="selectedSeverity.id">{{ `${selectedSeverity.code} - ${selectedSeverity.name}` }}</span>
              </template>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>
            <TransitionRoot
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
            </TransitionRoot>
          </div>
        </Listbox>
      </template>
      <template #ticket-detail-problem-title>
        <base-input
          id="ticket-detail-problem-title"
          v-model="ticket.detail.problemTitle"
          :class="{ 'bg-red-100': canEdit && !ticket.detail.problemTitle }"
          label="Problem Title"
          type="text"
          :is-disabled="!canEdit"
        />
      </template>
      <template #ticket-detail-problem-description>
        <h5>Problem Description</h5>
        <Editor
          v-if="canEdit"
          placeholder="Problem Description"
          v-model="ticket.detail.problemDescription"
          :class="{ 'required-editor': !ticket.detail.problemDescription }"
        />
        <section v-else v-html="ticket.detail.problemDescription"></section>
      </template>
      <template #ticket-detail-problem-remedy>
        <base-input
          id="ticket-detail-problem-remedy"
          v-model="ticket.detail.problemRemedy"
          label="Remedy"
          type="text"
          :is-disabled="!canEdit"
        />
      </template>
      <template #ticket-detail-problem-software-release>
        <base-input
          id="ticket-detail-problem-software-release"
          v-model="ticket.detail.problemSoftwareRelease"
          label="Software Release"
          type="text"
          :is-disabled="!canEdit"
        />
      </template>
      <template #evidence-file>
        <TicketsFiles
          title="Evidence file"
          :ticket-id="ticket.id"
          :old-files="oldFiles"
          :project-id="project.id"
          :can-edit="canEdit"
          :file-limit="3"
          :persist="canEdit ? ticket.status !== 1 : true"
          type="basic-info"
          @change="updateListFiles"
        />
      </template>
    </FormPanel>

    <FormPanel
      title="Technical Questionnaire"
      sub-title="Response additional information with the technical Questionnaire."
      :rows="[
        { label: 'selected-category', col: 6, query: { sm: 3 }},
        { label: 'selected-category-children', col: 6, query: { sm: 3 }},
        { label: 'selected-impacted-service', col: 6, query: { sm: 3 }},
        { label: 'impacted-service', col: 6, query: { sm: 3 }},
        { label: 'ticket-detail-problem-affected-users', col: 6 }, { label: 'ticket-detail-frontOffice', col: 6 }, { label: 'ticket-detail-backOffice', col: 6 },
        { label: 'ticket-detail-kpi', col: 6 }, { label: 'ticket-detail-activitiesBefore', col: 6 }, { label: 'ticket-detail-resolutionActions', col: 6 },
        { label: 'ticket-detail-failFirstTime', col: 6 }, { label: 'ticket-detail-affectedRegion', col: 6 }
      ]"
      separation :canHidden="!canEdit" :grid="{ cols: 6 }"
      :default-hidden="hiddenPanel === true || (Array.isArray(hiddenPanel) && hiddenPanel.indexOf('technical') !== -1)"
    >
      <template #selected-category>
        <Listbox as="div" v-model="selectedCategory" :disabled="!canEdit" aria-required="true">
          <ListboxLabel class="block text-sm font-medium text-gray-700">Tier1</ListboxLabel>
          <div class="relative mt-1">
            <ListboxButton
              class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
              :class="{ 'bg-red-100': canEdit && !selectedCategory.id }"
            >
              <span class="block truncate" v-if="!selectedCategory.id">Select Tier1</span>
              <template v-else>
                <span class="block truncate">{{ selectedCategory.name }}</span>
              </template>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>
            <TransitionRoot
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
              <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ListboxOption
                    v-slot="{ active, selected }"
                    v-for="category in listCategories"
                    :key="category.id"
                    :value="category"
                    as="template"
                    @click="changeTier1"
                >
                  <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                    <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ category.name }}</span>
                    <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amerinode-blue-600">
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </TransitionRoot>
          </div>
        </Listbox>
      </template>
      <template #selected-category-children>
        <Listbox as="div" v-model="selectedCategoryChildren" :disabled="!canEdit || isLoadingCategory" aria-required="true">
          <ListboxLabel class="block text-sm font-medium text-gray-700">Tier2</ListboxLabel>
          <div class="relative mt-1">
            <ListboxButton
              class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
              :class="{ 'bg-red-100': canEdit && !selectedCategoryChildren.id }"
            >
              <div v-if="isLoadingCategory">
                <div class="flex items-center">
                  <div>
                    <svg role="status" class="mr-2 w-5 h-5 text-blue-200 animate-spin dark:text-blue-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                    </svg>
                  </div>
                  <div class="ml-1">
                    <p class="text-sm text-gray-600">Getting available Tier2...</p>
                  </div>
                </div>
              </div>
              <span class="block truncate" v-if="!selectedCategoryChildren.id && !isLoadingCategory">Select Tier2</span>
              <template v-else>
                <span class="block truncate">{{ selectedCategoryChildren.name }}</span>
              </template>
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
                    v-for="category in listCategoriesChildren"
                    :key="category.id"
                    :value="category"
                    as="template"
                >
                  <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                    <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ category.name }}</span>
                    <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amerinode-blue-600">
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </template>
      <template #selected-impacted-service>
        <Listbox as="div" v-model="selectedImpactedService" :disabled="!canEdit" aria-required="true">
          <ListboxLabel class="block text-sm font-medium text-gray-700">Servicio Impactado</ListboxLabel>
          <div class="relative mt-1">
            <ListboxButton
              class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
              :class="{ 'bg-red-100': canEdit && !selectedImpactedService.id }"
            >
              <span class="block truncate" v-if="!selectedImpactedService.id">Select servicio impactado</span>
              <template v-else>
                <span class="block truncate">{{ selectedImpactedService.name }}</span>
              </template>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>
            <TransitionRoot
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
              <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ListboxOption
                    v-slot="{ active, selected }"
                    v-for="impactedService in listImpactedService"
                    :key="impactedService.id"
                    :value="impactedService"
                    as="template"
                >
                  <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4']">
                    <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">{{ impactedService.name }}</span>
                    <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amerinode-blue-600">
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </TransitionRoot>
          </div>
        </Listbox>
      </template>
      <template #impacted-service>
        <label class="block text-sm font-medium text-gray-700">Impacto (%) a la red del cliente: {{ ticket.detail.impactedService }}%</label>
        <div class="mt-5">
          <Slider v-model="ticket.detail.impactedService" :disabled="!canEdit"/>
        </div>
      </template>
      <template #ticket-detail-problem-affected-users>
        <base-input
          id="ticket-detail-problem-affected-users"
          v-model="ticket.detail.affectedUsers"
          label="¿Cuantos usuarios/suscriptores estan afectados y cual es el numero total de usuarios del elemento de red? (approximate)"
          type="number"
          max="20000"
          :is-disabled="!canEdit"
        />
      </template>
      <template #ticket-detail-frontOffice>
        <label class="block text-sm font-medium text-gray-700">Analisis realizado por nivel 1 / Front Office</label>
        <div class="mt-2">
          <Editor
            v-if="canEdit"
            placeholder="Analisis realizado por nivel 1 / Front Office"
            v-model="ticket.detail.frontOffice"
            :class="{ 'required-editor': !ticket.detail.frontOffice }"
          />
          <section v-else v-html="ticket.detail.frontOffice"></section>
        </div>
      </template>
      <template #ticket-detail-backOffice>
        <label class="block text-sm font-medium text-gray-700">Analisis realizado por nivel 2 / Back Office</label>
        <div class="mt-2">
          <Editor
            v-if="canEdit"
            placeholder="Analisis realizado por nivel 2 / Back Office"
            v-model="ticket.detail.backOffice"
            :class="{ 'required-editor': !ticket.detail.backOffice }"
          />
          <section v-else v-html="ticket.detail.backOffice"></section>
        </div>
      </template>
      <template #ticket-detail-kpi>
        <label class="block text-sm font-medium text-gray-700">KPI / Contador or Clear Code afectado</label>
        <div class="mt-2">
          <Editor
            v-if="canEdit"
            placeholder="KPI / Contador or Clear Code afectado"
            v-model="ticket.detail.kpi"
            :class="{ 'required-editor': !ticket.detail.kpi }"
          />
          <section v-else v-html="ticket.detail.kpi"></section>
        </div>
      </template>
      <template #ticket-detail-activitiesBefore>
        <label class="block text-sm font-medium text-gray-700">¿Actividades realizadas antes del incidente?</label>
        <div class="mt-2">
          <Editor
            v-if="canEdit"
            placeholder="¿Actividades realizadas antes del incidente?"
            v-model="ticket.detail.activitiesBefore"
            :class="{ 'required-editor': !ticket.detail.activitiesBefore }"
          />
          <section v-else v-html="ticket.detail.activitiesBefore"></section>
        </div>
      </template>
      <template #ticket-detail-resolutionActions>
        <label class="block text-sm font-medium text-gray-700">¿Que actividades de solucion se han realizado? ¿Cuales estan en progreso?</label>
        <div class="mt-2">
          <Editor
            v-if="canEdit"
            placeholder="¿Que actividades de solucion se han realizado? ¿Cuales estan en progreso?"
            v-model="ticket.detail.resolutionActions"
            :class="{ 'required-editor': !ticket.detail.resolutionActions }"
          />
          <section v-else v-html="ticket.detail.resolutionActions"></section>
        </div>
      </template>
      <template #ticket-detail-failFirstTime>
        <label class="block text-sm font-medium text-gray-700">¿Cual fue la primera falla observada?</label>
        <div class="mt-2">
          <Editor
            v-if="canEdit"
            placeholder="¿Cual fue la primera falla observada?"
            v-model="ticket.detail.failFirstTime"
            :class="{ 'required-editor': !ticket.detail.failFirstTime }"
          />
          <section v-else v-html="ticket.detail.failFirstTime"></section>
        </div>
      </template>
      <template #ticket-detail-affectedRegion>
        <label class="block text-sm font-medium text-gray-700">¿Cual es el area, region o ciudad afectada?</label>
        <div class="mt-2">
          <Editor
            v-if="canEdit"
            placeholder="¿Cual es el area, region o ciudad afectada?"
            v-model="ticket.detail.affectedRegion"
          />
          <section v-else v-html="ticket.detail.affectedRegion"></section>
        </div>
      </template>
    </FormPanel>

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
import {computed, onBeforeMount, onMounted, ref, toRefs, watch} from 'vue'
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
import { CheckIcon, ChevronUpDownIcon, TrashIcon } from '@heroicons/vue/24/solid'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Editor from 'primevue/editor'
import InputSwitch from 'primevue/inputswitch'
import Slider from 'primevue/slider'
import LoadingButton from "@/components/LoadingButton.vue";

import FormPanel from '@/components/FormPanel.vue'
import BaseInput from '@/components/BaseInput.vue'
import categoriesService from '@/services/category.service'
import controllerElementsService from '@/services/controller_element.service'
import impactedServicesService from '@/services/impacted-services.service'
import groupEmailsService from '@/services/group-emails.service'
import networkElementsService from '@/services/network_element.service'
import oemService from '@/services/oem.service'
import severityService from '@/services/severity.service'
import sitesService from '@/services/sites.service'
import technologyService from '@/services/technology.service'
import { loading } from '@/store/loading'
import { loadingButton } from '@/store/loadingButton'
import resolver from '@/utils/_resolver.ts'
import { notifyError } from '@/utils/notify_error'
import { uuid } from '@/utils/uuid.ts'
import TicketsFiles from '@/views/Tickets/TicketsFiles.vue'
import {useSetInitialSelect} from "@/composables/listbox_items";

const selectedEmailList = ref({})
const queryEmailList = ref('')
const queryNetworkElementList = ref('')
const queryControllerElementList = ref('')
const selectedNetworkElement = ref({})
const selectedControllerElement = ref({})
const selectedSites = ref({})
const listSelectedSites = ref([])
const filteredSites = ref([])
const selectedTechnology = ref({})
const selectedSeverity = ref({})
const selectedOem = ref({})
const selectedCategory = ref({})
const listCategories = ref([])
const selectedCategoryChildren = ref({})
const listCategoriesChildren = ref([])
const listTechnology = ref([])
const listSeverity = ref([])
const listNetworkElement = ref([])
const listControllerElement = ref([])
const listOem = ref([])
const listEmailGroups = ref([])
const listImpactedService = ref([])
const selectedImpactedService = ref([])
const isLoadingCategory = ref(false)
const isLoadingTechnology = ref(false)
const isLoadingSeverity = ref(false)
const isLoadingNetworkElement = ref(false)
const isLoadingControllerElement = ref(false)
const finishLoading = ref(false)
const listFiles = ref([])

const props = defineProps({
  ticket: {
    type: Object
  },
  project: {
    type: Object
  },
  ticketPackageId: {
    type: Number
  },
  oldSelectors: {
    type: Object
  },
  oldFiles: {
    type: Array
  },
  canEdit: {
    type: Boolean,
    default: true
  },
  hiddenPanel: {
    type: [Boolean, Array]
  }
})

const emit = defineEmits(['save'])
const data = toRefs(props)

watch(selectedEmailList, (val) => {
  if (val && val.emails) { addEmailList() }
})

watch(selectedSites, (val) => {
  if (val && val.id) { addSiteList() }
})

watch(selectedOem, (val) => {
  if (val && val.id && finishLoading.value) {
    selectedTechnology.value = {}
    selectedSeverity.value = {}
    listSeverity.value = []
    loadTechnologies()
    changeOemOrTechnology(true)
  }
})

watch(selectedTechnology, (val) => {
  if (val && val.id && finishLoading.value) {
    selectedSeverity.value = {}
    loadSeverities()
    changeNetworkElement()
    changeControllerElement()
    changeOemOrTechnology()
  }
})

watch(selectedControllerElement, (val) => {
  if (val && val.id && finishLoading.value) { props.ticket.detail.controllerIp = val.ip_address }
})

const loadTechnologies = (setOld) => {
  isLoadingTechnology.value = true
  return technologyService.listForTicketModule({
    ticket_package: data.ticketPackageId.value,
    oem: selectedOem.value.id
  }).then(x => {
    listTechnology.value = x.data
    isLoadingTechnology.value = false
  })
}

const loadSeverities = (setOld) => {
  isLoadingSeverity.value = true
  return severityService.listForTicketModule({
    ticket_package: data.ticketPackageId.value,
    oem: selectedOem.value.id,
    technology: selectedTechnology.value.id
  }).then(x => {
    listSeverity.value = x.data
    isLoadingSeverity.value = false
  })
}

const newEmailList = computed(() => {
  return queryEmailList.value === '' || listEmailGroups.value.find(item => item.emails === queryEmailList.value) ? null : { id: uuid(), emails: queryEmailList.value }
})

const filteredEmails = computed(() =>
    queryEmailList.value === ''
        ? listEmailGroups.value
        : listEmailGroups.value.filter((item) => {
          return item.emails.toLowerCase().includes(queryEmailList.value.toLowerCase())
        })
)

const enableSave = computed(() => {
  return !!(selectedOem.value.id
      && selectedTechnology.value.id
      && selectedSeverity.value.id
      && selectedNetworkElement.value.id
      && selectedControllerElement.value.id
      && selectedCategory.value.id
      && selectedCategoryChildren.value.id
      && selectedImpactedService.value.id
      && (props.ticket.detail && props.ticket.detail.controllerIp)
      && (props.ticket.detail && props.ticket.detail.problemTitle)
      && (props.ticket.detail && props.ticket.detail.problemDescription)
      && (props.ticket.detail && props.ticket.detail.impactedService)
      && (props.ticket.detail && props.ticket.detail.frontOffice)
      && (props.ticket.detail && props.ticket.detail.backOffice)
      && (props.ticket.detail && props.ticket.detail.kpi)
      && (props.ticket.detail && props.ticket.detail.activitiesBefore)
      && (props.ticket.detail && props.ticket.detail.resolutionActions)
      && (props.ticket.detail && props.ticket.detail.failFirstTime))
})

const hiddenRows = computed(() => {
  return [
    ...(!selectedOem.value.id || !selectedTechnology.value.id ? ['selected-network-element', 'selected-controller-element', 'selected-sites'] : []),
    (!selectedOem.value.id || !selectedTechnology.value.id || !selectedControllerElement.value.id ? 'detail-controller-ip' : ''),
    (!selectedOem.value.id || !selectedTechnology.value.id || !listSelectedSites.value.length ? 'detail-site-ip' : '')
  ]
})

const filteredNetworkElement = computed(() =>  {
  return queryNetworkElementList.value === ''
      ? listNetworkElement.value
      : listNetworkElement.value.filter((network) => {
        return network.name.toLowerCase().includes(queryNetworkElementList.value.toLowerCase())
      })
})
const filteredControllerElement = computed(() =>  {
  return queryControllerElementList.value === ''
      ? listControllerElement.value
      : listControllerElement.value.filter((controllerElement) => {
        return controllerElement.name.toLowerCase().includes(queryControllerElementList.value.toLowerCase())
      })
})

const updateListFiles = ($event) => {
  listFiles.value = $event.list
}

const changeOemOrTechnology = (oem) => {
  selectedNetworkElement.value = {}
  selectedControllerElement.value = {}
  props.ticket.detail.controllerIp = ''
  if (oem) {
    selectedSites.value = {}
    filteredSites.value = []
    props.ticket.detail.siteIp = ''
  }
}

const changeNetworkElement = () => {
  if (!selectedOem.value.id || !selectedTechnology.value.id) {
    selectedNetworkElement.value = {}
    listNetworkElement.value = []
    return notifyError('You must first select the fields "OEM" and "Technology"')
  }
  loadNetworkElement()
}

const loadNetworkElement = () => {
  isLoadingNetworkElement.value = true
  return networkElementsService.filterByProject({
    oem: selectedOem.value.id,
    technology: selectedTechnology.value.id,
    project: data.project.value.id,
  }).then(x => {
    listNetworkElement.value = x.data
    isLoadingNetworkElement.value = false
  })
}

const changeControllerElement = () => {
  if (!selectedOem.value.id || !selectedTechnology.value.id) {
    selectedControllerElement.value = {}
    listControllerElement.value = []
    return notifyError('You must first select the fields "OEM" and "Technology"')
  }
  loadControllerElement()
}

const loadControllerElement = () => {
  isLoadingControllerElement.value = true
  return controllerElementsService.filter({
    oem: selectedOem.value.id,
    technology: selectedTechnology.value.id,
    branch: data.project.value.branch.id
  }).then(x => {
    listControllerElement.value = x.data
    isLoadingControllerElement.value = false
  })
}

const changeSite = ($event) => {
  if (!selectedOem.value.id) {
    selectedSites.value = {}
    filteredSites.value = []
    return notifyError('You must first select the field "OEM"')
  }
  if (typeof $event.target.value !== 'string') {
    return
  }

  loadSites($event)
}

const loadSites = ($event) => {
  return sitesService.filter({
    oem: selectedOem.value.id,
    branch: data.project.value.branch_id,
    query: $event ? $event.target.value : undefined
  }).then(x => {
    filteredSites.value = x.data
  }).catch(() => notifyError('Error filtering sites elements, please contact your provider"') )
}

const sendData = (event) => {
  event.preventDefault()
  loadingButton.show()
  emit('save', {
    ticket: props.ticket,
    ticketPackageId: data.ticketPackageId.value,
    selectors : {
      networkElement: selectedNetworkElement.value.id,
      controllerElement: selectedControllerElement.value.id,
      sites: listSelectedSites.value.map(sites => sites.id),
      technology: selectedTechnology.value.id,
      severity: selectedSeverity.value.id,
      oem: selectedOem.value.id,
      category: selectedCategory.value.id,
      categoryChildren: selectedCategoryChildren.value.id,
      impactedService: selectedImpactedService.value.id
    },
    listFiles: listFiles.value
  })
}

const addEmailList = () => {
  if (!selectedEmailList.value.emails) {
    selectedEmailList.value = {}
    return notifyError('Indicate email')
  }
  const regexEmail = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  if (!regexEmail.test(selectedEmailList.value.emails)) {
    selectedEmailList.value = {}
    queryEmailList.value = ''
    return notifyError('Email format invalid')
  }
  if (!data.ticket.value.additional_information.list) {
    data.ticket.value.additional_information.list = []
  }
  if (data.ticket.value.additional_information.list.find(item => item.emails === selectedEmailList.value.emails)) {
    selectedEmailList.value = {}
    queryEmailList.value = ''
    return notifyError('Email duplicated')
  }
  data.ticket.value.additional_information.list.push(selectedEmailList.value)
  selectedEmailList.value = {}
}

const removeEmailList = (emailList, event) => {
  event.preventDefault()
  const idx = data.ticket.value.additional_information.list.findIndex((item) => item.id.toString() === emailList.id.toString())
  data.ticket.value.additional_information.list.splice(idx, 1)
}

const addSiteList = () => {
  if (!selectedSites.value.id) {
    selectedSites.value = {}
    return notifyError('Indicate site')
  }

  if (listSelectedSites.value.find(item => item.id === selectedSites.value.id)) {
    selectedSites.value = {}
    return notifyError('Site duplicated')
  }

  listSelectedSites.value.push(selectedSites.value)
  if (listSelectedSites.value.length === 1) {
    props.ticket.detail.siteIp = selectedSites.value.ip_address
  }
  selectedSites.value = {}
}

const removeSiteList = (site, event) => {
  event.preventDefault()
  const idx = listSelectedSites.value.findIndex(item => item.id === site.id)
  listSelectedSites.value.splice(idx, 1)
}

const changeTier1 = () => {
  selectedCategoryChildren.value = {}
  isLoadingCategory.value = true
  loadTier2()
}

const loadTier2 = () => {
  return categoriesService.children(1, 1, selectedCategory.value.id)
    .then(x => {
      listCategoriesChildren.value = x.data
      isLoadingCategory.value = false
    })
}

onBeforeMount(() => {
  loading.show()
  resolver.all({
    categories: categoriesService.parents(1, 1),
    impactedServices: impactedServicesService.list(),
    oem: oemService.listForTicketModule(data.ticketPackageId.value),
    groupEmails: groupEmailsService.filter(data.project.value.branch_id),
  }).then(resp => {
    listCategories.value = resp.categories.data
    listImpactedService.value = resp.impactedServices.data
    listEmailGroups.value = resp.groupEmails.data
    listOem.value = resp.oem.data

    if (props.ticket.id) {
      useSetInitialSelect(listOem.value, props.oldSelectors.oem, selectedOem)
      loadTechnologies()
          .then(() => useSetInitialSelect(listTechnology.value, props.oldSelectors.technology, selectedTechnology))
          .then(() => loadSeverities())
          .then(() => useSetInitialSelect(listSeverity.value, props.oldSelectors.severity, selectedSeverity))
          .then(() => {
            loadNetworkElement().then(() => useSetInitialSelect(listNetworkElement.value, props.oldSelectors.networkElement, selectedNetworkElement))
            loadControllerElement().then(() => useSetInitialSelect(listControllerElement.value, props.oldSelectors.controllerElement, selectedControllerElement))
          })
          .then(() => finishLoading.value = true )

      useSetInitialSelect(listImpactedService.value, props.oldSelectors.impactedService, selectedImpactedService)
      useSetInitialSelect(listCategories.value, props.oldSelectors.category, selectedCategory)
      loadTier2().then(() => useSetInitialSelect(listCategoriesChildren.value, props.oldSelectors.categoryChildren, selectedCategoryChildren))

      sitesService.filterById({
        ids: props.oldSelectors.sites
      }).then(x => {
        listSelectedSites.value = x.data
      }).catch(() => notifyError('Error querying sites elements, please contact your provider"') )

    } else {
      finishLoading.value = true
    }
    loading.hide()

  })
})
onMounted(() => {
  document.querySelectorAll('.ql-image').forEach((image) => image.remove())
})
</script>
<style>
  .required-editor .p-editor-toolbar{
    --tw-bg-opacity: 1;
    background-color: rgb(254 226 226 / var(--tw-bg-opacity))
  }
</style>
