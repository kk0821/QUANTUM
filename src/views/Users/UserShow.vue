<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ names }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <UserForm
            v-if="userData.id"
            :user="userData"
            :can-edit="false"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from 'vue-router'
import userService from "@/services/user.service";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import UserForm from '@/views/Users/UserForm.vue'
import { loading } from '@/store/loading'

const route = useRoute()
const userData = ref({})
const names = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Users', pathName: 'UserList', isLink: true, current: false },
  { description: 'Show', pathName: 'UserShow', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  userService.edit(route.params.userId).then(x => {
    userData.value = x.data
    names.value = x.data.name
    loading.hide()
  })
})

</script>
