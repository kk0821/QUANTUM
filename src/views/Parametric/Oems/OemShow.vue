<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">OEM {{ oemName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <OemForm
            v-if="oemData.id"
            :oem="oemData"
            :can-edit="false" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from 'vue-router'
import {loading} from "@/store/loading";
import oemService from "@/services/oem.service";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import OemForm from '@/views/Parametric/Oems/OemForm.vue'

const route = useRoute()
const oemData = ref({})
const oemName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'OEMs', pathName: 'OemList', isLink: true, current: false },
  { description: 'Show', pathName: 'OemShow', isLink: false, current: true }
]
onBeforeMount( () => {
  loading.show()
  oemService.get(route.params.oemId).then(x => {
    oemData.value = x.data
    oemName.value = x.data.description
    loading.hide()
  })
})
</script>
