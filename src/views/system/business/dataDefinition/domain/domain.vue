<style>
</style>
<template>
	<div>
		<Row>
			<Card>
				<p slot="title"><Icon type="compose"></Icon>域定义</p>
				<Row>
					<p>
						<Input type="text" v-model="ename" placeholder="请输入英文名称" style="width:200px" @on-change="searching" icon="search"></Input>
						<Input type="text" v-model="cname" placeholder="请输入中文名称" style="width:200px" @on-change="searching" icon="search"></Input>
						<Button style="margin: 2px;" v-for="(item,index) in buttonInfos" :type="item.icon"  
							:key="item.code" @click="onClicking(item.href)" :size="getSizeValue">{{item.title }}</Button>   
					</p>	
				</Row>
				<Row>
					<Table :columns="columns" :data="data_list" height="410" highlight-row
						 border :size="getSizeValue" :stripe="true" @on-select="choicing" @on-select-cancel="cancing" @on-select-all="choicingAll" @on-selection-change="cancingAll"></Table>	
					<div style="float: right;">
					<Page  :total="totalCount" :current="1" :page-size="pageSize" :transfer="true" 
						@on-change="changePage" @on-page-size-change="changePageSize" show-total show-elevator show-sizer>
					</Page> 	
					</div> 
				</Row>
			</Card>
		</Row>
		
		<Modal v-model="viewModal" title="信息查看" width="700">
			<Form ref="viewFormRef" :model="viewForm" :label-width="100" inline>
				<FormItem label="英文名称" prop="ename">
					<Input :readonly="true" v-model="viewForm.ename" style="width:170px"/>
				</FormItem>
				<FormItem label="中文名称" prop="cname">
					<Input :readonly="true" v-model="viewForm.cname" style="width:170px"/>
				</FormItem>
				<FormItem label="数据类型" prop="dataType">
					<Input :readonly="true" v-model="viewForm.dataType" style="width:170px"/>
				</FormItem>
				<FormItem label="长度" prop="dataLen">
					<Input :readonly="true" v-model="viewForm.dataLen" style="width:170px"/>
				</FormItem>
			</Form>
		</Modal>  
			
		<Modal v-model="addModal" title="信息新增" width="700" ok-text="保存" cancel-text="关闭" :loading="addloading" :mask-closable="false"  @on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')">
			<Form ref="addFormRef" :model="addForm" :rules="addRules" :label-width="100" inline>
				<FormItem label="英文名称" prop="ename">
					<Input v-model="addForm.ename" placeholder="英文名称"/>
				</FormItem>
				<FormItem label="中文名称" prop="cname">
					<Input v-model="addForm.cname" placeholder="中文名称"/>
				</FormItem>
				<FormItem label="字段类型" prop="dataType">
					<Select v-model="addForm.dataType" style="width:170px" @on-change="dataTypeChage('A')" clearable filterable>
						<Option v-for="item in dtList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</FormItem>
				<FormItem label="字段长度" prop="dataLen">
					<Input v-model="addForm.dataLen" style="width:170px"/>
				</FormItem>
			</Form>
		</Modal> 
			
		<Modal v-model="updModal" title="信息修改" width="700" ok-text="保存" cancel-text="关闭" :loading="updloading" :mask-closable="false"  @on-ok="saving('updFormRef')" @on-cancel="reseting('updFormRef')">
			<Form ref="updFormRef" :model="updForm" :rules="updRules" :label-width="100" inline>
				<FormItem label="英文名称" prop="ename">
					<Input v-model="updForm.ename" placeholder="英文名称" disabled/>
				</FormItem>
				<FormItem label="中文名称" prop="cname">
					<Input v-model="updForm.cname" placeholder="中文名称"/>
				</FormItem>
				<FormItem label="字段类型" prop="dataType">
					<Select v-model="updForm.dataType" style="width:170px" @on-change="dataTypeChage('U')" clearable filterable>
						<Option v-for="item in dtList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</FormItem>
				<FormItem label="字段长度" prop="dataLen">
					<Input v-model="updForm.dataLen" style="width:170px"/>
				</FormItem>
		   </Form>
		</Modal>  
	</div>
</template>
<script>

import datetool from '@/libs/datetool';
import pagepublictool from '@/libs/pagepublictool';
import Cookies from 'js-cookie';
import domain from './domain-column.js';

export default {
    name: 'domain-info',
    data () {
		var validateDataLen = (rule, value, callback) =>{
			var self = this;
			let dataType;
			let dataLen;
			if(self.addModal){
				dataType = this.addForm.dataType;
				dataLen = this.addForm.dataLen != null? this.addForm.dataLen.replace(/^\s+|\s+$/g,''):'';
			}else if(self.updModal){
				dataType = this.updForm.dataType;
				dataLen = this.updForm.dataLen != null? this.updForm.dataLen.replace(/^\s+|\s+$/g,''):'';
			}else{
				callback();
			}
			
			if((dataType === 'decimal' || dataType === 'char' || dataType === 'varchar') && !value){
				return callback(new Error("字段长度不能为空！"));
			}else if((dataType === 'int' || dataType === 'date' || dataType === 'datetime') && value){
				return callback(new Error("int/date/datetime类型字段长度默认,不必输入！"));
			}else{
				callback();
			}
		};

		var validateDataType = (rule, value, callback) =>{
			var self = this;
			if(self.addModal || self.updModal){
				if(!value){
					return callback(new Error(rule.message));
				}else{
					callback();
				}
			}else{
				callback();
			}
		};
        return {
        	listurl: '/business/TK0010L.do', 
        	saveurl: '/business/TK0010I.do',
        	deleteurl: '/business/TK0010D.do',
        	updateurl: '/business/TK0010U.do',
        	ename:'',
        	cname:'',
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
        		{
					title:'查看',
					code:'100101',
					icon:'info',
					href:'view'
		        },
		        {
					title:'新增',
					code:'100102',
					icon:'primary',
					href:'add'
		        },
		        {
					title:'修改',
					code:'100103',
					icon:'warning',
					href:'upd'
		        },
		        {
					title:'删除',
					code:'100104',
					icon:'error',
					href:'del'
        		} 	   
        	],          
        	columns:[],
        	addRules: {
				ename : [{required: true, message: '英文名称不能为空！', trigger: 'blur'}],
				dataType : [{validator: validateDataType, message: '字段类型不能为空！', trigger: 'change'}],
				dataLen : [{validator: validateDataLen, trigger: 'blur'}]
			},
			updRules: {
				ename : [{required: true, message: '英文名称不能为空！', trigger: 'blur'}],
				dataType : [{validator: validateDataType, message: '字段类型不能为空！', trigger: 'change'}],
				dataLen : [{validator: validateDataLen, trigger: 'blur'}]
			},
       	    deleteKey:[],
			dtList: [
				{
					value: 'char',
					label: 'char'
				},
				{
					value: 'date',
					label: 'date'
				},
				{
					value: 'datetime',
					label: 'datetime'
				},
				{
				value: 'decimal',
				label: 'decimal'
				},
				{
					value: 'int',
					label: 'int'
				},
				{
					value: 'varchar',
					label: 'varchar'
				}
			]
        };
    },
    methods: {
    	getSearch() {
    		let menuCode = Cookies.get('menucode');
        	return {
				'menuCode':menuCode,
				'pageSize': this.pageSize, 
				'currentPage': this.currentPage,
				'valObj':{'ename': this.ename,'cname': this.cname}
			};
        }, 
		
        init () {
       		pagepublictool.setPage(this);
        	pagepublictool.page(this.getSearch());
        	this.columns = domain.getColumns();
        },
		
        searching () {
    		pagepublictool.page(this.getSearch());
        },
		
        onClicking(type){
         	if(type==='VIEW' || type==='view') pagepublictool.view();
        	else if(type==='ADD'  || type==='add') this.add();
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
        	this.deleteKey.push(row.ename);
        },
		
        cancing(selection, row){
        	pagepublictool.cancel(selection, row);
        	if(this.selectedLines>0){
        		this.deleteKey.splice(this.deleteKey.indexOf(row.ename), 1);
        	}
        },
		
        choicingAll(selection){
        	this.selectedLines=selection.length;
        	this.deleteKey=[];
        	for(var i=0;i<this.selectedLines;i++){
        		this.deleteKey.push(selection[i].ename)
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
		
		//新增
		add () {
			this.addForm = {};
			pagepublictool.reset('addFormRef');
			
			pagepublictool.add();
		},
		
		//数据类型变化时
		dataTypeChage (flag) {
			let dataType;
			if(flag === 'A'){
				dataType = this.addForm.dataType;
				if(this.addModal){
					this.addForm.dataLen = '';
				}
			}else{
				dataType = this.updForm.dataType;
				if(this.updModal){
					this.updForm.dataLen = '';
				}
			}
		},
    },
	
    created() {
    	this.init();
    },
	
    computed:{
		getSizeValue(){
			//个性化设置，设置字体大小
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