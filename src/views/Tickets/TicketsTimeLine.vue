<template>
  <FormPanel
    title="Status history"
    sub-title="It reflects the status changes that the ticket has had in chronological order"
    :rows="[
      { label: 'time-line', col: 6 }
    ]"
    separation canHidden default-hidden
  >
    <template #time-line>
        <TimeLine
          :timeline="statusTimeLine"
        />
    </template>
  </FormPanel>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'

import {
  PlusIcon, TrashIcon, UsersIcon,
  PauseIcon, PlayIcon, ForwardIcon, CheckBadgeIcon, ShieldCheckIcon
} from '@heroicons/vue/24/outline'

import FormPanel from '@/components/FormPanel.vue'
import ticketsService from '@/services/tickets.service.js'
import TimeLine from '@/components/TimeLine.vue'
import { formatDate } from '@/utils/format_date.ts'
import { loading } from '@/store/loading'

const props = defineProps({
  ticketId: {
    type: Number
  }
})

const statusTimeLine = ref([])
const statuses = {
  'New': {
    icon: PlusIcon,
    iconBackground: 'bg-green-400',
  },
  'In Progress': {
    icon: PlayIcon,
    iconBackground: 'bg-blue-400',
  },
  'Restored': {
    icon: ForwardIcon,
    iconBackground: 'bg-blue-400',
  },
  'Resolved': {
    icon: CheckBadgeIcon,
    iconBackground: 'bg-green-400',
  },
  'Closed': {
    icon: ShieldCheckIcon,
    iconBackground: 'bg-green-400',
  },
  'Pending': {
    icon: PauseIcon,
    iconBackground: 'bg-gray-400',
  },
  'Pause Restored': {
    icon: PauseIcon,
    iconBackground: 'bg-gray-400',
  },
  'Pause Resolved': {
    icon: PauseIcon,
    iconBackground: 'bg-gray-400',
  },
  'Cancelled': {
    icon: TrashIcon,
    iconBackground: 'bg-red-400',
  },
  'Assigned': {
    icon: UsersIcon,
    iconBackground: 'bg-blue-400',
  }
}

onBeforeMount( () => {
  loading.show()
  ticketsService.statusHistory(props.ticketId)
    .then((x) => {
      x.data.forEach(item => {
        statusTimeLine.value.push({
          content: [
            { strong: item.status.description },
            { text: item.note },
            { strong: `Report by ${item.reported_by.name} (${item.reported_by.email})` },
          ],
          datetime: item.created_at_tz,
          date: formatDate(item.created_at_tz, true, true) + '<br/>' +(item.due_date_tz ? `${formatDate(item.due_date_tz, true, true)}`: ''),
          ...( statuses[item.status.description] || {} )
        })
      })
      loading.hide()
    })
})
</script>
