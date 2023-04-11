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
        <LocationsForm
          :location="locationData"
          :can-edit="false" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import locationsService from '@/services/locations.service.js'
import { loading } from '@/store/loading'
import LocationsForm from '@/views/Elements/Locations/LocationsForm.vue'

const route = useRoute()
const locationData = ref({})
const controllerElementName = ref(String)

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Locations', pathName: 'LocationsListPage', isLink: true, current: false },
  { description: 'Show', pathName: 'LocationsShow', isLink: false, current: true }
]
onBeforeMount( () => {
  loading.show()
  locationsService.get(route.params.locationId).then(x => {
    locationData.value = x.data
    controllerElementName.value =  x.data.name
    loading.hide()
  })
})

</script>
