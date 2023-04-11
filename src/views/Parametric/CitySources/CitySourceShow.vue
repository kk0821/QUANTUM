<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ citySourceName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <CitySourceForm
          :city-source="citySourceData"
          :source-type="sourceType"
          :can-edit="false"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { loading } from '@/store/loading'
import { notifyError } from "@/utils/notify_error.ts"
import citySourceService from "@/services/city_sources.service.js"
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import CitySourceForm from '@/views/Parametric/CitySources/CitySourceForm.vue'

const route = useRoute()
const router = useRouter()
const sourceType = ref(route.params.type.toString())
const canEdit = ref(false)
const canAssign = ref(true)
const citySourceData = ref({
  'city': '',
})
const sourceTypeCaption = ref(sourceType.value.charAt(0).toUpperCase()+sourceType.value.substring(1)+' source')

const citySourceId = ref(route.params.citySourceId)
const citySourceName = ref(String)

let trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: `${sourceTypeCaption.value}`, pathName: 'CitySourceList', isLink: true, current: false },
  { description: 'Show', pathName: 'CitySourceShow', isLink: false, current: true }
]

onBeforeMount( () => {

  loading.show()
  citySourceService.get(route.params.citySourceId).then(x => {
    citySourceData.value = x.data
    citySourceName.value = x.data.city
    loading.hide()
  }).catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
})

</script>
