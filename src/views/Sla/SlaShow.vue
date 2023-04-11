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
            :can-edit="false"
            @isLoading="statusLoading"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router"
import { loading } from '@/store/loading'
import { notifyError } from "@/utils/notify_error";
import slaService from "@/services/sla.service"
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import SlaForm from '@/views/Sla/SlaForm.vue'

const route = useRoute()
const router = useRouter()

let slaId = ref('')
let slaName = ref("")
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
  { description: 'Show', pathName: 'SlaShow', isLink: false, current: true }
]
onBeforeMount( () => {
  loading.show()
  slaId.value = route.params.slaId

  slaService.get(slaId.value).then(x => {
    loading.hide()
    slaData.value = x.data
    slaName.value = x.data.name
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
})

const statusLoading = (data) => {
  loading.hide()
}
</script>
