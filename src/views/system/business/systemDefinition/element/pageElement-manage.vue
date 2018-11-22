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
						业务单元
					</p>
					<div class="treestyle">
						<Tree :data="baseData" @on-select-change="selectNode" ref="tree"></Tree>
					</div>				
				</Card>
			</Col>
			<Col span="17">
				<div v-show="detailedInfo">
					<Card>
						<p slot="title"> <Icon type="compose"></Icon>页面元素</p> 
						<Row>
							<p>
								<Input v-model="sEleCName" placeholder="请输入元素中文名称搜索" icon="search" 
									style="width: 200px" @on-change="searching"></Input>
								<Input v-model="sEleEName" placeholder="请输入元素英文名称搜索" icon="search" 
									style="width: 200px" @on-change="searching"></Input>
								&nbsp;
								<Button type="success" @click="handleUpdate()">修改</Button>
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
					
						
						<!-- 编辑页面 -->
						<Modal width="700" v-model="viewModal" title="元素信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false"
							@on-ok="update('updFormRef')">
							<Form ref="updFormRef" :model="viewOrUpdateModel" :label-width="100">
								<FormItem label="英文名称" prop="eleEName">
									<Input v-model="viewOrUpdateModel.eleEName" disabled style="width: auto"/>
								</FormItem>
								<FormItem label="中文名称" prop="eleCName">
									<Input v-model="viewOrUpdateModel.eleCName" style="width: auto"/>
								</FormItem>
								<FormItem label="标签信息" prop="tagInfo">
									<Input v-model="viewOrUpdateModel.tagInfo" icon="ios-search" @on-click="editTags" style="width: auto"/>
								</FormItem>
								<FormItem label="创建日期" prop="crtDate">
									<DatePicker type="date" v-model="viewOrUpdateModel.crtDate" disabled readonly/>
								</FormItem>
							</Form>    	
						</Modal>
						
						<!-- 标签树 -->
						<Modal v-model="treeModal" width="700" @on-ok="submitColumns" @on-cancel="cancelSub">
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
				</div>
			</Col>
		</Row>	
	</div>
</template>
<script>
import pageElement from './pageElement_column';
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
				treeurl: '/business/TK0005T.do',
				listurl: '/business/TK0006L.do',
				updateurl: '/business/TK0006U.do',
				tagurl: '/business/TK0003T.do',
				taginfourl: '/business/TK0003L1.do',
				list_data: [],
				columns: [],
				pageSize: 10,
				currentPage: 1,
				totalCount: 0,
				totalPage: 0,
				sEleCode: '',
				sUnitCode: '',
				sEleCName: '',
				sEleEName: '',
				classificationFinalSelected: [],
				deletedPks: [],
				selectedLines: 0,
				viewOrUpdateModel: {},
				viewModal: false,
				treeModal: false,
				sTagId: '',
				sTagTitle: '',
				tagInfo: false,
				tagDatas: [],
				tagColumns: [],
				crtdate: ''
			};
			
		},
		methods: {
			getSearchCond() {
				//let menuCode = Cookies.get('menucode');
				return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
					'valObj': {'unitCode': this.sUnitCode, 'eleCode': this.sEleCode, 'eleCName': this.sEleCName, 'eleEName': this.sEleEName}
				};
			},
		
			//获取数据	
			init() {
				pageElement.setPage(this);
				pageElement.getBaseData("");
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
				
					if(item.isRoot == '0') return;
					
					var params = new URLSearchParams();
					params.append('unitCode', item.code);
					
					pagetool.setPage(this);
					this.sUnitCode = item.code;
					pagetool.page(this.getSearchCond());
					this.columns = pageElement.getColumns();
					this.detailedInfo = true;
					this.selectedLines = 0;
				});
			},
			sorting(data) {
				pagetool.sort(data, this.getSearchCond());
			},
			choicing(selection, row) {
				pageElement.choice(selection, row);
			},
			cancing(selection, row) {
				pageElement.cancel(selection, row);
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
				this.viewOrUpdateModel.crtDate = this.crtdate;
				this.viewModal = true;
			},
			
			//修改保存
			update (name) {
				this.viewOrUpdateModel.updDate = datetool.format(new Date());
				pageElement.update(name);
			},
			
			editTags () {
				pageElement.getTagData('');
				this.treeModal = true;
			},
			
			selectTag(selectedArray) { //选择标签，显示该标签下所有属性
			
				selectedArray.map(item => {
					if(item.isRoot == '0') return;
					
					var params = new URLSearchParams();
					params.append('tagCode', item.tagId);
					params.append('eleCode', this.viewOrUpdateModel.eleCode);
					
					//this.sTagId = item.tagId;
					//this.sTagTitle = item.title;
					
					pageElement.getTagDataInfo(this.taginfourl, params);
					this.tagColumns = pageElement.getTagColumns();
					
					this.tagInfo = true;
				});
				
			},
			
			handleEdit (row) {
				this.$set(row, '$isEdit', true);
			}, 
			
			handleSave (row) {
				row.eleCode = this.viewOrUpdateModel.eleCode;
				this.$set(row, '$isEdit', false);
				pageElement.saveColumns(row);
			},
			
			submitColumns () {
				var params = new URLSearchParams();
				params.append('eleCode', this.viewOrUpdateModel.eleCode);
				pageElement.assembleJson(params);
			},
			
			cancelSub () {
				this.tagInfo = false;
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