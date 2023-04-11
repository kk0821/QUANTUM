<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ incomeTypeName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <IncomeTypeForm
            v-if="incomeTypeData.id"
            :income-type="incomeTypeData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import { useRouter, useRoute } from 'vue-router'
import incomeTypeService from "@/services/income_type.service.js"
import { loading } from '@/store/loading'
import { notifySuccess } from "@/utils/notify_success";
import { notifyError } from "@/utils/notify_error";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import IncomeTypeForm from '@/views/Parametric/IncomeTypes/IncomeTypeForm.vue'

const route = useRoute()
const router = useRouter()
const incomeTypeData = ref({})
const incomeTypeName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Income types', pathName: 'IncomeTypesList', isLink: true, current: false },
  { description: 'Edit', pathName: 'IncomeTypeEdit', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  incomeTypeService.get(route.params.incomeTypeId).then(x => {
    incomeTypeData.value = x.data
    incomeTypeName.value = x.data.code
    loading.hide()
  })
})

const saveData = (event) => {
  incomeTypeService.save(route.params.incomeTypeId, {
    income_type: event.income_type,
    status: event.status,
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "IncomeTypesList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
