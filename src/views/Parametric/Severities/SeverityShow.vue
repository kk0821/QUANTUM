<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">Severity {{ severityName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <SeverityForm
            v-if="severityData.id"
            :severity-data="severityData"
            :can-edit="false"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from 'vue-router'
import severityService from "@/services/severity.service";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import SeverityForm from '@/views/Parametric/Severities/SeverityForm.vue'
import {loading} from "@/store/loading";

const route = useRoute()
const severityData = ref({})
const severityName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Severities', pathName: 'SeverityList', isLink: true, current: false },
  { description: 'Show', pathName: 'SeverityShow', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  severityService.get(route.params.severityId).then(x => {
    severityData.value = x.data
    severityName.value = x.data.name
    loading.hide()
  })
})

</script>
