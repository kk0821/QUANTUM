<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New role</h1>
        </div>
      </div>
      <div class="mx-auto">
        <RoleForm
            :role="roleData"
            @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import RoleForm from '@/views/Roles/RoleForm.vue'
import roleService from "@/services/role.service"
import {useRouter} from "vue-router"
import {loading} from "@/store/loading";
import {notifySuccess} from "@/utils/notify_success";
import {notifyError} from "@/utils/notify_error";

const router = useRouter()
const roleData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Roles', pathName: 'RoleList', isLink: true, current: false },
  { description: 'Create', pathName: 'RoleCreate', isLink: false, current: true }
]

const saveData = (event) => {
  roleService.save(0, {
    role: event.role,
    status: event.status,
    permissions: event.permissions
  }).then(x => {
    notifySuccess('Create', x.data)
    router.push({ name: "RoleList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
