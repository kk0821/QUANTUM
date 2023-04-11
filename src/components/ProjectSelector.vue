<template>
  <div class="mx-4 mt-2" v-if="projects.length">
    <Menu as="div" class="relative inline-block w-full text-left">
      <div>
        <MenuButton
            class="flex w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-amerinode-blue-500"
        >
          <div class="flex-2 mr-2">
            <span v-if="!project.id">Select project</span>
            <div v-else class="flex items-center">
              <div v-if="project?.branch?.country?.flag_url">
                <img class="inline-block h-6 w-6" :src="project.branch.country.flag_url" alt="" />
              </div>
              <div class="flex flex-col flex-wrap">
                <div class="ml-3 text-left">
                  <p class="text-gray-900 text-sm font-medium">{{ project.name }}</p>
                </div>
                <div class="ml-3 text-left">
                  <p class="text-gray-900 text-xs">{{ project.project_type.service_type.code }} {{ project.branch.company.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-auto">
            <div class="relative">
              <div class="absolute inset-y-0 right-0 mt-0.8">
                <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5 " aria-hidden="true" />
              </div>
            </div>
          </div>
        </MenuButton>
      </div>

      <transition
        v-if="projectsMenu.length"
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="absolute right-0 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="px-1 py-1">
            <MenuItem v-for="item in projectsMenu" :key="item.name" v-slot="{ active }" @click="setProjectWithReload(item)">
              <button
                  :class="[
                  active ? 'bg-gray-100 text-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                <div class="flex items-center">
                  <div v-if="item?.branch?.country?.flag_url">
                    <img class="inline-block h-6 w-6" :src="item.branch.country.flag_url" alt="" />
                  </div>
                  <div class="flex flex-col flex-wrap">
                    <div class="ml-3 text-left">
                      <p class="text-gray-900 text-sm font-medium">{{ item.project_type.service_type.code }} {{ item.name }}</p>
                    </div>
                    <div class="ml-3 text-left">
                      <p class="text-gray-900 text-xs">{{ item.project_type.service_type.code }} {{ item.branch.company.description }}</p>
                    </div>
                  </div>
                </div>
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
    <div class="sm:block" aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-gray-100" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { projectsDefined, setProjectWithReload } from "@/composables/project_selector.js"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const { projects, project } = projectsDefined()

const projectsMenu = computed(() => {
  return projects.value.filter(item => item.id !== project.value.id)
})


</script>
