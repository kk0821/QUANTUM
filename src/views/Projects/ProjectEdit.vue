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
          @save="saveData"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import { useRouter, useRoute } from 'vue-router'
import { loading } from '@/store/loading'
import projectService from "@/services/project.service";
import {notifySuccess} from "@/utils/notify_success";
import {notifyError} from "@/utils/notify_error";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ProjectForm from '@/views/Projects/ProjectForm.vue'

const route = useRoute()
const router = useRouter()
const projectData = ref({})
const countryFlag = ref(String)
const companyName = ref("")

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Projects', pathName: 'ProjectList', isLink: true, current: false },
  { description: 'Edit', pathName: 'ProjectEdit', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  projectService.edit(route.params.projectId).then(x => {
    projectData.value = x.data
    countryFlag.value = x.data.branch.country.flag_url
    companyName.value = x.data.name+' | '+x.data.branch.company.description
    loading.hide()
  })
})

const saveData = (event) => {
  projectService.save(route.params.projectId, {
    project: event.project,
    project_type: event.project_type,
    network_elements: event.network_elements,
    country: event.country,
    company: event.company,
    status: event.status,
    projectSLA: event.projectSLA
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "ProjectList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
