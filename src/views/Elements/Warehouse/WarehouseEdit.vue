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
            v-if="warehouseData.id"
            :warehouse="warehouseData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import WarehouseService from '@/services/warehouse.service'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import WarehouseForm from '@/views/Elements/Warehouse/WarehouseForm.vue'

const route = useRoute()
const router = useRouter()
const warehouseData = ref({})
const warehouseName = ref(String)

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Warehouse', pathName: 'WarehouseListPage', isLink: true, current: false },
  { description: 'Edit', pathName: 'WarehouseEdit', isLink: false, current: true }
]
onBeforeMount( () => {
  loading.show()
  WarehouseService.edit(route.params.warehouseId)
    .then(x => {
      warehouseData.value = x.data
      warehouseData.value.main = Boolean(x.data.main)
      warehouseData.value.lab = Boolean(x.data.lab)
      warehouseData.value.is_virtual = Boolean(x.data.is_virtual)
      warehouseName.value = x.data.warehouse
      loading.hide()
    })
})
const saveData = (event) => {
  WarehouseService.save(route.params.warehouseId, {
    warehouse: event.warehouse,
    country: event.country,
    company: event.company,
    status: event.status
  })
    .then(x => {
      notifySuccess('Update', x.data)
      router.push({ name: "WarehouseListPage" })
    }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
