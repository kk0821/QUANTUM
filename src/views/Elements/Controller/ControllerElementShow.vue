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
        <ControllerElementForm
          :controller-element="controllerElementData"
          :can-edit="false" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import controllerElementService from '@/services/controller_element.service'
import { loading } from '@/store/loading'
import ControllerElementForm from '@/views/Elements/Controller/ControllerElementForm.vue'

const route = useRoute()
const controllerElementData = ref({})
const controllerElementName = ref(String)

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Controller', pathName: 'ControllerElementList', isLink: true, current: false },
  { description: 'Show', pathName: 'ControllerElementShow', isLink: false, current: true }
]
onBeforeMount( () => {
  loading.show()
  controllerElementService.get(route.params.controllerElementId).then(x => {
    controllerElementData.value = x.data
    controllerElementData.value.ip = x.data.ip_address
    controllerElementName.value =  x.data.name
    loading.hide()
  })
})

</script>
