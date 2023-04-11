<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ networkElementName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <NetworkElementForm
            v-if="networkElementData.id"
            :network-element="networkElementData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import networkElementService from '@/services/network_element.service'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import NetworkElementForm from '@/views/Elements/Network/NetworkElementForm.vue'

const route = useRoute()
const router = useRouter()
const networkElementData = ref({})
const networkElementName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Network', pathName: 'NetworkElementList', isLink: true, current: false },
  { description: 'Edit', pathName: 'NetworkElementEdit', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  networkElementService.edit(route.params.networkElementId).then(x => {
    networkElementData.value = x.data
    networkElementName.value = x.data.name
    loading.hide()
  })
})

const saveData = (event) => {
  networkElementService.save(route.params.networkElementId, {
      network_element: event.network_element,
      technology: event.technology,
      oem: event.oem,
      status: event.status
    }).then(x => {
      notifySuccess('Update', x.data)
      router.push({ name: "NetworkElementList" })
    }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
