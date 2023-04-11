<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">Controller Type: {{ controllerTypeName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <ControllerTypeForm
          v-if="controllerTypeData.id"
          :controller-type="controllerTypeData"
          :can-edit="false" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ControllerTypeService from '@/services/controller_types.service'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import ControllerTypeForm from '@/views/Parametric/ControllerType/ControllerTypeForm.vue'

const route = useRoute()
const controllerTypeData = ref({})
const controllerTypeName = ref('')

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Controller Types', pathName: 'ControllerTypeListPage', isLink: true, current: false },
  { description: 'Show', pathName: 'ControllerTypeShow', isLink: false, current: true }
]
onBeforeMount( () => {
  ControllerTypeService.get(route.params.controllerTypeId)
    .then(x => {
      controllerTypeData.value = x.data
      controllerTypeName.value = x.data.name
    }).catch(err => notifyError((err.code === 'ERR_BAD_REQUEST') ? err.response.data.message : err.message) )
})
</script>
