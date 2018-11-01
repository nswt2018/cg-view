<style lang="less">
    @import '../../../styles/common.less';
</style>

<template>
   <Row>
        <Card>
              <p slot="title"> <Icon type="compose"></Icon>机构信息</p>
              <Row>
                <p>
                	<Input v-model="orgCode" placeholder="请输入机构编码" icon="search" 
                		style="width: 200px" @on-change="searching"></Input>
                	<Input v-model="orgBrief" placeholder="请输入机构简称" icon="search" 
                    	style="width: 200px" @on-change="searching"></Input>
                    <Button style="margin: 2px;" :key="item.code" 
                			@click="onClicking(item.href)" :size="getFont" :type="item.icon" 
                			v-for="(item,index) in buttonInfos">{{ item.title }}</Button>	
        	    </p>	
        	  </Row>
        	  <Row>
        	     <Table highlight-row border ref="orgList" :size="getFont" height="410" 
                		:columns="columns"  :stripe="true"  :data="data_list"
                		@on-select="choicing" @on-select-cancel="cancing" @on-select-all="choicingAll" @on-selection-change="cancingAll"
                		></Table>
                  <div style="float: right;">
                	<Page  :total="totalCount" :current="1" :page-size="pageSize" 
                		:transfer="true" :size="getFont"
                		@on-change="changePage" @on-page-size-change="changePageSize"
                		show-total show-elevator show-sizer></Page>
                  </div>		
        	  </Row>
        	<Modal width="700" v-model="viewModal"  title="机构信息查看">
        		<Form :model="viewForm" :label-width="100">
        			<FormItem label="机构ID：">
                        <Input :readonly="true" v-model="viewForm.orgId" />
                    </FormItem>
                    <FormItem label="机构编码：">
                        <Input :readonly="true" v-model="viewForm.orgCode" />
                    </FormItem>
                    <FormItem label="机构简称：">
                        <Input :readonly="true" v-model="viewForm.orgBrief" />
                    </FormItem>
                    <FormItem label="直接上级机构ID：">
                        <Input :readonly="true" v-model="viewForm.upOrgCode" />
                    </FormItem>
                    <FormItem label="机构类别：">
                        <Input :readonly="true" v-model="viewForm.orgCategory" />
                    </FormItem>
                    <FormItem label="机构级别：">
                        <Input :readonly="true" v-model="viewForm.orgGrade" />
                    </FormItem>
                    <FormItem label="机构层级：">
                        <Input :readonly="true" v-model="viewForm.orgLevel" />
                    </FormItem>
                 </Form>   
        	</Modal>
	        <Modal width="700" v-model="addModal" title="机构信息"  ok-text="保存" cancel-text="关闭"
	       		:mask-closable="false" :loading="loading"
	       		 @on-ok="saving('addRef')" @on-cancel="reseting('addRef')">
	         	<Form ref="addRef" :model="addForm" :rules="addRules" :label-width="100">
	             	<FormItem label="机构ID：" prop="orgId">
                        <Input required v-model="addForm.orgId" />
                    </FormItem>
                    <FormItem label="机构编码：" prop="orgCode">
                        <Input required v-model="addForm.orgCode" />
                    </FormItem>
                    <FormItem label="机构简称：" prop="orgBrief">
                        <Input required v-model="addForm.orgBrief" />
                    </FormItem>
                    <FormItem label="直接上级机构ID：" prop="upOrgCode">
                        <Input required v-model="addForm.upOrgCode" />
                    </FormItem>
                    <FormItem label="机构类别：" prop="orgCategory">
                        <Input required v-model="addForm.orgCategory" />
                    </FormItem>
                    <FormItem label="机构级别：" prop="orgGrade">
                        <Input required v-model="addForm.orgGrade" />
                    </FormItem>
                    <FormItem label="机构层级：" prop="orgLevel">
                        <Input required v-model="addForm.orgLevel" />
                    </FormItem>
	         </Form> 
		    </Modal>
		    <Modal width="700" v-model="updModal" title="机构信息修改"  ok-text="修改" cancel-text="关闭"
	       		:mask-closable="false" :loading="updloading"
	       		 @on-ok="saving('updRef')" @on-cancel="reseting('updRef')">
	         	<Form ref="updRef" :model="updForm" :rules="updRules" :label-width="100">
	             	<FormItem label="机构ID：" prop="orgId">
                        <Input required v-model="updForm.orgId" />
                    </FormItem>
                    <FormItem label="机构编码：" prop="orgCode">
                        <Input required v-model="updForm.orgCode" />
                    </FormItem>
                    <FormItem label="机构简称：" prop="orgBrief">
                        <Input required v-model="updForm.orgBrief" />
                    </FormItem>
                    <FormItem label="直接上级机构ID：" prop="upOrgCode">
                        <Input required v-model="updForm.upOrgCode" />
                    </FormItem>
                    <FormItem label="机构类别：" prop="orgCategory">
                        <Input required v-model="updForm.orgCategory" />
                    </FormItem>
                    <FormItem label="机构级别：" prop="orgGrade">
                        <Input required v-model="updForm.orgGrade" />
                    </FormItem>
                    <FormItem label="机构层级：" prop="orgLevel">
                        <Input required v-model="updForm.orgLevel" />
                    </FormItem>
	         </Form> 
		    </Modal>        	    
          </Card>
     </Row>
   </div>
</template>

<script>
import orgColumn from './org-column';
import parmFun from '@/libs/parmfun';
import Cookies from 'js-cookie';

export default {
    name: 'org-info',
    data () {
        return {
        	listurl: '/system/SY0003L1.do', 
        	saveurl: '/system/SY0003I1.do',
        	deleteurl: '/system/SY0003D1.do',
        	updateurl: '/system/SY0003U1.do',
        	orgCode:'',
        	orgBrief:'',
        	addModal:false,
        	addForm:{},
        	updModal:false,
        	updForm:{},
        	viewModal:false,
        	viewForm:{},
        	selectedLines: 0,
        	loading:true,
        	updloading:true,
        	size:'default',
        	data_list:[],
        	pageSize: 10,
            currentPage: 1,
            totalPage: 0,
            totalCount: 0,
        	buttonInfos:[
        	 		   {title:'查看',
        	           code:'100101',
        	           icon:'info',
        	           href:'view'
        	           },
        	           {title:'新增',
        	           code:'100102',
        	           icon:'primary',
        	           href:'add'
        	           },
        	           {title:'修改',
        	           code:'100103',
        	           icon:'warning',
        	           href:'upd'
        	           },
        	           {title:'删除',
        	           code:'100104',
        	           icon:'error',
        	           href:'del'
        	           }
        	          ],          
        	columns:[],
        	deleteKey:[],
        	addRules:{
        		orgId: [
                    {required: true, message: '机构ID不能为空', trigger: 'blur' }
                ],
        		orgCode: [
                    {required: true, message: '机构编码不能为空', trigger: 'blur' }
                ],
                orgBrief: [
                    {required: true, message: '机构简称不能为空', trigger: 'blur' }
                ],
                upOrgCode: [
                    {required: true, message: '直接上级机构ID不能为空', trigger: 'blur' }
                ],
                orgCategory: [
                    {required: true, message: '机构类别不能为空', trigger: 'blur' }
                ],
                orgGrade: [
                    {required: true, message: '机构级别不能为空', trigger: 'blur' }
                ],
                orgLevel: [
                    {required: true, message: '机构层级不能为空', trigger: 'blur' }
                ]
        	},
        	updRules:{
        		orgId: [
                    {required: true, message: '机构ID不能为空', trigger: 'blur' }
                ],
        		orgCode: [
                    {required: true, message: '机构编码不能为空', trigger: 'blur' }
                ],
                orgBrief: [
                    {required: true, message: '机构简称不能为空', trigger: 'blur' }
                ],
                upOrgCode: [
                    {required: true, message: '直接上级机构ID不能为空', trigger: 'blur' }
                ],
                orgCategory: [
                    {required: true, message: '机构类别不能为空', trigger: 'blur' }
                ],
                orgGrade: [
                    {required: true, message: '机构级别不能为空', trigger: 'blur' }
                ],
                orgLevel: [
                    {required: true, message: '机构层级不能为空', trigger: 'blur' }
                ]
        	}  
        };
    },
    methods: {
    	getSearch() {
    		let menuCode = Cookies.get('menucode');
        	return {'menuCode':menuCode,'pageSize': this.pageSize, 'currentPage': this.currentPage,
        	'valObj':{'orgCode': this.orgCode, 'orgBrief': this.orgBrief}
        	};
        }, 
        init () {
       		parmFun.setPage(this);
       		parmFun.page(this.getSearch());
        	this.columns = orgColumn.getColumns();
        },
        searching () {
    		parmFun.page(this.getSearch());
        },
        onClicking(type){
         	if(type==='add') parmFun.add();
         	else if(type==='view') parmFun.view();
         	else if(type==='del') parmFun.delete(this.deleteurl+"?orgid="+this.deleteKey.join(','));
         	else if(type==='upd') parmFun.update();
        },
        saving(refValue){
         	parmFun.save(refValue);
        },
        reseting (refValue) {
 			this.$refs[refValue].resetFields();
        },
        choicing(selection,row) {
        	this.selectedLines=selection.length;
			this.viewForm=row;
			this.updForm=row;
			this.deleteKey.push(row.orgId);
        },
        cancing(selection, row){
        	this.selectedLines=selection.length;
			if(this.selectedLines>0){
			    this.viewForm=selection[0];
			    this.updForm=selection[0];
				this.deleteKey.splice(this.deleteKey.indexOf(row.orgId), 1);
			}else{
				this.viewForm={};
				this.updForm={};
				this.deleteKey=[];
			}
        },
        choicingAll(selection){
        	this.selectedLines=selection.length;
        	this.deleteKey=[];
        	for(var i=0;i<this.selectedLines;i++){
        		this.deleteKey.push(selection[i].orgId)
        	}
        },
        cancingAll(selection){
        	this.selectedLines=selection.length;
        	if(this.selectedLines==0){
        		this.deleteKey=[];
        	}
        },
        changePage (page) {
        	let cond = this.getSearch();
        	cond.currentPage = page;
        	parmFun.page(cond);
        },
        changePageSize (_pageSize) {
        	let cond = this.getSearch();
        	cond.pageSize = _pageSize;
        	parmFun.page(cond);        	
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
