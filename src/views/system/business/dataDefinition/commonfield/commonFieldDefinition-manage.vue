<style>
</style>
<template>
	<div>
		<Row>
			<Card>
				<p slot="title"><Icon type="compose"></Icon>报元定义</p>
				<Row>
					<p>
						<Input type="text" v-model="colName" placeholder="请输入字段中文名称" style="width:200px" @on-change="searching" icon="search"></Input>
						<Input type="text" v-model="colCode" placeholder="请输入字段英文名称" style="width:200px" @on-change="searching" icon="search"></Input>
						<Button style="margin: 2px;" v-for="(item,index) in buttonInfos" :type="item.icon"  
							:key="item.code" @click="onClicking(item.href)" :size="getSizeValue">{{item.title }}
						</Button>
						<Button type="info" @click="handleInsert()">插入</Button>
					</p>	
				</Row>
				<Row>
					<Table :columns="columns" :data="data_list" height="410" highlight-row
						border :size="getSizeValue" :stripe="true" @on-select="choicing" @on-select-cancel="cancing" 
						@on-select-all="choicingAll" @on-selection-change="cancingAll">
					</Table>	
					<div style="float: right;">
						<Page :total="totalCount" :current="1" :page-size="pageSize" :transfer="true"
							@on-change="changePage" @on-page-size-change="changePageSize" show-total show-elevator show-sizer>
						</Page> 	
					</div> 
				</Row>
			</Card>
		</Row>
		
		<!-- 查看 -->
		<Modal v-model="viewModal" title="字段查看" width="700">
			<Form ref="viewFormRef" :model="viewForm" :label-width="100" inline>
				<FormItem label="字段名" prop="colCode">
					<Input :readonly="true" v-model="viewForm.colCode"/>
				</FormItem>
				<FormItem label="中文名称" prop="colName">
					<Input :readonly="true" v-model="viewForm.colName"/>
				</FormItem>
				<FormItem label="字段类型" prop="dataType">
					<Input :readonly="true" v-model="viewForm.dataType"/>
				</FormItem>
				<FormItem label="字段长度" prop="dataLen">
					<Input :readonly="true" v-model="viewForm.dataLen"/>
				</FormItem>
				<FormItem label="显示类型" prop="uiType">
					<Select v-model="viewForm.uiType" style="width:170px" readonly>
						<Option v-for="item in utList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<br>
				<FormItem label="关联表" prop="joinTabCode">
					<Input :readonly="true" v-model="viewForm.joinTabCode"/>
				</FormItem>
				<FormItem label="关联字段" prop="joinColCode">
					<Input :readonly="true" v-model="viewForm.joinColCode"/>
				</FormItem>
				<FormItem label="传递参数" prop="joinWhere">
					<Input :readonly="true" v-model="viewForm.joinWhere"/>
				</FormItem>
				<FormItem label="值区间" prop="valBetween">
					<Input :readonly="true" v-model="viewForm.valBetween"/>
				</FormItem>
			</Form>
		</Modal> 

		<!-- 新增 -->
		<Modal v-model="addModal" title="字段新增" width="700" ok-text="保存" cancel-text="关闭" :loading="addloading" :mask-closable="false"  @on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')">
			<Form ref="addFormRef" :model="addForm" :rules="formRules" :label-width="100" inline> 
				<FormItem label="字段名" prop="colCode">
					<Input v-model="addForm.colCode" placeholder="请输入字段英文名称" style="width: auto"/>
				</FormItem>
				<FormItem label="中文名称" prop="colName">
					<Input v-model="addForm.colName" placeholder="请输入字段中文名称" style="width: auto"/>
				</FormItem>
				<FormItem label="字段类型" prop="dataType">
					<Select v-model="addForm.dataType" ref="dtselect" style="width:170px" @on-change="dataTypeChage('A')" clearable>
						<Option v-for="item in dtList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="字段长度" prop="dataLen">
					<Input v-model="addForm.dataLen" style="width: auto"/>
				</FormItem>
				<FormItem label="显示类型" prop="uiType">
					<Select v-model="addForm.uiType" style="width:170px">
						<Option v-for="item in utList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<br>
				<FormItem label="关联表" prop="joinTabCode">
					<Select v-model="addForm.joinTabCode" style="width:455px" @on-change="tabCodeChage('A')" clearable>
						<Option v-for="item in tabList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="关联字段" prop="joinColCodes">
					<Select :multiple="true" v-model="addForm.joinColCodes" style="width:455px" ref="addFormColList" clearable>
						<Option v-for="item in colList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="传递参数" prop="joinWhere">
					<Input v-model="addForm.joinWhere" style="width: auto"/>
				</FormItem>
				<FormItem label="值区间" prop="valBetween">
					<Input v-model="addForm.valBetween" style="width: auto"/>
				</FormItem>
			</Form>
		</Modal>
		
		<!-- 修改 -->
		<Modal v-model="updModal" title="字段修改" width="700" ok-text="保存" cancel-text="关闭" :loading="updloading" :mask-closable="false" @on-ok="saving('updFormRef')">
			<Form ref="updFormRef" :model="updForm" :rules="formRules" :label-width="100" inline>
				<FormItem label="字段名" prop="colCode">
					<Input v-model="updForm.colCode" placeholder="请输入字段英文名称" style="width: auto" disabled/>
				</FormItem>
				<FormItem label="中文名称" prop="colName">
					<Input v-model="updForm.colName" placeholder="请输入字段中文名称" style="width: auto"/>
				</FormItem>
				<FormItem label="字段类型" prop="dataType">
					<Select v-model="updForm.dataType" style="width:170px" @on-change="dataTypeChage('U')" clearable>
						<Option v-for="item in dtList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="字段长度" prop="dataLen">
					<Input v-model="updForm.dataLen" style="width: auto"/>
				</FormItem>
				<FormItem label="显示类型" prop="uiType">
					<Select v-model="updForm.uiType" style="width:170px">
						<Option v-for="item in utList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<br>
				<FormItem label="关联表" prop="joinTabCode">
					<Select v-model="updForm.joinTabCode" style="width:455px" @on-change="tabCodeChage('U')" clearable>
						<Option v-for="item in tabList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="关联字段" prop="joinColCodes">
					<Select :multiple="true" v-model="updForm.joinColCodes" style="width:455px" ref="updFormColList" clearable>
						<Option v-for="item in colList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="传递参数" prop="joinWhere">
					<Input v-model="updForm.joinWhere" style="width: auto"/>
				</FormItem>
				<FormItem label="值区间" prop="valBetween">
					<Input v-model="updForm.valBetween" style="width: auto"/>
				</FormItem>
			</Form>
		</Modal>
	</div>
</template>
<script>

import datetool from '@/libs/datetool';
import pagepublictool from '@/libs/pagepublictool';
import Cookies from 'js-cookie';
import commonfield from './commonFieldDefinition-column.js';
import colDefinition from '../columns/colDefinition_column';

export default {
    name: 'commonfield-info',	
    data(){
		var validateDataLen = (rule, value, callback) =>{
			var self = this;
			let dataType;
			let dataLen;
			if(self.addModal){
				dataType = this.addForm.dataType;
				dataLen = this.addForm.dataLen != null? this.addForm.dataLen.replace(/^\s+|\s+$/g,''):'';
			}else if(self.viewModal){
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
			if(self.addModal || self.viewModal){
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
        	listurl: '/business/TK0009L.do', 
        	saveurl: '/business/TK0009I.do',
        	deleteurl: '/business/TK0009D.do',
        	updateurl: '/business/TK0009U.do',
			taburl: '/business/TK0004L1.do',
			colurl: '/business/TK0004L2.do',
			inserturl: '/business/TK0009I1.do',
        	colName: '',
        	colCode: '',
        	viewModal: false,
        	viewForm: {},
        	addModal: false,
        	addForm: {},
        	addloading: true,
        	updModal: false,
        	updForm: {},
        	updloading: true,
        	selectedLines: 0,
        	data_list: [],
        	pageSize: 10,
            currentPage: 1,
            totalPage: 0,
            totalCount: 0,
        	buttonInfos: [
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
					icon:'success',
					href:'upd'
		        },
		        {
					title:'删除',
					code:'100104',
					icon:'warning',
					href:'del'
        		} 	   
			],          
        	columns: [],
        	formRules: {
				colCode : [{required: true, message: '字段名不能为空！', trigger: 'blur'}],
				colName : [{required: true, message: '中文名称不能为空！', trigger: 'blur'}],
				dataType : [{validator: validateDataType, message: '字段类型不能为空！', trigger: 'blur'}],
				dataLen : [{validator: validateDataLen, trigger: 'blur'}]
			},
       	    deleteKey: [],
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
			],
			pkList: [
				{
					value: '0',
					label: '0-手动录入'
				},
				{
					value: '1',
					label: '1-自动生成'
				}
			],
			utList: [
				{
					value: 'A1',
					label: '单行文本'
				},
				{
					value: 'A2',
					label: '多行文本'
				},
				{
					value: 'B1',
					label: '单选按钮'
				},
				{
					value: 'B2',
					label: '多选按钮'
				},
				{
					value: 'B3',
					label: '下拉框带搜索单选'
				},
				{
					value: 'B4',
					label: '下拉框带搜索多选'
				},
				{
					value: 'B5',
					label: '弹出框单选'
				},
				{
					value: 'C1',
					label: '日期框'
				},
				{
					value: 'D1',
					label: '数字框'
				}
			],
			tabList: [],
			colList: [],
        };
    },
    methods: {
    	getSearch() {
    		let menuCode = Cookies.get('menucode');
        	return {'menuCode':menuCode, 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
					'valObj':{'colName': this.colName, 'colCode': this.colCode}};
        },  
        init () {
       		pagepublictool.setPage(this);
        	pagepublictool.page(this.getSearch());
			commonfield.setPage(this);
        	this.columns = commonfield.getColumns();
			
			//获取数据库所有表
			colDefinition.setPage(this);
			colDefinition.getTabList(this.taburl);
        },
        searching () {
    		pagepublictool.page(this.getSearch());
        },
        onClicking(type){
         	if(type==='VIEW' || type==='view') pagepublictool.view();
        	else if(type==='ADD'  || type==='add') this.add();
        	else if(type==='UPD' || type==='upd') this.update();
        	else if(type==='DEL' || type==='del') pagepublictool.delete(this.deleteurl+"?delKeys="+this.deleteKey.join(','));
        },
        saving(refValue){
			debugger;
			if(refValue === 'addFormRef'){
				if(this.addForm.joinColCodes && this.addForm.joinColCodes.length > 0)
					this.addForm.joinColCode = this.addForm.joinColCodes.join(',');
			}else{
				if(this.updForm.joinColCodes && this.updForm.joinColCodes.length > 0)
					this.updForm.joinColCode = this.updForm.joinColCodes.join(',');
			}
         	pagepublictool.save(refValue);
        },
        reseting (refValue) {
			this.addModal = false;
        },
        choicing(selection, row) {
        	pagepublictool.choice(selection, row);
        	this.deleteKey.push(row.colCode);
        },
        cancing(selection, row){
        	pagepublictool.cancel(selection, row);
        	if(this.selectedLines>0){
        		this.deleteKey.splice(this.deleteKey.indexOf(row.colCode), 1);
        	}
        },
        choicingAll(selection){
        	this.selectedLines=selection.length;
        	this.deleteKey=[];
        	for(var i=0;i<this.selectedLines;i++){
        		this.deleteKey.push(selection[i].colCode)
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
		
		//数据类型变化时
		dataTypeChage (flag) {
			let dataType;
			if(flag === 'A'){
				dataType = this.addForm.dataType;
				
				//字段类型为char、varchar,显示类型默认为A1
				if(dataType === 'char' || dataType === 'varchar') this.addForm.uiType = 'A1';
				else if(dataType === 'date' || dataType === 'datetime') this.addForm.uiType = 'C1';
				else if(dataType === 'int' || dataType === 'decimal') this.addForm.uiType = 'D1';
				else this.addForm.uiType = '';
				
				this.addModal = true;
			}else{
				dataType = this.updForm.dataType;
				
				//字段类型为char、varchar,显示类型默认为A1
				if(dataType === 'char' || dataType === 'varchar') this.updForm.uiType = 'A1';
				else if(dataType === 'date' || dataType === 'datetime') this.updForm.uiType = 'C1';
				else if(dataType === 'int' || dataType === 'decimal') this.updForm.uiType = 'D1';
				else this.updForm.uiType = '';
			}
		},
		
		//表名变化时
		tabCodeChage(flag) {
			
			var params = new URLSearchParams();
			
				//清空关联字段
				if(flag === 'A'){
					this.$refs.addFormColList.clearSingleSelect();
					params.append('tabCode', this.addForm.joinTabCode);
				}else{
					this.$refs.updFormColList.clearSingleSelect();
					params.append('tabCode', this.updForm.joinTabCode);
				}
				
				//获取该表的所有字段
				colDefinition.getColList(this.colurl, params);
		},
		
		//新增
		add () {
			this.addForm = {};
			pagepublictool.reset('addFormRef');
			this.$refs.dtselect.clearSingleSelect();
			
			pagepublictool.add();
		},
		
		//修改
		update(){
			var params = new URLSearchParams();
			params.append('tabCode', this.updForm.joinTabCode);
			
			//获取该表的所有字段
			colDefinition.getColList(this.colurl, params);
				
			if(this.updForm.joinColCode && this.updForm.joinColCode.length > 0){
				this.updForm.joinColCodes = this.updForm.joinColCode.split(',');
			}
			pagepublictool.update();
		},
		
		handleInsert(){
			if(this.selectedLines < 1){
				this.$Modal.warning({
					title: '提示信息',
					content: '必须选中一条记录！'
				});
				
				return;
			}
			
			if(!this.$route.query.tabCode){
				this.$Modal.warning({
					title: '提示信息',
					content: '请前往表定义页面点击选择按钮！'
				});
				
				return;
			}
			
			var params = new URLSearchParams();
			params.append('tabCode', this.$route.query.tabCode);
			params.append('colCode', this.deleteKey);
			
			commonfield.insertCol(this.inserturl, params);
			
		}
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