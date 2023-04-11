<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New severity</h1>
        </div>
      </div>
      <div class="mx-auto">
        <SeverityForm
            :severity-data="severityData"
            @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import SeverityForm from '@/views/Parametric/Severities/SeverityForm.vue'
import severityService from "@/services/severity.service"
import {useRouter} from "vue-router"
import {loading} from "@/store/loading";
import {notifySuccess} from "@/utils/notify_success";
import {notifyError} from "@/utils/notify_error";

const router = useRouter()
const severityData = ref({
  "color": "#007fce",
})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Severities', pathName: 'SeverityList', isLink: true, current: false },
  { description: 'Create', pathName: 'SeverityCreate', isLink: false, current: true }
]
const saveData = (event) => {
  severityService.save(0, {
    data: event.data,
    color: event.color,
    status: event.status,
  }).then(x => {
    notifySuccess('Create', x.data)
    router.push({ name: "SeverityList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
