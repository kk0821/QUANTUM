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
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  CubeIcon,
  LifebuoyIcon,
  Bars4Icon,
  FlagIcon,
  SwatchIcon,
  ListBulletIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
  Bars3BottomLeftIcon
} from '@heroicons/vue/24/outline'

let trace = [
  { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
  { description: 'Parametric', pathName: 'ParametricPage', isLink: true, current: true }
]

const actions = [
  {
    title: 'Countries',
    href: 'parametric/countries',
    icon: GlobeAltIcon,
    description: 'Administration of countries where the company is present'
  },
  {
    title: 'Companies',
    href: 'parametric/companies',
    icon: BuildingOfficeIcon,
    description: 'The companies to which Amerinode provides its services',
  },
  {
    title: 'Technologies',
    href: 'parametric/technologies',
    icon: CpuChipIcon,
    description: 'Technologies on which Amerinode offers its software or hardware services',
  },
  {
    title: 'OEM',
    href: 'parametric/oems',
    icon: CubeIcon,
    description: 'List of brands or OEMs to which we provide services',
  },
  {
    title: 'Service types',
    href: 'parametric/service-types',
    icon: LifebuoyIcon,
    description: 'Types of services we provide',
  },
  {
    title: 'Project types',
    href: 'parametric/project-types',
    icon: LifebuoyIcon,
    description: 'Types of projects we provide',
  },
  {
    title: 'Status',
    href: 'parametric/statuses',
    icon: Bars4Icon,
    description: 'All status available and categorized by modules',
  },
  {
    title: 'Severities',
    href: 'parametric/severities',
    icon: FlagIcon,
    description: 'All severities available',
  },
  {
    title: 'Impacted services',
    href: 'parametric/impacted-services',
    icon: SwatchIcon,
    description: 'All impacted services available when a ticket is being created',
  },
  {
    title: 'Categories',
    href: 'parametric/categories',
    icon: ListBulletIcon,
    description: 'Categories to classify tickets, operational and resolution type',
  },
  {
    title: 'Segments',
    href: 'parametric/segments',
    icon: AcademicCapIcon,
    description: 'Segments to classify items master',
  },
  {
    title: 'Controller Types',
    href: 'parametric/controller-types',
    icon: AdjustmentsHorizontalIcon,
    description: 'Controller Types to classify items master',
  },
  {
    title: 'Failure Sources',
    href: 'parametric/failure/sources',
    icon: ExclamationTriangleIcon,
    description: 'City of origin of the failure, grouped by branches'
  },
  {
    title: 'Delivery Sources',
    href: 'parametric/delivery/sources',
    icon: ShoppingCartIcon,
    description: 'City of origin of the delivery source, grouped by branches'
  },
  {
    title: 'Income Types',
    href: 'parametric/income-types',
    icon: Bars3BottomLeftIcon,
    description: 'Description'
  },
  {
    title: 'Equipment Types',
    href: 'parametric/equipment-types',
    icon: Bars3BottomLeftIcon,
    description: 'Description'
  },
  {
    title: 'Failure Types',
    href: 'parametric/failure-types',
    icon: Bars3BottomLeftIcon,
    description: 'Description'
  },
  {
    title: 'Resolution Types',
    href: 'parametric/resolution-types',
    icon: Bars3BottomLeftIcon,
    description: 'Description'
  },
  {
    title: 'Substages',
    href: 'parametric/substages',
    icon: Bars3BottomLeftIcon,
    description: 'Description'
  },
  {
    title: 'Failures',
    href: 'parametric/failures',
    icon: Bars3BottomLeftIcon,
    description: 'Description'
  }
]
</script>
