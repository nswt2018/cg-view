<style lang="less">
    @import '../styles/menu.less';
</style>

<template>
	<Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto" @on-select="changeMenu" accordion>
		<template v-for="item in menuList">
			<Submenu v-if="item.children" :name="item.name" :key="item.name">
				<template slot="title">
					 <Icon :type="item.icon" :size="iconSize"></Icon>
					 <span class="layout-text">{{ itemTitle(item) }}</span>
				</template>
				<template v-for="child in item.children">
					 <!-- 二级菜单 -->
					 <MenuItem v-if="isMoreLeveMenu(child)==false" :name="child.name" :key="'menuitem' + child.name">
						  <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
						  <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
					 </MenuItem>
					 <Submenu v-if="isMoreLeveMenu(child)==true" :name="child.name" :key="'menuitem' + child.name">
						  <template slot="title">
								<Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
								<span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
						  </template>
						  <template v-for="son in child.children">
								<!-- 三级菜单 -->
								<MenuItem v-if="isMoreLeveMenu(son)==false" :name="son.name" :key="'menuitem' + son.name">
									 <Icon :type="son.icon" :size="iconSize" :key="'icon' + son.name"></Icon>
									 <span class="layout-text" :key="'title' + son.name">{{ itemTitle(son) }}</span>
								</MenuItem>
								<!-- 四级菜单 -->
								<Submenu v-if="isMoreLeveMenu(son)==true" :name="son.name" :key="'menuitem' + son.name">
									<template slot="title">
										<Icon :type="son.icon" :size="iconSize" :key="'icon' + son.name"></Icon>
										<span class="layout-text" :key="'title' + son.name">{{ itemTitle(son) }}</span>
									</template>
									<template v-for="sn in son.children">
										<MenuItem :name="sn.name" :key="'menuitem' + sn.name">
											 <Icon :type="sn.icon" :size="iconSize" :key="'icon' + sn.name"></Icon>
											 <span class="layout-text" :key="'title' + sn.name">{{ itemTitle(sn) }}</span>
										</MenuItem>
									</template>
								</Submenu>
						</template>
					</Submenu>
				</template>
			</Submenu>
		</template>
	</Menu>
</template>

<script>
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        },
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
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    }

};
</script>
