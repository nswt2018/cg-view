<style lang="less">
    @import '../../../../../styles/common.less';
	@import '../../modelstyle.less';
</style>

<template>
    <div>
        <Row>
            <Card>
                <p slot="title"> <Icon type="compose"></Icon>模块定义</p>
                <Row>
                	<p>
                		<Input v-model="sModuCode" placeholder="请输入模块代码搜索" icon="search" 
                			style="width: 200px" @on-change="searching"></Input>
                		<Input v-model="sModuCName" placeholder="请输入模块中文名称搜索" icon="search" 
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
				<Modal width="700" v-model="addModal" title="模块信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false" :loading="loading"
					@on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')">
					<Form ref="addFormRef" :model="addModel" :rules="modelAddRules" :label-width="100">
						<FormItem label="模块代码" prop="moduCode">
							 <Input v-model="addModel.moduCode" placeholder="请输入4位模块代码" />
						 </FormItem>
						 <FormItem label="中文名称" prop="moduCName">
							 <Input v-model="addModel.moduCName" placeholder="请输入模块中文名称" />
						 </FormItem>
						 <FormItem label="模块交易号" prop="moduTC">
							 <Input v-model="addModel.moduTC" />
						 </FormItem>
						 <FormItem label="所属模型" prop="moduModel">
							 <Select v-model="addModel.moduModel" @on-change="moduModelChange()">
								<Option v-for="item in modList" :value="item.value" :key="item.value">
									{{ item.label }}
								</Option>
							 </Select>
						 </FormItem>
						 <FormItem label="关联表" prop="relTables">
							 <Select v-model="addModel.relTables" ref="addSelect">
								<Option v-for="item in tabList" :value="item.value" :key="item.value">
									{{ item.label }}
								</Option>
							 </Select>
						 </FormItem>
						 <FormItem label="关联关系" prop="relInfo">
							 <Input v-model="addModel.relInfo" icon="ios-search" @on-click="chooseRelInfo('A')" ref="addRelInfo"/>
						 </FormItem>
					 </Form>    	
				</Modal>
				
				<!-- 修改页面 -->
				<Modal width="700" v-model="viewModal" title="模块信息" ok-text="保存" cancel-text="关闭" :mask-closable="false" :loading="loading"
					@on-ok="update('updFormRef')" @on-cancel="reseting('updFormRef')">
					<Form ref="updFormRef" :model="viewOrUpdateModel" :label-width="100" :rules="modelUpdRules">
						<FormItem label="模块代码" prop="moduCode">
							 <Input v-model="viewOrUpdateModel.moduCode" disabled/>
						 </FormItem>
						 <FormItem label="中文名称" prop="moduCName">
							 <Input v-model="viewOrUpdateModel.moduCName" />
						 </FormItem>
						 <FormItem label="模块交易号" prop="moduTC">
							 <Input v-model="viewOrUpdateModel.moduTC" />
						 </FormItem>
						 <FormItem label="所属模型" prop="moduModel">
							 <Select v-model="viewOrUpdateModel.moduModel" @on-change="moduModelChange()">
								<Option v-for="item in modList" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						 </FormItem>
						 <FormItem label="关联表" prop="relTables">
							 <Select v-model="viewOrUpdateModel.relTables" ref="updSelect">
								<Option v-for="item in tabList" :value="item.value" :key="item.value">
									{{ item.label }}
								</Option>
							 </Select>
						 </FormItem>
						 <FormItem label="关联关系" prop="relInfo">
							 <Input v-model="viewOrUpdateModel.relInfo" icon="ios-search" @on-click="chooseRelInfo('U')" ref="updRelInfo"/>
						 </FormItem>
					</Form>    	
				</Modal>
				
				<!-- 关联信息 多表、主从模型-->
				<Modal v-model="relModal" width="700" @on-ok="submitRelInfo">
					<div class="modaltyle">
						<template v-for="item in selectList">
							<Col span="6" style="text-align:center">
								{{ item.code }}
								<br/>
								<Select ref="item" :name="item.code" style="width: 80px" filterable clearable>
									<Option v-for="child in item.list" :value="child.value" :key="child.value">{{ child.label }}</Option>
								</Select>
							</Col>
						 </template>
					</div>
				</Modal>
				
				<!-- 关联信息 树模型-->
				<Modal v-model="treeModal" width="700">
					<div class="modaltyle1">
						<Col span="8">
							<div class="treestyle1">
								<Tree :data="treeData" @on-select-change="selectNode" ref="tree"></Tree>
							</div>
							<div class="buttonstyle">
								<Button type="primary" size="small" @click="nodeInsert()">新增</Button>
								<Button type="success" size="small" @click="nodeUpdate()">修改</Button>
								<Button type="info" size="small" @click="nodeDelete()">删除</Button>
							</div>
						</Col>
						<Col span="16">
							<!-- 新增 -->
							<div v-show="insertInfo">
								<div>
									<br/>
									<Form ref="addRef" :model="insertModel" :rules="addRules" :label-width="200" inline="true">
										<FormItem label="节点名称" prop="nodName">
											<Input v-model="insertModel.nodName" placeholder="请输入节点名称" style="width: auto"/>
										</FormItem>
										<FormItem label="上级节点名称" prop="upNodName">
											<Input v-model="nodName" style="width: auto" disabled/>
										</FormItem>
										<FormItem label="交易号(根节点编号)" prop="tranCode">
											<Cascader :data="tCodeData" v-model="insertModel.tranCode" style="width: auto"/>
										</FormItem>
										<FormItem label="显示条件" prop="showCond">
											<Input v-model="insertModel.showCond" style="width: auto"/>
										</FormItem>
										<FormItem label="传递参数" prop="showParam">
											<Input v-model="insertModel.showParam" style="width: auto"/>
										</FormItem>
									</Form>
								</div>
								<div class="buttonstyle2">
									<br/>
									<br/>
									<br/>
									<Button type="primary" size="small" @click="addCansel()">取消</Button>
									<Button type="info" size="small" @click="addSubmit()">提交</Button>
								</div>
							</div>
							
							<!-- 浏览 -->
							<div v-show="scanInfo">
								<br/>
								<Form ref="scanRef" :model="scanModel" :label-width="200" inline="true">
									<FormItem label="节点名称" prop="nodName">
										<Input v-model="scanModel.nodName" placeholder="请输入节点名称" style="width: auto" readonly/>
									</FormItem>
									<FormItem label="上级节点名称" prop="upNodName">
										<Input v-model="scanModel.upNodName" style="width: auto" readonly/>
									</FormItem>
									<FormItem label="交易号(根节点编号)" prop="tranCode">
										<Input v-model="scanModel.tranCode" style="width: auto" readonly/>
									</FormItem>
									<FormItem label="显示条件" prop="showCond">
										<Input v-model="scanModel.showCond" style="width: auto" readonly/>
									</FormItem>
									<FormItem label="传递参数" prop="showParam">
										<Input v-model="scanModel.showParam" style="width: auto" readonly/>
									</FormItem>
								</Form>
							</div>
							
							<!-- 修改 -->
							<div v-show="updInfo">
								<div>
									<br/>
									<Form ref="updRef" :model="updModel" :rules="addRules" :label-width="200" inline="true">
										<FormItem label="节点名称" prop="nodName">
											<Input v-model="updModel.nodName" placeholder="请输入节点名称" style="width: auto" disabled/>
										</FormItem>
										<FormItem label="上级节点名称" prop="upNodName">
											<Input v-model="updModel.upNodName" style="width: auto" disabled/>
										</FormItem>
										<FormItem label="交易号(根节点编号)" prop="tranCode">
											<Cascader :data="tCodeData" v-model="updModel.tranCode" style="width: auto"/>
										</FormItem>
										<FormItem label="显示条件" prop="showCond">
											<Input v-model="updModel.showCond" style="width: auto"/>
										</FormItem>
										<FormItem label="传递参数" prop="showParam">
											<Input v-model="updModel.showParam" style="width: auto"/>
										</FormItem>
									</Form>
								</div>
								<div class="buttonstyle2">
									<br/>
									<br/>
									<br/>
									<Button type="primary" size="small" @click="updCansel()">取消</Button>
									<Button type="info" size="small" @click="updSubmit()">提交</Button>
								</div>
							</div>
						</Col>
					</div>
				</Modal>
            </Card>
        </Row>
    </div>

</template>

<script>
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';
import systemModule from './systemModule_column';
import Cookies from 'js-cookie';


export default {
    name: 'module-info',
    data () {
		var validateUpdData = (rule, value, callback) =>{
			var self = this;
			if (!value) {
				return callback(new Error(rule.message));
			}else {
				callback();
			}
		};
        return {
        	headers: {'Content-Type': 'application/json;charset=UTF-8'},
        	listurl: '/business/TK0004L.do', 
			saveurl: '/business/TK0004I.do',
			deleteurl: '/business/TK0004D.do',
			updateurl: '/business/TK0004U.do',  
			selecturl: '/business/TK0001T.do',  
			gettaburl: '/business/TK0004L1.do',
			getcolurl: '/business/TK0004L2.do',
			treeurl: '/business/TK0004L3.do',
			scanurl: '/business/TK0004L4.do',
			trancodeurl: '/business/TK0004L5.do',
			updurl: '/business/TK0004U1.do',
			addurl: '/business/TK0004I1.do',
			delurl: '/business/TK0004D1.do',
			list_data: [],
			pageSize: 10,
			currentPage: 1,
			totalCount: 0,
			totalPage: 0,
			sModuCode: '',
			sModuCName: '',
			sModuEName: '',
			addModal: false,
			addModel: {},
			loading: true,
			modelAddRules: {
            	moduCode : [{required: true}],
				moduCName : [{required: true}],
				moduTC : [{required: true}],
				moduModel : [{required: true}],
				relTables : [{required: true}]
            },
			modelUpdRules: {
				moduModel : [{validator: validateUpdData, message: '所属模型不能为空！'}],
				relTables : [{validator: validateUpdData, message: '关联表不能为空！'}],
			},
			viewOrUpdateModel: {},
            columns: [],
			selectedLines: 0,
			deletedPks: [],
			viewModal: false,
			modList: [],
			tabList: [],
			relModal: false,
			selectList: [],
			relModel: [],
			treeModal: false,
			treeData: [],
			insertIsnfo: false,
			scanInfo: false,
			updInfo: false,
			insertModel: {},
			scanModel: {},
			updModel: {},
			nodCode: '',
			nodName: '',
			tranCode: '',
			tCodeData: [],
			addRules: {
				nodName : [{required: true}],
				showCond : [{required: true}],
				showParam : [{required: true}],
			}
        };
    },
    methods: {  
		getSearchCond() {
    		//let menuCode = Cookies.get('menucode');
        	return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
        		'valObj': {'moduCode': this.sModuCode, 'moduCName': this.sModuCName}
        	};
        },
        init () {
        	pagetool.setPage(this);
        	systemModule.setPage(this);
        	pagetool.page(this.getSearchCond());
        	this.columns = systemModule.getColumns();
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
        	systemModule.choice(selection, row);
        },
        cancing(selection, row) {
        	systemModule.cancel(selection, row);        	
        },
		
		//新增页面
		handleInsert(){
			this.addModal = true;
			pagetool.reset('addFormRef');
			this.modList = [];
			this.tabList = [];
			systemModule.getModList(this.selecturl);
			systemModule.getTabList(this.gettaburl);
			
			this.viewOrUpdateModel = {};
		},
		
		//新增保存
		saving(name) {
			//所属模型为多表模型时,将Array数组转换为","隔开的字符串
			if(this.addModel.moduModel == 'm002' || this.addModel.moduModel == 'm004'){
				this.addModel.relTable = this.addModel.relTables.join(',');
			}else{
				this.addModel.relTable = this.addModel.relTables;
			}
			this.addModel.crtDate = datetool.format(new Date());
        	pagetool.save(name);
        },
		
		//新增/修改取消
        reseting (name) {
			if(name == 'addFormRef'){
				this.addModal = false;
			}else{	
				this.viewModal = false;
			}
        },
		
		//删除操作
        handleDelete () {
        	systemModule.delete(this.deleteurl+"?moduCode="+this.deletedPks.join(','));
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
			systemModule.getModList(this.selecturl);
			systemModule.getTabList(this.gettaburl);
			
			this.addModel = {};
		
			//所属模型为多表模型时,设置关联表字段为多选,并将字符串转为数组
			if(this.viewOrUpdateModel.moduModel == 'm002' || this.viewOrUpdateModel.moduModel == 'm004'){
				this.$refs.updSelect.multiple = true;
				this.viewOrUpdateModel.relTables = this.viewOrUpdateModel.relTable.split(',');
			}else{
				this.$refs.updSelect.multiple = false;
				this.viewOrUpdateModel.relTables = this.viewOrUpdateModel.relTable;
			}
		},
		
		//修改保存
		update (name) {
			this.viewOrUpdateModel.updDate = datetool.format(new Date());
			
			//所属模型为多表模型时,将Array数组转换为","隔开的字符串
			if(this.addModel.moduModel == 'm002' || this.addModel.moduModel == 'm004'){
				this.viewOrUpdateModel.relTable = this.viewOrUpdateModel.relTables.join(',');
			}else{
				this.viewOrUpdateModel.relTable = this.viewOrUpdateModel.relTables;
			}
			
			systemModule.update(name);
		},
		
		//所属模型变化时
		moduModelChange(){
			//清空关联表和关联关系字段
			this.addModel.relInfo = '';
			this.viewOrUpdateModel.relInfo = '';
			this.addModel.relTable = '';
			this.viewOrUpdateModel.relTable = '';
			
			if(this.addModel.moduModel == 'm001' || this.viewOrUpdateModel.moduModel == 'm001'){
				this.$refs.addSelect.multiple = false;
				this.$refs.updSelect.multiple = false;
				this.$refs.addRelInfo.disabled = true;
				this.$refs.updRelInfo.disabled = true;
				
			}else if(this.addModel.moduModel == 'm003' || this.viewOrUpdateModel.moduModel == 'm003'){
				this.$refs.addSelect.multiple = false;
				this.$refs.updSelect.multiple = false;
				this.$refs.addRelInfo.disabled = false;
				this.$refs.updRelInfo.disabled = false;
			}else{
				this.$refs.addSelect.multiple = true;
				this.$refs.updSelect.multiple = true;
				this.$refs.addRelInfo.disabled = false;
				this.$refs.updRelInfo.disabled = false;
			}
		},
		
		//选择关联表关联关系
		chooseRelInfo(flag) {
			
			if(this.addModel.moduModel == 'm001' || this.viewOrUpdateModel.moduModel == 'm001'){
				return;
			}else if(this.addModel.moduModel == 'm003' || this.viewOrUpdateModel.moduModel == 'm003'){
				this.treeModal = true;
				this.hideForm();
				this.clearCol();
				
				this.insertModel = {};
				this.scanModel = {};
				this.updModel = {};
				
				if(flag == 'U'){
					//获取树数据
					systemModule.getTreeData(this.viewOrUpdateModel.relInfo);
				}else{
					systemModule.getTreeData(this.addModel.relInfo);
				}
				
			}else{
				//主从模型只能选两张表
				let data = '';
				if(flag == 'A'){
					data = this.addModel.relTables;
				}else if(flag == 'U'){
					data = this.viewOrUpdateModel.relTables;
				}
				
				if((this.addModel.moduModel == 'm004' || this.viewOrUpdateModel.moduModel == 'm004') && !(data.length == 2)){
					this.$Modal.warning({
						title: '提示信息',
						content: '主从模型只能且必须选两张表！'
					});
					
					return;
				}else{
					if((this.addModel.moduModel == 'm002' || this.viewOrUpdateModel.moduModel == 'm002') && data.length < 2){
						this.$Modal.warning({
							title: '提示信息',
							content: '多表模型必须选两张以上表！'
						});
						
						return;
					}
				}
				
				this.selectList = [];
				
				data.forEach(tabCode => {
					systemModule.getColList(tabCode);
				});
				this.relModal = true;
			}
		},
		
		//提交关联关系
		submitRelInfo() {
			let data = this.$refs.item;
			let relInfo = "";
			data.forEach(child => {
				if(child.publicValue){
					relInfo += child.name + "." + child.publicValue + " = ";
				}else{
					this.$Modal.warning({
						title: '提示信息',
						content: '所有的表都必须选取字段！'
					});
				
					relInfo = '';
					return;
				}
				
			});
			
			if(relInfo.length > 0){
				relInfo = relInfo.substring(0, relInfo.length-3);
			}
			
			if(this.addModel.relTables){ //新增页面
				if(this.addModel.relInfo){
					this.addModel.relInfo += " and " + relInfo;
				}else{
					this.addModel.relInfo = relInfo;
				}
			}else if(this.viewOrUpdateModel.relTables){ //修改页面
				if(this.viewOrUpdateModel.relInfo){
					this.viewOrUpdateModel.relInfo += " and " + relInfo;
				}else{
					this.viewOrUpdateModel.relInfo = relInfo;
				}
			}
		},
		
		//选择标签，显示该标签下所有属性
		selectNode(selectedArray) { 
			
			selectedArray.map(item => {
				
				//获取当前节点编号、名称、交易号
				this.nodCode = item.nodCode;
				this.nodName = item.title;
				this.tranCode = item.tranCode;
				
				//获取当前节点详细信息
				var params = new URLSearchParams();
				params.append('nodCode', this.nodCode);
				systemModule.getNodeInfo(params);
				
				//显示浏览界面
				this.scanInfo = true;
				
				//隐藏其他界面
				this.insertInfo = false;
				this.updInfo = false;
			});
			
		},
		
		//修改节点
		nodeUpdate () {
			if(this.nodCode == '' || this.nodCode.length == 0){
				this.$Modal.warning({
					title: '提示信息',
					content: '请选择任意节点！'
				});
				
				return;
			}
				
			//显示修改界面
			this.updInfo = true;
			
			//隐藏其他界面
			this.insertInfo = false;
			this.scanInfo = false;
			
			//获取根节点编号及模块交易号
			systemModule.getTranCodeList(this.updModel.nodCode, this.viewOrUpdateModel.moduTC);
			
			//回显交易号字段
			let tranCode = this.updModel.tranCode.split('/')[1].replace(/^\s*|\s*$/g,"");
			if(tranCode.indexOf('r') == 0 && tranCode.length == 3){
				this.updModel.tranCode = ['nc', tranCode];
			}else{
				this.updModel.tranCode = ['mc', tranCode];
			}
			
		},
		
		//新增节点
		nodeInsert() {
			
			if(this.addModel.relInfo && this.nodCode == ''){
				this.$Modal.warning({
					title: '提示信息',
					content: '已经存在根节点！请选取任意节点！'
				});
				
				return;
			}
			
			if(this.tranCode != '' && this.tranCode != null){
				this.$Modal.warning({
					title: '提示信息',
					content: '该节点已经挂接模块交易号或根节点编号,不能新增子节点！'
				});
				
				return;
			}
			//清空表单
			pagetool.reset('addRef');
			
			//显示新增界面
			this.insertInfo = true;
			
			//隐藏其他界面
			this.updInfo = false;
			this.scanInfo = false;
			
			//获取根节点编号及模块交易号
			systemModule.getTranCodeList(this.insertModel.nodCode, this.addModel.moduTC);
			
		},
		
		//新增提交
		addSubmit() {
			if(this.insertModel.tranCode){
				this.insertModel.tranCode = this.insertModel.tranCode[1];
			}
			this.insertModel.upNodName = this.nodName;
			this.insertModel.upNodCode = this.nodCode;
			systemModule.save('addRef', this.addurl, this.insertModel);
		},
		
		//新增取消
		addCansel() {
			this.hideForm();
		},
		
		//隐藏所有窗口
		hideForm(){
			this.insertInfo = false;
			this.scanInfo = false;
			this.updInfo = false;
		},
		
		//清空相关字段
		clearCol(){
			this.nodCode = '';
			this.nodName = '';
			this.tranCode = '';
		},
		
		//修改取消
		updCansel(){
			this.hideForm();
		},
		
		//修改提交
		updSubmit() {
			if(this.updModel.tranCode){
				this.updModel.tranCode = this.updModel.tranCode[1];
			}
			systemModule.save('updRef', this.updurl, this.updModel);
		},
		
		//删除节点
		nodeDelete (){
			if(this.nodCode == '' || this.nodCode.length == 0){
				this.$Modal.warning({
					title: '提示信息',
					content: '请选择任意节点！'
				});
				
				return;
			}
			systemModule.delTrans(this.delurl + "?nodCode=" + this.nodCode);
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
