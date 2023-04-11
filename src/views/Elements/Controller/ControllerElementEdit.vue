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
            v-if="controllerElementData.id"
            :controller-element="controllerElementData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import controllerElementService from '@/services/controller_element.service'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import ControllerElementForm from '@/views/Elements/Controller/ControllerElementForm.vue'

const route = useRoute()
const router = useRouter()
const controllerElementData = ref({})
const controllerElementName = ref(String)

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Controller', pathName: 'ControllerElementList', isLink: true, current: false },
  { description: 'Edit', pathName: 'ControllerElementEdit', isLink: false, current: true }
]
onBeforeMount( () => {
  loading.show()
  controllerElementService.edit(route.params.controllerElementId).then(x => {
    controllerElementData.value = x.data
    controllerElementData.value.ip = x.data.ip_address
    controllerElementName.value = x.data.name
    loading.hide()
  })
})
const saveData = (event) => {
  controllerElementService.save(route.params.controllerElementId, {
    controller: event.controllerElement,
    country: event.country,
    company: event.company,
    technology: event.technology,
    oem: event.oem,
    status: event.status
  })
    .then(x => {
      notifySuccess('Update', x.data)
      router.push({ name: "ControllerElementList" })
    }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
