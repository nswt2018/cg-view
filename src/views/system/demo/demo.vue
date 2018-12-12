<style lang="less">
	@import '../../main-components/shrinkable-menu/styles/menu.less';
</style>
<template>
	<Row >
		<i-col span="5">
			<i-menu active-name="1-1" width="auto" accordion :open-names="[menuData[0].name]">
				<template v-for="item in menuData">
					<Submenu :name="item.name" :key="item.name">
						<template slot="title">
							<Icon :type="item.icon"></Icon>
							<span class="layout-text">{{ item.label }}</span>
						</template>
						<template v-for="childs in item.children">
							<menu-item v-if="isMoreLeveMenu(childs)==false" :name="childs.name" :key="childs.name">
								<router-link :to="childs.path">{{ childs.label }}</router-link>
							</menu-item>
							<Submenu v-if="isMoreLeveMenu(childs)==true" :name="childs.name" :key="childs.name">
								<template slot="title">
									<Icon :type="childs.icon"></Icon>
									<span class="layout-text">{{ childs.label }}</span>
								</template>
								<template v-for="child in childs.children">
									<menu-item v-if="isMoreLeveMenu(child)==false" :name="child.name" :key="child.name">
										<router-link :to="child.path">{{ child.label }}</router-link>
									</menu-item>
									<Submenu v-if="isMoreLeveMenu(child)==true" :name="child.name" :key="child.name">
										<template slot="title">
											<Icon :type="child.icon"></Icon>
											<span class="layout-text">{{ child.label }}</span>
										</template>
										<template v-for="kids in child.children">
											<menu-item :name="kids.name" :key="kids.name">
												<router-link :to="kids.path">{{ kids.label }}</router-link>
											</menu-item>
										</template>
									</Submenu>
								</template>
							</Submenu>
						</template>
					</Submenu>
				</template>
			</i-menu>
		</i-col>
		<i-col span="18">
			<div class="layout-content-main" >
				<router-view></router-view>
			</div>
		</i-col>
	</Row>
</template>
<script>
import util from '@/libs/util.js';
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';
import Cookies from 'js-cookie';
import VueRouter from "vue-router";

	 export default {
		router : new VueRouter({
			routes: [
				{
				  path: '/error',
				  name: 'error-500',
				  component: () => import('@/views/system/business/systemDefinition/module/systemModule-manage.vue')
				},
				{
				  path: '/warn',
				  name: 'error-500',
				  component: () => import('@/views/error-page/403.vue')
				},
				{
				  path: '/demo',
				  name: 'error-500',
				  component: () => import('@/views/system/business/dataDefinition/table/tabDefinition-manage.vue')
				},
				{
				  path: '/text',
				  name: 'error-500',
				  component: () => import('@/views/error-page/404.vue')
				}
			]
		}),
		data () {
			return {
				menuData:[
					{ 	label:'菜单1',name:"m1",
						children:[
							{name:'m1-1',label:'菜单2-1', path:'/error'},
						]
					},
					{	label:'菜单2',name:"m2",
						children:[
							{name:'m2-1',label:'菜单2-1', path:'/warn'},
							{name:'m2-2',label:'菜单2-2', path:'/demo'},
						]
					},
					{   label:'菜单3',name:"m3",
						children:[
							{	name:'m3-1',label:'菜单3-1',
								children:[
									{name:'m3-1-1',label:'菜单3-1-1', path:'/text'},
									{name:'m3-1-2',label:'菜单3-1-2', path:'/text'},
								]
							},
						]
					},
					{   label:'菜单4',name:"m4",
						children:[
							{	name:'m4-1',label:'菜单4-1',
								children:[
									{name:'m4-1-1',label:'菜单4-1-1', path:'/text'},
									{	
										name:'m4-1-2',label:'菜单4-1-2',
										children:[
											{name:'m4-1-2-1',label:'菜单4-1-2-1', path:'/error'},
											{name:'m4-1-2-2',label:'菜单4-1-2-2', path:'/warn'},
										]
									},
								]
							},
						]
					},
				],
				activeTab:null,
				mainHeight: 0,
				frameHeight: 0,
				mainTabs:[],
			};
		},
		methods: {
			
			isMoreLeveMenu(child){
				if(child.children){
				   if(child.children.length>0){
						return true;
					}else{
						return false;
					} 
				}else {
					return false;
				}
			}
		}
	};
</script>