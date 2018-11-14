<style lang="less">
    @import '../../../../../styles/common.less';
</style>

<template>
    <div>
        <Row>
            <Card>
                <p slot="title"> <Icon type="compose"></Icon>表定义</p>
                <Row>
                	<p>
                		<Input v-model="sTabCode" placeholder="请输入表中文名称搜索" icon="search" 
                			style="width: 200px" @on-change="searching"></Input>
                		<Input v-model="sTabName" placeholder="请输入表英文名称搜索" icon="search" 
							style="width: 200px" @on-change="searching"></Input>
						&nbsp;
                		<Button type="primary" @click="handleInsert()">新增</Button>
                		<Button type="success" @click="handleUpdate()">修改</Button>
						<Button type="warning" @click="handleDelete()">删除</Button>
						<Button type="info" @click="tabFactory()">表创建</Button>
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
				<Modal width="700" v-model="addModal" title="表信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false" :loading="loading"
					@on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')">
					<Form ref="addFormRef" :model="addModel" :rules="modelAddRules" :label-width="100">
						 <FormItem label="表名" prop="tabCode">
							 <Input v-model="addModel.tabCode" placeholder="请输入表英文名称" />
						 </FormItem>
						 <FormItem label="中文名称" prop="tabName">
							 <Input v-model="addModel.tabName" placeholder="请输入表中文名称" />
						 </FormItem>
						 <FormItem label="备注" prop="tabComm">
							 <Input v-model="addModel.tabComm" />
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
							 <Input v-model="viewOrUpdateModel.tabComm" />
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
import tabDefinition from './tabDefinition_column';
import Cookies from 'js-cookie';


export default {
    name: 'module-info',
    data () {
        return {
        	headers: {'Content-Type': 'application/json;charset=UTF-8'},
        	listurl: '/business/TK0007L.do', 
			saveurl: '/business/TK0007I.do',
			deleteurl: '/business/TK0007D.do',
			updateurl: '/business/TK0007U.do', 
			createTaburl: '/business/TK0007G.do',
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
			selectedLines: 0,
			deletedPks: [],
			viewModal: false
        };
    },
    methods: {  
		getSearchCond() {
    		//let menuCode = Cookies.get('menucode');
        	return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
        		'valObj': {'tabCode': this.sTabCode, 'tabName': this.sTabName}
        	};
        },
        init () {
        	pagetool.setPage(this);
        	tabDefinition.setPage(this);
        	pagetool.page(this.getSearchCond());
        	this.columns = tabDefinition.getColumns();
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
        	tabDefinition.choice(selection, row);
        },
        cancing(selection, row) {
        	tabDefinition.cancel(selection, row);        	
        },
		
		//新增页面
		handleInsert(){
			this.addModal = true;
			this.handleReset('addFormRef');
		},
		
		//新增保存
		saving(name) {
			this.addModel.crtDate = datetool.format(new Date());
        	pagetool.save(name);
        },
		
		//新增/修改取消
        reseting (name) {
        	pagetool.reset(name);
        },
		
		//对整个表单进行重置，将所有字段值重置为空并移除校验结果
		handleReset (name) {
			this.$refs[name].resetFields();
		},
		
		//删除操作
        handleDelete () {
        	tabDefinition.delete(this.deleteurl+"?tabCode="+this.deletedPks.join(','));
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
			
			this.viewModal = true;
		},
		
		//修改保存
		update (name) {
			this.viewOrUpdateModel.updDate = datetool.format(new Date());
			tabDefinition.update(name);
		},
		
		//生成表
		tabFactory () {
			tabDefinition.tabFactory(this.createTaburl+"?tabCode="+this.deletedPks.join(','));
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
