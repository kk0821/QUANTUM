<template>
  <div class="flow-root">
    <ul role="list" class="-mb-8">
      <li v-for="(event, eventIdx) in timeline" :key="eventIdx">
        <div class="relative pb-8">
          <span v-if="eventIdx !== timeline.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
          <div class="relative flex space-x-3">
            <div>
              <span :class="[event.iconBackground, 'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white']">
                <component :is="event.icon" class="h-5 w-5 text-white" aria-hidden="true" />
              </span>
            </div>
            <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
              <div>
                <p class="text-sm text-gray-500">
                  <span v-for="(content, idx) in event.content" :key="idx">
                    <span v-if="idx">, </span>
                    <span v-if="content.text">{{ content.text }}</span>
                    <strong v-else-if="content.strong">{{ content.strong }}</strong>
                  </span>
                </p>
              </div>
            </div>
            <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
              <div class="whitespace-nowrap text-right text-sm text-gray-500">
                <time :datetime="event.datetime" v-html="event.date"></time>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>

const props = defineProps({
  timeline: {
    type: Array
  }
})
</script>
