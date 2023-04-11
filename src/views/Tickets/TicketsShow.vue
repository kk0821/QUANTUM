<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pt-5 pb-5 border-b border-gray-200">
          <ticket-header v-if="ticketData.id" :ticket="ticketData" :project="project" />
        </div>
      </div>
      <div class="mx-auto">
        <TicketsForm
          v-if="ticketData.id"
          :ticket="ticketData"
          :project="project"
          :ticket-package-id="ticketData.ticketPackageId"
          :old-selectors="oldSelectors"
          :old-files="oldFiles"
          :can-edit="false"
        />
      </div>
      <TicketsTimeLine
        v-if="ticketData.id"
        :ticket-id="ticketData.id"
      />
    </div>
  </main>
</template>
<script setup>
import { useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import TicketHeader from '@/components/TicketHeader.vue'
import { loading } from '@/store/loading'
import TicketsForm from '@/views/Tickets/TicketsForm.vue'
import TicketsTimeLine from '@/views/Tickets/TicketsTimeLine.vue'
import { useTrace } from './composable/trace'
import { useLoadTicket } from './composable/load_ticket'

const route = useRoute()
const trace = useTrace({ description: 'Show', pathName: 'TicketsShow'})
const { ticketData , project, oldSelectors, oldFiles } = useLoadTicket(route.params.ticketId)

</script>
