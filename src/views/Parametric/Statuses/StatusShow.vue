<template>
  <main>
    <loading-content :is-loading="loading" />
    <div v-show="!loading" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">Status {{ statusName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <StatusForm
            :status-data="statusData"
            :status-id="statusId"
            :assign-list="canAssign"
            :can-edit="canEdit"
            @isLoading="statusLoading" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import statusService from "@/services/status.service";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import LoadingContent from '@/components/LoadingContent.vue'
import StatusForm from '@/views/Parametric/Statuses/StatusForm.vue'

const route = useRoute()
const router = useRouter()
const canEdit = ref(false)
const canAssign = ref(true)
let statusData = ref({
  "module": "",
  "description": "",
  "status": ""
})

let loading = ref(true)
let statusId = ref('')
let statusName = ref(String)

//for breadcrumbs
let trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Status', pathName: 'StatusList', isLink: true, current: false },
  { description: 'Show', pathName: 'StatusShow', isLink: false, current: true }
]
onBeforeMount( () => {

  statusId.value = route.params.statusId

  statusService.get(statusId.value).then(x => {
    statusData.value = x.data
    statusName.value = x.data.description
  }).catch(err => {
  }).finally(() => {
  })
})

const statusLoading = (data) => {
  loading.value = data
}
</script>
