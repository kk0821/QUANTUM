<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ locationName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <LocationsForm
            v-if="locationData.id"
            :location="locationData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import locationsService from '@/services/locations.service'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import LocationsForm from '@/views/Elements/Locations/LocationsForm.vue'

const route = useRoute()
const router = useRouter()
const locationData = ref({})
const locationName = ref(String)

//for breadcrumbs
let trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Locations', pathName: 'LocationsListPage', isLink: true, current: false },
  { description: 'Edit', pathName: 'LocationsEdit', isLink: false, current: true }
]
onBeforeMount( () => {
  loading.show()
  locationsService.get(route.params.locationId).then(x => {
    locationData.value = x.data
    locationData.value.ip = x.data.ip_address
    locationName.value = x.data.name
    loading.hide()
  })
})
const saveData = (event) => {
  locationsService.save(route.params.locationId, {
    location: event.location,
    country_id: event.country,
    company_id: event.company,
    status: event.status,
  })
    .then(x => {
      notifySuccess('Update', x.data)
      router.push({ name: "LocationsListPage" })
    }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
