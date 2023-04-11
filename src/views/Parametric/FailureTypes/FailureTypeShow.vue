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
          :can-edit="false"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import failureTypeService from "@/services/failure_type.service.js"
import {loading} from "@/store/loading";
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
  { description: 'Show', pathName: 'FailureShow', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  failureTypeService.get(route.params.failureTypeId).then(x => {
    failureTypeData.value = x.data
    failureTypeName.value =  x.data.code
    loading.hide()
  })
})

</script>
