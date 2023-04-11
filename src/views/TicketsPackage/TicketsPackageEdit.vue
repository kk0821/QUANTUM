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
          @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import { useRouter, useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ticketsPackageService from "@/services/tickets_package.service.js"
import { loading } from '@/store/loading'
import { notifyError } from "@/utils/notify_error.ts";
import { notifySuccess } from "@/utils/notify_success";
import TicketsPackageForm from '@/views/TicketsPackage/TicketsPackageForm.vue'

const route = useRoute()
const router = useRouter()

const ticketPackageData = ref({})
const countryFlag = ref(String)
const companyName = ref("")

//for breadcrumbs
  const trace = [
    { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
    { description: 'Tickets package', pathName: 'TicketsPackageList', isLink: true, current: false },
    { description: 'Edit', pathName: 'TicketsPackageEdit', isLink: false, current: true }
  ]

onBeforeMount( () => {
  loading.show()
  ticketsPackageService.edit(route.params.ticketPackageId)
    .then(x => {
      ticketPackageData.value = x.data
      countryFlag.value = x.data.project.branch.country.flag_url
      companyName.value = x.data.name+' | '+x.data.project.branch.company.description
      loading.hide()
    })
})
const saveData = (event) => {
  ticketsPackageService.save(route.params.ticketPackageId, {
    'ticketsPackage': event.ticketsPackage,
    'details': event.details,
    'expirationDate': event.expirationDate,
    'serviceType': event.serviceType,
    'project': event.project,
    'status': event.status,
  }).then(x => {
      notifySuccess('Update', x.data)
      router.push({ name: "TicketsPackageList" })
    }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
