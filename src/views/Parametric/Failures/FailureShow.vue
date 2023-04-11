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
          :can-edit="false"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import failureService from "@/services/failure.service.js"
import {loading} from "@/store/loading";
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
  { description: 'Show', pathName: 'FailureShow', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  failureService.get(route.params.failureId).then(x => {
    failureData.value = x.data
    failureName.value =  x.data.failure
    loading.hide()
  })
})

</script>
