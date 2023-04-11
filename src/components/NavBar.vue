<template>
  <div>
    <div class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button type="button" class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amerinode-blue-500 md:hidden" @click="openSideBar">
        <span class="sr-only">Open sidebar</span>
        <Bars3BottomLeftIcon class="h-6 w-6" aria-hidden="true" />
      </button>
      <div class="flex-1 px-4 flex justify-between">
        <div class="flex-1 flex">
          <form class="w-full flex md:ml-0" action="#" method="GET">
            <label for="search-field" class="sr-only">Search</label>
            <div class="relative w-full text-gray-400 focus-within:text-gray-600">
              <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5" aria-hidden="true" />
              </div>
              <input id="search-field" class="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search" type="search" name="search" />
            </div>
          </form>
        </div>
        <div class="ml-4 flex items-center md:ml-6">
          <button type="button" class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true" />
          </button>

          <!-- Profile dropdown -->
          <Menu as="div" class="ml-3 relative">
            <div>
              <MenuButton class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                <span class="sr-only">Open user menu</span>
                <UserCircleIcon class="h-8 w-8 rounded-full text-gray-400" aria-hidden="true" />
              </MenuButton>
            </div>
            <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div v-for="itemGroup in userNavigation" class="px-1 py-1">
                  <MenuItem v-for="item in itemGroup.menu" :key="item.name" v-slot="{ active }">
                    <a
                        v-if="item.isLink"
                        :key="item.name"
                        :href="item.href"
                        @click="(event) => executeAction(item, event)"
                        :class="[
                            active? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                        ]"
                    >
                      <component
                          :is="item.icon"
                          :class="[
                              active ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                              'mr-3 flex-shrink-0 h-6 w-6'
                          ]"
                          aria-hidden="true"/>
                      {{ item.name }}
                    </a>

                    <a v-else :href="null" class="group bg-gray-50 text-gray-900 flex items-center px-2 py-2 text-sm font-medium rounded-md">
                      <div class="flex items-center">
                        <div>
                          <component
                              :is="item.icon"
                              class="group-hover:text-gray-600 mr-3 flex-shrink-0 h-6 w-6"
                              aria-hidden="true" />
                        </div>
                        <div>
                          <p class="text-base font-medium">{{ item.user.name }}</p>
                          <p class="text-xs font-medium italic text-gray-500">{{ item.user.email }}</p>
                        </div>
                      </div>
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
  import { BellIcon, Bars3BottomLeftIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
  import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
  import router from "@/routes";
  import authService from "@/services/auth.service";
  import {encryptStorage} from "@/services/http.service";
  import {notify} from "notiwind";

  defineProps({
    userNavigation: {
      type: Object
    },
    sidebarIsOpen: {
      type: Boolean
    }
  })
  const emit = defineEmits(['sideBarOpen'])

  const openSideBar = () => {
    emit('sideBarOpen', true)
  }

  function executeAction(menu, event) {

    if (menu.page === 'Logout') {
      event.preventDefault()
      logout()
    } else {
      if (menu.isLink) {
        router.push({ name: menu.page }).then()
      }
    }
  }

  function logout() {
    authService.logout().then(response => {
      if (response.status === 200) {
        encryptStorage.clear();
        router.push({ name: 'LoginPage' })
      }
    }).catch(err => {
      if (err.code !== "ERR_NETWORK") {
        notify({
          group: "top",
          title: "Error",
          text: err.response.data.message,
          type: "error"
        }, 5000)
      }
    })
  }
</script>
