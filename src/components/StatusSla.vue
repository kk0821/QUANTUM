<template>
  <div>
    <span
        class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium uppercase cursor-pointer"
        :class="[
          sla.status === 'on_time' || sla.status === 'sla_fulfilled' ? 'bg-green-100 text-green-800' : '',
          sla.status === 'late' || sla.status === 'sla_breached' ? 'bg-red-100 text-red-800' : '',
          sla.status === 'at_risk' ? 'bg-amber-100 text-amber-800' : '',
          sla.status === 'pause' || sla.status === 'processing_sla' ? 'bg-gray-200 text-gray-800' : '']"
        @click="openSlaModal(ticketId)"
    >
      <div class="flex items-center">
        <div>
          <ArrowPathRoundedSquareIcon v-show="sla.status === 'on_time'" class="h-4 w-4" aria-hidden="true" />
          <CheckIcon v-show="sla.status === 'sla_fulfilled'" class="h-4 w-4" aria-hidden="true" />
          <XMarkIcon v-show="sla.status === 'late' || sla.status === 'sla_breached'" class="h-4 w-4" aria-hidden="true" />
          <BellAlertIcon v-show="sla.status === 'at_risk'" class="h-4 w-4" aria-hidden="true" />
          <PauseIcon v-show="sla.status === 'pause'" class="h-4 w-4" aria-hidden="true" />
          <ClockIcon v-show="sla.status === 'processing_sla'" class="h-4 w-4" aria-hidden="true" />
        </div>
        <div class="ml-1">
          <p class="ml-[2px]">{{sla.running_sla}}</p>
        </div>
      </div>
    </span>
  </div>
</template>
<script setup>
import {h, toRefs} from 'vue';
import SlaStatusForm from '@/views/Sla/SlaStatusForm.vue'
import {useDialog} from "primevue/usedialog";
import Button from "primevue/button";
import { BellAlertIcon, CheckIcon, PauseIcon, ClockIcon, XMarkIcon, ArrowPathRoundedSquareIcon } from '@heroicons/vue/24/outline'

const dialog = useDialog();

const props = defineProps({
  ticketId: {
    type: Number,
    default: 0
  },
  sla: {
    type: Object,
    required: true
  }
})
const data = toRefs(props)

function openSlaModal() {

  const dialogRef = dialog.open(SlaStatusForm, {
    props: {
      header: 'SLA Status',
      style: {
        width: '75vw',
      },
      modal: true,
    },
    data: {
      ticketId: data.ticketId.value
    },
    templates: {
      footer: () => {
        return [
          h(Button, { label: "Close", icon: "pi pi-times", onClick: () => dialogRef.close(), autofocus: true})
        ]
      }
    },
  });
}

</script>
