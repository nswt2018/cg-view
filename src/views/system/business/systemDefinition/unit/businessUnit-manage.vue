<style lang="less">
    @import '../../../../../styles/common.less';
	@import '../../modelstyle.less';
</style>
<template>
	<div>
		<Row>
			<div>
				<Card :padding="padding">
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
						<Table highlight-row border ref="dataList" :size="getFont" :height="tableHeight"
							:columns="columns" :data="unit_list_data" :stripe="true" 
							@on-row-click="singleclick">
						</Table>
					</Row>
				</Card>
				
				
				<pageElement ref="bElement" style="padding-top: 5px"/>
				
				<!-- 修改页面 -->
				<Modal width="700" v-model="viewModal" title="组件信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false"
					@on-ok="update('updFormRef')" @on-cancel="updCancel('updFormRef')">
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
						<FormItem label="组件类型" prop="comName">
							<Input v-model="viewOrUpdateModel.comName" disabled/>
						</FormItem>
						<FormItem label="关联表" prop="relTable">
							<Input v-model="viewOrUpdateModel.relTable" disabled/>
						</FormItem>
						<FormItem label="关联字段" prop="relColumn">
							<Select v-model="viewOrUpdateModel.relColumn" multiple filterable ref="select1">
								<Option v-for="item in colList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
				sUnitCode: '',
				sModuCode: '',
				sUnitName: '',
				modelAddRules: {
					unitCode : [{required: true}],
					unitName : [{required: true}],
					relTable : [{required: true}],
					relColumn: [{required: true}]
				},
				deletedPks: '',
				selectedLines: 0,
				viewOrUpdateModel: {},
				viewModal: false,
				colList: [],
				columns: [],
				tableHeight: 200,
				padding: 2,
				index: -1
			};
			
		},
		
		methods: {
		
			getSearchCond() {
				return {
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
				this.deletedPks = '';
				this.selectedLines = 0;
				this.$refs.bElement.getElementDataList('-1');
			},
			
			searching() {
				businessUnit.page(this.getSearchCond());
			},
			
			//删除操作
			handleDelete () {
				businessUnit.delete(this.deleteurl+"?unitCode="+this.deletedPks);
			},
			
			//修改操作
			handleUpdate () {
				if(this.index == -1) {
					this.$Modal.warning({
						title: '提示信息',
						content: '必须选中一条记录！'
					});
					
					return;
				};
				
				this.viewModal = true;
				
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
			},
			
			//修改关闭
			updCancel (name) {
				this.index = -1;
				this.viewOrUpdateModel = {};
				this.$refs.select1.clearSingleSelect();
				this.viewModal = false;
			},
			
			singleclick(row, index){
				this.index = index;
				this.viewOrUpdateModel = row;
				this.viewOrUpdateModel.relColumn = this.viewOrUpdateModel.relColumn.split(',');
				
				this.deletedPks = row.unitCode;
				this.$refs.bElement.getElementDataList(this.deletedPks);
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
		},
		
		mounted() {
			this.tableHeight = (window.innerHeight - this.$refs.dataList.$el.offsetTop - 235)/2
		},
	};
</script>