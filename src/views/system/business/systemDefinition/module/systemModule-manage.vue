<style lang="less">
    @import '../../../../../styles/common.less';
</style>

<template>
    <div>
        <Row>
            <Card>
                <p slot="title"> <Icon type="compose"></Icon>模块定义</p>
                <Row>
                	<p>
                		<Input v-model="sModuCode" placeholder="请输入模块代码搜索" icon="search" 
                			style="width: 200px" @on-change="searching"></Input>
                		<Input v-model="sModuCName" placeholder="请输入模块中文名称搜索" icon="search" 
                    			style="width: 200px" @on-change="searching"></Input>
						&nbsp;
                		<Button type="primary" @click="handleInsert()">新增</Button>
                		<Button type="success" @click="handleUpdate()">修改</Button>
						<Button type="warning" @click="handleDelete()">删除</Button>
        	    	</p>
        	    </Row>        	    
        	    <Row>
					<Table highlight-row border ref="dataList" :size="getFont" height="410" 
                		:columns="columns" :data="list_data" :stripe="true" 
                		@on-select="choicing" @on-select-cancel="cancing" 
                		@on-sort-change="sorting">
					</Table>
                	<div style="float: right;">
                	<Page :total="totalCount" :current="1" :page-size="pageSize" 
                		:transfer="true" :size="getFont"
                		@on-change="changePage" @on-page-size-change="changePageSize" 
                		show-total show-elevator show-sizer></Page>
                	</div>
                </Row> 
				
				<!-- 新增页面 -->
				<Modal width="700" v-model="addModal" title="模块信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false" :loading="loading"
					@on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')">
					<Form ref="addFormRef" :model="addModel" :rules="modelAddRules" :label-width="100">
						<FormItem label="模块代码" prop="moduCode">
							 <Input v-model="addModel.moduCode" placeholder="请输入4位模块代码" />
						 </FormItem>
						 <FormItem label="中文名称" prop="moduCName">
							 <Input v-model="addModel.moduCName" placeholder="请输入模块中文名称" />
						 </FormItem>
						 <FormItem label="模块交易号" prop="moduTC">
							 <Input v-model="addModel.moduTC" />
						 </FormItem>
						 <FormItem label="所属模型" prop="moduModel">
							 <Select v-model="addModel.moduModel">
								<Option v-for="item in modList" :value="item.value" :key="item.value">
									{{ item.label }}
								</Option>
							 </Select>
						 </FormItem>
						 <FormItem label="关联表" prop="relTable">
							 <Select v-model="addModel.relTable" filterable>
								<Option v-for="item in tabList" :value="item.value" :key="item.value">
									{{ item.label }}
								</Option>
							 </Select>
						 </FormItem>
					 </Form>    	
				</Modal>
				
				<!-- 修改页面 -->
				<Modal width="700" v-model="viewModal" title="模块信息" ok-text="保存" cancel-text="关闭" :mask-closable="false" :loading="loading"
					@on-ok="update('updFormRef')">
					<Form ref="updFormRef" :model="viewOrUpdateModel" :label-width="100" :rules="modelUpdRules">
						<FormItem label="模块代码" prop="moduCode">
							 <Input v-model="viewOrUpdateModel.moduCode" disabled/>
						 </FormItem>
						 <FormItem label="中文名称" prop="moduCName">
							 <Input v-model="viewOrUpdateModel.moduCName" />
						 </FormItem>
						 <FormItem label="模块交易号" prop="moduTC">
							 <Input v-model="viewOrUpdateModel.moduTC" />
						 </FormItem>
						 <FormItem label="所属模型" prop="moduModel">
							 <Select v-model="viewOrUpdateModel.moduModel">
								<Option v-for="item in modList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						 </FormItem>
						 <FormItem label="关联表" prop="relTable">
							 <Select v-model="viewOrUpdateModel.relTable" filterable>
								<Option v-for="item in tabList" :value="item.value" :key="item.value">
									{{ item.label }}
								</Option>
							 </Select>
						 </FormItem>
					</Form>    	
				</Modal>
            </Card>
        </Row>
    </div>

</template>

<script>
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';
import systemModule from './systemModule_column';
import Cookies from 'js-cookie';


export default {
    name: 'module-info',
    data () {
        return {
        	headers: {'Content-Type': 'application/json;charset=UTF-8'},
        	listurl: '/business/TK0004L.do', 
			saveurl: '/business/TK0004I.do',
			deleteurl: '/business/TK0004D.do',
			updateurl: '/business/TK0004U.do',  
			selecturl: '/business/TK0001T.do',  
			gettaburl: '/business/TK0004L1.do', 
			list_data: [],
			pageSize: 10,
			currentPage: 1,
			totalCount: 0,
			totalPage: 0,
			sModuCode: '',
			sModuCName: '',
			sModuEName: '',
			addModal: false,
			addModel: {},
			loading: true,
			modelAddRules: {
            	moduCode : [{required: true}],
				moduCName : [{required: true}],
				moduTC : [{required: true}],
				moduModel : [{required: true}],
				relTable : [{required: true}]
            },
			modelUpdRules: {
				moduModel : [{required: true}],
				relTable : [{required: true}]
			},
			viewOrUpdateModel: {},
            columns: [],
			selectedLines: 0,
			deletedPks: [],
			viewModal: false,
			modList: [],
			tabList: []
        };
    },
    methods: {  
		getSearchCond() {
    		//let menuCode = Cookies.get('menucode');
        	return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
        		'valObj': {'moduCode': this.sModuCode, 'moduCName': this.sModuCName}
        	};
        },
        init () {
        	pagetool.setPage(this);
        	systemModule.setPage(this);
        	pagetool.page(this.getSearchCond());
        	this.columns = systemModule.getColumns();
        },        
        searching () {
    		pagetool.page(this.getSearchCond());
        },
		changePage (page) {
        	let cond = this.getSearchCond();
        	cond.currentPage = page;
        	pagetool.page(cond);
        },
        changePageSize (_pageSize) {
        	let cond = this.getSearchCond();
        	cond.pageSize = _pageSize;
        	pagetool.page(cond);        	
        },  	
		sorting(data) {
        	pagetool.sort(data, this.getSearchCond());
        },
		choicing(selection, row) {
        	systemModule.choice(selection, row);
        },
        cancing(selection, row) {
        	systemModule.cancel(selection, row);        	
        },
		
		//新增页面
		handleInsert(){
			this.addModal = true;
			pagetool.reset('addFormRef');
			this.modList = [];
			this.tabList = [];
			systemModule.getModList(this.selecturl);
			systemModule.getTabList(this.gettaburl);
		},
		
		//新增保存
		saving(name) {
			this.addModel.crtDate = datetool.format(new Date());
        	pagetool.save(name);
        },
		
		//新增/修改取消
        reseting (name) {
			this.addModal = false;
        	//pagetool.reset(name);
        },
		
		//删除操作
        handleDelete () {
        	systemModule.delete(this.deleteurl+"?moduCode="+this.deletedPks.join(','));
        },
		
		//修改操作
		handleUpdate () {
			if(this.selectedLines < 1) {
				this.$Modal.warning({
					title: '提示信息',
					content: '必须选中一条记录！'
				});
				
				return;
			}
			
			if(this.selectedLines > 1) {
				this.$Modal.warning({
					title: '提示信息',
					content: '只能选中一条记录！'
				});
				
				return;
			};
			
			systemModule.getModList(this.selecturl);
			systemModule.getTabList(this.gettaburl);
			this.viewModal = true;
		},
		
		//修改保存
		update (name) {
			this.viewOrUpdateModel.updDate = datetool.format(new Date());
			systemModule.update(name);
		}
    },
    created() {
    	this.init();
    },
    computed:{
		//个性化设置，设置字体大小
    	getFont(){
    	    const sizeValue=Cookies.get("sizeValue");
    		const size=this.$store.state.app.sizeFont;
    		if(!sizeValue){
    			return size;
    		}else{
    			return sizeValue;
    		}
    	}
    }    
};
</script>
