<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New tickets package</h1>
        </div>
      </div>
      <div class="mx-auto">
        <TicketsPackageForm
          :tickets-package="TicketPackageData"
          @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ticketsPackageService from "@/services/tickets_package.service.js"
import { loading } from '@/store/loading'
import { notifyError } from "@/utils/notify_error.ts";
import { notifySuccess } from "@/utils/notify_success";
import TicketsPackageForm from '@/views/TicketsPackage/TicketsPackageForm.vue'

const router = useRouter()
const TicketPackageData = ref({})
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Tickets package', pathName: 'TicketsPackageList', isLink: true, current: false },
  { description: 'Create', pathName: 'TicketsPackageCreate', isLink: false, current: true }
]

const saveData = (event) => {
  ticketsPackageService.save(0, {
    'ticketsPackage': event.ticketsPackage,
    'details': event.details,
    'expirationDate': event.expirationDate,
    'serviceType': event.serviceType,
    'project': event.project,
    'status': event.status,
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "TicketsPackageList" })
  }).catch(err =>  notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
