<style>
</style>
<template>
  <Row>
	<Card>
	   <p slot="title"> <Icon type="compose"></Icon>测试</p>
	 <Row>
          <p>
	        <Input type="text" v-model="testKey" placeholder="请输入测试主键" style="width:200px" @on-change="searching" icon="search"></Input>
	        <Input type="text" v-model="testOne" placeholder="请输入测试第一个字段" style="width:200px" @on-change="searching" icon="search"></Input>
	        <Input type="text" v-model="testTwo" placeholder="请输入测试第二个字段" style="width:200px" @on-change="searching" icon="search"></Input>
	        <Button style="margin: 2px;" v-for="(item,index) in buttonInfos" :type="item.icon"  
 					:key="item.code" @click="onClicking(item.href)" :size="getSizeValue">{{item.title }}</Button>   
          </p>	
     </Row>
     <Row>
       	   <Table :columns="columns" :data="data_list" height="410" highlight-row
       	         border :size="getSizeValue" :stripe="true" @on-select="choicing" @on-select-cancel="cancing" @on-select-all="choicingAll" @on-selection-change="cancingAll"></Table>	
	 	  <div style="float: right;">
               <Page  :total="totalCount" :current="1" :page-size="pageSize" 
               	      :transfer="true" :size="getSizeValue" @on-change="changePage" @on-page-size-change="changePageSize" show-total show-elevator show-sizer></Page> 	
          </div> 
     </Row>
	 		<Modal v-model="viewModal" title="信息查看" width="700"       >
	           <Form ref="viewFormRef" :model="viewForm" :label-width="100">
	              <FormItem label="测试主键:" >
	                 <Input :readonly="true" v-model="viewForm.testKey" />
	              </FormItem>

	              <FormItem label="测试第一个字段:" >
	                 <Input :readonly="true" v-model="viewForm.testOne" />
	              </FormItem>

	              <FormItem label="测试第二个字段:" >
	                 <Input :readonly="true" v-model="viewForm.testTwo" />
	              </FormItem>
	        </Form>
	        </Modal>  
	 		<Modal v-model="addModal" title="信息新增" width="700" ok-text="保存" cancel-text="关闭" :loading="addloading"   :mask-closable="false"  @on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')">
	           <Form ref="addFormRef" :model="addForm" :rules="addRules" :label-width="100">
	              <FormItem label="测试主键:" prop="testKey" required >
	                 <Input v-model="addForm.testKey" placeholder="请输入测试主键" />
	              </FormItem>

	              <FormItem label="测试第一个字段:" prop="testOne" required >
	                 <Input v-model="addForm.testOne" placeholder="请输入测试第一个字段" />
	              </FormItem>

	              <FormItem label="测试第二个字段:" prop="testTwo" required >
	                 <Input v-model="addForm.testTwo" placeholder="请输入测试第二个字段" />
	              </FormItem>
	          </Form>
	        </Modal>  
	 		<Modal v-model="updModal" title="信息修改" width="700" ok-text="保存" cancel-text="关闭" :loading="updloading"   :mask-closable="false"  @on-ok="saving('updFormRef')" @on-cancel="reseting('updFormRef')">
	           <Form ref="updFormRef" :model="updForm" :rules="updRules" :label-width="100">
	              <FormItem label="测试主键:" prop="testKey" required >
	                 <Input v-model="updForm.testKey" placeholder="请输入测试主键" />
	              </FormItem>

	              <FormItem label="测试第一个字段:" prop="testOne" required >
	                 <Input v-model="updForm.testOne" placeholder="请输入测试第一个字段" />
	              </FormItem>

	              <FormItem label="测试第二个字段:" prop="testTwo" required >
	                 <Input v-model="updForm.testTwo" placeholder="请输入测试第二个字段" />
	              </FormItem>
	           </Form>
	        </Modal>  
 	</Card>
  </Row>
</template>
<script>
import datetool from '@/libs/datetool';
import pagepublictool from '@/libs/pagepublictool';
import Cookies from 'js-cookie';
import TestColumn from './Test-column.js';

export default {
    name: 'Test-info',
    data () {
        return {
        	listurl: '/system/TS001L.do', 
        	saveurl: '/system/TS001I.do',
        	deleteurl: '/system/TS001D.do',
        	updateurl: '/system/TS001U.do',
        	testKey:'',
        	testOne:'',
        	testTwo:'',
        	viewModal:false,
        	viewForm:{},
        	addModal:false,
        	addForm:{},
        	addloading:true,
        	updModal:false,
        	updForm:{},
        	updloading:true,
        	selectedLines: 0,
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
        	addRules:{
        	    testKey: [
                   	 {required: true, message: '测试主键不可为空', trigger: 'blur' }
                   ],                                 
        	    testOne: [
                   	 {required: true, message: '测试第一个字段不可为空', trigger: 'blur' }
                   ],                                 
        	    testTwo: [
                   	 {required: true, message: '测试第二个字段不可为空', trigger: 'blur' }
                   ]                                 
        	},
        	updRules:{
        	    testKey: [
                   	 {required: true, message: '测试主键不可为空', trigger: 'blur' }
                   ],
        	    testOne: [
                   	 {required: true, message: '测试第一个字段不可为空', trigger: 'blur' }
                   ],
        	    testTwo: [
                   	 {required: true, message: '测试第二个字段不可为空', trigger: 'blur' }
                   ]
        	},
       	    deleteKey:[]
        };
    },
    methods: {
    	getSearch() {
    		let menuCode = Cookies.get('menucode');
        	return {'menuCode':menuCode,'pageSize': this.pageSize, 'currentPage': this.currentPage
        	,'valObj':{'testKey': this.testKey,'testOne': this.testOne,'testTwo': this.testTwo}        	};
        },  
        init () {
       		pagepublictool.setPage(this);
        	pagepublictool.page(this.getSearch());
        	//pagepublictool.getButtons();
        	this.columns=TestColumn.getColumns();
        },
        searching () {
    		pagepublictool.page(this.getSearch());
        },
        onClicking(type){
         	if(type==='VIEW' || type==='view') pagepublictool.view();
        	else if(type==='ADD'  || type==='add') pagepublictool.add();
        	else if(type==='UPD' || type==='upd') pagepublictool.update();
        	else if(type==='DEL' || type==='del') pagepublictool.delete(this.deleteurl+"?delKeys="+this.deleteKey.join(','));
        },
        saving(refValue){
         	pagepublictool.save(refValue);
        },
        reseting (refValue) {
 			pagepublictool.reset(refValue);
        },
        choicing(selection, row) {
        	pagepublictool.choice(selection, row);
        	this.deleteKey.push(row.testKey);
        },
        cancing(selection, row){
        	pagepublictool.cancel(selection, row);
        },
        choicingAll(selection){
        	this.selectedLines=selection.length;
        	this.deleteKey=[];
        	for(var i=0;i<this.selectedLines;i++){
        		this.deleteKey.push(selection[i].testKey)
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
        	pagepublictool.page(cond);
        },
        changePageSize (_pageSize) {
        	let cond = this.getSearch();
        	cond.pageSize = _pageSize;
        	pagepublictool.page(cond);        	
        },
    },
    created() {
    	this.init();
    },
    computed:{
		//pagepublictool.getSizeValue();
    }  
};
</script>