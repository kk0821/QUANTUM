<template>
  <div class="py-4 sm:mt-0">
    <div class="md:grid md:grid-cols-4 md:gap-4">
      <div class="md:col-span-2">
        <div class="px-4 sm:px-0" v-if="canHidden">
          <div class="flex items-center">
            <div>
              <Switch
                  v-model="show"
                  @click="show = !show"
                  :class="[show ? 'bg-amerinode-blue-600' : 'bg-gray-200', 'relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amerinode-blue-500 focus:ring-offset-2']"
              >
                <span class="sr-only">Expand info</span>
                <span :class="[show ? 'translate-x-6' : 'translate-x-0', 'pointer-events-none relative inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                  <span :class="[show ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                    <EyeSlashIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                  <span :class="[show ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                    <EyeIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </span>
              </Switch>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium leading-6 text-gray-900">{{ title }}</h3>
              <p class="mt-1 text-sm text-gray-600">{{ subTitle }}</p>
            </div>
          </div>
        </div>
        <div class="px-4 sm:px-0" v-else>
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            {{ title }}
          </h3>
          <p class="mt-1 text-sm text-gray-600">{{ subTitle }}</p>
        </div>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-4" v-show="show">
        <form action="#" method="POST">
          <div class="shadow sm:rounded-md">
            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="grid" :class="[classGrip]">
                <template v-for="(row, $idx) in formatRows" :key="$idx">
                  <div
                    :class="{
                      'col-span-1': row.col === 'col-span-1',
                      'col-span-2': row.col === 'col-span-2',
                      'col-span-3': row.col === 'col-span-3',
                      'col-span-4': row.col === 'col-span-4',
                      'col-span-5': row.col === 'col-span-5',
                      'col-span-6': row.col === 'col-span-6',
                      'sm:col-span-1': row.sm === 1,
                      'sm:col-span-2': row.sm === 2,
                      'sm:col-span-3': row.sm === 3,
                      'sm:col-span-4': row.sm === 4,
                      'sm:col-span-5': row.sm === 5,
                      'sm:col-span-6': row.sm === 6,
                      'md:col-span-1': row.md === 1,
                      'md:col-span-2': row.md === 2,
                      'md:col-span-3': row.md === 3,
                      'md:col-span-4': row.md === 4,
                      'md:col-span-5': row.md === 5,
                      'md:col-span-6': row.md === 6,
                      'lg:col-span-1': row.lg === 1,
                      'lg:col-span-2': row.lg === 2,
                      'lg:col-span-3': row.lg === 3,
                      'lg:col-span-4': row.lg === 4,
                      'lg:col-span-5': row.lg === 5,
                      'lg:col-span-6': row.lg === 6,
                    }"
                    v-show="hiddenRows.indexOf(row.label) === -1"
                  >
                    <slot :name="row.label"></slot>
                  </div>
                </template>
              </div>
              <p class="mt-1 text-sm text-gray-600" v-if="!show">{{ formatRows.length }} hidden items</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="hidden sm:block" aria-hidden="true" v-if="separation">
    <div class="py-5">
      <div class="border-t border-gray-200" />
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'
import { Switch } from '@headlessui/vue'

const defaultGrid = {
  cols: 6,
  col: 3
}

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subTitle: {
    type: String,
    default: ''
  },
  rows: {
    type: Array,
    required: true
  },
  hiddenRows: {
    type: Array,
    default () {
      return []
    }
  },
  separation: {
    type: Boolean,
    default: false
  },
  grid: {
    type: Object,
    default () {
      return {
        cols: 6,
        col: 3
      }
    }
  },
  canHidden: {
    type: Boolean,
    default: false
  },
  defaultHidden: {
    type: Boolean,
    default: false
  }
})

const formatRows = ref([])
const classGrip = `grid-cols-${props.grid.cols || defaultGrid.cols} gap-${props.grid.cols || defaultGrid.cols}`
const show = ref(!props.defaultHidden)

onBeforeMount(() => {
  props.rows.forEach((row, idx) => {
    const format = {}
    if (typeof row === 'string') {
      format.label = row
      format.col = props.grid.col || defaultGrid.col
    } else if (typeof row === 'object') {
      if (Array.isArray(row)) {
        return;
      }
      format.label = row.label || `row-${idx}`
      format.col = row.col || props.grid.col || defaultGrid.col
      if (typeof row.query === 'object') {
        format.sm = row.query.sm || ''
        format.md = row.query.md || ''
        format.lg = row.query.lg || ''
      }
    }
    format.col = `col-span-${format.col}`
    formatRows.value.push(format)
  })
})
</script>
