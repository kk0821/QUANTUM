<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New user</h1>
        </div>
      </div>
      <div class="mx-auto">
        <UserForm
            :user="userData"
            @save="saveData"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import UserForm from '@/views/Users/UserForm.vue'
import userService from "@/services/user.service"
import {useRouter} from "vue-router"
import {loading} from "@/store/loading";
import {notifySuccess} from "@/utils/notify_success";
import {notifyError} from "@/utils/notify_error";

const router = useRouter()
const userData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Users', pathName: 'UserList', isLink: true, current: false },
  { description: 'Create', pathName: 'UserCreate', isLink: false, current: true }
]

const saveData = (event) => {
  userService.save(0, {
    user: event.user,
    role: event.role,
    status: event.status
  }).then(x => {
    notifySuccess('Create', x.data)
    router.push({ name: "UserList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
