<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New project</h1>
        </div>
      </div>
      <div class="mx-auto">
        <ProjectForm
          :project="projectData"
          @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"
import projectService from "@/services/project.service"
import { loading } from '@/store/loading'
import {notifySuccess} from "@/utils/notify_success";
import {notifyError} from "@/utils/notify_error";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ProjectForm from '@/views/Projects/ProjectForm.vue'

const router = useRouter()
const projectData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Projects', pathName: 'ProjectList', isLink: true, current: false },
  { description: 'Create', pathName: 'ProjectCreate', isLink: false, current: true }
]

const saveData = (event) => {
  projectService.save(0, {
    project: event.project,
    project_type: event.project_type,
    network_elements: event.network_elements,
    country: event.country,
    company: event.company,
    status: event.status,
    projectSLA: event.projectSLA
  }).then(x => {
    notifySuccess('Create', x.data)
    router.push({ name: "ProjectList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}
</script>
