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
						模型
					</p>
					<div class="treestyle">
						<Tree :data="baseData" @on-select-change="selectNode" ref="tree" :render="renderContent"></Tree>
					</div>				
				</Card>
			</Col>
			<Col span="17">
				<div v-show="detailedInfo">
					<Card>
						<p slot="title"> <Icon type="compose"></Icon>组件定义</p> 
						<Row>
							<p>
								<Input v-model="sComCode" placeholder="请输入组件代码搜索" icon="search" 
									style="width: 200px" @on-change="searching"></Input>
								<Input v-model="sComName" placeholder="请输入组件名称搜索" icon="search" 
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
						<Modal width="700" v-model="addModal" title="组件信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false"
							@on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')">
							<Form ref="addFormRef" :model="addModel" :rules="modelAddRules" :label-width="100">
								<FormItem label="组件代码" prop="comCode">
									<Input v-model="addModel.comCode" placeholder="请输入4位组件代码" />
								</FormItem>
								<FormItem label="组件名称" prop="comName">
									<Input v-model="addModel.comName" placeholder="请输入组件中文名称" />
								</FormItem>
								<FormItem label="模板文件" prop="template">
									<Input v-model="addModel.template"/>
								</FormItem>
								<FormItem label="关联标签" prop="relTag">
									<Input v-model="addModel.relTag"/>
								</FormItem>
								<FormItem label="所属模型" prop="modCode">
									<Input v-model="sModCode" disabled/>
								</FormItem>
							</Form>    	
						</Modal>
						
						<!-- 修改页面 -->
						<Modal width="700" v-model="viewModal" title="组件信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false"
							@on-ok="update('updFormRef')">
							<Form ref="updFormRef" :model="viewOrUpdateModel" :rules="modelAddRules" :label-width="100">
								<FormItem label="组件代码" prop="comCode">
									<Input v-model="viewOrUpdateModel.comCode" placeholder="请输入4位组件代码" disabled/>
								</FormItem>
								<FormItem label="组件名称" prop="comName">
									<Input v-model="viewOrUpdateModel.comName" placeholder="请输入组件中文名称"/>
								</FormItem>
								<FormItem label="模板文件" prop="template">
									<Input v-model="viewOrUpdateModel.template"></Input>
								</FormItem>
								<FormItem label="关联标签" prop="relTag">
									<Input v-model="viewOrUpdateModel.relTag"></Input>
								</FormItem>
								<FormItem label="所属模型" prop="modCode">
									<Input v-model="viewOrUpdateModel.modCode" disabled/>
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
import componet from './componet_column';
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
				treeurl: '/business/TK0001T.do',
				listurl: '/business/TK0002L.do',
				saveurl: '/business/TK0002I.do',
				deleteurl: '/business/TK0002D.do',
				updateurl: '/business/TK0002U.do',
				list_data: [],
				pageSize: 10,
				currentPage: 1,
				totalCount: 0,
				totalPage: 0,
				orderFileds: [],
				sComCode: '',
				sModCode: '',
				sComName: '',
				addModal: false,
				addModel: {},
				classificationFinalSelected: [],
				modelAddRules: {
					comCode : [{required: true}],
					comName : [{required: true}]
				},
				deletedPks: [],
				selectedLines: 0,
				viewOrUpdateModel: {},
				viewModal: false
			};
			
		},
		methods: {
			getSearchCond() {
				//let menuCode = Cookies.get('menucode');
				return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
					'valObj': {'comCode': this.sComCode, 'comName': this.sComName, 'modCode': this.sModCode}
				};
			},
		
			//获取数据	
			init() {
				componet.setPage(this);
				componet.getBaseData("");
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
					params.append('modCode', item.modCode);
					
					pagetool.setPage(this);
					this.sModCode = item.modCode;
					pagetool.page(this.getSearchCond());
					this.columns = componet.getColumns();
					this.detailedInfo = true;
					this.selectedLines = 0;
				});
			},
			sorting(data) {
				pagetool.sort(data, this.getSearchCond());
			},
			choicing(selection, row) {
				componet.choice(selection, row);
			},
			cancing(selection, row) {
				componet.cancel(selection, row);        	
			},
			searching() {
				pagetool.page(this.getSearchCond());
			},
			//新增页面
			handleInsert(){
				this.addModal = true;
				pagetool.reset('addFormRef');
				this.addModel.relTags = [];
			},
			
			//新增保存
			saving(name) {
				this.addModel.modCode = this.sModCode;
				this.addModel.crtDate = datetool.format(new Date());
				componet.save(name);
			},
			
			//新增/修改取消
			reseting (name) {
				//pagetool.reset(name);
				this.addModal = false;
			},
			
			//删除操作
			handleDelete () {
				componet.delete(this.deleteurl+"?comCode="+this.deletedPks.join(','));
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
			},
			
			//修改保存
			update (name) {
				this.viewOrUpdateModel.updDate = datetool.format(new Date());
				componet.update(name);
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