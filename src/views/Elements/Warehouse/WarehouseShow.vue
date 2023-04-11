<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ warehouseName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <WarehouseForm
          :warehouse="warehouseData"
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
import WarehouseService from '@/services/warehouse.service'
import WarehouseForm from '@/views/Elements/Warehouse/WarehouseForm.vue'

const route = useRoute()
const warehouseData = ref({})
const warehouseName = ref(String)

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Warehouse', pathName: 'WarehouseListPage', isLink: true, current: false },
  { description: 'Show', pathName: 'WarehouseShow', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  WarehouseService.get(route.params.warehouseId).then(x => {
    warehouseData.value = x.data
    warehouseData.value.main = Boolean(x.data.main)
    warehouseData.value.lab = Boolean(x.data.lab)
    warehouseData.value.is_virtual = Boolean(x.data.is_virtual)
    warehouseName.value = x.data.warehouse
    loading.hide()
  })
})

</script>
