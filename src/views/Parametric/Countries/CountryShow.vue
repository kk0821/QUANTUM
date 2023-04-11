<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="py-3 border-b border-gray-200">
          <div href="#" class="flex-shrink-0 group block">
            <div class="flex items-center">
              <div>
                <img class="inline-block h-14 w-14" :src="urlFlag" alt="" />
              </div>
              <div class="ml-3">
                <h1 class="text-2xl font-semibold text-gray-900"> {{ countryName }}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mx-auto">
        <CountryForm
            v-if="countryData.id"
            :country="countryData"
            :can-edit="false" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import countryService from "@/services/country.service";
import { loading } from '@/store/loading'
import { notifyError } from "@/utils/notify_error";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import CountryForm from '@/views/Parametric/Countries/CountryForm.vue'

const route = useRoute()
const router = useRouter()
const countryData = ref({})
const countryName = ref(String)
const urlFlag = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Countries', pathName: 'CountryList', isLink: true, current: false },
  { description: 'Show', pathName: 'CountryShow', isLink: false, current: true }
]
onBeforeMount( () => {
  loading.show()
  countryService.get(route.params.countryId).then(x => {
    countryData.value = x.data
    countryName.value = x.data.name
    urlFlag.value =x.data.flag_url
    loading.hide()
  }).catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
})

</script>
