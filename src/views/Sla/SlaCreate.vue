<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New SLA</h1>
        </div>
      </div>
      <div class="mx-auto">
        <SlaForm
            :sla="slaData"
            :sla-id="slaId"
            :assign-list="false"
            :mode-edit="false"
            @isLoading="statusLoading"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import {useRouter} from "vue-router"
import { loading } from '@/store/loading'
import { notifyError } from "@/utils/notify_error";
import { notifySuccess } from "@/utils/notify_success";
import slaService from "@/services/sla.service"
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import SlaForm from '@/views/Sla/SlaForm.vue'

const router = useRouter()

let slaId = ref('')
let slaData = ref({
  "id": "",
  "name": "",
  "status": "",
  "details": []
})

//for breadcrumbs
let trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'SLA', pathName: 'SlaList', isLink: true, current: false },
  { description: 'Create', pathName: 'SlaCreate', isLink: false, current: true }
]

const saveData = (event) => {
  let data = {
    'sla': event.sla,
    'status': event.status
  }
  slaService.save(0, data).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "SlaList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

const statusLoading = (data) => {
  loading.hide()
}
</script>
