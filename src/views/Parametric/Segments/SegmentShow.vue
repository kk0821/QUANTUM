<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">Segment: {{ segmentName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <SegmentForm
          v-if="segmentData.id"
          :segment="segmentData"
          :can-edit="false" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import SegmentService from '@/services/segment.service'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import SegmentForm from '@/views/Parametric/Segments/SegmentForm.vue'

const route = useRoute()
const segmentData = ref({})
const segmentName = ref('')

//for breadcrumbs
const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Segments', pathName: 'SegmentListPage', isLink: true, current: false },
  { description: 'Show', pathName: 'SegmentShow', isLink: false, current: true }
]
onBeforeMount( () => {
  SegmentService.get(route.params.segmentId)
    .then(x => {
      segmentData.value = x.data
      segmentName.value = x.data.name
    }).catch(err => notifyError((err.code === 'ERR_BAD_REQUEST') ? err.response.data.message : err.message) )
})
</script>
