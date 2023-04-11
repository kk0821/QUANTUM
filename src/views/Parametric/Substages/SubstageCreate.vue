<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New substage</h1>
        </div>
      </div>
      <div class="mx-auto">
        <SubstageForm
          :substage="substageData"
          @save="saveData"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import {useRouter} from "vue-router"
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import substageService from "@/services/substage.service.js"
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import SubstageForm from '@/views/Parametric/Substages/SubstageForm.vue'

const router = useRouter()
const substageData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Substages', pathName: 'SubstagesList', isLink: true, current: false },
  { description: 'Create', pathName: 'SubstageCreate', isLink: false, current: true }
]

const saveData = (event) => {
  substageService.save(0, {
    equipment_type_ids: event.equipment_type_ids,
    substage: event.substage,
    status: event.status,
  }).then(x => {
    notifySuccess('Created', x.data)
    router.push({ name: "SubstagesList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
