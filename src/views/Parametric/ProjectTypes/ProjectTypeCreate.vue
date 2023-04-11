<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New project type</h1>
        </div>
      </div>
      <div class="mx-auto">
        <ProjectTypeForm
            :project-type="projectTypeData"
            @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import {useRouter} from "vue-router"
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'
import projectTypeService from "@/services/project_type.service"
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ProjectTypeForm from '@/views/Parametric/ProjectTypes/ProjectTypeForm.vue'

const router = useRouter()
const projectTypeData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Project types', pathName: 'ProjectTypeList', isLink: true, current: false },
  { description: 'Create', pathName: 'ProjectCreate', isLink: false, current: true }
]

const saveData = (event) => {
  projectTypeService.save(0, {
    project_type: event.project_type,
    service_type: event.service_type,
    status: event.status
  }).then(x => {
    notifySuccess('Created', x.data)
    router.push({ name: "ProjectTypeList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
