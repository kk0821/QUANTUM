<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New income type</h1>
        </div>
      </div>
      <div class="mx-auto">
        <IncomeTypeForm
          :income-type="incomeTypeData"
          @save="saveData"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import {useRouter} from "vue-router"
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import incomeTypeService from "@/services/income_type.service.js"
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import IncomeTypeForm from '@/views/Parametric/IncomeTypes/IncomeTypeForm.vue'

const router = useRouter()
const incomeTypeData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Income types', pathName: 'IncomeTypesList', isLink: true, current: false },
  { description: 'Create', pathName: 'IncomeCreate', isLink: false, current: true }
]

const saveData = (event) => {
  incomeTypeService.save(0, {
    income_type: event.income_type,
    status: event.status,
  }).then(x => {
    notifySuccess('Created', x.data)
    router.push({ name: "IncomeTypesList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
