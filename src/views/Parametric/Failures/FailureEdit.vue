<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ failureName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <FailureForm
            v-if="failureData.id"
            :failure="failureData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import { useRouter, useRoute } from 'vue-router'
import failureService from "@/services/failure.service.js"
import { loading } from '@/store/loading'
import { notifySuccess } from "@/utils/notify_success";
import { notifyError } from "@/utils/notify_error";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import FailureForm from '@/views/Parametric/Failures/FailureForm.vue'

const route = useRoute()
const router = useRouter()
const failureData = ref({})
const failureName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Failures', pathName: 'FailuresList', isLink: true, current: false },
  { description: 'Edit', pathName: 'FailureEdit', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  failureService.get(route.params.failureId).then(x => {
    failureData.value = x.data
    failureName.value = x.data.failure
    loading.hide()
  })
})

const saveData = (event) => {
  failureService.save(route.params.failureId, {
    equipment_substage_ids: event.equipment_substage_ids,
    failure: event.failure
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "FailuresList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
