<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New impacted service</h1>
        </div>
      </div>
      <div class="mx-auto">
        <ImpactedServiceForm
            :impacted-service="impactedServiceData"
            @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import { loading } from '@/store/loading'
import { notifyError } from "@/utils/notify_error.ts";
import { notifySuccess } from "@/utils/notify_success";
import { useRouter } from "vue-router"
import serviceImpactedService from "@/services/service_impacted.service"
import ImpactedServiceForm from '@/views/Parametric/ImpactedServices/ImpactedServiceForm.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

const router = useRouter()
const impactedServiceData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Impacted services', pathName: 'ImpactedServiceList', isLink: true, current: false },
  { description: 'Create', pathName: 'ImpactedServiceCreate', isLink: false, current: true }
]
const saveData = (event) => {
  serviceImpactedService.save(0, {
    impacted_service: event.impacted_service,
    status: event.status
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "ImpactedServiceList" })
  }).catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
}

</script>
