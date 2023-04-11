<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New location</h1>
        </div>
      </div>
      <div class="mx-auto">
        <LocationsForm
            :location="locationData"
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
import locationService from '@/services/locations.service.js'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import LocationsForm from '@/views/Elements/Locations/LocationsForm.vue'

const router = useRouter()
const locationData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Locations', pathName: 'LocationsListPage', isLink: true, current: false },
  { description: 'Create', pathName: 'LocationsCreate', isLink: false, current: true }
]
const saveData = (event) => {
  locationService.save(0, {
      location: event.location,
      country_id: event.country,
      company_id: event.company,
      status: event.status,
    }).then(x => {
      notifySuccess('Created', x.data)
      router.push({ name: "LocationsListPage" })
    }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
