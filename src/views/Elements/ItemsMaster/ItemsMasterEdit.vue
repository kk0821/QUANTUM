<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ itemMasterTitle }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <ItemsMasterForm
            v-if="itemMasterData.id"
            :item-master="itemMasterData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ItemsMasterService from '@/services/items_master.service'
import { loading } from '@/store/loading'
import { loadingButton } from '@/store/loadingButton'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import ItemsMasterForm from '@/views/Elements/ItemsMaster/ItemsMasterForm.vue'

const route = useRoute()
const router = useRouter()
const itemMasterData = ref({})
const itemMasterTitle = ref(String)

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Items Master', pathName: 'ItemsMasterListPage', isLink: true, current: false },
  { description: 'Edit', pathName: 'ItemsMasterEdit', isLink: false, current: true }
]
onBeforeMount( () => {
  loading.show()
  ItemsMasterService.edit(route.params.itemMasterId)
    .then(x => {
      itemMasterData.value = x.data
      itemMasterTitle.value = `[${x.data.part_number}] ${x.data.description}`
      loading.hide()
    })
})
const saveData = (event) => {
  loadingButton.show()
  ItemsMasterService.save(route.params.itemMasterId, {
    itemMaster: event.itemMaster,
    country: event.country,
    company: event.company,
    oem: event.oem,
    segment: event.segment,
    technology: event.technology,
    controllerType: event.controllerType,
    networkElement: event.networkElement,
    timeUnit: event.timeUnit,
    status: event.status,
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "ItemsMasterListPage" })
  }).catch(err => {
    notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message)
  }).finally(() => {
    loadingButton.hide()
  })
}
</script>
