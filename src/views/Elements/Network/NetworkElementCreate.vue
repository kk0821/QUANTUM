<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New network element</h1>
        </div>
      </div>
      <div class="mx-auto">
        <NetworkElementForm
            :network-element="networkElementData"
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
import networkElementService from '@/services/network_element.service'
import { loading } from '@/store/loading'
import { notifySuccess } from '@/utils/notify_success'
import { notifyError } from '@/utils/notify_error'
import NetworkElementForm from '@/views/Elements/Network/NetworkElementForm.vue'

const router = useRouter()
const networkElementData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Network', pathName: 'NetworkElementList', isLink: true, current: false },
  { description: 'Create', pathName: 'NetworkElementCreate', isLink: false, current: true }
]
const saveData = (event) => {
  networkElementService.save(0, {
      'network_element': event.network_element,
      'technology': event.technology,
      'oem': event.oem,
      'status': event.status
    }).then(x => {
      notifySuccess('Created', x.data)
      router.push({ name: "NetworkElementList" })
    }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
