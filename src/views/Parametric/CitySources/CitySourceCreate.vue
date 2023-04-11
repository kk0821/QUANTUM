<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New {{sourceTypeCaption}}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <CitySourceForm
          :city-source="citySourceData"
          :source-type="sourceType"
          @save="saveData"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { loading } from '@/store/loading'
import { notifyError } from "@/utils/notify_error.ts";
import { notifySuccess } from "@/utils/notify_success";
import citySourceService from "@/services/city_sources.service.js"
import CitySourceForm from '@/views/Parametric/CitySources/CitySourceForm.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

const route = useRoute()
const router = useRouter()
const sourceType = ref(route.params.type.toString())
const citySourceData = ref({})
const sourceTypeCaption = ref(sourceType.value.charAt(0).toUpperCase()+sourceType.value.substring(1)+' source')

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: `${sourceTypeCaption.value}`, pathName: 'CitySourceList', isLink: true, current: false },
  { description: 'Create', pathName: 'CitySourceCreate', isLink: false, current: true }
]

const saveData = (event) => {
  let payload = {
    city_source: {
      'type': `${sourceType.value}_source`,
      'city': event.city
    },
    country_id: event.country,
    company_id: event.company,
    status: event.status,
  }
  citySourceService.save(0, payload)
    .then(x => {
      notifySuccess('Created', x.data)
      router.push({ name: "CitySourceList" })
    })
    .catch(err => {
      notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message)
    })
}

</script>
