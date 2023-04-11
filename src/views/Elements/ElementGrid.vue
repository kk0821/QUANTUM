<template>
  <div>
    <div class="px-4 py-4 sm:px-6 lg:px-8">
      <breadcrumbs :trace-route="trace" />
      <grid-action :list-actions="actions" />
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import GridAction from '@/components/GridAction.vue'
import {
  CubeTransparentIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  MapPinIcon,
  ServerStackIcon,
  CpuChipIcon,
} from '@heroicons/vue/24/outline'

let trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Elements', pathName: 'ElementsPage', isLink: true, current: true }
]

const actions = [
  {
    title: 'Network element',
    href: 'elements/networks',
    icon: CubeTransparentIcon,
    description: 'Administration of network elements'
  },
  {
    title: 'Controllers',
    href: 'elements/controllers',
    icon: ServerStackIcon,
    description: 'Administration of controllers by technology, oem and branch',
  },
  {
    title: 'Sites',
    href: 'elements/sites',
    icon: BuildingOffice2Icon,
    description: 'Administration of sites by oem and branch',
  },
  {
    title: 'Locations',
    href: 'elements/locations',
    icon: MapPinIcon,
    description: 'Administration of locations by branch',
  },
  {
    title: 'Warehouse',
    href: 'elements/warehouse',
    icon: BuildingOfficeIcon,
    description: 'Administration of warehouse by branch',
  },
  {
    title: 'Items Master',
    href: 'elements/items-master',
    icon: CpuChipIcon,
    description: 'Administration of items master by branch',
  }
]
</script>
