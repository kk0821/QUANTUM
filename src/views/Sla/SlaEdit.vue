<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">SLA {{ slaName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <SlaForm
            :sla="slaData"
            :sla-id="slaId"
            :assign-list="canAssign"
            @isLoading="statusLoading"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import { useRouter, useRoute } from 'vue-router'
import { notifyError } from "@/utils/notify_error.ts";
import { notifySuccess } from "@/utils/notify_success"
import { loading } from '@/store/loading'
import slaService from "@/services/sla.service";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import SlaForm from '@/views/Sla/SlaForm.vue'

const route = useRoute()
const router = useRouter()
const canAssign = ref(true)
let slaData = ref({
  "id": "",
  "name": "",
  "status": "",
  "details": [
    {
      "id": "",
      "sla_id": "",
      "severity_id": "",
      "time_response": "",
      "time_response_unit_id": "",
      "time_recovery": "",
      "time_recovery_unit_id": "",
      "severity": {
        "id": "",
        "code": "",
        "name": "",
        "description": "",
        "status": "",
        "color": ""
      },
      "time_response_unit": {
        "id": "",
        "name": "",
        "unit": "",
        "nomenclature": "",
        "description": "",
        "type": "",
        "factor_conversion": "",
        "weekdays": ""
      },
      "time_recovery_unit": {
        "id": "",
        "name": "",
        "unit": "",
        "nomenclature": "",
        "description": "",
        "type": "",
        "factor_conversion": "",
        "weekdays": "",
      },
      "resolutions": [],
      "availabilities": []
    },
  ]
})

let slaId = ref('')
let slaName = ref("")

//for breadcrumbs
let trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'SLA', pathName: 'SlaList', isLink: true, current: false },
  { description: 'Edit', pathName: 'SlaEdit', isLink: false, current: true }
]
onBeforeMount( () => {
  loading.show()
  slaId.value = route.params.slaId

  slaService.edit(slaId.value).then(x => {
    loading.hide()
    slaData.value = x.data
    slaName.value = x.data.name
  })
})
const saveData = (event) => {

  let data = {
    'sla': event.sla,
    'status': event.status
  }
  slaService.save(slaId.value, data).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "SlaList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
const statusLoading = (data) => {
  loading.hide()
}
</script>
