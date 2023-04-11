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
        <ProjectForm
          v-if="projectData.id"
          :project="projectData"
          :can-edit="false"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from 'vue-router'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import projectService from "@/services/project.service";
import { loading } from '@/store/loading'
import ProjectForm from '@/views/Projects/ProjectForm.vue'

const route = useRoute()
const projectData = ref({})
const countryFlag = ref(String)
const companyName = ref("")

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Projects', pathName: 'ProjectList', isLink: true, current: false },
  { description: 'Show', pathName: 'ProjectShow', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  projectService.get(route.params.projectId).then(x => {
    projectData.value = x.data
    countryFlag.value = x.data.branch.country.flag_url
    companyName.value = x.data.name+' | '+x.data.branch.company.description
    loading.hide()
  })
})
</script>
