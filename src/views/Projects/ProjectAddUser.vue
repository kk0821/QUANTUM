<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="py-5 border-b border-gray-200">
          <div href="#" class="flex-shrink-0 group block">
            <div class="flex items-center">
              <div>
                <img class="inline-block h-9 w-9 rounded-full" :src="countryFlag" alt="" />
              </div>
              <div class="ml-3">
                <p class="text-2xl font-semibold text-gray-900">{{ companyName }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mx-auto">
        <div>
          <div class="mt-10 sm:mt-0">
            <div class="md:grid md:grid-cols-4 md:gap-6">
              <div class="md:col-span-1">
                <div class="px-4 sm:px-0">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">Users</h3>
                  <p class="mt-1 text-sm text-gray-600">List users with permission on this project.</p>
                </div>
              </div>
              <div class="mt-5 md:mt-0 md:col-span-3">
                <form action="#" method="POST">
                  <div class="shadow sm:rounded-md">
                    <div class="px-4 py-5 bg-white sm:p-6" v-if="tableUsers.length">
                      <DataTable
                        :value="tableUsers"
                        :paginator="false"
                        dataKey="id"
                        :rowHover="true"
                        responsiveLayout="scroll"
                      >
                        <Column field="name" header="Name">
                          <template #body="{data}">
                            {{ data.name }}
                          </template>
                        </Column>
                        <Column field="email" header="Email">
                          <template #body="{data}">
                            {{ data.email }}
                          </template>
                        </Column>
                        <Column field="roles" header="Roles">
                          <template #body="{data}">
                            <span
                              v-for="(role, $index) in data.roles"
                              :key="role.id"
                            >
                              {{ role.name }}<span v-if="$index + 1 !== data.roles.length">, </span>
                            </span>
                          </template>
                        </Column>
                        <Column :exportable="false">
                          <template #body="data">
                            <button type="button" @click="($event) => removeUser(data, $event)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
                              <TrashIcon class="h-6 w-6" aria-hidden="true" />
                              <span class="sr-only">Remove</span>
                            </button>
                          </template>
                        </Column>
                      </DataTable>
                    </div>
                    <div class="px-4 py-5 bg-white sm:p-6" v-show="usersOptions.length">
                      <div class="grid grid-cols-6 gap-6">
                        <div class="col-span-6 sm:col-span-5 lg:col-span-3">
                          <Listbox as="div" v-model="selectedUser">
                            <ListboxLabel class="block text-sm font-medium text-gray-700">Users</ListboxLabel>
                            <div class="relative mt-1">
                              <ListboxButton
                                class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
                              >
                                <span class="block truncate" v-if="selectedUser.name">{{ selectedUser.name }}</span>
                                <span class="block truncate" v-else>Select user</span>
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
                                      v-for="user in usersOptions"
                                      :key="user.id"
                                      :value="user"
                                      as="template"
                                  >
                                    <li :class="[active ? 'bg-amerinode-blue-100 text-amerinode-blue-900' : 'text-gray-900','relative cursor-default select-none py-2 pl-4 pr-4']">
                                      <div class="flex items-center">
                                        <span :class="['ml-3 truncate', selected && 'font-semibold']">{{ user.name }}</span>
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
                      </div>
                    </div>
                    <div class="px-4 py-5 bg-white sm:p-6" v-if="selectedUser.id">
                      <button
                          type="submit"
                          @click="(event) => addUser(event)"
                          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
                        >Select this user for the project</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="mt-10 sm:mt-0">
            <div class="md:grid md:grid-cols-4 md:gap-6">
              <div class="md:col-span-1"></div>
              <div class="mt-5 md:mt-0 md:col-span-3">
                <form action="#" method="POST">
                  <div>
                    <div class="px-4 py-3 text-right sm:px-6">
                      <button
                        type="submit"
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amerinode-blue-600 hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
                        @click="(event) => saveData(event)"
                      >Make these changes permanent</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { updateProjects } from "@/composables/project_selector.js"
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Breadcrumbs from '@/components/Breadcrumbs.vue'

import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'

import { CheckIcon, ChevronUpDownIcon, TrashIcon } from '@heroicons/vue/24/solid'

import projectService from "@/services/project.service";
import userService from "@/services/user.service";
import { loading } from '@/store/loading'
import resolver from "@/utils/_resolver.ts";
import { notifyError } from "@/utils/notify_error.ts";
import { notifySuccess } from "@/utils/notify_success.ts";

const route = useRoute()
const router = useRouter()
const projectId = ref('')
const countryFlag = ref(String)
const companyName = ref("")
const users = ref([])
const usersSelected = ref([])
const selectedUser = ref({})

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Projects', pathName: 'ProjectList', isLink: true, current: false },
  { description: 'Users', pathName: 'ProjectAddUser', isLink: false, current: true }
]

const tableUsers = computed(() => usersSelected.value.filter(user => !user.deletedAt))
const usersOptions = computed(() => users.value.filter(user => {
  return !usersSelected.value.find(us => us.id === user.id && !us.deletedAt)
}))

onBeforeMount( () => {
  projectId.value = route.params.projectId
  loading.show()
  resolver.all({
    users: userService.usersWithCreateTickets(),
    product: projectService.getOneWithUsers(projectId.value),
  }).then((resp) => {
    users.value = resp.users.data
    countryFlag.value = resp.product.data.branch.country.flag_url
    companyName.value = resp.product.data.name+' | '+resp.product.data.branch.company.description
    resp.product.data.users.forEach(user => {
      usersSelected.value.push({
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        old: true
      })
    })
    loading.hide()
  })
})

const removeUser = (user, event) => {
  event.preventDefault()

  if (user.data && user.data.old) {
    user.data.deletedAt = new Date()
  } else {
    const idx = usersSelected.value.findIndex((us) =>  us.id === user.data.id)
    usersSelected.value.splice(idx, 1)
  }
}

const addUser = (event) => {
  event.preventDefault()
  if (usersSelected.value.find(user => selectedUser.value.id === user.id && !user.deletedAt)) {
    notifyError('This user was previously assigned')
  }

  usersSelected.value.push({
    id: selectedUser.value.id,
    email: selectedUser.value.email,
    name: selectedUser.value.name,
    roles: selectedUser.value.roles
  })

  selectedUser.value = {}
}

const saveData = (event) => {
  event.preventDefault()
  projectService.addUsers(projectId.value, {
    mapUsers: usersSelected.value.map(user => ({ id: user.id, deletedAt: user.deletedAt, old: user.old }))
  })
    .then(x => {
      updateProjects()
      notifySuccess('Assigning users to projects', x.data)
      router.push({ name: "ProjectList" })
    })
    .catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
}
</script>
