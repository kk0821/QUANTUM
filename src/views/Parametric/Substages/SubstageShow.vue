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
          :can-edit="false"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import substageService from "@/services/substage.service.js"
import {loading} from "@/store/loading";
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
  { description: 'Show', pathName: 'SubstageShow', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  substageService.get(route.params.substageId).then(x => {
    substageData.value = x.data
    substageName.value =  x.data.description
    loading.hide()
  })
})

</script>
