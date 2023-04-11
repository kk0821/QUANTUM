<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New branch</h1>
        </div>
      </div>
      <div class="mx-auto">
        <BranchForm
            :branch="branchData"
            @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import branchService from "@/services/branch.service"
import { useRouter } from "vue-router"
import { notifyError } from "@/utils/notify_error";
import { notifySuccess } from "@/utils/notify_success";
import { loading } from '@/store/loading'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import BranchForm from '@/views/Branches/BranchForm.vue'

const router = useRouter()
const branchData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Branches', pathName: 'BranchList', isLink: true, current: false },
  { description: 'Create', pathName: 'BranchCreate', isLink: false, current: true }
]

onBeforeMount(() => {
  branchService.workSchedule().then(x => {
    branchData.value.schedules = x.data
    branchData.value.has_technical_lab = false
  }).catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
})

const saveData = (event) => {

  branchService.save(0, {
    data: event.data,
    timezone: event.timezone,
    country: event.country,
    company: event.company,
    schedules: event.schedules,
    status: event.status
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "BranchList" })
  }).catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
}

</script>
