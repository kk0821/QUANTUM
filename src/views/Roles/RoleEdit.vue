<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">Role {{ roleName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <RoleForm
            v-if="roleData.id"
            :role="roleData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import roleService from "@/services/role.service";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import RoleForm from '@/views/Roles/RoleForm.vue'
import {loading} from "@/store/loading";
import {notifySuccess} from "@/utils/notify_success";
import {notifyError} from "@/utils/notify_error";

const route = useRoute()
const router = useRouter()
const roleData = ref({})
const roleName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Roles', pathName: 'RoleList', isLink: true, current: false },
  { description: 'Edit', pathName: 'RoleEdit', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  roleService.edit(route.params.roleId).then(x => {
    roleData.value = x.data
    roleName.value = x.data.name
    loading.hide()
  })
})

const saveData = (event) => {
  roleService.save(route.params.roleId, {
    role: event.role,
    status: event.status,
    permissions: event.permissions
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "RoleList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
