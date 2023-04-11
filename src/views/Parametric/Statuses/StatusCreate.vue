<template>
  <main>
    <loading-content :is-loading="loading" />
    <div v-show="!loading" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New status</h1>
        </div>
      </div>
      <div class="mx-auto">
        <StatusForm
            :status-data="statusData"
            :status-id="statusId"
            :assign-list="canAssign"
            :mode-edit="false"
            @isLoading="statusLoading"
            @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import {useRouter} from "vue-router"
import {notifySuccess} from "@/utils/notify_success";
import {notifyError} from "@/utils/notify_error";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import LoadingContent from '@/components/LoadingContent.vue'
import StatusForm from '@/views/Parametric/Statuses/StatusForm.vue'
import statusService from "@/services/status.service"

const router = useRouter()
const canAssign = ref(false)
let loading = ref(false)
let statusId = ref('')
let statusData = ref({
  code: '',
  module: '',
  description: '',
  stop_time: false,
  status: ''
})

let trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Status', pathName: 'StatusList', isLink: true, current: false },
  { description: 'Create', pathName: 'StatusCreate', isLink: false, current: true }
]
const saveData = (event) => {
  let data = {
    'data': event.data,
    'status': event.status
  }
  statusService.save(0, data).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "StatusList" })
  }).catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
}
const statusLoading = (data) => {
  loading.value = data
}
</script>
