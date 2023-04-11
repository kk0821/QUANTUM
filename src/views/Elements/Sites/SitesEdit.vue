<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ siteName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <SitesForm
            v-if="siteData.id"
            :site="siteData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import sitesService from '@/services/sites.service'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import SitesForm from '@/views/Elements/Sites/SitesForm.vue'

const route = useRoute()
const router = useRouter()
const siteData = ref({})
const siteName = ref(String)

//for breadcrumbs
let trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Sites', pathName: 'SitesListPage', isLink: true, current: false },
  { description: 'Edit', pathName: 'SitesEdit', isLink: false, current: true }
]
onBeforeMount( () => {
  loading.show()
  sitesService.edit(route.params.siteId).then(x => {
    siteData.value = x.data
    siteData.value.ip = x.data.ip_address
    siteName.value = x.data.name
    loading.hide()
  })
})
const saveData = (event) => {
  sitesService.save(route.params.siteId, {
    site: event.site,
    country: event.country,
    company: event.company,
    technology: event.technology,
    oem: event.oem,
    status: event.status
  })
    .then(x => {
      notifySuccess('Update', x.data)
      router.push({ name: "SitesListPage" })
    }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
