<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="py-5 border-b border-gray-200">
          <div href="#" class="flex-shrink-0 group block">
            <div class="flex items-center">
              <div>
                <img class="inline-block h-9 w-9 rounded-full" :src="countryFlag" alt="" />
              </div>
              <div class="ml-3">
                <p class="text-2xl font-semibold text-gray-900">{{ companyName }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mx-auto">
        <BranchForm
            :branch="branchData"
            :can-edit="false" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { loading } from '@/store/loading'
import branchService from "@/services/branch.service";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import BranchForm from '@/views/Branches/BranchForm.vue'

const route = useRoute()
const router = useRouter()
const branchData = ref({})
const countryFlag = ref(String)
const companyName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Branches', pathName: 'BranchList', isLink: true, current: false },
  { description: 'Show', pathName: 'BranchShow', isLink: false, current: true }
]
onBeforeMount( () => {

  branchService.get(route.params.branchId).then(x => {
    branchData.value = x.data
    branchData.value.has_technical_lab = (branchData.value.has_technical_lab === 1)
    branchData.value.schedules.forEach(schedule => schedule.laborable_day = (schedule.laborable_day === 1))
    countryFlag.value = x.data.country.flag_url
    companyName.value = x.data.company.description
  })
})

</script>
