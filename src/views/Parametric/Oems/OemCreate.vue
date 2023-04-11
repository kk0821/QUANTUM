<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New OEM</h1>
        </div>
      </div>
      <div class="mx-auto">
        <OemForm
            :oem="oemData"
            @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import OemForm from '@/views/Parametric/Oems/OemForm.vue'
import oemService from "@/services/oem.service"
import {useRouter} from "vue-router"
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'

const router = useRouter()
const canAssign = ref(false)
const oemData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'OEMs', pathName: 'OemList', isLink: true, current: false },
  { description: 'Create', pathName: 'OemCreate', isLink: false, current: true }
]

const saveData = (event) => {
  oemService.save(0, {
    oem: event.oem,
    status: event.status
  }).then(x => {
    notifySuccess('Created', x.data)
    router.push({ name: "OemList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
