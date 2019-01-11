<style lang="less">
    @import '../../../../../styles/common.less';
</style>
<style lang="less">
	.split-pane{
		padding: 3px;
	}
</style>
<template>
     <div id="div1">
        <Split v-model="split">
			<div slot="left" class="split-pane">
				<Card>
					<p slot="title"> <Icon type="compose"></Icon>模型定义</p>
					<Row>
						<p>
							<Input v-model="sModelCode" placeholder="请输入模型代码搜索" icon="search" 
								style="width: 150px" @on-change="searching"></Input>
							<Input v-model="sModelName" placeholder="请输入模型名称搜索" icon="search" 
								style="width: 150px" @on-change="searching"></Input>
							&nbsp;
							<Button type="primary" @click="handleInsert()">新增</Button>
							<Button type="success" @click="handleUpdate()">修改</Button>
							<Button type="warning" @click="handleDelete()">删除</Button>
						</p>
					</Row>
					<Row>
						<Table highlight-row border ref="dataList" :size="getFont" :height="tableHeight" 
							:columns="columns" :data="list_data" :stripe="true" 
							@on-row-click="singleclick" @on-sort-change="sorting">
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
				<componetDefinition ref="componet"/>
			</div>
		</Split>       
			 
		<!-- 新增页面 -->
		<Modal width="700" v-model="addModal" title="模型信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false" :loading="loading"
			@on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')">
			<Form ref="addFormRef" :model="addModel" :rules="modelAddRules" :label-width="100">
				<FormItem label="模型代码" prop="modCode">
					 <Input v-model="addModel.modCode" placeholder="请输入4位模型代码" />
				 </FormItem>
				 <FormItem label="模型名称" prop="modName">
					 <Input v-model="addModel.modName" placeholder="请输入模型中文名称" />
				 </FormItem>
				 <FormItem label="版本" prop="modVersion">
					 <Input v-model="addModel.modVersion" placeholder="请输入版本" />
				 </FormItem>
				 <FormItem label="备注" prop="remarks">
					 <Input v-model="addModel.remarks"/>
				 </FormItem>
			 </Form>    	
		</Modal>
			
		<!-- 修改页面 -->
		<Modal width="700" v-model="viewModal" title="模型信息" ok-text="保存" cancel-text="关闭" :mask-closable="false" :loading="loading"
			@on-ok="update('updFormRef')">
			<Form ref="updFormRef" :model="viewOrUpdateModel" :label-width="100" :rules="modelUpdRules">
				<FormItem label="模型代码" prop="modCode">
					 <Input v-model="viewOrUpdateModel.modCode" disabled/>
				 </FormItem>
				 <FormItem label="模型名称" prop="modName">
					 <Input v-model="viewOrUpdateModel.modName"/>
				 </FormItem>
				 <FormItem label="版本" prop="modVersion">
					 <Input v-model="viewOrUpdateModel.modVersion"/>
				 </FormItem>
				 <FormItem label="备注" prop="remarks">
					 <Input v-model="viewOrUpdateModel.remarks"/>
				 </FormItem>
			</Form>    	
		</Modal>
    </div>

</template>

<script>
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';
import modelcolumn from './model_column';
import Cookies from 'js-cookie';
import componetDefinition from '../componet/componetDefinition-manage.vue';


export default {
    name: 'model-info',
	components: {
            componetDefinition
		},
    data () {
        return {
			split: 0.5,
        	headers: {'Content-Type': 'application/json;charset=UTF-8'},
        	listurl: '/business/TK0001L.do', 
			saveurl: '/business/TK0001I.do',
			deleteurl: '/business/TK0001D.do',
			updateurl: '/business/TK0001U.do',  
			modulisturl: '/business/TK0001L1.do',
			list_data: [],
			pageSize: 10,
			currentPage: 1,
			totalCount: 0,
			totalPage: 0,
			sModelCode: '',
			sModelName: '',
			sOrgCode: '',
			orderFileds: [],
			addModal: false,
			addModel: {},
			loading: true,
			modelAddRules: {
            	modCode : [{required: true}],
				modName : [{required: true}],
				modVersion : [{required: true}]
            },
			modelUpdRules: {
				modVersion : [{required: true}]
            },
			viewOrUpdateModel: {},
            columns: [],
			selectedLines: 0,
			deletedPks: '',
			viewModal: false,
			tableHeight: 410,
			index: -1
        };
    },
    methods: {  
		getSearchCond() {
        	return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
        		'valObj': {'modCode': this.sModelCode, 'modName': this.sModelName}
        	};
        },
		
        init () {
        	pagetool.setPage(this);
        	modelcolumn.setPage(this);
        	pagetool.page(this.getSearchCond());
        	this.columns = modelcolumn.getColumns();
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
		
		//单选
		singleclick(row, index){
			
			this.index = index;
			this.viewOrUpdateModel = row;
			
			this.deletedPks = row.modCode;
	
			this.$refs.componet.getComponetDataList(row.modCode);
		},
		
		//新增页面
		handleInsert(){
			pagetool.reset('addFormRef');
			this.addModal = true;
		},
		
		
		//新增保存
		saving(name) {
			this.addModel.crtDate = datetool.format(new Date());
        	modelcolumn.save(name);
        },
		
		//新增/修改取消
        reseting (name) {
			this.addModal = false;
        },
		
		//删除操作
        handleDelete () {
        	modelcolumn.delete(this.deleteurl+"?modCode="+this.deletedPks);
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
			if(this.selectedLines > 1) {
				this.$Modal.warning({
					title: '提示信息',
					content: '只能选中一条记录！'
				});
				
				return;
			};
			this.viewModal = true;
		},
		
		//修改保存
		update (name) {
			this.viewOrUpdateModel.updDate = datetool.format(new Date());
			modelcolumn.update(name);
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
		document.getElementById("div1").style.height = this.tableHeight + 'px'
	},
};
</script>
