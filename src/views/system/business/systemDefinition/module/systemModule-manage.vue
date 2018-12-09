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
						 <FormItem label="关联表" prop="relTable">
							 <Select v-model="addModel.relTable" ref="addSelect">
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
					@on-ok="update('updFormRef')">
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
						 <FormItem label="关联表" prop="relTable">
							 <Select v-model="viewOrUpdateModel.relTable" ref="updSelect">
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
					<div class="modaltyle">
						<Col span="5">
							<Tree :data="tagData" @on-select-change="selectTag" ref="tree"></Tree>
						</Col>
						<Col span="19">
							<div v-show="tagInfo">
								<Table highlight-row border 
									:columns="tagColumns" :data="tagDatas" :stripe="true" 
									@on-select="choicing" @on-select-cancel="cancing" 
									@on-sort-change="sorting">
								</Table>
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
        return {
        	headers: {'Content-Type': 'application/json;charset=UTF-8'},
        	listurl: '/business/TK0004L.do', 
			saveurl: '/business/TK0004I.do',
			deleteurl: '/business/TK0004D.do',
			updateurl: '/business/TK0004U.do',  
			selecturl: '/business/TK0001T.do',  
			gettaburl: '/business/TK0004L1.do',
			getcolurl: '/business/TK0004L2.do',
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
				relTable : [{required: true}]
            },
			modelUpdRules: {
				moduModel : [{required: true}],
				relTable : [{required: true}]
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
			tagData: [],
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
			if(this.addModel.moduModel == 'm002'){
				this.addModel.relTable = this.addModel.relTable.join(',');
			}
			this.addModel.crtDate = datetool.format(new Date());
        	pagetool.save(name);
        },
		
		//新增/修改取消
        reseting (name) {
			this.addModal = false;
        	//pagetool.reset(name);
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
			if(this.viewOrUpdateModel.moduModel == 'm002'){
				this.$refs.updSelect.multiple = true;
				this.viewOrUpdateModel.relTable = this.viewOrUpdateModel.relTable.split(',');
			}else{
				this.$refs.updSelect.multiple = false;
			}
		},
		
		//修改保存
		update (name) {
			this.viewOrUpdateModel.updDate = datetool.format(new Date());
			
			//所属模型为多表模型时,将Array数组转换为","隔开的字符串
			this.viewOrUpdateModel.relTable = this.viewOrUpdateModel.relTable.join(',');
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
			}else{
				//主从模型只能选两张表
				let data = '';
				if(flag == 'A'){
					data = this.addModel.relTable;
				}else if(flag == 'U'){
					data = this.viewOrUpdateModel.relTable;
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
			
			if(this.addModel.relTable){ //新增页面
				if(this.addModel.relInfo){
					this.addModel.relInfo += " and " + relInfo;
				}else{
					this.addModel.relInfo = relInfo;
				}
			}else if(this.viewOrUpdateModel.relTable){ //修改页面
				if(this.viewOrUpdateModel.relInfo){
					this.viewOrUpdateModel.relInfo += " and " + relInfo;
				}else{
					this.viewOrUpdateModel.relInfo = relInfo;
				}
			}
		},
		
		//选择标签，显示该标签下所有属性
		selectTag(selectedArray) { 
			
			selectedArray.map(item => {
				
			});
			
		},
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
