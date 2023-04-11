<template>
  <main>
    <div v-show="!loading.state" class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="mx-auto">
        <breadcrumbs :trace-route="trace" />
        <div class="pb-5 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 pt-4">New category</h1>
        </div>
      </div>
      <div class="mx-auto">
        <CategoryForm
            :category="categoryData"
            @save="saveData" />
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"
import { loading } from '@/store/loading'
import { notifySuccess } from "@/utils/notify_success";
import { notifyError } from "@/utils/notify_error";
import categoryService from "@/services/category.service"
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import CategoryForm from '@/views/Parametric/Categories/CategoryForm.vue'

const router = useRouter()
const categoryData = ref({})

const trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: false },
  { description: 'Categories', pathName: 'CategoryList', isLink: true, current: false },
  { description: 'Create', pathName: 'CategoryCreate', isLink: false, current: true }
]

const saveData = (event) => {

  categoryService.save(0, {
    category: event.category,
    module: event.module,
    category_type: event.category_type,
    parent: event.parent,
    status: event.status
  }).then(x => {
    notifySuccess('Create', x.data)
    router.push({ name: "CategoryList" })
  }).catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
}

</script>
