<style lang="less">
    @import '../../../../../styles/common.less';
	@import '../../modelstyle.less';
</style>
<template>
	<div>
		<Card>
			<p slot="title"> <Icon type="compose"></Icon>字段定义</p> 
			<Row>
				<p>
					<Input v-model="sColCode" placeholder="请输入字段名称搜索" icon="search" 
						style="width: 150px" @on-change="searching"></Input>
					&nbsp;
					<Button type="primary" @click="handleInsert()">新增</Button>
					<Button type="success" @click="handleUpdate()">修改</Button>
					<Button type="warning" @click="handleDelete()">删除</Button>
					<Button type="info" @click="handleSelect()">选择</Button>
				</p>
			</Row>						
			<Row>
				<Table highlight-row border ref="dataList" :height="tableHeight" 
					:columns="columns" :data="list_data" :stripe="true" :size="getFont"
					@on-select="choicing" @on-select-cancel="cancing" 
					@on-sort-change="sorting">
				</Table>
				<div style="float: right;">
					<Page :total="totalCount" :current="1" :page-size="pageSize" 
					:transfer="true"
					@on-change="changePage" @on-page-size-change="changePageSize" 
					show-total show-elevator show-sizer></Page>
				</div>
			</Row>
		</Card>
		<!-- 新增页面 -->
		<Modal width="700" v-model="addModal" title="字段信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false" 
			:loading="loading" @on-ok="saving('addFormRef')">
			<Form ref="addFormRef" :model="addModel" :rules="addRules" :label-width="100" :inline="true">
				<FormItem label="字段名" prop="colCode">
					<Input v-model="addModel.colCode" placeholder="请输入字段英文名称" style="width: auto"/>
				</FormItem>
				<FormItem label="中文名称" prop="colName">
					<Input v-model="addModel.colName" placeholder="请输入字段中文名称" style="width: auto"/>
				</FormItem>
				<FormItem label="主键策略" prop="pkGen">
					<Select v-model="addModel.pkGen" style="width:170px" clearable ref="select2">
						<Option v-for="item in pkList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="域类型" prop="doMainType">
					<Select v-model="addModel.doMainType" style="width:170px" clearable @on-change="doMainTypeChage('A', $event)">
						<Option v-for="item in dmList" :value="item.value" :key="item.label">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="字段类型" prop="dataType">
					<Select v-model="addModel.dataType" style="width:170px" clearable ref="select1" @on-change="dataTypeChage('A')">
						<Option v-for="item in dtList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="字段长度" prop="dataLen">
					<Input v-model="addModel.dataLen" style="width: auto"/>
				</FormItem>
				<FormItem label="显示顺序" prop="uiOrder">
					<Input v-model="addModel.uiOrder" style="width: auto"/>
				</FormItem>
				<FormItem label="显示类型" prop="uiType">
					<Select v-model="addModel.uiType" style="width:170px">
						<Option v-for="item in utList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="关联表" prop="joinTabCode">
					<Select v-model="addModel.joinTabCode" style="width:455px" @on-change="tabCodeChage('A')" clearable>
						<Option v-for="item in tabList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="关联字段" prop="joinColCode">
					<Select :multiple="true" v-model="addModel.joinColCodes" style="width:455px" ref="addFormColList" clearable>
						<Option v-for="item in colList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="传递参数" prop="joinWhere">
					<Input v-model="addModel.joinWhere" style="width: auto"/>
				</FormItem>
				<FormItem label="值区间" prop="valBetween">
					<Input v-model="addModel.valBetween" style="width: auto"/>
				</FormItem>
			 </Form>    	
		</Modal>
						
		<!-- 编辑页面 -->
		<Modal width="700" v-model="viewModal" title="字段信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false"
			@on-ok="update('updFormRef')" :loading="loading">
			<Form ref="updFormRef" :model="viewOrUpdateModel" :rules="updRules" :label-width="100" :inline="true">
				<FormItem label="字段名" prop="colCode">
					<Input v-model="viewOrUpdateModel.colCode" placeholder="请输入字段英文名称" style="width: auto" disabled/>
				</FormItem>
				<FormItem label="中文名称" prop="colName">
					<Input v-model="viewOrUpdateModel.colName" placeholder="请输入字段中文名称" style="width: auto"/>
				</FormItem>
				<FormItem label="主键策略" prop="pkGen">
					<Select v-model="viewOrUpdateModel.pkGen" style="width:170px" clearable ref="select2">
						<Option v-for="item in pkList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="域类型" prop="doMainType">
					<Select disabled v-model="viewOrUpdateModel.doMainType" style="width:170px">
						<Option v-for="item in dmList" :value="item.value" :key="item.label">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="字段类型" prop="dataType">
					<Select disabled v-model="viewOrUpdateModel.dataType" style="width:170px">
						<Option v-for="item in dtList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="字段长度" prop="dataLen">
					<Input v-model="viewOrUpdateModel.dataLen" style="width: auto"/>
				</FormItem>
				<FormItem label="显示顺序" prop="uiOrder">
					<Input v-model="viewOrUpdateModel.uiOrder" style="width: auto"/>
				</FormItem>
				<FormItem label="显示类型" prop="uiType">
					<Select v-model="viewOrUpdateModel.uiType" style="width:170px">
						<Option v-for="item in utList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="关联表" prop="joinTabCode">
					<Select v-model="viewOrUpdateModel.joinTabCode" style="width:455px" @on-change="tabCodeChage('U')" clearable>
						<Option v-for="item in tabList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="关联字段" prop="joinColCode">
					<Select :multiple="true" v-model="viewOrUpdateModel.joinColCodes" style="width:455px" ref="updFormColList" clearable>
						<Option v-for="item in colList" :value="item.value" :key="item.value">
							{{ item.label }}
						</Option>
					</Select>
				</FormItem>
				<FormItem label="传递参数" prop="joinWhere">
					<Input v-model="viewOrUpdateModel.joinWhere" style="width: auto"/>
				</FormItem>
				<FormItem label="值区间" prop="valBetween">
					<Input v-model="viewOrUpdateModel.valBetween" style="width: auto"/>
				</FormItem>
			</Form>    	
		</Modal>
	</div>
</template>
<script>
import colDefinition from './colDefinition_column';
import util from '@/libs/util.js';
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';
import Cookies from 'js-cookie';

	 export default {
        data () {
			var validateDataLen = (rule, value, callback) =>{
				var self = this;
				let dataType;
				let dataLen;
				if(self.addModal){
					dataType = this.addModel.dataType;
					dataLen = this.addModel.dataLen != null? this.addModel.dataLen.replace(/^\s+|\s+$/g,''):'';
				}else{
					callback();
				}
				
				if(value){
					if(dataType === 'int' || dataType === 'date' || dataType === 'datetime'){
						return callback(new Error(dataType + "类型不用输入字段长度！"));
					}
				}else{
					if(dataType === 'char' || dataType === 'varchar' || dataType === 'decimal'){
						return callback(new Error(dataType + "类型字段长度不能为空！"));
					}
				}
				
				callback();
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
			
			var validateUiOrder = (rule, value, callback) =>{
				var self = this;
				if(self.addModal || self.viewModal){
					if(!Number.isInteger(+value)){
						return callback(new Error("请输入数值！"));
					}else{
						callback();
					}
				}else{
					callback();
				}
			};
			
			var validateDataLen1 = (rule, value, callback) =>{
				var self = this;
				let dataType;
				let dataLen;
				if(self.viewModal){
					dataType = this.viewOrUpdateModel.dataType;
					dataLen = this.viewOrUpdateModel.dataLen != null? this.viewOrUpdateModel.dataLen.replace(/^\s+|\s+$/g,''):'';
				}else{
					callback();
				}
				
				let colLen = this.colLen;
				
				if(value){
					if(dataType === 'int' || dataType === 'date' || dataType === 'datetime'){
						return callback(new Error(dataType + "类型不用输入字段长度！"));
					}else if(dataType === 'char' || dataType === 'varchar'){
						if(value < colLen){
							return callback(new Error("字段长度不能变小！"));
						}
					}else if(dataType === 'decimal'){
						if(value.split(',')[0] < colLen.split(',')[0]){
							return callback(new Error("字段长度不能变小！"));
						}
					}
				}else{
					if(dataType === 'char' || dataType === 'varchar' || dataType === 'decimal'){
						return callback(new Error(dataType + "类型字段长度不能为空！"));
					}
				}
				
				callback();
			};
            return {
				listurl: '/business/TK0008L.do',
				updateurl: '/business/TK0008U.do',
				deleteurl: '/business/TK0008D.do',
				saveurl: '/business/TK0008I.do',
				taburl: '/business/TK0004L1.do',
				colurl: '/business/TK0004L2.do',
				dmurl: '/business/TK0010L1.do',
				columns: [],
				list_data: [],
				pageSize: 10,
				currentPage: 1,
				totalCount: 0,
				totalPage: 0,
				sColCode: '',
				sColName: '',
				sTabCode: '',
				classificationFinalSelected: [],
				deletedPks: [],
				selectedLines: 0,
				viewOrUpdateModel: {},
				viewModal: false,
				addModal: false,
				addModel: {},
				loading: true,
				addRules: {
					colCode : [{required: true, message: '字段名不能为空！', trigger: 'blur'}],
					colName : [{required: true, message: '中文名称不能为空！', trigger: 'blur'}],
					uiOrder : [{required: true, message: '显示顺序不能为空！', trigger: 'blur'},{validator: validateUiOrder, trigger: 'blur'}],
					dataType : [{validator: validateDataType, message: '字段类型不能为空！', trigger: 'blur'}],
					dataLen : [{validator: validateDataLen, trigger: 'blur'}]
				},
				updRules: {
					colName : [{required: true, message: '中文名称不能为空！', trigger: 'blur'}],
					uiOrder : [{required: true, message: '显示顺序不能为空！', trigger: 'blur'},{validator: validateUiOrder, trigger: 'blur'}],
					dataLen : [{validator: validateDataLen1, trigger: 'blur'}]
				},
				exist: false,
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
				dmList: [],
				colLen: '',
				tableHeight: 410
			};
			
		},
		methods: {
			getSearchCond() {
				return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
					'valObj': {'colCode': this.sColCode, 'colName': this.sColName, 'tabCode': this.sTabCode}
				};
			},
			
			//根据父组件(主表)传来的数据 查询子组件(从表)数据
			getColDataList(data){
				this.sTabCode = data;
				colDefinition.page(this.getSearchCond());
				
				//去数据库查询该表是否存在
				var params = new URLSearchParams();
				params.append('tabCode', data);
				colDefinition.findTable(params);
				
				//获取数据库所有表
				colDefinition.getTabList(this.taburl);
				
				//获取域定义域类型
				colDefinition.getDoMainList(this.dmurl);
			},
		
			//获取数据	
			init() {
				colDefinition.setPage(this);
				this.columns = colDefinition.getColumns();
			},
			
			changePage(page) {
				let cond = this.getSearchCond();
				cond.currentPage = page;
				pagetool.page(cond);
			},
			
			changePageSize(_pageSize) {
				let cond = this.getSearchCond();
				cond.pageSize = _pageSize;
				pagetool.page(cond);
			},
			sorting(data) {
				pagetool.sort(data, this.getSearchCond());
			},
			choicing(selection, row) {
				colDefinition.choice(selection, row);
			},
			cancing(selection, row) {
				colDefinition.cancel(selection, row);
			},
			searching() {
				colDefinition.page(this.getSearchCond());
			},
			
			//修改操作
			handleUpdate () {
				if(this.selectedLines < 1) {
					this.$Modal.warning({
						title: '提示信息',
						content: '必须选中一条记录！'
					});
					
					return;
				};
				
				if(this.selectedLines > 1) {
					this.$Modal.warning({
						title: '提示信息',
						content: '只能选中一条记录！'
					});
					
					return;
				};
				
				this.viewModal = true;
				
				var params = new URLSearchParams();
				params.append('tabCode', this.viewOrUpdateModel.joinTabCode);
				
				//获取该表的所有字段
				colDefinition.getColList(this.colurl, params);
				
				this.viewOrUpdateModel.uiOrder = this.viewOrUpdateModel.uiOrder + '';
				
				this.colLen = this.viewOrUpdateModel.dataLen;
				
				//回显关联字段
				if(this.viewOrUpdateModel.joinColCode && this.viewOrUpdateModel.joinColCode.length > 0)
					this.viewOrUpdateModel.joinColCodes = this.viewOrUpdateModel.joinColCode.split(',');
			},
			
			//修改保存
			update (name) {
				this.viewOrUpdateModel.updDate = datetool.format(new Date());
				if(this.viewOrUpdateModel.joinColCodes && this.viewOrUpdateModel.joinColCodes.length > 0){
					this.viewOrUpdateModel.joinColCode = this.viewOrUpdateModel.joinColCodes.join(',');
				}
				
				colDefinition.update(name);
			},
			
			//删除操作
			handleDelete () {
				colDefinition.delete(this.deleteurl+"?codes="+this.deletedPks.join(','));
			},
			
			reset(name){
				this.$refs[name].resetFields();
			},
			
			
			//新增页面
			handleInsert(){
				if(this.sTabCode == ''){
					this.$Modal.warning({
						title: '错误信息',
						content: '请先选取表！'
					});
					return;	
				}
			
				this.addModal = true;
				this.addModel = {};
				this.reset('addFormRef');
				this.$refs.select1.clearSingleSelect();
				this.$refs.select2.clearSingleSelect();
			},
			
			//新增保存
			saving(name) {
				this.addModel.tabCode = this.sTabCode;
				this.addModel.crtDate = datetool.format(new Date());
				if(this.addModel.joinColCodes && this.addModel.joinColCodes.length > 0){
					this.addModel.joinColCode = this.addModel.joinColCodes.join(',');
				}
				colDefinition.save(name);
			},
			
			//数据类型变化时
			dataTypeChage (flag) {
				let dataType;
				if(flag === 'A'){
					dataType = this.addModel.dataType;
					
					//字段类型为char、varchar,显示类型默认为A1
					if(dataType === 'char' || dataType === 'varchar') this.addModel.uiType = 'A1';
					else if(dataType === 'date' || dataType === 'datetime') this.addModel.uiType = 'C1';
					else if(dataType === 'int' || dataType === 'decimal') this.addModel.uiType = 'D1';
					else this.addModel.uiType = '';
					
					this.addModal = true;
				}else{
					dataType = this.viewOrUpdateModel.dataType;
					
					//字段类型为char、varchar,显示类型默认为A1
					if(dataType === 'char' || dataType === 'varchar') this.viewOrUpdateModel.uiType = 'A1';
					else if(dataType === 'date' || dataType === 'datetime') this.viewOrUpdateModel.uiType = 'C1';
					else if(dataType === 'int' || dataType === 'decimal') this.viewOrUpdateModel.uiType = 'D1';
					else this.viewOrUpdateModel.uiType = '';
				}
			},
			
			//表名变化时
			tabCodeChage(flag) {
			
				var params = new URLSearchParams();
			
				//清空关联字段
				if(flag === 'A'){
					this.$refs.addFormColList.clearSingleSelect();
					params.append('tabCode', this.addModel.joinTabCode);
				}else{
					this.$refs.updFormColList.clearSingleSelect();
					params.append('tabCode', this.viewOrUpdateModel.joinTabCode);
				}
				
				//获取该表的所有字段
				colDefinition.getColList(this.colurl, params);
			},
			
			//域类型变化时
			doMainTypeChage(flag, event) {
				let data = event.split(',');
				if(flag === 'A'){
					this.addModel.dataType = data[0];
					this.addModel.dataLen = data[1];
				}else{
					this.viewOrUpdateModel.dataType = data[0];
					this.viewOrUpdateModel.dataLen = data[1];
				}
			},
			
			handleSelect(){
			
				if(this.sTabCode == ''){
					this.$Modal.warning({
						title: '错误信息',
						content: '请先选取表！'
					});
					return;	
				}
				
				if(this.exist){
					this.$Modal.warning({
						title: '错误信息',
						content: '该表在数据库中已经存在,不能新增字段！'
					});
					return;
				}
			
				let query = {tabCode: this.sTabCode};
				this.$router.push({
					name: 'commonFieldDefinition',
					query: query
				});
			},
		},
		created () {
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