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
        <TicketsPackageForm
          v-if="ticketPackageData.id"
          :tickets-package="ticketPackageData"
          :can-edit="false"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from 'vue-router'
import { loading } from '@/store/loading'
import ticketsPackageService from "@/services/tickets_package.service.js"
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import TicketsPackageForm from '@/views/TicketsPackage/TicketsPackageForm.vue'

const route = useRoute()
const ticketPackageData = ref({})
const ticketPackageId = ref('')
const countryFlag = ref(String)
const companyName = ref("")

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Tickets package', pathName: 'TicketsPackageList', isLink: true, current: false },
  { description: 'Show', pathName: 'TicketsPackageShow', isLink: false, current: true }
]

onBeforeMount( () => {
  ticketPackageId.value = route.params.ticketPackageId
  loading.show()
  ticketsPackageService.get(ticketPackageId.value)
      .then(x => {
        ticketPackageData.value = x.data
        countryFlag.value = x.data.project.branch.country.flag_url
        companyName.value = x.data.name+' | '+x.data.project.branch.company.description
        loading.hide()
      })
})
</script>
