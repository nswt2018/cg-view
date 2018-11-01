<style lang="less">
    @import '../../../styles/common.less';
</style>

<template>
   <Row>
        <Card>
              <p slot="title"> <Icon type="compose"></Icon>系统参数</p>
              <Row>
                <p>
                	<Input v-model="categoryId" placeholder="请输入参数类型" icon="search" 
                		style="width: 200px" @on-change="searching"></Input>
                	<Input v-model="paraCode" placeholder="请输入参数代码" icon="search" 
                    	style="width: 200px" @on-change="searching"></Input>
                    <Button style="margin: 2px;" :key="item.code" 
                			@click="onClicking(item.href)" :size="getFont" :type="item.icon" 
                			v-for="(item,index) in buttonInfos">{{ item.title }}</Button>	
        	    </p>	
        	  </Row>
        	  <Row>
        	     <Table highlight-row border ref="parmList" :size="getFont" height="410" 
                		:columns="columns"  :stripe="true"  :data="data_list"
                		@on-select="choicing" @on-select-cancel="cancing" @on-select-all="choicingAll" @on-selection-change="cancingAll"
                		></Table>
                  <div style="float: right;">
                	<Page  :total="totalCount" :current="1" :page-size="pageSize" 
                		:transfer="true" :size="getFont"
                		@on-change="changePage" @on-page-size-change="changePageSize"
                		show-total show-elevator show-sizer></Page>
                  </div>
                  <Button type="primary" :size="getFont" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>导出原始数据</Button>
        	  </Row>
        	<Modal width="700" v-model="viewModal"  title="系统参数信息查看">
        		<Form :model="viewForm" :label-width="100">
        			<FormItem label="参数类别：">
                        <Input :readonly="true" v-model="viewForm.categoryId" />
                    </FormItem>
                    <FormItem label="参数代码：">
                        <Input :readonly="true" v-model="viewForm.paraCode" />
                    </FormItem>
                    <FormItem label="参数名称：">
                        <Input :readonly="true" v-model="viewForm.paraName" />
                    </FormItem>
                    <FormItem label="参数值：">
                        <Input :readonly="true" v-model="viewForm.paraValue" />
                    </FormItem>
                    <FormItem label="参数描述：">
                        <Input :readonly="true" v-model="viewForm.paraDesc" type="textarea" :autosize="{minSize:2,maxSize:5}"/>
                    </FormItem>
                    <FormItem label="创建人：">
                        <Input :readonly="true" v-model="viewForm.crtUserCode" />
                    </FormItem>
                    <FormItem label="创建人机构：">
                        <Input :readonly="true" v-model="viewForm.crtOrgCode" />
                    </FormItem>
                    <FormItem label="创建时间：">
                        <Input :readonly="true" v-model="viewForm.crtDate" />
                    </FormItem>
                 </Form>   
        	</Modal>
	        <Modal width="700" v-model="addModal" title="系统参数信息"  ok-text="保存" cancel-text="关闭"
	       		:mask-closable="false" :loading="loading"
	       		 @on-ok="saving('addRef')" @on-cancel="reseting('addRef')">
	         	<Form ref="addRef" :model="addForm" :rules="addRules" :label-width="100">
	             <FormItem label="参数类别：" prop="categoryId" required>
	                 <Input v-model="addForm.categoryId" placeholder="请输入4位" />
	             </FormItem>
	             <FormItem label="参数代码：" prop="paraCode" required>
	                 <Input v-model="addForm.paraCode" placeholder="请输入" />
	             </FormItem>
	             <FormItem label="参数名称：" prop="paraName" required>
	                 <Input v-model="addForm.paraName"  />
	             </FormItem>
	             <FormItem label="参数值：" prop="paraValue" required>
	                 <Input v-model="addForm.paraValue"/>
	             </FormItem>
	             <FormItem label="参数描述：" prop="paraDesc" required>
	                 <Input v-model="addForm.paraDesc" type="textarea" :autosize="{minSize:2,maxSize:5}"/>
	             </FormItem>
	             <FormItem label="创建人：" >
	                 <Input :readonly="true" v-model="addForm.crtUserCode" />
	             </FormItem>
	             <FormItem label="创建人机构：">
	                 <Input :readonly="true" v-model="addForm.crtOrgCode"/>
	             </FormItem>
	             <FormItem label="创建时间：">
	             	<Input :readonly="true" v-model="addForm.crtDate"/>
	             </FormItem>
	         </Form> 
		    </Modal>
		    <Modal width="700" v-model="updModal" title="系统参数信息修改"  ok-text="修改" cancel-text="关闭"
	       		:mask-closable="false" :loading="updloading"
	       		 @on-ok="saving('updFormRef')" @on-cancel="reseting('updFormRef')">
	         	<Form ref="updFormRef" :model="updForm" :rules="updRules" :label-width="100">
	             <FormItem label="参数类别：" >
	                 <Input :readonly="true" v-model="updForm.categoryId" />
	             </FormItem>
	             <FormItem label="参数代码：">
	                 <Input :readonly="true" v-model="updForm.paraCode"/>
	             </FormItem>
	             <FormItem label="参数名称：" prop="paraName" required>
	                 <Input v-model="updForm.paraName"  />
	             </FormItem>
	             <FormItem label="参数值：" prop="paraValue" required>
	                 <Input v-model="updForm.paraValue"/>
	             </FormItem>
	             <FormItem label="参数描述：" prop="paraDesc" required>
	                 <Input v-model="updForm.paraDesc" type="textarea" :autosize="{minSize:2,maxSize:5}"/>
	             </FormItem>
	             <FormItem label="创建人：" >
	                 <Input :readonly="true" v-model="updForm.crtUserCode"/>
	             </FormItem>
	             <FormItem label="创建人机构：">
	                 <Input :readonly="true" v-model="updForm.crtOrgCode"/>
	             </FormItem>
	             <FormItem label="创建时间：">
	             	<Input :readonly="true" v-model="updForm.crtDate"/>
	             </FormItem>
	         </Form> 
		    </Modal>        	    
          </Card>
     </Row>
   </div>
</template>

<script>
import parmColumn from './parm-column.js';
import parmFun from '@/libs/parmfun.js';
import datetool from '@/libs/datetool.js';
import Cookies from 'js-cookie';

export default {
    name: 'parm-info',
    data () {
        return {
        	listurl: '/system/SY0002L3.do', 
        	saveurl: '/system/SY0002I2.do',
        	deleteurl: '/system/SY0002D2.do',
        	updateurl: '/system/SY0002U2.do',
        	categoryId:'',
        	paraCode:'',
        	addModal:false,
        	addForm:{},
        	updModal:false,
        	updForm:{},
        	viewModal:false,
        	viewForm:{},
        	selectedLines: 0,
        	loading:true,
        	updloading:true,
        	data_list:[],
        	pageSize: 10,
            currentPage: 1,
            totalPage: 0,
            totalCount: 0,
        	buttonInfos:[],          
        	columns:[],
        	deleteKey:[],
        	addRules:{
        		categoryId: [
                    {required: true, message: '参数类别不能为空', trigger: 'blur' }
                ],
        		paraCode: [
                    {required: true, message: '参数代码不能为空', trigger: 'blur' }
                ],
                paraName: [
                    {required: true, message: '参数名称不能为空', trigger: 'blur' }
                ],
                paraValue: [
                    {required: true, message: '参数值不能为空', trigger: 'blur' }
                ],
                paraDesc: [
                    {required: true, message: '参数描述不能为空', trigger: 'blur' }
                ]
        	},
        	updRules:{
        		paraName: [
                    {required: true, message: '参数名称不能为空', trigger: 'blur' }
                ],
                paraValue: [
                    {required: true, message: '参数值不能为空', trigger: 'blur' }
                ],
                paraDesc: [
                    {required: true, message: '参数描述不能为空', trigger: 'blur' }
                ]
        	}  
        };
    },
    methods: {
    	getSearch() {
    		let menuCode = Cookies.get('menucode');
        	return {'menuCode':menuCode,'pageSize': this.pageSize, 'currentPage': this.currentPage,
        	'valObj':{'categoryId': this.categoryId, 'paraCode': this.paraCode}
        	};
        },  
        init () {
       		parmFun.setPage(this);
       		parmFun.page(this.getSearch());
       		parmFun.getButtons()
        	this.columns = parmColumn.getColumns();
        },
        searching () {
    		parmFun.page(this.getSearch());
        },
        onClicking(type){
         	if(type==='ADD') {
	         	parmFun.add();
	         	var sysdate=datetool.format(new Date());
				this.addForm = {crtUserCode:'admin',crtOrgCode:'340321101',crtDate:sysdate};
			}else if(type==='VIEW') {
				parmFun.view();
			}else if(type==='DEL'){ 
         		parmFun.delete(this.deleteurl+"?paraCode="+this.deleteKey.join(','));
         	}else if(type==='UPD') {
         		parmFun.update();
         	}
        },
        saving(refValue){
         	parmFun.save(refValue);
        },
        reseting (refValue) {
 			this.$refs[refValue].resetFields();
        },
        choicing(selection, row) {
        	parmFun.choice(selection, row);
        },
        cancing(selection, row){
        	parmFun.cancel(selection, row);
        },
        choicingAll(selection){
        	this.selectedLines=selection.length;
        	this.deleteKey=[];
        	for(var i=0;i<this.selectedLines;i++){
        		this.deleteKey.push(selection[i].paraCode)
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
        },
        exportData(type){
        	if (type === 1) {
                    this.$refs.parmList.exportCsv({
                        filename: '系统参数'
                    });
                }
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
