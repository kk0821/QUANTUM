<template>
  <DataTable
      :value="slaDetails"
      :loading="loading"
      :paginator="false"
      :rowHover="true"
      dataKey="id"
      :scrollable="true"
      responsiveLayout="scroll"
      class="p-datatable-sm z-0"
      columnResizeMode="expand"
  >
    <template #empty>
      No SLA configuration found.
    </template>
    <template #loading>
      <div class="grid place-items-center h-screen">
        <svg role="status" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>
    </template>
    <template #header>
      <div class="lg:flex lg:items-center">
        <div class="lg:flex-auto">
          <h1 class="text-xl font-semibold text-gray-900">SLA Configuration</h1>
          <p class="mt-2 text-sm font-normal text-gray-700">Configuration of the SLA with severities, resolutions and availabilities.</p>
        </div>
        <div class="mt-4 lg:mt-0 lg:ml-16 inline-flex items-center lg:flex-none">
          <button
              v-show="!readOnly"
              type="button"
              @click="openSlaModal()"
              :disabled="!canAddSLAConfiguration"
              v-tooltip.top="'You can add a maximum of 4 severities'"
              class="ml-1 inline-flex items-center justify-center rounded-md border border-transparent bg-amerinode-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amerinode-blue-700 focus:outline-none focus:ring-2 focus:ring-amerinode-blue-500 focus:ring-offset-2 sm:w-auto"
              :class="[ !canAddSLAConfiguration ? 'disabled:opacity-75' : '']"
          >
            <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add new severity to SLA
          </button>
        </div>
      </div>
    </template>
    <ColumnGroup type="header" >
      <Row>
        <Column field="severity" header="Severity" :rowspan="2" style="width: 100px; max-width: 100px;" />
        <Column field="time_response" header="Response" :rowspan="2" style="width: 100px; max-width: 100px;" />
        <Column field="time_recovery" header="Recovery" :rowspan="2" style="width: 100px; max-width: 100px;" />
        <Column header="Resolutions" :colspan="slaResolutions.length" style="width: 440px;" />
        <Column header="Availabilities" :colspan="slaAvailabilities.length" style="width: 275px;" />
        <Column :rowspan="2" header="&nbsp" style="width: 100%;" />
      </Row>
      <Row>
        <Column
            v-for="resolution in slaResolutions"
            :key="resolution.id"
            :header="resolution.name"
            :field="resolution.name"
            style="width: 100px"
        />
        <Column
            v-for="availability in slaAvailabilities"
            :key="availability.id"
            :header="availability.name"
            :field="availability.name"
        />
      </Row>
    </ColumnGroup>
    <Column field="severity" style="min-width: 100px; max-width: 100px;">
      <template #body="{data}">
        {{ data.severity.code }}
      </template>
    </Column>
    <Column field="time_response" style="min-width: 100px; max-width: 100px;">
      <template #body="{data}">
        {{ data.time_response }}&nbsp;
        {{ data.time_response_unit.nomenclature }}
      </template>
    </Column>
    <Column field="time_recovery" style="min-width: 100px; max-width: 100px;">
      <template #body="{data}">
        {{ data.time_recovery }}&nbsp;
        {{ data.time_recovery_unit.nomenclature }}
      </template>
    </Column>
    <Column
        v-for="resolution in slaResolutions"
        :key="resolution.id"
        :field="resolution.name"
        style="min-width: 110px; max-width: 110px;"
    >
      <template #body="{data}">
        <div class="flex flex-col">
          <div v-for="r in data.resolutions.filter(r => r.name === resolution.name)" class="text-xs">
            {{ r.time }} {{ r.unit.nomenclature }}<span v-if="r.precision">, {{ r.precision }}%</span>
            <br/>
          </div>
        </div>
      </template>
    </Column>
    <Column
        v-for="availability in slaAvailabilities"
        :key="availability.id"
        :field="availability.name"
        style="min-width: 90px; max-width: 90px;"
    >
      <template #body="{data}">
        <span v-for="a in data.availabilities.filter(a => a.name === availability.name)">
          {{ a.unit.name }}
        </span>
      </template>
    </Column>
    <Column :exportable="false">
      <template #body="slotProps">
        <div class="ml-4 flex items-center md:ml-6">
          <button type="button" v-show="!readOnly" @click="openSlaModal(slotProps.data)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
            <PencilIcon class="h-6 w-6" aria-hidden="true" />
            <span class="sr-only">edit</span>
          </button>
          <button type="button" v-show="!readOnly" @click="confirmDelete(slotProps.data)" class="bg-white rounded-full p-1 mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerinode-blue-500">
            <TrashIcon class="h-6 w-6" aria-hidden="true" />
            <span class="sr-only">delete</span>
          </button>
        </div>
      </template>
    </Column>
  </DataTable>

  <dialog-confirm
      :showDialog="openDialogConfirm"
      :title="'Delete SLA configuration'"
      :message="messageDelete"
      @executeAction="deleteRegister"
      @closeDialog="closeDeleteDialog"
  />

  <DynamicDialog />
</template>
<script setup>
import {ref, onMounted, onBeforeUpdate, computed} from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Button from 'primevue/button';
import { useDialog } from 'primevue/usedialog';
import DynamicDialog from 'primevue/dynamicdialog';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import DialogConfirm from '@/components/DialogConfirm.vue'
import SlaConfigurationForm from '@/views/Sla/SlaConfigurationForm.vue'

const slaDetail = ref({})
const loading = ref(true)
const mode = ref('')
const openDialogConfirm = ref(false)
const messageDelete = ref("")
const dialog = useDialog();

const props = defineProps({
  details: {
    type: Array
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

const slaDetails = ref([])
const emit = defineEmits(['change'])

onMounted(() => {
  loading.value = false
})

onBeforeUpdate( () => {
  slaDetails.value = props.details
})

const slaAvailabilities = computed(() =>
  slaDetails.value.length
      ? slaDetails.value[0].availabilities
      : []
)
const slaResolutions = computed(() =>
    slaDetails.value.length
        ? slaDetails.value[0].resolutions.reduce((a, b) => {
          if (!a.length || a[a.length - 1].name !== b.name) {
            a.push(b)
          }
          return a
        }, [])
        : []
)

const canAddSLAConfiguration = computed(() =>
    slaDetails.value.length
        ? slaDetails.value.length < 4
        : true
)

const titleModal = computed(() =>
    slaDetail.value.severity ? 'SLA configuration - Severity '+slaDetail.value.severity.code : 'New SLA configuration'
)

const sendData = () => {
  emit('change', { slaDetails: slaDetails.value })
}

const closeDeleteDialog = () => {
  openDialogConfirm.value = false
}

const deleteRegister = () => {
  const idx = slaDetails.value.findIndex((item) =>  item.id === slaDetail.value.id)
  slaDetails.value.splice(idx, 1)
  closeDeleteDialog()
}

function confirmDelete(data) {
  messageDelete.value = "Are you sure you want to delete the SLA configuration for severity "+data.severity.code+"?"
  slaDetail.value = Object.assign({}, data)
  openDialogConfirm.value = true
}

function openSlaModal(data = {}) {

  slaDetail.value = Object.assign({}, data)
  mode.value = slaDetail.value.severity ? 'edit': 'new'
  const severities = slaDetails.value.map( r => r.severity.id)

  const dialogRef = dialog.open(SlaConfigurationForm, {
    props: {
      header: titleModal,
      style: {
        width: '80vw',
      },
      breakpoints:{
        '960px': '65vw',
        '640px': '90vw'
      },
      modal: true
    },
    data: {
      slaDetail: slaDetail.value,
      severitiesRegistered: severities,
      mode: mode.value
    },

    onClose: (options) => {
      const data = options.data;
      if (data) {

        switch (mode.value) {
          case 'new':
            const newRow = Object.assign({}, data.sla)
            slaDetails.value.push(newRow)
            break;
          case 'edit':

            const idx = slaDetails.value.findIndex( item => item.severity.code === data.sla.severity.code)
            slaDetails.value[idx].time_recovery = data.sla.time_recovery
            slaDetails.value[idx].time_response = data.sla.time_response
            slaDetails.value[idx].time_recovery_unit = data.sla.time_recovery_unit
            slaDetails.value[idx].time_response_unit = data.sla.time_response_unit
            slaDetails.value[idx].resolutions = []
            for(const item of data.sla.resolutions) {
              slaDetails.value[idx].resolutions.push(item)
            }
            slaDetails.value[idx].availabilities = []
            for(const item of data.sla.availabilities) {
              slaDetails.value[idx].availabilities.push(item)
            }
            break;
        }
      }
    }
  });
}
</script>
<style>
  .p-dialog-mask {
    z-index: 10 !important;
  }
</style>
