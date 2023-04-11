<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New warehouse</h1>
        </div>
      </div>
      <div class="mx-auto">
        <WarehouseForm
            :warehouse="warehouseData"
            @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import WarehouseService from '@/services/warehouse.service'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import WarehouseForm from '@/views/Elements/Warehouse/WarehouseForm.vue'

const router = useRouter()
const warehouseData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Warehouse', pathName: 'WarehouseListPage', isLink: true, current: false },
  { description: 'Create', pathName: 'WarehouseCreate', isLink: false, current: true }
]

const saveData = (event) => {
  WarehouseService.save(0, {
      warehouse: event.warehouse,
      country: event.country,
      company: event.company,
      status: event.status
    }).then(x => {
      notifySuccess('Created', x.data)
      router.push({ name: "WarehouseListPage" })
    }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
