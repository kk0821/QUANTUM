<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New Controller Type</h1>
        </div>
      </div>
      <div class="mx-auto">
        <ControllerTypeForm
          :controller-type="ControllerTypeData"
          @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ControllerTypesService from '@/services/controller_types.service'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import ControllerTypeForm from '@/views/Parametric/ControllerType/ControllerTypeForm.vue'

const router = useRouter()
const ControllerTypeData = ref({})
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Controller Type', pathName: 'ControllerTypeListPage', isLink: true, current: false },
  { description: 'Create', pathName: 'ControllerTypeCreate', isLink: false, current: true }
]

const saveData = (event) => {
  ControllerTypesService.save(0, {
    'controllerType': event.controllerType
  }).then(x => {
    notifySuccess('Created', x.data)
    router.push({ name: 'ControllerTypeListPage' })
  }).catch(err => notifyError((err.code === 'ERR_BAD_REQUEST') ? err.response.data.message : err.message) )
}
</script>
