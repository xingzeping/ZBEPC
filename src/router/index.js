import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '../views/layout/Layout'
import UseWater from '../views/StatisticalAnalysis/UseWater'
import BiogasSlurryUse from '../views/StatisticalAnalysis/BiogasSlurryUse'
import EPOperation from '../views/StatisticalAnalysis/EPOperation'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/EPOperation',
    component: Layout,
    redirect: '/EPOperation/useElectricity',
    name: 'EPOperation',
    meta: { title: '环保运营', icon: 'EPOperation' },
    children: [{
      path: 'useElectricity',
      name: 'UseElectricity',
      component: () => import('@/views/EPOperation/BasicData/UseElectricity'),
      meta: { title: '用电记录', icon: 's' }
    }, {
      path: 'waterQuality',
      name: 'WaterQuality',
      component: () => import('@/views/EPOperation/BasicData/WaterQuality'),
      meta: { title: '水质管理', icon: 's' }
    }, {
      path: 'pigManure',
      name: 'PigManure',
      component: () => import('@/views/EPOperation/BasicData/PigManure'),
      meta: { title: '猪粪记录', icon: 'ss' }
    }, {
      path: 'biogas',
      name: 'Biogas',
      component: () => import('@/views/EPOperation/BasicData/Biogas'),
      meta: { title: '沼液塘水量', icon: 's' }
    }, {
      path: 'facilityWorking',
      name: 'FacilityWorking',
      component: () => import('@/views/EPOperation/BasicData/FacilityWorking'),
      meta: { title: '设备运行记录', icon: 's' }
    }, {
      path: 'facilityRepair',
      name: 'FacilityRepair',
      component: () => import('@/views/EPOperation/BasicData/FacilityRepair'),
      meta: { title: '设备维修记录', icon: 's' }
    }, {
      path: 'facilityMaintain',
      name: 'FacilityMaintain',
      component: () => import('@/views/EPOperation/BasicData/FacilityMaintain'),
      meta: { title: '设备保养记录', icon: 's' }
    }, {
      path: 'soilManage',
      name: 'SoilManage',
      component: () => import('@/views/EPOperation/BasicData/SoilManage'),
      meta: { title: '排泥管理', icon: 's' }
    }, {
      path: 'utilizeMethane',
      name: 'UtilizeMethane',
      component: () => import('@/views/EPOperation/BasicData/UtilizeMethane'),
      meta: { title: '沼气利用', icon: 's' }
    }, {
      path: 'organicFertilizer',
      name: 'OrganicFertilizer',
      component: () => import('@/views/EPOperation/BasicData/OrganicFertilizer'),
      meta: { title: '有机肥记录', icon: 's' }
    }]
  },
  {
    path: '/biogasSlurryUse',
    component: Layout,
    redirect: '/biogasSlurryUse/ReturnLandTarget',
    name: 'biogasSlurryUse ',
    meta: { title: '沼液利用', icon: 'biogasSlurryUse' },
    children: [{
      path: 'returnLandTarget',
      name: 'ReturnLandTarget',
      component: () => import('@/views/BiogasSlurryUse/ReturnLandTarget'),
      meta: { title: '还田目标', icon: 's' }
    }, {
      path: 'returnLandResult',
      name: 'ReturnLandResult',
      component: () => import('@/views/BiogasSlurryUse/ReturnLandResult'),
      meta: { title: '还田结果追踪', icon: 's' }
    }, {
      path: 'returnLandStandard',
      name: 'ReturnLandStandard',
      component: () => import('@/views/BiogasSlurryUse/ReturnLandStandard'),
      meta: { title: '还田标准', icon: 's' }
    }, {
      path: 'returnLandSchedule',
      name: 'ReturnLandSchedule',
      component: () => import('@/views/BiogasSlurryUse/ReturnLandSchedule'),
      meta: { title: '还田进度', icon: 'ss' }
    }]
  },
  {
    path: '/epProject',
    component: Layout,
    redirect: '/epProject/PipelineInformation',
    name: 'epProject',
    meta: { title: '环保工程', icon: 'epProject' },
    children: [ {
      path: 'pipelineInformation',
      name: 'PipelineInformation',
      component: () => import('@/views/EPProject/PipelineInformation'),
      meta: { title: '管网信息', icon: 's' }
    }, {
      path: 'buildLog',
      name: 'BuildLog',
      component: () => import('@/views/EPProject/BuildLog'),
      meta: { title: '施工日志', icon: 's' }
    }, {
      path: 'outlet',
      name: 'Outlet',
      component: () => import('@/views/EPProject/Outlet'),
      meta: { title: '出水口信息', icon: 's' }
    }]
  },
  {
    path: '/plantInfo',
    component: Layout,
    redirect: '/plantInfo/RentedLand',
    name: 'plantInfo',
    meta: { title: '种植信息', icon: 'plantInfo' },
    children: [  {
      path: 'rentedLand',
      name: 'RentedLand',
      component: () => import('@/views/PlantingInfo/RentedLand'),
      meta: { title: '租地信息', icon: 's' }
    }, {
      path: 'plant',
      name: 'Plant',
      component: () => import('@/views/PlantingInfo/Plant'),
      meta: { title: '种植信息', icon: 's' }
    }]
  },
  //TODO
     {
       path: '/StatisticalAnalysis',
       component: Layout,
       redirect: '/StatisticalAnalysis/UseWater/UseElectricity',
       name: 'StatisticalAnalysis',
       meta: { title: '统计分析', icon: 'StatisticalAnalysis' },
       children: [
	   	{
	   		path: '/StatisticalAnalysis/UseWater',
	   		name: 'UseWater',
	   		component: UseWater,
	        redirect: '/StatisticalAnalysis/UseWater/ClearWater',
	   		meta: { title: '用水量统计', icon: 's' },
	   		children: [{
	      path: 'clearWater',
	      name: 'ClearWater',
	      component: () => import('@/views/StatisticalAnalysis/UseWater/ClearWater'),
	      meta: { title: '清水量日报', icon: 's' }
	    },{
	      path: 'clearWaterM',
	      name: 'ClearWaterM',
	      component: () => import('@/views/StatisticalAnalysis/UseWater/ClearWaterM'),
	      meta: { title: '清水量月报', icon: 's' }
	    }, {
	      path: 'sewage',
	      name: 'Sewage',
	      component: () => import('@/views/StatisticalAnalysis/UseWater/Sewage'),
	      meta: { title: '污水量日报', icon: 's' }
	    }, {
	      path: 'sewageM',
	      name: 'SewageM',
	      component: () => import('@/views/StatisticalAnalysis/UseWater/SewageM'),
	      meta: { title: '污水量月报', icon: 's' }
	    }, {
	      path: 'consumption',
	      name: 'Consumption',
	      component: () => import('@/views/StatisticalAnalysis/UseWater/Consumption'),
	      meta: { title: '消纳量日报', icon: 's' }
	    }, {
	      path: 'consumptionM',
	      name: 'ConsumptionM',
	      component: () => import('@/views/StatisticalAnalysis/UseWater/ConsumptionM'),
	      meta: { title: '消纳量月报', icon: 's' }
	    }]
   	},{
   		path: '/StatisticalAnalysis/EPOperation',
   		name: 'EPOperation',
   		component: EPOperation,
        redirect: '/StatisticalAnalysis/EPOperation/UseElectricity',
   		meta: { title: '环保运营统计', icon: 's' },
   		children: [{
   		  path: 'useElectricity',
   		  name: 'UseElectricity',
   		  component: () => import('@/views/StatisticalAnalysis/EPOperation/UseElectricity'),
   		  meta: { title: '用电记录月报', icon: 's' }
   		},{
   		  path: 'waterQuality',
   		  name: 'WaterQuality',
   		  component: () => import('@/views/StatisticalAnalysis/EPOperation/WaterQuality'),
   		  meta: { title: '水质管理月报', icon: 's' }
   		},{
	      path: 'pigManure',
	      name: 'PigManure',
	      component: () => import('@/views/StatisticalAnalysis/EPOperation/PigManure'),
	      meta: { title: '猪粪记录月报', icon: 'sss' }
	    }, {
	      path: 'biogas',
	      name: 'Biogas',
	      component: () => import('@/views/StatisticalAnalysis/EPOperation/Biogas'),
	      meta: { title: '沼液塘水量月报', icon: 'sss' }
	    }, {
	      path: 'facilityWorking',
	      name: 'FacilityWorking',
	      component: () => import('@/views/StatisticalAnalysis/EPOperation/FacilityWorking'),
	      meta: { title: '设备运行月报', icon: 'sss' }
	    }, {
	      path: 'facilityRepair',
	      name: 'FacilityRepair',
	      component: () => import('@/views/StatisticalAnalysis/EPOperation/FacilityRepair'),
	      meta: { title: '设备维修月报', icon: 'sss' }
	    }, {
	      path: 'facilityMaintain',
	      name: 'FacilityMaintain',
	      component: () => import('@/views/StatisticalAnalysis/EPOperation/FacilityMaintain'),
	      meta: { title: '设备保养月报', icon: 'sss' }
	    }, {
	      path: 'utilizeMethane',
	      name: 'UtilizeMethane',
	      component: () => import('@/views/StatisticalAnalysis/EPOperation/UtilizeMethane'),
	      meta: { title: '沼气利用月报', icon: 's' }
	    }, {
	      path: 'ePOperation',
	      name: 'EPOperation',
	      component: () => import('@/views/StatisticalAnalysis/EPOperation/EPOperation'),
	      meta: { title: '环保运营分析月报', icon: 's' }
	    }]
   	},{
   		path: '/StatisticalAnalysis/BiogasSlurryUse',
   		name: 'BiogasSlurryUse',
   		component: BiogasSlurryUse,
        redirect: '/StatisticalAnalysis/BiogasSlurryUse/ReturnLandSchedule',
   		meta: { title: '沼液利用统计', icon: 'BiogasSlurryUse' },
   		children: [{
   		  path: 'returnLandSchedule',
   		  name: 'ReturnLandSchedule',
   		  component: () => import('@/views/StatisticalAnalysis/BiogasSlurryUse/ReturnLandSchedule'),
   		  meta: { title: '还田进度', icon: 's' }
   		},{
   		  path: 'returnLandStandard',
   		  name: 'ReturnLandStandard',
   		  component: () => import('@/views/StatisticalAnalysis/BiogasSlurryUse/ReturnLandStandard'),
   		  meta: { title: '还田标准', icon: 's' }
   		}]
   	}]
     },
//   {
//     path: '/analysis',
//     component: Layout,
//     redirect: '/analysis/RentedLand',
//     name: 'Access',
//     meta: { title: '统计分析', icon: 'supplierMagG' },
//     children: [  {
//       path: 'rentedLand',
//       name: 'RentedLand',
//       component: () => import('@/views/EPOperation/BasicData/RentedLand'),
//       meta: { title: '租地信息', icon: 's' }
//     }, {
//       path: 'plant',
//       name: 'Plant',
//       component: () => import('@/views/EPOperation/BasicData/Plant'),
//       meta: { title: '种植信息', icon: 's' }
//     }]
//   },
  {
    path: '/financeMagment',
    component: Layout,
    redirect: '/financeMagment/Management',
    name: 'financeMagment',
    meta: { title: '环保财务管理', icon: 'financeMagment' },
    children: [  {
      path: 'management',
      name: 'Management',
      component: () => import('@/views/FinancialManagement/Management'),
      meta: { title: '月度经营情况表', icon: 's' }
    }, {
      path: 'costStructure',
      name: 'CostStructure',
      component: () => import('@/views/FinancialManagement/CostStructure'),
      meta: { title: '环保成本构成表', icon: 's' }
    }, {
      path: 'incomeStructure',
      name: 'IncomeStructure',
      component: () => import('@/views/FinancialManagement/IncomeStructure'),
      meta: { title: '环保收入构成表', icon: 's' }
    }, {
      path: 'billHeadCost',
      name: 'BillHeadCost',
      component: () => import('@/views/FinancialManagement/BillHeadCost'),
      meta: { title: '环保单头成本表', icon: 's' }
    }]
  },{
    path: '/BasicInfo',
    component: Layout,
    redirect: '/BasicInfo/EPStation',
    name: 'BasicInfo',
    meta: { title: '环保基础信息', icon: 'BasicInfo' },
    children: [{
      path: 'EPStation',
      name: 'EPStation',
      component: () => import('@/views/BasicInfo/EPStation'),
      meta: { title: '环保站', icon: 's' }
    }, {
      path: 'PersonMag',
      name: 'PersonMag',
      component: () => import('@/views/BasicInfo/PersonMag'),
      meta: { title: '人员信息', icon: 's' }
    }, {
      path: 'financeBasicData',
      name: 'FinanceBasicData',
      component: () => import('@/views/BasicInfo/FinanceBasicData'),
      meta: { title: '环保财务管理基础数据', icon: 's' }
    }, {
      path: 'biogasSlurryPond',
      name: 'BiogasSlurryPond',
      component: () => import('@/views/BasicInfo/BiogasSlurryPond'),
      meta: { title: '沼液塘基础信息表', icon: 's' }
    }]
  },
  
  { path: '*', redirect: '/404', hidden: true }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
