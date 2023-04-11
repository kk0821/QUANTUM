<template>
  <span
      v-if="status"
      class="inline-flex items-center rounded-full py-1 px-1 text-sm font-medium"
      :class="[
          status.code === 'new' || status.code === 'resolved' || status.code === 'closed' ? 'bg-green-100 text-green-700' : '',
          status.code === 'inprogress' || status.code === 'restored' || status.code === 'assigned' ? 'bg-blue-100 text-blue-700' : '',
          status.code === 'pending' || status.code === 'pause_restored' || status.code === 'pause_resolved' ? 'bg-gray-400 text-white' : '',
          status.code === 'cancelled' ? 'bg-red-100 text-red-800' : '',
      ]"
  >
    <span class="mx-1">{{ status.description }}</span>
    <div
        class="mx-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
        :class="[
          status.code === 'new' || status.code === 'resolved' || status.code === 'closed' ? 'text-green-700' : '',
          status.code === 'inprogress' || status.code === 'restored' || status.code === 'assigned' ? 'text-blue-700' : '',
          status.code === 'pending' || status.code === 'pause_restored' || status.code === 'pause_resolved' ? 'text-white' : '',
          status.code === 'cancelled' ? 'text-red-800' : '',
        ]"
    >
      <span class="sr-only">status ticket</span>
      <component :is="graph.icon" class="h-5 w-5" aria-hidden="true" />
    </div>
  </span>
</template>

<script setup>
import { useStatusTicket } from "@/composables/types";
import { toRefs } from "vue";

const props = defineProps({
  status: {
    type: Object
  }
})
const data = toRefs(props)
const { statuses } = useStatusTicket()
const graph = statuses.value.find(({ name }) => name ===  data.status.value?.code)

</script>
