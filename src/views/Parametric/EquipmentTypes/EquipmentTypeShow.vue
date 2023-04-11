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
          :can-edit="false"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import equipmentTypeService from "@/services/equipment_type.service.js"
import {loading} from "@/store/loading";
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
  { description: 'Show', pathName: 'EquipmentShow', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  equipmentTypeService.get(route.params.equipmentTypeId).then(x => {
    equipmentTypeData.value = x.data
    equipmentTypeName.value =  x.data.code
    loading.hide()
  })
})

</script>
