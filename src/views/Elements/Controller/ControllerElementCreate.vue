<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New controller element</h1>
        </div>
      </div>
      <div class="mx-auto">
        <ControllerElementForm
            :controller-element="controllerElementData"
            :mode-edit="false"
            @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import controllerElementService from '@/services/controller_element.service'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import ControllerElementForm from '@/views/Elements/Controller/ControllerElementForm.vue'

const router = useRouter()
const controllerElementData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: false },
  { description: 'Controller', pathName: 'ControllerElementList', isLink: true, current: false },
  { description: 'Create', pathName: 'ControllerElementCreate', isLink: false, current: true }
]
const saveData = (event) => {
  controllerElementService.save(0, {
      controller: event.controllerElement,
      country: event.country,
      company: event.company,
      technology: event.technology,
      oem: event.oem,
      status: event.status
    }).then(x => {
      notifySuccess('Created', x.data)
      router.push({ name: "ControllerElementList" })
    }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
