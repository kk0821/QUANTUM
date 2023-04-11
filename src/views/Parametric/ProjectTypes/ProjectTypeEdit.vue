<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">{{ projectTypeName }}</h1>
        </div>
      </div>
      <div class="mx-auto">
        <ProjectTypeForm
            v-if="projectTypeData.id"
            :project-type="projectTypeData"
            @save="saveData"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import { useRouter, useRoute } from 'vue-router'
import projectTypeService from "@/services/project_type.service";
import { loading } from '@/store/loading'
import { notifySuccess } from "@/utils/notify_success";
import { notifyError } from "@/utils/notify_error";
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ProjectTypeForm from '@/views/Parametric/ProjectTypes/ProjectTypeForm.vue'

const route = useRoute()
const router = useRouter()
const projectTypeData = ref({})
const projectTypeName = ref(String)

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Project types', pathName: 'ProjectTypeList', isLink: true, current: false },
  { description: 'Edit', pathName: 'ProjectTypeEdit', isLink: false, current: true }
]

onBeforeMount( () => {
  loading.show()
  projectTypeService.edit(route.params.projectTypeId).then(x => {
    projectTypeData.value = x.data
    projectTypeName.value = x.data.description
    loading.hide()
  })
})

const saveData = (event) => {
  projectTypeService.save(route.params.projectTypeId, {
    project_type: event.project_type,
    service_type: event.service_type,
    status: event.status
  }).then(x => {
    notifySuccess('Update', x.data)
    router.push({ name: "ProjectTypeList" })
  }).catch(err => notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) )
}

</script>
