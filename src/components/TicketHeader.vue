<template>
  <div v-show="ticket && project" class="lg:flex lg:items-center lg:justify-between">
    <div class="min-w-0 flex-1">
      <div class="flex items-center">
        <div>
          <img class="inline-block h-9 w-9 rounded-full" :src="(project || {}).branch?.country?.flag_url" alt="" />
        </div>
        <div class="ml-3">
          <p class="text-3xl font-semibold text-gray-900">{{ ticketTitle }}</p>
        </div>
      </div>
      <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
        <div class="mt-2 flex items-center text-sm text-gray-500">
          <FolderOpenIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          {{ (project || {}).name }}
        </div>
        <div class="mt-2 flex items-center text-sm text-gray-500">
          <UserIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          {{ ticket.creator.username }}
        </div>
        <div class="mt-2 flex items-center text-sm text-gray-500">
          <CalendarIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          {{ ticketDateCreated }}
        </div>
      </div>
      <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap ">
        <div v-if="ticket.technical_assigned" class="mt-2 mr-2 flex items-center text-sm text-gray-500 sm:space-x-6">
          <UserGroupIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          Attended by: {{ ticket.technical_assigned.name }}
        </div>
        <div class="mt-2 flex items-center">
          <status-ticket
              v-show="ticket.statusTicket"
              :status="ticket.statusTicket" />
        </div>
      </div>
    </div>
    <div v-show="showButtonAction" class="mt-5 flex lg:mt-0 lg:ml-4">
      <span class="hidden sm:block">
        <button type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amerinode-blue-500 focus:ring-offset-2">
          <PencilIcon class="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
          Edit
        </button>
      </span>

      <span class="ml-3 hidden sm:block">
        <button type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amerinode-blue-500 focus:ring-offset-2">
          <LinkIcon class="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
          View
        </button>
      </span>

      <!-- Dropdown -->
      <Menu as="div" class="relative ml-3 sm:hidden">
        <MenuButton class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amerinode-blue-500 focus:ring-offset-2">
          More
          <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5 text-gray-500" aria-hidden="true" />
        </MenuButton>

        <transition enter-active-class="transition ease-out duration-200" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
          <MenuItems class="absolute right-0 z-10 mt-2 -mr-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <MenuItem v-slot="{ active }">
              <a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Edit</a>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">View</a>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </div>
</template>

<script setup>
import {
  FolderOpenIcon,
  CalendarIcon,
  ChevronDownIcon,
  UserIcon,
  UserGroupIcon,
  LinkIcon,
  PencilIcon,
} from '@heroicons/vue/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { computed } from "vue";
import { useStatusTicket } from "@/composables/types";
import StatusTicket from "@/components/StatusTicket.vue";

const props = defineProps({
  ticket: {
    type: Object
  },
  project: {
    type: Object
  },
  showButtonAction: {
    type: Boolean,
    default: false
  },
  canEdit: {
    type: Boolean,
    default: false
  }
})

const { statuses } = useStatusTicket()

const ticketTitle = computed(() => {
  return 'Ticket '+props.ticket.identify
})

const ticketDateCreated = computed( () => {
  return props.ticket.id ? props.ticket.created_at_tz : props.ticket.created_at
})

</script>
