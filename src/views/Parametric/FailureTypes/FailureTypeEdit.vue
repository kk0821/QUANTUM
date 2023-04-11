<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ failureTypeName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <FailureTypeForm
            v-if="failureTypeData.id"
            :failure-type="failureTypeData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import { useRouter, useRoute } from 'vue-router'
import failureTypeService from "@/services/failure_type.service.js"
import { loading } from '@/store/loading'
import { notifySuccess } from "@/utils/notify_success";
import { notifyError } from "@/utils/notify_error";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import FailureTypeForm from '@/views/Parametric/FailureTypes/FailureTypeForm.vue'

const route = useRoute()
const router = useRouter()
const failureTypeData = ref({})
const failureTypeName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Failure types', pathName: 'FailureTypesList', isLink: true, current: false },
  { description: 'Edit', pathName: 'FailureTypeEdit', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  failureTypeService.get(route.params.failureTypeId).then(x => {
    failureTypeData.value = x.data
    failureTypeName.value = x.data.code
    loading.hide()
  })
})

const saveData = (event) => {
  failureTypeService.save(route.params.failureTypeId, {
    failure_type: event.failure_type,
    status: event.status,
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "FailureTypesList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
