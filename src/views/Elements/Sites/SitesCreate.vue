<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New site</h1>
        </div>
      </div>
      <div class="mx-auto">
        <SiteForm
            :site="siteData"
            :mode-edit="false"
            @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import siteService from '@/services/sites.service.js'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import SiteForm from '@/views/Elements/Sites/SitesForm.vue'

const router = useRouter()
const siteData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Sites', pathName: 'SitesListPage', isLink: true, current: false },
  { description: 'Create', pathName: 'SitesCreate', isLink: false, current: true }
]
const saveData = (event) => {
  siteService.save(0, {
      site: event.site,
      country: event.country,
      company: event.company,
      oem: event.oem,
      status: event.status
    }).then(x => {
      notifySuccess('Created', x.data)
      router.push({ name: "SitesListPage" })
    }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
