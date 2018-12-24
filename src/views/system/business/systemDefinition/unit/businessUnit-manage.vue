<style lang="less">
    @import '../../../../../styles/common.less';
	@import '../../modelstyle.less';
</style>
<template>
	<div>
		<Row>
			<div>
				<Card padding="2">
					<h4><p><Icon type="compose"></Icon>业务单元</p></h4>
					<Row>
						<p>
							<Input v-model="sUnitName" placeholder="请输入单元名称搜索" size="small" icon="search" 
								style="width: 150px" @on-change="searching"></Input>
							&nbsp;
							<!-- <Button type="primary" @click="handleInsert()">新增</Button> -->
							<Button type="success" size="small" @click="handleUpdate()">修改</Button>
							<Button type="warning" size="small" @click="handleDelete()">删除</Button>
						</p>
					</Row>						
					<Row>
						<Table highlight-row border ref="dataList" @size="getFont" height="200" 
							:columns="columns" :data="unit_list_data" :stripe="true" 
							@on-select="choicing" @on-select-cancel="cancing">
						</Table>
						<div style="float: right;">
							<Page :total="totalCount" :current="1" :page-size="pageSize" 
							:transfer="true" size="small"
							@on-change="changePage" @on-page-size-change="changePageSize" 
							show-total show-elevator show-sizer></Page>
						</div>
					</Row>
				</Card>
				
				
				<pageElement ref="bElement" style="padding-top: 5px"/>
				
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
							<Input v-model="viewOrUpdateModel.moduCode" disabled/>
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
			</div>
		</Row>	
	</div>
</template>
<script>
import businessUnit from './businessUnit_column';
import util from '@/libs/util.js';
import datetool from '@/libs/datetool';
import Cookies from 'js-cookie';
import pageElement from '../element/pageElement-manage.vue';

	 export default {
		components: {
            pageElement
		},
        data () {
            return {
				unit_list_data: [],
				listurl: '/business/TK0005L.do',
				saveurl: '/business/TK0005I.do',
				deleteurl: '/business/TK0005D.do',
				updateurl: '/business/TK0005U.do',
				selecturl: '/business/TK0005S.do', 	
				collisturl: '/business/TK0005S1.do',
				pageSize: 10,
				currentPage: 1,
				totalCount: 0,
				totalPage: 0,
				orderFileds: [],
				sUnitCode: '',
				sModuCode: '',
				sUnitName: '',
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
				return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
					'valObj': {'unitCode': this.sUnitCode, 'unitName': this.sUnitName, 'moduCode': this.sModuCode}
				};
			},
		
			//获取数据	
			init() {
				businessUnit.setPage(this);
				this.columns = businessUnit.getColumns();
			},
			
			//根据父组件(主表)传来的数据 查询子组件(从表)数据
			getUnitDataList(data){
				this.sModuCode = data;
				businessUnit.page(this.getSearchCond());
				
				//刷新页面元素数据
				this.deletedPks = [];
				this.selectedLines = 0;
				this.$refs.bElement.getElementDataList([-1]);
			},
			
			changePage(page) {
				let cond = this.getSearchCond();
				cond.currentPage = page;
				businessUnit.page(cond);
			},
			
			changePageSize(_pageSize) {
				let cond = this.getSearchCond();
				cond.pageSize = _pageSize;
				businessUnit.page(cond);        	
			},
			choicing(selection, row) {
				businessUnit.choice(selection, row);
			},
			cancing(selection, row) {
				businessUnit.cancel(selection, row);        	
			},
			searching() {
				businessUnit.page(this.getSearchCond());
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
				
				if(this.selectedLines > 1) {
					this.$Modal.warning({
						title: '提示信息',
						content: '只能选中一条记录！'
					});
					
					return;
				};
				this.viewModal = true;
				businessUnit.getModList(this.selecturl);
				
				var params = new URLSearchParams();
				params.append('relTable', this.viewOrUpdateModel.relTable);
				businessUnit.getColList(params);
			},
			
			//修改保存
			update (name) {
				this.viewOrUpdateModel.updDate = datetool.format(new Date());
				
				//将Array数组转换为","隔开的字符串
				this.viewOrUpdateModel.relColumn = this.viewOrUpdateModel.relColumn.join(',');
				businessUnit.update(name);
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