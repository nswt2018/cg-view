<style lang="less">
    @import '../../../../../styles/common.less';
</style>
<style lang="less">
	.div-split{
		height: 100px
    }
	.split-pane{
		padding: 3px;
	}
</style>
<template>
    <div class="div-split">
		<Split v-model="split">
			<div slot="left" class="split-pane">
				<Card>
					<p slot="title"> <Icon type="compose"></Icon>表定义</p>
					<Row>
						<p>
							<Input v-model="sTabCode" placeholder="请输入表名搜索" icon="search" 
								style="width: 150px" @on-change="searching"></Input>
							&nbsp;
							<Button type="primary"  @click="handleInsert()">新增</Button>
							<Button type="success" @click="handleUpdate()">修改</Button>
							<Button type="error" @click="handleDelete()">删除</Button>
							<Button type="warning" @click="handleInsertTab()">导入</Button>
							<Button type="info" @click="tabFactory()">表创建</Button>
						</p>
					</Row>        	    
					<Row>
						<Table highlight-row border ref="dataList" :size="getFont" :height="tableHeight" 
							:columns="columns" :data="list_data" :stripe="true" 
							@on-sort-change="sorting" @on-row-click="singleclick">
						</Table>
						<div style="float: right;">
							<Page :total="totalCount" :current="1" :page-size="pageSize" 
								:transfer="true"
								@on-change="changePage" @on-page-size-change="changePageSize" 
								show-total show-elevator show-sizer>
							</Page>
						</div>
					</Row> 
				</Card>
			</div>
			<div slot="right" class="split-pane">
				<colDefinition ref="colRef"/>
			</div>
		</Split>
		
		<!-- 新增页面 -->
		<Modal width="700" v-model="addModal" title="表信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false" :loading="loading"
			@on-ok="saving('tabAddFormRef')" @on-cancel="reseting('tabAddFormRef')">
			<Form ref="tabAddFormRef" :model="addModel" :rules="modelAddRules" :label-width="100">
				<FormItem label="表名" prop="tabCode">
					<Input v-model="addModel.tabCode" placeholder="请输入表英文名称" />
				</FormItem>
				<FormItem label="中文名称" prop="tabName">
					<Input v-model="addModel.tabName" placeholder="请输入表中文名称" />
				</FormItem>
				<FormItem label="备注" prop="tabComm">
					<Input v-model="addModel.tabComm"/>
				</FormItem>
			 </Form>    	
		</Modal>
		
		<!-- 修改页面 -->
		<Modal width="700" v-model="viewModal" title="模块信息" ok-text="保存" cancel-text="关闭" :mask-closable="false" :loading="loading"
			@on-ok="update('updFormRef')">
			<Form ref="updFormRef" :model="viewOrUpdateModel" :label-width="100">
				<FormItem label="表名" prop="tabCode">
					<Input v-model="viewOrUpdateModel.tabCode" disabled/>
				 </FormItem>
				 <FormItem label="中文名称" prop="tabName">
					<Input v-model="viewOrUpdateModel.tabName"/>
				 </FormItem>
				 <FormItem label="备注" prop="tabComm">
					<Input v-model="viewOrUpdateModel.tabComm"/>
				 </FormItem>
			</Form>    	
		</Modal>
		
		<!-- 导入表 -->
		<Modal width="700" v-model="addTabModal" title="表信息"  ok-text="导入" cancel-text="关闭" :mask-closable="false" :loading="loading"
			@on-ok="addTabs('addTabRef')" @on-cancel="reseting('addTabRef')">
				
				<div>
					<Row>
						<Input v-model="sTabCode1" placeholder="请输入表名搜索" icon="search" 
							style="width: 200px" @on-change="searching1"></Input>
						<Input v-model="sTabName1" placeholder="请输入中文名搜索" icon="search" 
							style="width: 200px" @on-change="searching1"></Input>
					</Row>
					
					<Row>					
						<Table highlight-row border height="280" size="small" 
							:columns="tab_columns" :data="tab_list_data" :stripe="true"
							@on-select="choicing" @on-select-cancel="cancing" 
							@on-select-all="choicingAll" @on-selection-change="cancingAll">
						</Table>
								
						<div style="text-align:center">
							<Page :total="totalCount1" :current="1" :page-size="pageSize1" 
								:transfer="true" size="small"
								@on-change="changePage1" @on-page-size-change="changePageSize1" 
								show-total show-elevator show-sizer>
							</Page>
						</div>
					</Row>
				</div>
		</Modal>
		
    </div>

</template>

<script>
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';
import tabDefinition from './tabDefinition_column';
import Cookies from 'js-cookie';
import colDefinition from '../columns/colDefinition-manage';


export default {
    name: 'module-info',
	components: {
            colDefinition
		},
    data () {
        return {
			split: 0.5,
        	headers: {'Content-Type': 'application/json;charset=UTF-8'},
        	listurl: '/business/TK0007L.do', 
			saveurl: '/business/TK0007I.do',
			deleteurl: '/business/TK0007D.do',
			updateurl: '/business/TK0007U.do', 
			createTaburl: '/business/TK0007G.do',
			findtaburl: '/business/TK0007F.do',
			addtaburl: '/business/TK0007I1.do',
			taburl: '/business/TK0007L1.do', 
			list_data: [],
			pageSize: 10,
			currentPage: 1,
			totalCount: 0,
			totalPage: 0,
			sTabCode: '',
			sTabName: '',
			addModal: false,
			addModel: {},
			loading: true,
			modelAddRules: {
            	tabCode : [{required: true}],
				tabName : [{required: true}]
            },
			viewOrUpdateModel: {},
            columns: [],
			index: -1,
			deletedPks: '',
			viewModal: false,
			exist: false,
			tableHeight: 410,
			addTabModal: false,
			sTabCode1: '',
			sTabName1: '',
			tab_list_data: [],
			tab_columns: [],
			pageSize1: 10,
			currentPage1: 1,
			totalCount1: 0,
			totalPage1: 0,
			deletedPks1: []
        };
    },
    methods: {  
		getSearchCond() {
        	return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
        		'valObj': {'tabCode': this.sTabCode, 'tabName': this.sTabName}
        	};
        },
        init () {
        	pagetool.setPage(this);
        	tabDefinition.setPage(this);
        	pagetool.page(this.getSearchCond());
        	this.columns = tabDefinition.getColumns();
			
			setTimeout(function() {
				tabDefinition.findCol();
			}, 500 );
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
		
		//新增页面
		handleInsert(){
			this.addModal = true;
			pagetool.reset('tabAddFormRef');
		},
		
		//新增保存
		saving(name) {
			this.addModel.crtDate = datetool.format(new Date());
        	pagetool.save(name);
			this.$refs.colRef.getColDataList('-1');
        },
		
		//新增/修改取消
        reseting (name) {
			this.addModal = false;
        },
		
		//删除操作
        handleDelete () {
        	tabDefinition.delete(this.deleteurl+"?tabCode="+this.deletedPks);
			this.$refs.colRef.getColDataList('-1');
        },
		
		//修改操作
		handleUpdate () {
			if(this.index == -1) {
				this.$Modal.warning({
					title: '提示信息',
					content: '必须选中一条记录！'
				});
				
				return;
			}
			
			//表存在则不能修改
			tabDefinition.findTab(this.findtaburl+"?tabCode="+this.deletedPks);
		},
		
		//修改保存
		update (name) {
			this.viewOrUpdateModel.updDate = datetool.format(new Date());
			tabDefinition.update(name);
		},
		
		//生成表
		tabFactory () {
			tabDefinition.tabFactory(this.createTaburl+"?tabCode="+this.deletedPks);
			this.$refs.colRef.getColDataList('-1');
		},
		
		//单选
		singleclick(row, index){
			
			this.index = index;
			this.viewOrUpdateModel = row;
			
			this.deletedPks = row.tabCode;
	
			this.$refs.colRef.getColDataList(row.tabCode);
		},
		
		handleInsertTab(){
			this.sTabCode1 = '';
			this.sTabName1 = '';
			this.tab_columns = tabDefinition.getTabColumns();
			tabDefinition.page(this.getTabSearchCond());
			this.addTabModal = true;
		},
		
		getTabSearchCond() {
        	return {'pageSize': this.pageSize1, 'currentPage': this.currentPage1, 
        		'valObj': {'tabCode': this.sTabCode1, 'tabName': this.sTabName1}
        	};
        },
		
		//从数据库添加表
		addTabs(){
			if(this.deletedPks1.length == 0){
				this.$Modal.warning({
					title: '提示信息',
					content: '必须选中一条记录！'
				});
				
				return;
			}else{
				tabDefinition.addTab(this.addtaburl + "?tabCode="+this.deletedPks1.join(','));
			}
		},
		
		changePage1 (page) {
        	let cond = this.getTabSearchCond();
        	cond.currentPage = page;
        	tabDefinition.page(cond);
        },
        changePageSize1 (_pageSize) {
        	let cond = this.getTabSearchCond();
        	cond.pageSize = _pageSize;
        	tabDefinition.page(cond);        	
        },
		searching1 () {
    		tabDefinition.page(this.getTabSearchCond());
        },
		
		choicing(selection, row) {
        	this.deletedPks1.push(row.tabCode);
        },
		
        cancing(selection, row){
        	if(selection.length > 0){
        		this.deletedPks1.splice(this.deletedPks1.indexOf(row.tabCode), 1);
        	}
        },
		
        choicingAll(selection){
        	this.deletedPks1 = [];
        	for(var i=0; i<selection.length; i++){
        		this.deletedPks1.push(selection[i].tabCode)
        	}
        },
		
        cancingAll(selection){
        	if(selection.length == 0){
        		this.deletedPks1 = [];
        	}
        },
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
    },

	mounted() {
		this.tableHeight = window.innerHeight - this.$refs.dataList.$el.offsetTop - 280
	},
};
</script>
