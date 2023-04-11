<template>
  <div>
    <SideBar :navigation="navigationItems" :sidebar-is-open="sidebarOpen" @sideBarOpen="changeSideBar" />
    <div class="md:pl-64 flex flex-col flex-1">
      <!-- navbar with search field-->
      <NavBar :user-navigation="userNavigation" :sidebar-is-open="sidebarOpen" @sideBarOpen="changeSideBar" />
      <loading-content :is-loading="loading.state" />
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>

<script setup>

import { ref, onBeforeMount } from 'vue'

import LoadingContent from '@/components/LoadingContent.vue'
import NavBar from '@/components/NavBar.vue'
import SideBar from '@/components/SideBar.vue'
import { updateProjects } from "@/composables/project_selector.js"
import { encryptStorage } from '@/services/http.service'
import { loading } from '@/store/loading'

import {
  ChartBarSquareIcon,
  TicketIcon,
  BriefcaseIcon,
  PresentationChartLineIcon,
  TableCellsIcon,
  KeyIcon,
  FolderOpenIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
  UsersIcon,
  HomeModernIcon,
  FlagIcon,
  ServerStackIcon,
  ArrowRightOnRectangleIcon,
  Cog8ToothIcon,
  AdjustmentsHorizontalIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'

//global declare for layoutAdmin
const sidebarOpen = ref(false)
const userLogged = ref(encryptStorage.getItem('user') ? encryptStorage.getItem('user') : '')

//event that listens to child components (navbar and sidebar)
const changeSideBar = (val) => {
  sidebarOpen.value = val
}

let navigationItems = encryptStorage.getItem('navigation')

onBeforeMount(() => {

  navigationItems.forEach(function (item) {
    switch (item.icon) {
      case 'ChartBarSquareIcon':
        item.icon = ChartBarSquareIcon
        break;
      case 'TicketIcon':
        item.icon = TicketIcon
        break
      case 'BriefcaseIcon':
        item.icon = BriefcaseIcon
        break;
      case 'PresentationChartLineIcon':
        item.icon = PresentationChartLineIcon
        break;
      case 'TableCellsIcon':
        item.icon = TableCellsIcon
        break;
      case 'KeyIcon':
        item.icon = KeyIcon
        break;
      case 'FolderOpenIcon':
        item.icon = FolderOpenIcon
        break;
      case 'UserGroupIcon':
        item.icon = UserGroupIcon
        break;
      case 'DocumentChartBarIcon':
        item.icon = DocumentChartBarIcon
        break;
      case 'UsersIcon':
        item.icon = UsersIcon
        break;
      case 'HomeModernIcon':
        item.icon = HomeModernIcon
        break;
      case 'FlagIcon':
        item.icon = FlagIcon
        break;
      case 'ServerStackIcon':
        item.icon = ServerStackIcon
        break;
    }
    item.current = false;
  })
  updateProjects()
})

const userNavigation = [
  {
    group: 'Options user',
    menu: [
      { user: userLogged.value, href: '', page: 'UserPage', icon: UserCircleIcon, isLink: false },
      { name: 'Profile', href: 'profile', page: 'ProfilePage', icon: AdjustmentsHorizontalIcon, isLink: true },
      { name: 'Settings', href: 'setting', page: 'SettingsPage', icon: Cog8ToothIcon, isLink: true },
    ]
  },
  {
    group: 'System',
    menu: [
      { name: 'Sign out', href: 'logout', page: 'Logout', icon: ArrowRightOnRectangleIcon, isLink: true },
    ]
  },
]

</script>
