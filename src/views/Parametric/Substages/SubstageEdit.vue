<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ substageName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <SubstageForm
            v-if="substageData.id"
            :substage="substageData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import { useRouter, useRoute } from 'vue-router'
import substageService from "@/services/substage.service.js"
import { loading } from '@/store/loading'
import { notifySuccess } from "@/utils/notify_success";
import { notifyError } from "@/utils/notify_error";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import SubstageForm from '@/views/Parametric/Substages/SubstageForm.vue'

const route = useRoute()
const router = useRouter()
const substageData = ref({})
const substageName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Substages', pathName: 'SubstagesList', isLink: true, current: false },
  { description: 'Edit', pathName: 'SubstageEdit', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  substageService.get(route.params.substageId).then(x => {
    substageData.value = x.data
    substageName.value = x.data.code
    loading.hide()
  })
})

const saveData = (event) => {
  substageService.save(route.params.substageId, {
    equipment_type_ids: event.equipment_type_ids,
    substage: event.substage,
    status: event.status,
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "SubstagesList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
