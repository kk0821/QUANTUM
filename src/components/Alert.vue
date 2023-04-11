<template>
  <div :class="[alertType === 'error'? 'bg-red-50' : (alertType === 'warning' ? 'bg-yellow-50' : 'bg-green-50'), 'rounded-md p-4 shadow']">
    <div class="flex">
      <div class="flex-shrink-0">
        <component :is="infoAlert.icon" :class="[alertType === 'error'? 'text-red-400' : (alertType === 'warning' ? 'text-yellow-400' : 'text-green-400'), 'h-6 w-6']" aria-hidden="true" />
      </div>
      <div class="ml-4">
        <h3 :class="[alertType === 'error'? 'text-red-800' : (alertType === 'warning' ? 'text-yellow-800' : 'text-green-800'), 'text-md font-medium']">{{ infoAlert.title }}</h3>
        <div :class="[alertType === 'error'? 'text-red-700' : (alertType === 'warning' ? 'text-yellow-700' : 'text-green-700'), 'mt-2 text-sm']">
          <div v-if="infoAlert.messages.length === 1">
            <p>{{ infoAlert.messages[0] }}</p>
          </div>
          <div v-else>
            <ul role="list" class="list-disc space-y-1 pl-5">
              <li v-for="message in infoAlert.messages">{{ message }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/vue/20/solid'
import {onBeforeMount, onUpdated, ref, toRefs} from "vue";

const props = defineProps({
  title: {
    type: String,
    default: 'Title'
  },
  message: {
    type: [String, Array],
  },
  alertType: {
    type: String,
    default: 'success'
  }
})
const loaded = ref(false)
const data = toRefs(props)
const infoAlert = ref({
  title: '',
  messages: [],
  icon: {},
})

onUpdated(()=> {
  loadMessages()
})

onBeforeMount(() => {
  infoAlert.value.title = data.title.value
  infoAlert.value.messages = []
  switch (data.alertType.value) {
    case 'warning':
      infoAlert.value.icon = ExclamationTriangleIcon
      break
    case 'error':
      infoAlert.value.icon = XCircleIcon
      break
    default:
      infoAlert.value.icon = CheckCircleIcon
  }
  loadMessages()
})

const loadMessages = () => {
  if (!loaded.value) {
    if (Array.isArray(data.message.value)) {
      for (let i = 0; i < data.message.value.length; i++) {
        infoAlert.value.messages.push(data.message.value[i])
      }
    } else {
      infoAlert.value.messages.push(data.message.value)
    }
    if (infoAlert.value.messages.length) {
      loaded.value = true
    }
  }
}
</script>
