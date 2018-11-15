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
						标签
					</p>
					<div class="treestyle">
						<Tree :data="baseData" @on-select-change="selectNode" ref="tree" :render="renderContent"></Tree>
					</div>				
				</Card>
			</Col>
			<Col span="17">
				<div v-show="detailedInfo">
					<Card>
						<p slot="title"> <Icon type="compose"></Icon>标签定义</p> 
						<Row>
							<p>
								<Input v-model="sTagProp" placeholder="请输入属性搜索" icon="search" 
									style="width: 200px" @on-change="searching" clearable></Input>
								<Select v-model="sPropType" placeholder="请选择属性类型" clearable
									style="width: 200px" @on-change="searching">
									<Option v-for="item in propTypeList" :value="item.value" :key="item.value">
										{{ item.label }}
									</Option>
								</Select>
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
						<Modal width="700" v-model="addModal" title="标签信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false"
							@on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')" :loading="loading">
							<Form ref="addFormRef" :model="addModel" :rules="modelAddRules" :label-width="100">
								<FormItem label="标签名称" prop="tagName">
									<Input v-model="sTagTitle" placeholder="请输入组件中文名称" disabled/>
								</FormItem>
								<FormItem label="属性" prop="tagProp">
									<Input v-model="addModel.tagProp"/>
								</FormItem>
								<FormItem label="属性类别" prop="propType">
									 <Select v-model="addModel.propType">
										<Option v-for="item in propTypeList" :value="item.value" :key="item.value">
											{{ item.label }}
										</Option>
									</Select>
								</FormItem>
								<FormItem label="属性值" prop="propVal">
									<Input v-model="addModel.propVal"/>
								</FormItem>
								<FormItem label="使用规则" prop="useRule">
									<Input v-model="addModel.useRule"/>
								</FormItem>
								<FormItem label="默认值" prop="defaultValue">
									<Input v-model="addModel.defaultValue"/>
								</FormItem>
							</Form>    	
						</Modal>
						
						<!-- 修改页面 -->
						<Modal width="700" v-model="viewModal" title="组件信息"  ok-text="保存" cancel-text="关闭" :mask-closable="false"
							@on-ok="update('updFormRef')">
							<Form ref="updFormRef" :model="viewOrUpdateModel" :rules="modelUpdRules" :label-width="100">
								<FormItem label="标签名称" prop="tagName">
									<Input v-model="viewOrUpdateModel.tagName" placeholder="请输入组件中文名称" disabled/>
								</FormItem>
								<FormItem label="属性" prop="tagProp">
									<Input v-model="viewOrUpdateModel.tagProp"/>
								</FormItem>
								<FormItem label="属性类别" prop="propType">
									<Select v-model="viewOrUpdateModel.propType">
										<Option v-for="item in propTypeList" :value="item.value" :key="item.value">
											{{ item.label }}
										</Option>
									</Select>
								</FormItem>
								<FormItem label="属性值" prop="propVal">
									<Input v-model="viewOrUpdateModel.propVal"/>
								</FormItem>
								<FormItem label="使用规则" prop="useRule">
									<Input v-model="viewOrUpdateModel.useRule"/>
								</FormItem>
								<FormItem label="默认值" prop="defaultValue">
									<Input v-model="viewOrUpdateModel.defaultValue"/>
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
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';
import tag from './tag_column';
import Cookies from 'js-cookie';

export default {
	data () {
		return {
			treeurl: '/business/TK0003T.do',
			listurl: '/business/TK0003L.do', 
			saveurl: '/business/TK0003I.do',
			deleteurl: '/business/TK0003D.do',
			updateurl: '/business/TK0003U.do',  		
			baseData: {},
			detailedInfo: false,
			classificationFinalSelected: [],
			sTagProp: '',
			sPropType: '',
			sTagId: '',
			sTagTitle: '',
			list_data: [],
			pageSize: 10,
			currentPage: 1,
			totalCount: 0,
			totalPage: 0,
			addModal: false,
			addModel: {},
			modelAddRules: {
				tagProp : [{required: true}],
				propType : [{required: true}]
			},
			modelUpdRules: {
				tagProp : [{required: true}],
				propType : [{required: true}]
			},
			loading: true,
			viewOrUpdateModel: {},
			viewModal: false,
			selectedLines: 0,
			deletedPks: [],
			propTypeList: [
				{
					value: '1',
					label: '静态标签'
				},
				{
					value: '2',
					label: '动态标签'
				},
				{
					value: '3',
					label: '方法'
				}
			]
		};
	},
	methods: {  
		getSearchCond() {
			return {'menuCode': '', 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
        		'valObj': {'tagCode': this.sTagId, 'propType': this.sPropType, 'tagProp': this.sTagProp}
        	};
        },
		
        init () {
			tag.setPage(this);
        	tag.getBaseData('');
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
		
		selectNode(selectedArray) { //选择标签，显示该标签下所有属性
			
			this.classificationFinalSelected = selectedArray.map(item => {
				if(item.isRoot == '0') return;
				
				var params = new URLSearchParams();
				params.append('tagCode', item.tagId);
				
				pagetool.setPage(this);
				this.sTagId = item.tagId;
				this.sTagTitle = item.title;
				this.sPropType = '';
				pagetool.page(this.getSearchCond());
				this.columns = tag.getColumns();
				this.detailedInfo = true;
				this.selectedLines = 0;
			});
		},
		
		sorting(data) {
			pagetool.sort(data, this.getSearchCond());
		},
		choicing(selection, row) {
			tag.choice(selection, row);
		},
		cancing(selection, row) {
			tag.cancel(selection, row);        	
		},
		searching() {
			tag.page(this.getSearchCond());
		},
		
		//新增页面
		handleInsert(){
			this.addModal = true;
			pagetool.reset('addFormRef');
		},
		
		//新增保存
		saving(name) {
			this.addModel.tagCode = this.sTagId;
			this.addModel.tagName = this.sTagTitle;
			this.addModel.crtDate = datetool.format(new Date());
			tag.save(name);
		},
		
		//新增/修改取消
		reseting (name) {
			this.addModal = true;
			//pagetool.reset(name);
		},
		
		//删除操作
		handleDelete () {
			tag.delete(this.deleteurl+"?tagKey="+this.deletedPks.join(',')); 
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
			tag.update(name);
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
detailedInfo