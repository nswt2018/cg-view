<style lang="less">
    @import '../../../styles/common.less';
	@import '../business/modelstyle.less';
</style>
<template>
	<div>
		<Row>
			<Col span="5">
				<Card>
					<p slot="title">
						<Icon type="ios-pricetags-outline"></Icon>
						系统定义
					</p>
					<div class="treestyle">
						<Tree :data="baseData" @on-select-change="selectNode" ref="tree"></Tree>
					</div>
					<div class="buttonstyle">
						<Button type="primary" @click="handleInsert()">新增</Button>
						<Button type="success" @click="handleUpdate()">修改</Button>
						<Button type="info" @click="handleDelete()">删除</Button>
					</div>
				</Card>
			</Col>
			<Col span="17">
				<div>
					<Card class="formstyle">
						<p slot="title">
							<Icon type="compose"/>
							详细信息
						</p>
						
						<!-- 操作按钮 -->
						<Row v-show="buttonInfo">
							<div class="buttonstyle1">
								<br/>
								<Button type="primary" size="small" @click="xxx()">代码生成</Button>
								<Button type="success" size="small" @click="xxx()">系统部署</Button>
								<Button type="info" size="small" @click="xxx()">系统查看</Button>
								<hr/>
								<br/>
							</div>
						</Row>	
						
						<!-- 新增页面 -->
						<Row v-show="addForm">
							<br/>
							<br/>
							<div>
								<Form ref="addFormRef" :model="addModel" :rules="modelRules" :label-width="200" inline="true">
									<FormItem label="系统二位简码" prop="sysCode">
										<Input v-model="addModel.sysCode" placeholder="请输入系统二位简码" style="width: auto"/>
									</FormItem>
									<FormItem label="系统名称" prop="sysName">
										<Input v-model="addModel.sysName" placeholder="请输入系统名称" style="width: auto"/>
									</FormItem>
									<FormItem label="上级系统名称" prop="upperName">
										<Input v-model="systemName" style="width: auto" disabled/>
									</FormItem>
									<FormItem label="挂接模块" prop="modCode">
										<Select v-model="addModel.modCode" style="width: 170px" readonly>
											<Option v-for="item in modList" :value="item.value" :key="item.value">
												{{ item.label }}
											</Option>
										 </Select>
									</FormItem>
									<FormItem label="视图组件路径" prop="vuePath">
										<Input v-model="addModel.vuePath" style="width: auto"/>
									</FormItem>
									<FormItem label="业务逻辑组件路径" prop="javaPath">
										<Input v-model="addModel.javaPath" style="width: auto"/>
									</FormItem>
									<FormItem label="包名" prop="packName">
										<Input v-model="addModel.packName" style="width: auto"/>
									</FormItem>
									<FormItem label="备注" prop="sysComm">
										<Input v-model="addModel.sysComm" style="width: auto"/>
									</FormItem>
								</Form>
							</div>
							<div class="buttonstyle">
								<Button type="primary" @click="addCansel()">取消</Button>
								<Button type="success" @click="addReset()">重置</Button>
								<Button type="info" @click="addSubmit()">提交</Button>
							</div>
						</Row>
						
						<!-- 查看页面 -->
						<Row v-show="checkForm">
							<div>
								<Form ref="checkFormRef" :model="checkModel" :label-width="200" inline="true">
									<FormItem label="系统二位简码" prop="sysCode">
										<Input v-model="checkModel.sysCode" placeholder="请输入系统二位简码" style="width: auto" readonly/>
									</FormItem>
									<FormItem label="系统名称" prop="sysName">
										<Input v-model="checkModel.sysName" placeholder="请输入系统名称" style="width: auto" readonly/>
									</FormItem>
									<FormItem label="上级系统名称" prop="upperName">
										<Input v-model="checkModel.upperName" style="width: auto" readonly/>
									</FormItem>
									<FormItem label="挂接模块" prop="modCode">
										<Input v-model="checkModel.modCode" style="width: auto" readonly/>
									</FormItem>
									<FormItem label="视图组件路径" prop="vuePath">
										<Cascader :data="data" trigger="hover" style="width: auto"/>
									</FormItem>
									<FormItem label="业务逻辑组件路径" prop="javaPath">
										<Input v-model="checkModel.javaPath" style="width: auto" readonly/>
									</FormItem>
									<FormItem label="包名" prop="packName">
										<Input v-model="checkModel.packName" style="width: auto" readonly/>
									</FormItem>
									<FormItem label="备注" prop="sysComm">
										<Input v-model="checkModel.sysComm" style="width: auto" readonly/>
									</FormItem>
								</Form>
							</div>
						</Row>
						
						<!-- 修改页面 -->
						<Row v-show="updForm">
							<br/>
							<br/>
							<div>
								<Form ref="updFormRef" :model="updModel" :rules="modelRules" :label-width="200" inline="true">
									<FormItem label="系统二位简码" prop="sysCode">
										<Input v-model="updModel.sysCode" placeholder="请输入系统二位简码" style="width: auto"/>
									</FormItem>
									<FormItem label="系统名称" prop="sysName">
										<Input v-model="updModel.sysName" placeholder="请输入系统名称" style="width: auto"/>
									</FormItem>
									<FormItem label="上级系统名称" prop="upperName">
										<Input v-model="updModel.upperName" style="width: auto" readonly disabled/>
									</FormItem>
									<FormItem label="挂接模块" prop="modCode">
										<Select v-model="updModel.modCode" style="width: 170px" readonly>
											<Option v-for="item in modList" :value="item.value" :key="item.value">
												{{ item.label }}
											</Option>
										 </Select>
									</FormItem>
									<FormItem label="视图组件路径" prop="vuePath">
										<Input v-model="updModel.vuePath" style="width: auto"/>
									</FormItem>
									<FormItem label="业务逻辑组件路径" prop="javaPath">
										<Input v-model="updModel.javaPath" style="width: auto"/>
									</FormItem>
									<FormItem label="包名" prop="packName">
										<Input v-model="updModel.packName" style="width: auto"/>
									</FormItem>
									<FormItem label="备注" prop="sysComm">
										<Input v-model="updModel.sysComm" style="width: auto"/>
									</FormItem>
								</Form>
							</div>
							<div class="buttonstyle">
								<Button type="success" @click="updReset()">取消</Button>
								<Button type="info" @click="updSubmit()">提交</Button>
							</div>
						</Row>
					</Card>
				</div>
			</Col>
		</Row>	
	</div>
</template>
<script>
import appFactory from './appFactory_column';
import util from '@/libs/util.js';
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';
import Cookies from 'js-cookie';

	 export default {
        data () {
            return {
				baseData: [],
				treeurl: '/factory/AF0001T.do',
				checkurl: '/factory/AF0001L.do',
				saveurl: '/factory/AF0001I.do',
				updateurl: '/factory/AF0001U.do',
				deleteurl: '/factory/AF0001D.do',
				selecturl: '/business/TK0004T.do',
				buttonInfo: false,
				addForm: false,
				checkForm: false,
				updForm: false,
				addModel: {
					sysCode: '',
					sysName: '',
					upperSys: '',
					upperName: '',
					modCode: '',
					vuePath: '',
					javaPath: '',
					packName: '',
					sysComm: ''
				},
				checkModel: {},
				updModel: {},
				systemKey: '',
				systemName: '',
				modelRules: {
					sysCode : [{required: true}],
					sysName : [{required: true}]
				},
				modList: []
			};
		},
		methods: {
		
			//获取系统树数据
			init() {
				pagetool.setPage(this);
				appFactory.setPage(this);
				appFactory.getBaseData(this.treeurl);
			},
			
			//选择节点
			selectNode(selectedArray) {
				
				this.classificationFinalSelected = selectedArray.map(item => {
				
					this.systemKey = item.sysKey;
					this.systemName = item.title;
					
					var params = new URLSearchParams();
					params.append('sysKey', this.systemKey);
					
					//获取节点详细信息
					appFactory.getNodeInfo(params);
					
					//显示查看界面
					this.checkForm = true;
					
					//显示操作按钮
					this.buttonInfo = true;
					
					//隐藏其他页面
					this.addForm = false;
					this.updForm = false;
				});
			},
			
			//新增操作
			handleInsert() {
			
				//显示新增界面
				this.addForm = true;
				
				//隐藏其他界面
				this.buttonInfo = false;
				this.checkForm = false;
				this.updForm = false;
				
				//清空表单
				pagetool.reset('addFormRef');
				
				//获取模块代码
				this.modList = [];
				appFactory.getModuList(this.selecturl);
			},
			
			//新增取消
			addCansel() {
			
				//隐藏新增页面
				this.addForm = false;
				
				//显示查看界面
				this.checkForm = true;
				
				//显示操作按钮
				this.buttonInfo = true;
				
				//刷新树
				appFactory.getBaseData(this.treeurl);
			},
			
			//重置字段
			addReset() {
				pagetool.reset('addFormRef');
			},
			
			//新增提交
			addSubmit () {
				this.addModel.crtDate = datetool.format(new Date());
				this.addModel.upperSys = this.systemKey;
				appFactory.save('addFormRef', this.saveurl, this.addModel);
				
				this.addCansel();
			},
			
			//修改操作
			handleUpdate () {
				
				if(this.systemKey == '' || this.systemKey.length == 0){
					this.$Modal.warning({
						title: '提示信息',
						content: '请选择任意节点！'
					});
					
					return;
				}
				
				//显示修改界面
				this.updForm = true;
				
				//隐藏其他界面
				this.buttonInfo = false;
				this.checkForm = false;
				this.addForm = false;
				
				//获取模块代码
				appFactory.getModuList(this.selecturl);
			},
			
			//修改取消
			updReset() {
				//隐藏修改页面
				this.updForm = false;
				
				//显示其他界面
				this.checkForm = true;
				this.buttonInfo = true;
			},
			
			//修改提交
			updSubmit () {
				this.updModel.updDate = datetool.format(new Date());
				this.updModel.upperSys = this.systemKey;
				appFactory.save('updFormRef', this.updateurl, this.updModel);
			},
			
			//删除操作
			handleDelete () {
				if(this.systemKey == '' || this.systemKey.length == 0){
					this.$Modal.warning({
						title: '提示信息',
						content: '请选择任意节点！'
					});
					
					return;
				}
				appFactory.delete(this.deleteurl + "?sysKey=" + this.systemKey);
				
				//刷新树
				appFactory.getBaseData(this.treeurl);
				this.addModel = {};
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