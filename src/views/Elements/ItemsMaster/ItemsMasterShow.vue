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
          :can-edit="false" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { loading } from '@/store/loading'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ItemsMasterService from '@/services/items_master.service'
import ItemsMasterForm from '@/views/Elements/ItemsMaster/ItemsMasterForm.vue'

const route = useRoute()
const itemMasterData = ref({})
const itemMasterTitle = ref(String)

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Items Master', pathName: 'ItemsMasterListPage', isLink: true, current: false },
  { description: 'Show', pathName: 'ItemsMasterShow', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  ItemsMasterService.get(route.params.itemMasterId).then(x => {
    itemMasterData.value = x.data
    itemMasterTitle.value = `[${x.data.part_number}] ${x.data.description}`
    loading.hide()
  })
})

</script>
