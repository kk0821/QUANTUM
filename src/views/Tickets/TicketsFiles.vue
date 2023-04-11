<template>
  <div>
    <h5>{{ title }}</h5>
    <FileUpload
      v-if="canEdit && (fileLimit - listFiles.length >= 1)"
      :customUpload="true"
      accept=".pdf,.jpg,.jpeg,.bmp,.png,.xls,.xlsx,.doc,.docx,.txt,.csv"
      @uploader="onUpload"
      :multiple="true"
      :maxFileSize="5000000"
      :fileLimit="fileLimit - listFiles.length">
        <template #empty>
          <p>Drag and drop files to here to upload.</p>
        </template>
    </FileUpload>
    <DataTable
      v-if="listFiles.length"
      :value="listFiles"
      :paginator="false"
      dataKey="path"
      :rowHover="true"
      responsiveLayout="scroll"
      :rowClass="rowClass"
    >
      <Column field="name" header="Files">
        <template #body="{ data }">
          <span class="text-sm font-semibold">{{ data.name }}</span>
          <dl v-if="data.type" class="font-normal">
            <dt class="sr-only">Type</dt>
            <dd class="mt-1 truncate text-gray-700">
              <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium uppercase italic"
                    :class="[
                        data.type === 'basic-info' ? 'bg-blue-100 text-blue-700': '',
                        data.type === 'resolved-info' ? 'bg-amber-100 text-amber-800' : '',
                        data.type === 'closed-info' ? 'bg-green-100 text-green-800' : '',
                    ]"
              >
                {{data.type}}
              </span>
            </dd>
          </dl>
        </template>
      </Column>
      <Column :exportable="false">
        <template #body="{ data }">
          <button type="button" @click="($event) => showFile(data, $event)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
            <DocumentArrowDownIcon class="h-6 w-6" aria-hidden="true"/>
            <span class="sr-only">Show</span>
          </button>
          <button
            v-if="canEdit && (!persist || (persist && !data.id))"
            type="button"
            @click="($event) => showDeleteFile(data, $event)"
            class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500"
          >
            <TrashIcon class="h-6 w-6" aria-hidden="true"/>
            <span class="sr-only">Remove</span>
          </button>
        </template>
      </Column>
    </DataTable>
    <dialog-confirm
      :showDialog="fileModal.show"
      title="Delete evidence file"
      :message="fileModal.msg"
      @executeAction="() => deleteFile(fileModal.data)"
      @closeDialog="hideDeleteFile"
    />
  </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'

import { DocumentArrowDownIcon, TrashIcon } from '@heroicons/vue/24/solid'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import FileUpload from 'primevue/fileupload'

import DialogConfirm from '@/components/DialogConfirm.vue'
import ticketsService from '@/services/tickets.service.js'
import { loading } from '@/store/loading'
import { notifyError } from '@/utils/notify_error'
import { notifySuccess } from '@/utils/notify_success'

const listFiles = ref([])
const fileModal = ref({
  show: false,
  msg: '',
  data: undefined
})

const props = defineProps({
  title: {
    type: String
  },
  ticketId: {
    type: Number
  },
  projectId: {
    type: Number
  },
  fileLimit: {
    type: Number
  },
  oldFiles: {
    type: Array
  },
  persist: {
    type: Boolean
  },
  canEdit: {
    type: Boolean
  },
  type: {
    type: String
  }
})

const emit = defineEmits(['change'])

const onUpload = ($event) => {
  ticketsService.uploadFiles(props.projectId, $event.files, props.ticketId || undefined)
    .then(x => {
      listFiles.value.push(...x.data)
      emit('change', { list: listFiles.value })
    })
    .catch(() => notifyError('There was an error uploading the files'))
}

const showFile = (data, $event) => {
  $event.preventDefault()
  ticketsService.showFile(data)
    .then(() => notifySuccess('Success', 'The file has been downloaded successfully'))
    .catch(() => notifyError('There was an error download the files'))
}

const showDeleteFile = (data, $event) => {
  $event.preventDefault()
  if (!data.id) {
    deleteFile(data, $event)
  } else {
    fileModal.value.msg = `Are you sure you want to delete this evidence file? Name: ${data.name}`
    fileModal.value.data = data
    fileModal.value.show = true
  }
}

const hideDeleteFile = () => {
  fileModal.value.msg = ''
  fileModal.value.data = undefined
  fileModal.value.show = false
}

const deleteFile = (data, $event) => {
  if (!data) {
    return;
  }
  if ($event) {
    $event.preventDefault()
  }
  return ticketsService.deleteFile(data)
    .then(x => {
      const idx = listFiles.value.findIndex(item => item.path === data.path)
      listFiles.value.splice(idx, 1)
      emit('change', { list: listFiles.value })
      notifySuccess('Success', x.data)
      hideDeleteFile($event)
    })
    .catch(() => notifyError('There was an error deleting the file.'))
}

const rowClass = (data) => {
  if (!data.type) {
    return undefined
  }
  return data.type === 'basic-info' ? 'bg-amerinode-blue-300' : ( data.type === 'pending-info' ? 'bg-amerinode-blue-500' : undefined)
}

onBeforeMount(() => {
  loading.show()
  if (props.ticketId) {
    props.oldFiles.forEach((file) => {
      listFiles.value.push({id: file.id, path: file.path, name: file.name, persist: props.persist, type: file.type || props.type })
    })
  }
  loading.hide()
})
</script>
<style>
  .p-fileupload-file-thumbnail {
    display: none !important;
  }
  .p-fileupload-file-name {
    padding: 10px 2px;
  }
  .p-fileupload-file-size {
    padding: 1px;
    margin-right: 10px;
  }
  .p-fileupload-file {
    border: 1px solid #f4f4f5;
    border-width: 0 0 1px 0;
    padding-bottom: 10px;
  }
</style>
