<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ controllerElementName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <SiteForm
          :site="siteData"
          :can-edit="false" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import siteService from '@/services/sites.service.js'
import { loading } from '@/store/loading'
import SiteForm from '@/views/Elements/Sites/SitesForm.vue'

const route = useRoute()
const siteData = ref({})
const controllerElementName = ref(String)

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Sites', pathName: 'SitesListPage', isLink: true, current: false },
  { description: 'Show', pathName: 'SitesShow', isLink: false, current: true }
]
onBeforeMount( () => {
  loading.show()
  siteService.get(route.params.siteId).then(x => {
    siteData.value = x.data
    siteData.value.ip = x.data.ip_address
    controllerElementName.value =  x.data.name
    loading.hide()
  })
})

</script>
