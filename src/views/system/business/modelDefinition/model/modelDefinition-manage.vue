<style lang="less">
    @import '../../../../../styles/common.less';
</style>

<template>
    <div>
        <Row>
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
            </Card>
        </Row>
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
			viewModal: false
        };
    },
    methods: {  
		getSearchCond() {
    		//let menuCode = Cookies.get('menucode');
        	return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
        		'valObj': {'modCode': this.sModelCode, 'modName': this.sModelName, 'orgCode': this.sOrgCode}
        	};
        },
        init () {
        	pagetool.setPage(this);
        	modelcolumn.setPage(this);
        	pagetool.page(this.getSearchCond());
        	//pagetool.getButtons();
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
