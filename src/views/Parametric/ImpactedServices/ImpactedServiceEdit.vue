<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ impactedServiceName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <ImpactedServiceForm
            v-if="impactedServiceData.id"
            :impacted-service="impactedServiceData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import { useRouter, useRoute } from 'vue-router'
import { loading } from '@/store/loading'
import { notifyError } from "@/utils/notify_error.ts";
import { notifySuccess } from "@/utils/notify_success";
import serviceImpactedService from "@/services/service_impacted.service";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ImpactedServiceForm from '@/views/Parametric/ImpactedServices/ImpactedServiceForm.vue'

const route = useRoute()
const router = useRouter()
const impactedServiceData = ref({})
const impactedServiceName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Impacted services', pathName: 'ImpactedServiceList', isLink: true, current: false },
  { description: 'Edit', pathName: 'ImpactedServiceEdit', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  serviceImpactedService.edit(route.params.impactedServiceId).then(x => {
    impactedServiceData.value = x.data
    impactedServiceName.value = x.data.name
    loading.hide()
  }).catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
})
const saveData = (event) => {
  serviceImpactedService.save(route.params.impactedServiceId, {
    impacted_service: event.impacted_service,
    status: event.status
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "ImpactedServiceList" })
  }).catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
}

</script>
