<style lang="less">
    @import '../../../../../styles/common.less';
	@import '../../modelstyle.less';
</style>
<template>
	<div>
		<Row>
			<div>
				<Card :padding="padding">
					<h4><p><Icon type="compose"></Icon>页面元素</p></h4>
					<Row>
						<p>
							<Input v-model="sEleCName" size="small" placeholder="请输入元素中文名称搜索" icon="search" 
								style="width: 150px" @on-change="searching"></Input>
							<Input v-model="sEleEName" size="small" placeholder="请输入元素英文名称搜索" icon="search" 
								style="width: 150px" @on-change="searching"></Input>
							&nbsp;
							<Button type="success" size="small" @click="handleUpdate()">修改</Button>
						</p>
					</Row>
					<Row>
						<Table highlight-row border ref="peList" :height="tableHeight"
							:columns="columns" :data="page_list_data" :stripe="true" :size="getFont"
							@on-row-click="singleclick">
						</Table>
					</Row>
				</Card>
				
					
				<!-- 编辑页面 -->
				<Modal width="700" v-model="viewModal" title="元素信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false"
					@on-ok="update('updFormRef')">
					<Form ref="updFormRef" :model="viewOrUpdateModel" :label-width="100" inline>
						<FormItem label="英文名称" prop="eleEName">
							<Input v-model="viewOrUpdateModel.eleEName" disabled style="width:170px"/>
						</FormItem>
						<FormItem label="中文名称" prop="eleCName">
							<Input v-model="viewOrUpdateModel.eleCName" style="width:170px"/>
						</FormItem>
						<FormItem label="标签信息" prop="tagInfo">
							<Input v-model="viewOrUpdateModel.tagInfo" icon="ios-search" @on-click="editTags" style="width:170px"/>
						</FormItem>
						<FormItem label="创建日期" prop="crtDate">
							<DatePicker type="date" v-model="viewOrUpdateModel.crtDate" disabled readonly style="width:170px"/>
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
									:columns="tagColumns" :data="tagDatas" :stripe="true">
								</Table>
							</div>
						</Col>
					</div>
				</Modal>
			</div>
		</Row>	
	</div>
</template>
<script>
import pageElement from './pageElement_column';
import util from '@/libs/util.js';
import datetool from '@/libs/datetool';
import Cookies from 'js-cookie';

	 export default {
        data () {
            return {
				tagData: [],
				listurl: '/business/TK0006L.do',
				updateurl: '/business/TK0006U.do',
				tagurl: '/business/TK0003T.do',
				taginfourl: '/business/TK0003L1.do',
				page_list_data: [],
				columns: [],
				sEleCName: '',
				sEleEName: '',
				selectedLines: 0,
				viewOrUpdateModel: {},
				viewModal: false,
				treeModal: false,
				sTagId: '',
				sTagTitle: '',
				tagInfo: false,
				tagDatas: [],
				tagColumns: [],
				createdate: '',
				tableHeight: 200,
				padding: 2,
				unitCode: '',
				index: -1
			};
			
		},
		methods: {
			getSearchCond() {
				return {
					'valObj': {'unitCode': this.unitCode, 'eleCName': this.sEleCName, 'eleEName': this.sEleEName}
				};
			},
			
			//根据父组件(主表)传来的数据 查询子组件(从表)数据
			getElementDataList(data){
				this.unitCode = data;
				pageElement.page(this.getSearchCond());
			},
		
			//获取数据	
			init() {
				pageElement.setPage(this);
				this.columns = pageElement.getColumns();
			},

			searching() {
				pageElement.page(this.getSearchCond());
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
				
				this.viewOrUpdateModel.crtDate = this.createdate;
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
			},
			
			singleclick(row, index){
				this.index = index;
				this.viewOrUpdateModel = row;
				this.createdate = row.crtDate;
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
			this.tableHeight = (window.innerHeight - this.$refs.peList.$el.offsetTop - 235)/2
		},
	};
</script>