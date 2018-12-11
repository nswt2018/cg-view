import Main from '@/views/Main.vue';
import hardWare from '@/views/system/hardware/hardware.vue';
// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
   /*{
        path: '/system',
        icon: 'android-checkbox',
        name: 'system',
        title: '系统管理',
        component: Main,
        children: [
			{ path: 'userlist', title: '用户管理', name: 'user-info',icon: 'compose',component: () => import('@/views/system/user/user-manage.vue') },
			{ path: 'orglist', title: '机构管理', name: 'org_info', icon: 'compose',component: () => import('@/views/system/org/sys-org.vue') },
			{ path: 'parmlist', title: '系统参数', name: 'parm_info',icon: 'compose',component: () => import('@/views/system/parm/sys-parm.vue') },
			{
				path:'hardware',
				icon: 'android-checkbox',
		        name: 'hardwate',
		        title: '硬件监控',
		        component: hardWare,
		        children:[
		            { path: 'hardwarechart', title: '硬件图标展示', name: 'hardware-chart', access: '1002', icon: 'compose',component: () => import('@/views/system/hardware/hardware-chart.vue') },
		            { path: 'ifstat', title: '网络流量信息', name: 'ifstat-info', access: '1002', icon: 'compose',component: () => import('@/views/system/hardware/ifstat/if-stat.vue') },
		            { path: 'cpuperc', title: 'CPU总量', name: 'cpuperc-info', access: '1002', icon: 'compose',component: () => import('@/views/system/hardware/cpuperc/cpu-perc.vue') }
		        ]
			}
		]
    },*/
    
    //业务平台
	{
        path: '/business',
        icon: 'android-checkbox',
        name: 'business',
        title: '业务平台',
        component: Main,
        children: [
			{ 
				path: 'dataDefinition', title: '数据定义', name: 'data_definition', icon: 'navicon-round',component: () => import('@/views/system/business/artical-publish-center.vue'),
				children: [
					{ path: 'tabDefinition', title: '表定义', name: 'tabDefinition', icon: 'navicon-round',component: () => import('@/views/system/business/dataDefinition/table/tabDefinition-manage.vue') },
					{ path: 'colDefinition', title: '字段定义', name: 'colDefinition', icon: 'navicon-round',component: () => import('@/views/system/business/dataDefinition/columns/colDefinition-manage.vue') }
				]
			},
			{ 
				path: 'modelDefinition', title: '模型定义', name: 'model_definition', icon: 'navicon-round',component: () => import('@/views/system/business/artical-publish-center.vue'),
				children: [
					{ path: 'modelDefinition', title: '模型定义', name: 'modelDefinition', icon: 'navicon-round',component: () => import('@/views/system/business/modelDefinition/model/modelDefinition-manage.vue') },
					{ path: 'componetDefinition', title: '组件定义', name: 'componetDefinition', icon: 'navicon-round',component: () => import('@/views/system/business/modelDefinition/componet/componetDefinition-manage.vue') },
					{ path: 'tagDefinition', title: '标签定义', name: 'tagDefinition', icon: 'navicon-round',component: () => import('@/views/system/business/modelDefinition/tag/tagDefinition-manage.vue') }
				]
			},
			{ 
				path: 'systemDefinition', title: '模块定义', name: 'system_definition', icon: 'navicon-round',component: () => import('@/views/system/business/artical-publish-center.vue'),
				children: [
					{ path: 'systemModule', title: '公共模块', name: 'systemModule', icon: 'navicon-round',component: () => import('@/views/system/business/systemDefinition/module/systemModule-manage.vue') },
					{ path: 'businessUnit', title: '业务单元', name: 'businessUnit', icon: 'navicon-round',component: () => import('@/views/system/business/systemDefinition/unit/businessUnit-manage.vue') },
					{ path: 'pageElement', title: '页面元素', name: 'pageElement', icon: 'navicon-round',component: () => import('@/views/system/business/systemDefinition/element/pageElement-manage.vue') },
				]
			},
        ]
    },
	
	 //应用工厂
	{
        path: '/appFactory',
        icon: 'android-checkbox',
        name: 'factory',
        title: '应用工厂',
		component: Main,
		children: [
            { 
				path: 'sysDefinition', 
				title: '系统定义', 
				name: 'sysDefinition', 
				icon: 'navicon-round',
				component: () => import('@/views/system/factory/sysDefinition-manage.vue') 
			},
			
			{ 
				path: 'demo', 
				title: '树预览演示', 
				name: 'demo', 
				icon: 'navicon-round',
				component: () => import('@/views/system/demo/demo.vue') 
			},
        ]
    },
	
	/*,
    
    {
        path: '/auxdev',
        icon: 'android-checkbox',
        name: 'auxdev',
        title: '开发辅助',
        component: Main,
        children: [
			{ path: 'coder', title: '代码生成', name: 'coder-info', icon: 'arrow-swap',component: () => import('@/views/system/user/user-manage.vue') },
			{ path: 'coder2', title: '报表生成', name: 'report-info', icon: 'arrow-swap',component: () => import('@/views/system/user/user-manage.vue') }
        ]
    }*/
];

// 所有上面定义的路由都要写在下面的routers里,定义路由
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];