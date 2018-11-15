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
						表
					</p>
					<div class="treestyle">
						<Tree :data="baseData" @on-select-change="selectNode" ref="tree"></Tree>
					</div>				
				</Card>
			</Col>
			<Col span="17">
				<div v-show="detailedInfo">
					<Card>
						<p slot="title"> <Icon type="compose"></Icon>字段定义</p> 
						<Row>
							<p>
								<Input v-model="sColCode" placeholder="请输入字段名称搜索" icon="search" 
									style="width: 200px" @on-change="searching"></Input>
								<Input v-model="sColName" placeholder="请输入字段中文名称搜索" icon="search" 
									style="width: 200px" @on-change="searching"></Input>
								&nbsp;
								<Button type="primary" @click="handleInsert()">新增</Button>
								<Button type="success" @click="handleUpdate()">修改</Button>
								<Button type="warning" @click="handleDelete()">删除</Button>
							</p>
						</Row>						
						<Row>
							<Table highlight-row border ref="dataList" height="410" 
								:columns="columns" :data="list_data" :stripe="true" :size="getFont"
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
						<Modal width="700" v-model="addModal" title="字段信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false" :loading="loading"
							@on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')">
							<Form ref="addFormRef" :model="addModel" :rules="modelAddRules" :label-width="100" inline="true">
								 <FormItem label="字段名" prop="colCode">
									 <Input v-model="addModel.colCode" placeholder="请输入字段英文名称" style="width: auto"/>
								 </FormItem>
								 <FormItem label="中文名称" prop="colName">
									 <Input v-model="addModel.colName" placeholder="请输入字段中文名称" style="width: auto"/>
								 </FormItem>
								 <FormItem label="字段类型" prop="dataType">
									 <Select v-model="addModel.dataType" style="width:170px" clearable ref="select1" @on-change="selectChange()">
										<Option v-for="item in dtList" :value="item.value" :key="item.value">
											{{ item.label }}
										</Option>
									 </Select>
								 </FormItem>
								 <FormItem label="字段长度" prop="dataLen">
									 <Input v-model="addModel.dataLen" style="width: auto" ref="input4"/>
								 </FormItem>
								 <FormItem label="主键策略" prop="pkGen">
									 <Select v-model="addModel.pkGen" style="width:170px" clearable ref="select2">
										<Option v-for="item in pkList" :value="item.value" :key="item.value">
											{{ item.label }}
										</Option>
									 </Select>
								 </FormItem>
								 </FormItem>
							 </Form>    	
						</Modal>
						
						<!-- 编辑页面 -->
						<Modal width="700" v-model="viewModal" title="字段信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false"
							@on-ok="update('updFormRef')">
							<Form ref="updFormRef" :model="viewOrUpdateModel" :rules="modelAddRules" :label-width="100" inline="true">
								 <FormItem label="字段名" prop="colCode">
									 <Input v-model="viewOrUpdateModel.colCode" placeholder="请输入字段英文名称" style="width: auto" ref="input1"/>
								 </FormItem>
								 <FormItem label="中文名称" prop="colName">
									 <Input v-model="viewOrUpdateModel.colName" placeholder="请输入字段中文名称" style="width: auto" ref="input2"/>
								 </FormItem>
								 <FormItem label="字段类型" prop="dataType">
									 <Select v-model="viewOrUpdateModel.dataType" style="width:170px" ref="select3" @on-change="selectChange()">
										<Option v-for="item in dtList" :value="item.value" :key="item.value">
											{{ item.label }}
										</Option>
									 </Select>
								 </FormItem>
								 <FormItem label="字段长度" prop="dataLen">
									 <Input v-model="viewOrUpdateModel.dataLen" style="width: auto" ref="input3"/>
								 </FormItem>
								 <FormItem label="主键策略" prop="pkGen">
									 <Select v-model="viewOrUpdateModel.pkGen" style="width:170px" clearable ref="select4">
										<Option v-for="item in pkList" :value="item.value" :key="item.label">
											{{ item.label }}
										</Option>
									 </Select>
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
import colDefinition from './colDefinition_column';
import util from '@/libs/util.js';
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';
import Cookies from 'js-cookie';

	 export default {
        data () {
            return {
				baseData: [],
				tagData: [],
				detailedInfo: false,
				list_data: [],
				treeurl: '/business/TK0007T.do',
				listurl: '/business/TK0008L.do',
				updateurl: '/business/TK0008U.do',
				deleteurl: '/business/TK0008D.do',
				saveurl: '/business/TK0008I.do',
				columns: [],
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
				modelAddRules: {
					colCode : [{required: true}],
					colName : [{required: true}],
					dataType : [{required: true}]
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
				]
			};
			
		},
		methods: {
			getSearchCond() {
				//let menuCode = Cookies.get('menucode');
				return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
					'valObj': {'colCode': this.sColCode, 'colName': this.sColName, 'tabCode': this.sTabCode}
				};
			},
		
			//获取数据	
			init() {
				colDefinition.setPage(this);
				colDefinition.getBaseData("");
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
				
					pagetool.setPage(this);
					this.sTabCode = item.tabCode;
					pagetool.page(this.getSearchCond());
					this.columns = colDefinition.getColumns();
					this.detailedInfo = true;
					this.selectedLines = 0;
					
					//去数据库查询该表是否存在
					var params = new URLSearchParams();
					params.append('tabCode', item.tabCode);
					colDefinition.findTable(params);
				});
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
				pagetool.page(this.getSearchCond());
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
				
				if(this.exist){
					//如果表在数据库存在,不允许修改字段
					this.$Modal.warning({
						title: '提示信息',
						content: '该表在数据库中已经存在,不能修改字段！'
					});
					return;
				}else{
					//如果不存在,所有字段都可以修改
					this.$refs.input1.disabled = false;
					this.$refs.input2.disabled = false;
					this.$refs.input3.disabled = false;
					this.$refs.select3.disabled = false;
					this.$refs.select3.clearable = true;
				}
				this.viewModal = true;
			},
			
			//修改保存
			update (name) {
				let dataType = this.viewOrUpdateModel.dataType;
				if(!(dataType === 'int' || dataType === 'date' || dataType === 'datetime')){
					this.$Modal.warning({
						title: '提示信息',
						content: '字段长度不能为空！'
					});
					return;
				}
				
				this.viewOrUpdateModel.updDate = datetool.format(new Date());
				colDefinition.update(name);
			},
			
			//删除操作
			handleDelete () {
				if(this.exist){
					this.$Modal.warning({
						title: '错误信息',
						content: '该表在数据库中已经存在,不能删除字段！'
					});
					return;
				}
				colDefinition.delete(this.deleteurl+"?codes="+this.deletedPks.join(','));
			},
			
			//新增页面
			handleInsert(){
				if(this.exist){
					this.$Modal.warning({
						title: '错误信息',
						content: '该表在数据库中已经存在,不能新增字段！'
					});
					return;
				}
				this.addModal = true;
				pagetool.reset('addFormRef');
				this.$refs.select1.clearSingleSelect();
				this.$refs.select2.clearSingleSelect();
			},
			
			//新增保存
			saving(name) {
			
				let dataType = this.addModel.dataType;
				let dataLen = this.addModel.dataLen != null? this.addModel.dataLen.trim():'';
				
				//其他数据类型长度不能为空
				if(!(dataType === 'int' || dataType === 'date' || dataType === 'datetime') && (dataLen.length == 0 || dataLen == '')){
					this.$Modal.warning({
						title: '提示信息',
						content: '字段长度不能为空！'
					});
					this.loading = false;
					this.$nextTick(() => {
						this.loading = true;
					});
					return;
				}
			
				this.addModel.tabCode = this.sTabCode;
				this.addModel.crtDate = datetool.format(new Date());
				colDefinition.save(name);
			},
			
			//新增/修改取消
			reseting (name) {
				//pagetool.reset(name);
				this.addModal = false;
			},
			
			//数据类型变化时
			selectChange () {
				let dataType = this.viewOrUpdateModel.dataType != null? this.viewOrUpdateModel.dataType:this.addModel.dataType;
				if(dataType === 'int' || dataType === 'date' || dataType === 'datetime'){
					this.viewOrUpdateModel.dataLen = '';
					this.$refs.input3.disabled = true;
					this.$refs.input4.disabled = true;
				}else{
					this.viewOrUpdateModel.dataLen = '';
					this.$refs.input3.disabled = false;
					this.$refs.input4.disabled = false;
				}
			}
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