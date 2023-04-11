<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ resolutionTypeName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <ResolutionTypeForm
          v-if="resolutionTypeData.id"
          :resolution-type="resolutionTypeData"
          :can-edit="false"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import resolutionTypeService from "@/services/resolution_type.service.js"
import {loading} from "@/store/loading";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ResolutionTypeForm from '@/views/Parametric/ResolutionTypes/ResolutionTypeForm.vue'

const route = useRoute()
const router = useRouter()
const resolutionTypeData = ref({})
const resolutionTypeName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Resolution types', pathName: 'ResolutionTypesList', isLink: true, current: false },
  { description: 'Show', pathName: 'ResolutionShow', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  resolutionTypeService.get(route.params.resolutionTypeId).then(x => {
    resolutionTypeData.value = x.data
    resolutionTypeName.value =  x.data.code
    loading.hide()
  })
})

</script>
