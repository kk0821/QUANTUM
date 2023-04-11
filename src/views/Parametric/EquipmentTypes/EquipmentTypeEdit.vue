<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ equipmentTypeName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <EquipmentTypeForm
            v-if="equipmentTypeData.id"
            :equipment-type="equipmentTypeData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import { useRouter, useRoute } from 'vue-router'
import equipmentTypeService from "@/services/equipment_type.service.js"
import { loading } from '@/store/loading'
import { notifySuccess } from "@/utils/notify_success";
import { notifyError } from "@/utils/notify_error";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import EquipmentTypeForm from '@/views/Parametric/EquipmentTypes/EquipmentTypeForm.vue'

const route = useRoute()
const router = useRouter()
const equipmentTypeData = ref({})
const equipmentTypeName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Equipment types', pathName: 'EquipmentTypesList', isLink: true, current: false },
  { description: 'Edit', pathName: 'EquipmentTypeEdit', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  equipmentTypeService.get(route.params.equipmentTypeId).then(x => {
    equipmentTypeData.value = x.data
    equipmentTypeName.value = x.data.code
    loading.hide()
  })
})

const saveData = (event) => {
  equipmentTypeService.save(route.params.equipmentTypeId, {
    equipment_type: event.equipment_type,
    status: event.status,
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "EquipmentTypesList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
