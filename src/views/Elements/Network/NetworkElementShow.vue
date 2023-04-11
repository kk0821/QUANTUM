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
            :network-element="networkElementData"
            :network-element-id="networkElementId"
            :assign-list="canAssign"
            :can-edit="canEdit" />
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
import NetworkElementForm from '@/views/Elements/Network/NetworkElementForm.vue'

const route = useRoute()
const router = useRouter()
const canEdit = ref(false)
const canAssign = ref(true)
const networkElementData = ref({})
const networkElementId = ref('')
const networkElementName = ref(String)

//for breadcrumbs
let trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Network', pathName: 'NetworkElementList', isLink: true, current: false },
  { description: 'Show', pathName: 'NetworkElementShow', isLink: false, current: true }
]
onBeforeMount( () => {

  networkElementId.value = route.params.networkElementId
  loading.show()
  networkElementService.get(networkElementId.value).then(x => {
    networkElementData.value = x.data
    networkElementName.value =  x.data.name
    loading.hide()
  })
})

</script>
