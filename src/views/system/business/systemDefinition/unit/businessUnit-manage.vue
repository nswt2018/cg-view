<style lang="less">
    @import '../../../../../styles/common.less';
	@import '../../modelstyle.less';
</style>
<template>
	<div>
		<Row>
			<Col span="5">
				<Card padding="10">
					<p slot="title">
						<Icon type="ios-pricetags-outline"></Icon>
						模块
					</p>
					<div class="treestyle">
						<Tree :data="baseData" @on-select-change="selectNode" ref="tree" :render="renderContent"></Tree>
					</div>				
				</Card>
			</Col>
			<Col span="17">
				<div v-show="detailedInfo">
					<Card>
						<p slot="title"> <Icon type="compose"></Icon>业务单元</p> 
						<Row>
							<p>
								<Input v-model="sUnitName" placeholder="请输入单元名称搜索" icon="search" 
									style="width: 200px" @on-change="searching"></Input>
								&nbsp;
								<!-- <Button type="primary" @click="handleInsert()">新增</Button> -->
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
						<Modal width="700" v-model="addModal" title="组件信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false"
							@on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')">
							<Form ref="addFormRef" :model="addModel" :rules="modelAddRules" :label-width="100">
								<FormItem label="单元编号" prop="unitCode">
									<Input v-model="addModel.unitCode" placeholder="请输入5位单元代码" />
								</FormItem>
								<FormItem label="单元名称" prop="unitName">
									<Input v-model="addModel.unitName" placeholder="请输入单元名称" />
								</FormItem>
								<FormItem label="模块代码" prop="moduCode">
									<Input v-model="sModuCode" disabled/>
								</FormItem>
								<FormItem label="组件类型" prop="comCode">
									<Select v-model="addModel.comCode">
										<Option v-for="item in modList" :value="item.value" :key="item.value">{{ item.label }}</Option>
									</Select>
								</FormItem>
								<FormItem label="关联表" prop="relTable">
									<Input v-model="addModel.relTable" />
								</FormItem>
								<FormItem label="关联字段" prop="relColumn">
									<Input v-model="addModel.relColumn" />
								</FormItem>
								<FormItem label="其他信息" prop="relInfo">
									<Input v-model="addModel.relInfo" />
								</FormItem>
							</Form>    	
						</Modal>
						
						<!-- 修改页面 -->
						<Modal width="700" v-model="viewModal" title="组件信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false"
							@on-ok="update('updFormRef')">
							<Form ref="updFormRef" :model="viewOrUpdateModel" :rules="modelAddRules" :label-width="100">
								<FormItem label="单元编号" prop="unitCode">
									<Input v-model="viewOrUpdateModel.unitCode" placeholder="请输入5位单元代码" disabled/>
								</FormItem>
								<FormItem label="单元名称" prop="unitName">
									<Input v-model="viewOrUpdateModel.unitName" placeholder="请输入单元名称" />
								</FormItem>
								<FormItem label="模块代码" prop="moduCode">
									<Input v-model="sModuCode" disabled/>
								</FormItem>
								<FormItem label="组件类型" prop="comCode">
									<Select v-model="viewOrUpdateModel.comCode">
										<Option v-for="item in modList" :value="item.value" :key="item.value">{{ item.label }}</Option>
									</Select>
								</FormItem>
								<FormItem label="关联表" prop="relTable">
									<Input v-model="viewOrUpdateModel.relTable" disabled/>
								</FormItem>
								<FormItem label="关联字段" prop="relColumn">
									<Select v-model="viewOrUpdateModel.relColumn" multiple>
										<Option v-for="item in colList" :value="item.value" :key="item.value">
											{{ item.label }}
										</Option>
									</Select>
								</FormItem>
								<FormItem label="其他信息" prop="relInfo">
									<Input v-model="viewOrUpdateModel.relInfo" />
								</FormItem>
							</Form>    	
						</Modal>
					</Card>
				</div>
			</Col>
		</Row>	
	</div>
</template>
<script>
import businessUnit from './businessUnit_column';
import util from '@/libs/util.js';
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';
import Cookies from 'js-cookie';

	 export default {
        data () {
            return {
				baseData: [],
				detailedInfo: false,
				list_data: [],
				treeurl: '/business/TK0004T.do',
				listurl: '/business/TK0005L.do',
				saveurl: '/business/TK0005I.do',
				deleteurl: '/business/TK0005D.do',
				updateurl: '/business/TK0005U.do',
				selecturl: '/business/TK0005S.do', 	
				collisturl: '/business/TK0005S1.do',
				list_data: [],
				pageSize: 10,
				currentPage: 1,
				totalCount: 0,
				totalPage: 0,
				orderFileds: [],
				sUnitCode: '',
				sModuCode: '',
				sUnitName: '',
				addModal: false,
				addModel: {},
				classificationFinalSelected: [],
				modelAddRules: {
					unitCode : [{required: true}],
					unitName : [{required: true}],
					relTable : [{required: true}],
					relColumn : [{required: true}]
				},
				deletedPks: [],
				selectedLines: 0,
				viewOrUpdateModel: {},
				viewModal: false,
				modList: [],
				colList: [],
				columns: []
			};
			
		},
		methods: {
			getSearchCond() {
				//let menuCode = Cookies.get('menucode');
				return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
					'valObj': {'unitCode': this.sUnitCode, 'unitName': this.sUnitName, 'moduCode': this.sModuCode}
				};
			},
		
			//获取数据	
			init() {
				businessUnit.setPage(this);
				businessUnit.getBaseData("");
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
			
			selectNode(selectedArray) { //选择模型，显示该模型下所有组件
				
				this.classificationFinalSelected = selectedArray.map(item => {
				
					var params = new URLSearchParams();
					params.append('moduCode', item.moduCode);
					
					pagetool.setPage(this);
					this.sModuCode = item.moduCode;
					pagetool.page(this.getSearchCond());
					this.columns = businessUnit.getColumns();
					this.detailedInfo = true;
					this.selectedLines = 0;
				});
			},
			sorting(data) {
				pagetool.sort(data, this.getSearchCond());
			},
			choicing(selection, row) {
				businessUnit.choice(selection, row);
			},
			cancing(selection, row) {
				businessUnit.cancel(selection, row);        	
			},
			searching() {
				pagetool.page(this.getSearchCond());
			},
			//新增页面
			handleInsert(){
				this.addModal = true;
				this.handleReset('addFormRef');
				this.addModel.relTags = [];
				this.modList = [];
				businessUnit.getModList(this.selecturl);
			},
			
			//新增保存
			saving(name) {
				this.addModel.relTag = this.addModel.relTags.join(',');
				this.addModel.moduCode = this.sModuCode;
				businessUnit.save(name);
			},
			
			//新增/修改取消
			reseting (name) {
				pagetool.reset(name);
			},
			
			//删除操作
			handleDelete () {
				businessUnit.delete(this.deleteurl+"?unitCode="+this.deletedPks.join(','));
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
				this.viewModal = true;
				businessUnit.getModList(this.selecturl);
				
				var params = new URLSearchParams();
				params.append('relTable', this.viewOrUpdateModel.relTable);
				businessUnit.getColList(params);
				
				//将字符串转为数组
				this.viewOrUpdateModel.relColumn = this.viewOrUpdateModel.relColumn.split(',');
			},
			
			//修改保存
			update (name) {
				this.viewOrUpdateModel.updDate = datetool.format(new Date());
				
				//将Array数组转换为","隔开的字符串
				this.viewOrUpdateModel.relColumn = this.viewOrUpdateModel.relColumn.join(',');
				businessUnit.update(name);
			},
			
			handleReset (name) {
                this.$refs[name].resetFields(); //对整个表单进行重置，将所有字段值重置为空并移除校验结果
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
		} 
	};
</script>