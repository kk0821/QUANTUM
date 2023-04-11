import { createRouter, createWebHistory } from 'vue-router'
import { encryptStorage } from "@/services/http.service";
import { notify } from "notiwind";

const LayoutAuth = () => import('@/layouts/LayoutAuth.vue');
const LayoutAdmin = () => import('@/layouts/LayoutAdmin.vue');

const About = () => import('@/views/AboutPage.vue');

let defaultPage = localStorage.getItem('DefaultPage') || 'DashboardPage';

const routes = [
  {
    path: '/',
    name: 'Root',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        name: 'HomePage',
        redirect: { name: localStorage.getItem('DefaultPage') || 'DashboardPage' }
      }
    ],
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: LayoutAdmin,
    children: [{
      path: '',
      component: () => import('@/views/HomePage.vue'),
      name: 'DashboardPage',
      meta: {
        page: 'DashboardPage'
      }
    }]
  },
  {
    path: '/parametric',
    name: 'Parametric',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('@/views/Parametric/ParametricGrid.vue'),
        name: 'ParametricPage',
        meta: {
          page: 'ParametricPage'
        },
      },
      {
        path: 'technologies',
        name: 'TechnologyList',
        component: () => import('@/views/Parametric/Technologies/TechnologyListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'technologies/create',
        name: 'TechnologyCreate',
        component: () => import('@/views/Parametric/Technologies/TechnologyCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'technologies/:technologyId(\\d+)',
        name: 'TechnologyShow',
        component: () => import('@/views/Parametric/Technologies/TechnologyShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'technologies/:technologyId(\\d+)/edit',
        name: 'TechnologyEdit',
        component: () => import('@/views/Parametric/Technologies/TechnologyEdit.vue'),
        meta: {
          page: 'ParametricPage'
        },
      },
      {
        path: 'companies',
        name: 'CompanyList',
        component: () => import('@/views/Parametric/Companies/CompanyListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'companies/create',
        name: 'CompanyCreate',
        component: () => import('@/views/Parametric/Companies/CompanyCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'companies/:companyId(\\d+)',
        name: 'CompanyShow',
        component: () => import('@/views/Parametric/Companies/CompanyShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'companies/:companyId(\\d+)/edit',
        name: 'CompanyEdit',
        component: () => import('@/views/Parametric/Companies/CompanyEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'oems',
        name: 'OemList',
        component: () => import('@/views/Parametric/Oems/OemListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'oems/create',
        name: 'OemCreate',
        component: () => import('@/views/Parametric/Oems/OemCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'oems/:oemId(\\d+)',
        name: 'OemShow',
        component: () => import('@/views/Parametric/Oems/OemShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'oems/:oemId(\\d+)/edit',
        name: 'OemEdit',
        component: () => import('@/views/Parametric/Oems/OemEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'statuses',
        name: 'StatusList',
        component: () => import('@/views/Parametric/Statuses/StatusListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'statuses/create',
        name: 'StatusCreate',
        component: () => import('@/views/Parametric/Statuses/StatusCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'statuses/:statusId(\\d+)',
        name: 'StatusShow',
        component: () => import('@/views/Parametric/Statuses/StatusShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'statuses/:statusId(\\d+)/edit',
        name: 'StatusEdit',
        component: () => import('@/views/Parametric/Statuses/StatusEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'countries',
        name: 'CountryList',
        component: () => import('@/views/Parametric/Countries/CountryListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'countries/create',
        name: 'CountryCreate',
        component: () => import('@/views/Parametric/Countries/CountryCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'countries/:countryId(\\d+)',
        name: 'CountryShow',
        component: () => import('@/views/Parametric/Countries/CountryShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'countries/:countryId(\\d+)/edit',
        name: 'CountryEdit',
        component: () => import('@/views/Parametric/Countries/CountryEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'service-types',
        name: 'ServiceTypeList',
        component: () => import('@/views/Parametric/ServiceTypes/ServiceTypeListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'service-types/create',
        name: 'ServiceTypeCreate',
        component: () => import('@/views/Parametric/ServiceTypes/ServiceTypeCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'service-types/:serviceTypeId(\\d+)',
        name: 'ServiceTypeShow',
        component: () => import('@/views/Parametric/ServiceTypes/ServiceTypeShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'service-types/:serviceTypeId(\\d+)/edit',
        name: 'ServiceTypeEdit',
        component: () => import('@/views/Parametric/ServiceTypes/ServiceTypeEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'project-types',
        name: 'ProjectTypeList',
        component: () => import('@/views/Parametric/ProjectTypes/ProjectTypeListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'project-types/create',
        name: 'ProjectTypeCreate',
        component: () => import('@/views/Parametric/ProjectTypes/ProjectTypeCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'project-types/:projectTypeId(\\d+)',
        name: 'ProjectTypeShow',
        component: () => import('@/views/Parametric/ProjectTypes/ProjectTypeShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'project-types/:projectTypeId(\\d+)/edit',
        name: 'ProjectTypeEdit',
        component: () => import('@/views/Parametric/ProjectTypes/ProjectTypeEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'controller-types',
        name: 'ControllerTypeListPage',
        component: () => import('@/views/Parametric/ControllerType/ControllerTypeListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'controller-types/create',
        name: 'ControllerTypeCreate',
        component: () => import('@/views/Parametric/ControllerType/ControllerTypeCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'controller-types/:controllerTypeId(\\d+)',
        name: 'ControllerTypeShow',
        component: () => import('@/views/Parametric/ControllerType/ControllerTypeShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'controller-types/:controllerTypeId(\\d+)/edit',
        name: 'ControllerTypeEdit',
        component: () => import('@/views/Parametric/ControllerType/ControllerTypeEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'segments',
        name: 'SegmentListPage',
        component: () => import('@/views/Parametric/Segments/SegmentListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'segments/create',
        name: 'SegmentCreate',
        component: () => import('@/views/Parametric/Segments/SegmentCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'segments/:segmentId(\\d+)',
        name: 'SegmentShow',
        component: () => import('@/views/Parametric/Segments/SegmentShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'segments/:segmentId(\\d+)/edit',
        name: 'SegmentEdit',
        component: () => import('@/views/Parametric/Segments/SegmentEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'severities',
        name: 'SeverityList',
        component: () => import('@/views/Parametric/Severities/SeverityListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'severities/create',
        name: 'SeverityCreate',
        component: () => import('@/views/Parametric/Severities/SeverityCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'severities/:severityId(\\d+)',
        name: 'SeverityShow',
        component: () => import('@/views/Parametric/Severities/SeverityShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'severities/:severityId(\\d+)/edit',
        name: 'SeverityEdit',
        component: () => import('@/views/Parametric/Severities/SeverityEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'impacted-services',
        name: 'ImpactedServiceList',
        component: () => import('@/views/Parametric/ImpactedServices/ImpactedServiceListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'impacted-services/create',
        name: 'ImpactedServiceCreate',
        component: () => import('@/views/Parametric/ImpactedServices/ImpactedServiceCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'impacted-services/:impactedServiceId(\\d+)',
        name: 'ImpactedServiceShow',
        component: () => import('@/views/Parametric/ImpactedServices/ImpactedServiceShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'impacted-services/:impactedServiceId(\\d+)/edit',
        name: 'ImpactedServiceEdit',
        component: () => import('@/views/Parametric/ImpactedServices/ImpactedServiceEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'categories',
        name: 'CategoryList',
        component: () => import('@/views/Parametric/Categories/CategoryListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'categories/create',
        name: 'CategoryCreate',
        component: () => import('@/views/Parametric/Categories/CategoryCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'categories/:categoryId(\\d+)',
        name: 'CategoryShow',
        component: () => import('@/views/Parametric/Categories/CategoryShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'categories/:categoryId(\\d+)/edit',
        name: 'CategoryEdit',
        component: () => import('@/views/Parametric/Categories/CategoryEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: ':type/sources',
        name: 'CitySourceList',
        component: () => import('@/views/Parametric/CitySources/CitySourceListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: ':type/source/create',
        name: 'CitySourceCreate',
        component: () => import('@/views/Parametric/CitySources/CitySourceCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: ':type/source/:citySourceId(\\d+)',
        name: 'CitySourceShow',
        component: () => import('@/views/Parametric/CitySources/CitySourceShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: ':type/source/:citySourceId(\\d+)/edit',
        name: 'CitySourceEdit',
        component: () => import('@/views/Parametric/CitySources/CitySourceEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'income-types',
        name: 'IncomeTypesList',
        component: () => import('@/views/Parametric/IncomeTypes/IncomeTypeListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'income-type/create',
        name: 'IncomeTypeCreate',
        component: () => import('@/views/Parametric/IncomeTypes/IncomeTypeCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'income-type/:incomeTypeId(\\d+)',
        name: 'IncomeTypeShow',
        component: () => import('@/views/Parametric/IncomeTypes/IncomeTypeShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'income-type/:incomeTypeId(\\d+)/edit',
        name: 'IncomeTypeEdit',
        component: () => import('@/views/Parametric/IncomeTypes/IncomeTypeEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'equipment-types',
        name: 'EquipmentTypesList',
        component: () => import('@/views/Parametric/EquipmentTypes/EquipmentTypeListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'equipment-type/create',
        name: 'EquipmentTypeCreate',
        component: () => import('@/views/Parametric/EquipmentTypes/EquipmentTypeCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'equipment-type/:equipmentTypeId(\\d+)',
        name: 'EquipmentTypeShow',
        component: () => import('@/views/Parametric/EquipmentTypes/EquipmentTypeShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'equipment-type/:equipmentTypeId(\\d+)/edit',
        name: 'EquipmentTypeEdit',
        component: () => import('@/views/Parametric/EquipmentTypes/EquipmentTypeEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'failure-types',
        name: 'FailureTypesList',
        component: () => import('@/views/Parametric/FailureTypes/FailureTypeListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'failure-type/create',
        name: 'FailureTypeCreate',
        component: () => import('@/views/Parametric/FailureTypes/FailureTypeCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'failure-type/:failureTypeId(\\d+)',
        name: 'FailureTypeShow',
        component: () => import('@/views/Parametric/FailureTypes/FailureTypeShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'failure-type/:failureTypeId(\\d+)/edit',
        name: 'FailureTypeEdit',
        component: () => import('@/views/Parametric/FailureTypes/FailureTypeEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'resolution-types',
        name: 'ResolutionTypesList',
        component: () => import('@/views/Parametric/ResolutionTypes/ResolutionTypeListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'resolution-type/create',
        name: 'ResolutionTypeCreate',
        component: () => import('@/views/Parametric/ResolutionTypes/ResolutionTypeCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'resolution-type/:resolutionTypeId(\\d+)',
        name: 'ResolutionTypeShow',
        component: () => import('@/views/Parametric/ResolutionTypes/ResolutionTypeShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'resolution-type/:resolutionTypeId(\\d+)/edit',
        name: 'ResolutionTypeEdit',
        component: () => import('@/views/Parametric/ResolutionTypes/ResolutionTypeEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'substages',
        name: 'SubstagesList',
        component: () => import('@/views/Parametric/Substages/SubstageListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'substage/create',
        name: 'SubstageCreate',
        component: () => import('@/views/Parametric/Substages/SubstageCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'substage/:substageId(\\d+)',
        name: 'SubstageShow',
        component: () => import('@/views/Parametric/Substages/SubstageShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'substage/:substageId(\\d+)/edit',
        name: 'SubstageEdit',
        component: () => import('@/views/Parametric/Substages/SubstageEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'failures',
        name: 'FailuresList',
        component: () => import('@/views/Parametric/Failures/FailureListPage.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'failure/create',
        name: 'FailureCreate',
        component: () => import('@/views/Parametric/Failures/FailureCreate.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'failure/:failureId(\\d+)',
        name: 'FailureShow',
        component: () => import('@/views/Parametric/Failures/FailureShow.vue'),
        meta: {
          page: 'ParametricPage'
        }
      },
      {
        path: 'failure/:failureId(\\d+)/edit',
        name: 'FailureEdit',
        component: () => import('@/views/Parametric/Failures/FailureEdit.vue'),
        meta: {
          page: 'ParametricPage'
        }
      }
    ]
  },
  {
    path: '/elements',
    name: 'Elements',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        component: () => import('@/views/Elements/ElementGrid.vue'),
        name: 'ElementsPage',
        meta: {
          page: 'ElementsPage'
        },
      },
      {
        path: 'networks',
        name: 'NetworkElementList',
        component: () => import('@/views/Elements/Network/NetworkElementListPage.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'networks/create',
        name: 'NetworkElementCreate',
        component: () => import('@/views/Elements/Network/NetworkElementCreate.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'networks/:networkElementId(\\d+)',
        name: 'NetworkElementShow',
        component: () => import('@/views/Elements/Network/NetworkElementShow.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'networks/:networkElementId(\\d+)/edit',
        name: 'NetworkElementEdit',
        component: () => import('@/views/Elements/Network/NetworkElementEdit.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'controllers',
        name: 'ControllerElementList',
        component: () => import('@/views/Elements/Controller/ControllerElementListPage.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'controllers/create',
        name: 'ControllerElementCreate',
        component: () => import('@/views/Elements/Controller/ControllerElementCreate.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'controllers/:controllerElementId(\\d+)',
        name: 'ControllerElementShow',
        component: () => import('@/views/Elements/Controller/ControllerElementShow.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'controllers/:controllerElementId(\\d+)/edit',
        name: 'ControllerElementEdit',
        component: () => import('@/views/Elements/Controller/ControllerElementEdit.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'sites',
        name: 'SitesListPage',
        component: () => import('@/views/Elements/Sites/SitesListPage.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'sites/create',
        name: 'SitesCreate',
        component: () => import('@/views/Elements/Sites/SitesCreate.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'sites/:siteId(\\d+)',
        name: 'SitesShow',
        component: () => import('@/views/Elements/Sites/SitesShow.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'sites/:siteId(\\d+)/edit',
        name: 'SitesEdit',
        component: () => import('@/views/Elements/Sites/SitesEdit.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'locations',
        name: 'LocationsListPage',
        component: () => import('@/views/Elements/Locations/LocationsListPage.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'locations/create',
        name: 'LocationsCreate',
        component: () => import('@/views/Elements/Locations/LocationsCreate.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'locations/:locationId(\\d+)',
        name: 'LocationsShow',
        component: () => import('@/views/Elements/Locations/LocationsShow.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'locations/:locationId(\\d+)/edit',
        name: 'LocationsEdit',
        component: () => import('@/views/Elements/Locations/LocationsEdit.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'warehouse',
        name: 'WarehouseListPage',
        component: () => import('@/views/Elements/Warehouse/WarehouseListPage.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'warehouse/create',
        name: 'WarehouseCreate',
        component: () => import('@/views/Elements/Warehouse/WarehouseCreate.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'warehouse/:warehouseId(\\d+)',
        name: 'WarehouseShow',
        component: () => import('@/views/Elements/Warehouse/WarehouseShow.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'warehouse/:warehouseId(\\d+)/edit',
        name: 'WarehouseEdit',
        component: () => import('@/views/Elements/Warehouse/WarehouseEdit.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'items-master',
        name: 'ItemsMasterListPage',
        component: () => import('@/views/Elements/ItemsMaster/ItemsMasterListPage.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'items-master/create',
        name: 'ItemsMasterCreate',
        component: () => import('@/views/Elements/ItemsMaster/ItemsMasterCreate.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'items-master/:itemMasterId(\\d+)',
        name: 'ItemsMasterShow',
        component: () => import('@/views/Elements/ItemsMaster/ItemsMasterShow.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
      {
        path: 'items-master/:itemMasterId(\\d+)/edit',
        name: 'ItemsMasterEdit',
        component: () => import('@/views/Elements/ItemsMaster/ItemsMasterEdit.vue'),
        meta: {
          page: 'ElementsPage'
        }
      },
    ],
  },
  {
    path: '/tickets-package',
    name: 'TicketsPackage',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        name: 'TicketsPackageList',
        component: () => import('@/views/TicketsPackage/TicketsPackagePage.vue'),
        meta: {
          page: 'TicketsPackagePage'
        }
      },
      {
        path: 'create',
        name: 'TicketsPackageCreate',
        component: () => import('@/views/TicketsPackage/TicketsPackageCreate.vue'),
        meta: {
          page: 'TicketsPackagePage'
        }
      },
      {
        path: ':ticketPackageId(\\d+)',
        name: 'TicketsPackageShow',
        component: () => import('@/views/TicketsPackage/TicketsPackageShow.vue'),
        meta: {
          page: 'TicketsPackagePage'
        }
      },
      {
        path: ':ticketPackageId(\\d+)/edit',
        name: 'TicketsPackageEdit',
        component: () => import('@/views/TicketsPackage/TicketsPackageEdit.vue'),
        meta: {
          page: 'TicketsPackagePage'
        }
      }
    ]
  },
  {
    path: '/tickets',
    name: 'Tickets',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        name: 'TicketsList',
        component: () => import('@/views/Tickets/TicketsPage.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: 'create',
        name: 'TicketsCreate',
        component: () => import('@/views/Tickets/TicketsCreate.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)',
        name: 'TicketsShow',
        component: () => import('@/views/Tickets/TicketsShow.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)/edit',
        name: 'TicketsEdit',
        component: () => import('@/views/Tickets/TicketsEdit.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)/cancel',
        name: 'TicketsCancel',
        component: () => import('@/views/Tickets/TicketsCancel.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)/addUser',
        name: 'TicketsAddUser',
        component: () => import('@/views/Tickets/TicketsAddUser.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)/accept',
        name: 'TicketsAccept',
        component: () => import('@/views/Tickets/TicketsAccept.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)/manager',
        name: 'TicketsManagerAccept',
        component: () => import('@/views/Tickets/TicketsManagerAccept.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)/pending',
        name: 'TicketsPending',
        component: () => import('@/views/Tickets/TicketsPending.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)/pauseRestored',
        name: 'TicketsPauseRestored',
        component: () => import('@/views/Tickets/TicketsPauseRestored.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)/pauseResolved',
        name: 'TicketsPauseResolved',
        component: () => import('@/views/Tickets/TicketsPauseResolved.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)/progress',
        name: 'TicketsInProgress',
        component: () => import('@/views/Tickets/TicketsInProgress.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)/restored',
        name: 'TicketsRestored',
        component: () => import('@/views/Tickets/TicketsRestored.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)/resolved',
        name: 'TicketsResolved',
        component: () => import('@/views/Tickets/TicketsResolved.vue'),
        meta: {
          page: 'TicketsPage'
        }
      },
      {
        path: ':ticketId(\\d+)/close',
        name: 'TicketsClose',
        component: () => import('@/views/Tickets/TicketsClose.vue'),
        meta: {
          page: 'TicketsPage'
        }
      }
    ]
  },
  {
    path: '/sla',
    name: 'Sla',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        name: 'SlaList',
        component: () => import('@/views/Sla/SlaListPage.vue'),
        meta: {
          page: 'SlaPage'
        }
      },
      {
        path: 'create',
        name: 'SlaCreate',
        component: () => import('@/views/Sla/SlaCreate.vue'),
        meta: {
          page: 'SlaPage'
        }
      },
      {
        path: ':slaId(\\d+)',
        name: 'SlaShow',
        component: () => import('@/views/Sla/SlaShow.vue'),
        meta: {
          page: 'SlaPage'
        }
      },
      {
        path: ':slaId(\\d+)/edit',
        name: 'SlaEdit',
        component: () => import('@/views/Sla/SlaEdit.vue'),
        meta: {
          page: 'SlaPage'
        }
      }
    ]
  },
  {
    path: '/branches',
    name: 'Branches',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        name: 'BranchList',
        component: () => import('@/views/Branches/BranchListPage.vue'),
        meta: {
          page: 'BranchesPage'
        }
      },
      {
        path: 'create',
        name: 'BranchCreate',
        component: () => import('@/views/Branches/BranchCreate.vue'),
        meta: {
          page: 'BranchesPage'
        }
      },
      {
        path: ':branchId(\\d+)',
        name: 'BranchShow',
        component: () => import('@/views/Branches/BranchShow.vue'),
        meta: {
          page: 'BranchesPage'
        }
      },
      {
        path: ':branchId(\\d+)/edit',
        name: 'BranchEdit',
        component: () => import('@/views/Branches/BranchEdit.vue'),
        meta: {
          page: 'BranchesPage'
        }
      }
    ]
  },
  {
    path: '/projects',
    name: 'Projects',
    component: LayoutAdmin,
    children: [
      {
        path: '',
        name: 'ProjectList',
        component: () => import('@/views/Projects/ProjectListPage.vue'),
        meta: {
          page: 'ProjectsPage'
        }
      },
      {
        path: 'create',
        name: 'ProjectCreate',
        component: () => import('@/views/Projects/ProjectCreate.vue'),
        meta: {
          page: 'ProjectsPage'
        }
      },
      {
        path: ':projectId(\\d+)',
        name: 'ProjectShow',
        component: () => import('@/views/Projects/ProjectShow.vue'),
        meta: {
          page: 'ProjectsPage'
        }
      },
      {
        path: ':projectId(\\d+)/edit',
        name: 'ProjectEdit',
        component: () => import('@/views/Projects/ProjectEdit.vue'),
        meta: {
          page: 'ProjectsPage'
        }
      },
      {
        path: ':projectId(\\d+)/addUser',
        name: 'ProjectAddUser',
        component: () => import('@/views/Projects/ProjectAddUser.vue'),
        meta: {
          page: 'ProjectsPage'
        }
      }
    ]
  },
  {
    path: '/reports',
    name: 'Reports',
    component: LayoutAdmin,
    children: [{
      path: '',
      component: () => import('@/views/Reports/ReportsPage.vue'),
      name: 'ReportsPage',
      meta: {
        page: 'ReportsPage'
      },
    }]
  },
  {
    path: '/users',
    component: LayoutAdmin,
    name: 'User',
    children: [
      {
        path: '',
        name: 'UserList',
        component: () => import('@/views/Users/UserListPage.vue'),
        meta: {
          page: 'UsersPage'
        }
      },
      {
        path: 'create',
        name: 'UserCreate',
        component: () => import('@/views/Users/UserCreate.vue'),
        meta: {
          page: 'UsersPage'
        }
      },
      {
        path: ':userId(\\d+)',
        name: 'UserShow',
        component: () => import('@/views/Users/UserShow.vue'),
        meta: {
          page: 'UsersPage'
        }
      },
      {
        path: ':userId(\\d+)/edit',
        name: 'UserEdit',
        component: () => import('@/views/Users/UserEdit.vue'),
        meta: {
          page: 'UsersPage'
        }
      }
    ]
  },
  {
    path: '/roles',
    component: LayoutAdmin,
    name: 'Role',
    children: [
      {
        path: '',
        name: 'RoleList',
        component: () => import('@/views/Roles/RoleListPage.vue'),
        meta: {
          page: 'RolesPage'
        }
      },
      {
        path: 'create',
        name: 'RoleCreate',
        component: () => import('@/views/Roles/RoleCreate.vue'),
        meta: {
          page: 'RolesPage'
        }
      },
      {
        path: ':roleId(\\d+)',
        name: 'RoleShow',
        component: () => import('@/views/Roles/RoleShow.vue'),
        meta: {
          page: 'RolesPage'
        }
      },
      {
        path: ':roleId(\\d+)/edit',
        name: 'RoleEdit',
        component: () => import('@/views/Roles/RoleEdit.vue'),
        meta: {
          page: 'RolesPage'
        }
      }
    ]
  },
  {
    path: '/permissions',
    component: LayoutAdmin,
    name: 'Permission',
    children: [
      {
        path: '',
        name: 'PermissionList',
        component: () => import('@/views/Permissions/PermissionListPage.vue'),
        meta: {
          page: 'PermissionsPage'
        }
      },
      {
        path: 'create',
        name: 'PermissionCreate',
        component: () => import('@/views/Permissions/PermissionCreate.vue'),
        meta: {
          page: 'PermissionsPage'
        }
      },
      {
        path: ':permissionId(\\d+)',
        name: 'PermissionShow',
        component: () => import('@/views/Permissions/PermissionShow.vue'),
        meta: {
          page: 'PermissionsPage'
        }
      },
      {
        path: ':permissionId(\\d+)/edit',
        name: 'PermissionEdit',
        component: () => import('@/views/Permissions/PermissionEdit.vue'),
        meta: {
          page: 'PermissionsPage'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: LayoutAuth,
    children: [{
      path: '',
      name: 'LoginPage',
      component: () => import('@/views/Auth/LoginPage.vue')
    }],
  },
  {
    path: '/about',
    name: 'About',
    component: LayoutAdmin,
    children: [{
      path: '',
      name: 'AboutPage',
      component: About
    }],
  },
  {
    path: '/:path(.*)',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {

  let isAuthenticated = (encryptStorage.getItem('jwt') !== null && encryptStorage.getItem('jwt') !== undefined);
  if (!isAuthenticated && to.name !== 'LoginPage') { next({ name: 'LoginPage' }) }
  else {
    if (isAuthenticated && to.name === 'LoginPage') next({ name: 'HomePage' })
    else {
      if (to.name !== 'LoginPage' && to.name !== 'NotFound') {
        let routeAuthorized = false;
        let navigationItems = encryptStorage.getItem('navigation')
        navigationItems.forEach(function (item) {
          if (item.name === to.meta.page) {
            routeAuthorized = true;
          }
        })
        if (!routeAuthorized) {
          notify({
            group: "top",
            title: "Error",
            text: "You are not authorized to enter the requested route",
            type: "error"
          }, 5000)
          router.push({name: defaultPage }).then()
        }
      }
      next();
    }
  }
})

export default router;
