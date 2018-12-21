<style lang="less">
    @import '../../../../../styles/common.less';
</style>

<template>
    <div>
        <Row :gutter="5">
			<Col span="12">
				<Card>
					<p slot="title"> <Icon type="compose"></Icon>模型定义</p>
					<Row>
						<p>
							<Input v-model="sModelCode" placeholder="请输入模型代码搜索" icon="search" 
								style="width: 200px" @on-change="searching"></Input>
							<Input v-model="sModelName" placeholder="请输入模型名称搜索" icon="search" 
								style="width: 200px" @on-change="searching"></Input>
							&nbsp;
							<Button type="primary" @click="handleInsert()">新增</Button>
							<Button type="success" @click="handleUpdate()">修改</Button>
							<Button type="warning" @click="handleDelete()">删除</Button>
						</p>
					</Row>
					<Row>
						<Table highlight-row border ref="dataList" @size="getFont" height="410" 
							:columns="columns" :data="list_data" :stripe="true" 
							@on-select="choicing" @on-select-cancel="cancing" 
							@on-sort-change="sorting">
						</Table>
						<div style="float: right;">
							<Page :total="totalCount" :current="1" :page-size="pageSize" 
								:transfer="true" @size="getFont"
								@on-change="changePage" @on-page-size-change="changePageSize" 
								show-total show-elevator show-sizer>
							</Page>
						</div>
					</Row>
				</Card>
			</Col>
			<Col span="12">
				<Card>
					<p slot="title"> <Icon type="compose"></Icon>模块定义</p>
					<Row>
						<p>
							<Input v-model="sModuEName" placeholder="请输入英文名称搜索" icon="search" 
								style="width: 200px" @on-change="searching1"></Input>
							<Input v-model="sModuCName" placeholder="请输入中文名称搜索" icon="search" 
								style="width: 200px" @on-change="searching1"></Input>
							&nbsp;
							<Button type="warning" @click="handleScan()">浏览</Button>
						</p>
					</Row>
					<Row>
						<Table highlight-row border ref="moduList" @size="getFont" height="410" 
							:columns="moduColumns" :data="modulist_data" :stripe="true" 
							@on-row-click="singleClick" @on-row-dblclick="doubleClick">
						</Table>
						<div style="float: right;">
							<Page :total="totalCount1" :current1="1" :page-size="pageSize1"
								:transfer="true" @size="getFont"
								@on-change="changePage1" @on-page-size-change="changePageSize1"
								show-total show-elevator show-sizer>
							</Page>
						</div>
					</Row>
				</Card>
			</Col>
		</Row>
                 
			 
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
		
		
		<!-- 模块浏览 -->
		<Modal width="700" v-model="moduScan" title="模块信息" cancel-text="关闭" :mask-closable="false">
			<Form :model="moduScanModel" :label-width="100">
				<FormItem label="模块代码" prop="moduCode">
					<Input v-model="moduScanModel.moduCode" readonly/>
				</FormItem>
				</FormItem>
				<FormItem label="中文名称" prop="moduCName">
					<Input v-model="moduScanModel.moduCName" readonly/>
				</FormItem>
				<FormItem label="模块交易号" prop="moduTC">
					<Input v-model="moduScanModel.moduTC" readonly/>
				</FormItem>
				<FormItem label="所属模型" prop="modName">
					<Input v-model="moduScanModel.modName" readonly/>
				</FormItem>
				<FormItem label="创建日期" prop="crtDate">
					<Input v-model="moduScanModel.crtDate" readonly/>
				</FormItem>
				<FormItem label="修改日期" prop="updDate">
					<Input v-model="moduScanModel.updDate" readonly/>
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


export default {
    name: 'model-info',
    data () {
        return {
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
			deletedPks: [],
			viewModal: false,
			moduColumns: [],
			modulist_data: [],
			currentPage1: 1,
			totalCount1: 0,
			pageSize1: 10,
			sModuEName: '',
			sModuCName: '',
			moduScan: false,
			moduScanModel: {},
			index: -1
        };
    },
    methods: {  
		getSearchCond() {
        	return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
        		'valObj': {'modCode': this.sModelCode, 'modName': this.sModelName}
        	};
        },
		
		getModuCond() {
        	return {'menuCode': '', 'pageSize': this.pageSize1, 'currentPage': this.currentPage1, 
        		'valObj': {'moduEName': this.sModuEName, 'moduCName': this.sModuCName, 'moduModel': this.deletedPks.join(',')}
        	};
        },
		
        init () {
        	pagetool.setPage(this);
        	modelcolumn.setPage(this);
        	pagetool.page(this.getSearchCond());
        	//pagetool.getButtons();
        	this.columns = modelcolumn.getColumns();
			this.moduColumns = modelcolumn.getModuColumns();
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
        	modelcolumn.choice(selection, row);
        },
        cancing(selection, row) {
        	modelcolumn.cancel(selection, row);        	
        },
		
		//新增页面
		handleInsert(){
			pagetool.reset('addFormRef');
			this.addModal = true;
		},
		
		
		//新增保存
		saving(name) {
			this.addModel.crtDate = datetool.format(new Date());
        	pagetool.save(name);
        },
		
		//新增/修改取消
        reseting (name) {
        	//pagetool.reset(name);
			this.addModal = false;
        },
		
		//删除操作
        handleDelete () {
        	modelcolumn.delete(this.deleteurl+"?modCode="+this.deletedPks.join(','));
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
			this.viewModal = true;
		},
		
		//修改保存
		update (name) {
			this.viewOrUpdateModel.updDate = datetool.format(new Date());
			modelcolumn.update(name);
		},
		
		changePage1 (page) {
			let cond = this.getModuCond();
			cond.currentPage = page;
			modelcolumn.getModuDataList(cond);
        },

        changePageSize1 (_pageSize) {
			let cond = this.getModuCond();
			cond.pageSize = _pageSize;
			modelcolumn.getModuDataList(cond);			
        }, 
		
		searching1 () {
    		modelcolumn.getModuDataList(this.getModuCond());
        },
		
		//单选
		singleClick (row, index) {
			this.index = index;
			this.moduScanModel = row;
		},
		
		//多选
		doubleClick (row, index) {
			this.index = index;
			this.moduScanModel = row;
			this.moduScan = true;
		},
		
		//模块浏览
		handleScan() {
			if(this.index == -1){
				this.$Modal.warning({
					title: '提示信息',
					content: '请选中一条记录！'
				});
				
				return;
			}
			this.moduScan = true;
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
