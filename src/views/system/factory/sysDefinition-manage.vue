<style lang="less">
    @import '../../../styles/common.less';
	@import '../business/modelstyle.less';
</style>
<template>
	<div>
		<Row>
			<Col span="5">
				<Card id="card1">
					<p slot="title">
						<Icon type="ios-pricetags-outline"></Icon>
						系统
					</p>
					<div id="Odiv" class="treestyle">
						<Tree :data="baseData" @on-select-change="selectNode" ref="tree"></Tree>
					</div>
					<div class="buttonstyle">
						<Button type="primary" @click="handleInsert()">新增</Button>
						<Button type="success" @click="handleUpdate()">修改</Button>
						<Button type="info" @click="handleDelete()">删除</Button>
					</div>
				</Card>
			</Col>
			<Col span="19">
				<div>
					<Card id="card2">
						<p slot="title">
							<Icon type="compose"/>
							详细信息
						</p>
						
						<!-- 操作按钮 -->
						<Row v-show="buttonInfo">
							<div class="buttonstyle1">
								<br/>
								<Button  type="primary" size="small" @click="codeGeneration()">代码生成</Button>
								<Button type="success" size="small" @click="sysDeployment()">系统部署</Button>
								<Button type="info" size="small" @click="look()">系统查看</Button>
								<hr/>
								<br/>
							</div>
						</Row>	
						
						<!-- 新增页面 -->
						<Row v-show="addForm">
							<br/>
							<br/>
							<div>
								<Form ref="addFormRef" :model="addModel" :rules="addRules" :label-width="200" :inline="true">
									<FormItem label="编码" prop="sysCode">
										<Input v-model="addModel.sysCode" placeholder="请输入系统二位简码或模块编码" style="width: auto"/>
									</FormItem>
									<FormItem label="系统名称" prop="sysName">
										<Input v-model="addModel.sysName" placeholder="请输入系统名称" style="width: auto"/>
									</FormItem>
									<FormItem label="上级系统名称" prop="upperName">
										<Input v-model="systemName" style="width: auto" disabled/>
									</FormItem>
									<FormItem label="挂接模块" prop="modCode">
										<Select v-model="addModel.modCode" style="width: 170px" clearable>
											<Option v-for="item in modList" :value="item.value" :key="item.value">
												{{ item.label }}
											</Option>
										 </Select>
									</FormItem>
									<FormItem label="视图组件路径" prop="vuePath">
										<Input v-model="addModel.vuePath" style="width: auto" ref="i1"/>
									</FormItem>
									<FormItem label="业务逻辑组件路径" prop="javaPath">
										<Input v-model="addModel.javaPath" style="width: auto" ref="i2"/>
									</FormItem>
									<FormItem label="包名" prop="packName">
										<Input v-model="addModel.packName" style="width: auto" ref="i3"/>
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
								<Form ref="checkFormRef" :model="checkModel" :label-width="200" :inline="true">
									<FormItem label="编码" prop="sysCode">
										<Input v-model="checkModel.sysCode" placeholder="请输入系统二位简码或模块编码" style="width: auto" readonly disabled/>
									</FormItem>
									<FormItem label="系统名称" prop="sysName">
										<Input v-model="checkModel.sysName" placeholder="请输入系统名称" style="width: auto" readonly disabled/>
									</FormItem>
									<FormItem label="上级系统名称" prop="upperName">
										<Input v-model="checkModel.upperName" style="width: auto" readonly disabled/>
									</FormItem>
									<FormItem label="挂接模块" prop="modCode">
										<Input v-model="checkModel.modCode" style="width: auto" readonly disabled/>
									</FormItem>
									<FormItem label="视图组件路径" prop="vuePath">
										<Input v-model="checkModel.vuePath" style="width: auto" readonly disabled/>
									</FormItem>
									<FormItem label="业务逻辑组件路径" prop="javaPath">
										<Input v-model="checkModel.javaPath" style="width: auto" readonly disabled/>
									</FormItem>
									<FormItem label="包名" prop="packName">
										<Input v-model="checkModel.packName" style="width: auto" readonly disabled/>
									</FormItem>
									<FormItem label="备注" prop="sysComm">
										<Input v-model="checkModel.sysComm" style="width: auto" readonly disabled/>
									</FormItem>
								</Form>
							</div>
						</Row>
						
						<!-- 修改页面 -->
						<Row v-show="updForm">
							<br/>
							<br/>
							<div>
								<Form ref="updFormRef" :model="updModel" :rules="updRules" :label-width="200" :inline="true">
									<FormItem label="编码" prop="sysCode">
										<Input v-model="updModel.sysCode" placeholder="请输入系统二位简码或模块编码" style="width: auto"/>
									</FormItem>
									<FormItem label="系统名称" prop="sysName">
										<Input v-model="updModel.sysName" placeholder="请输入系统名称" style="width: auto"/>
									</FormItem>
									<FormItem label="上级系统名称" prop="upperName">
										<Input v-model="updModel.upperName" style="width: auto" readonly disabled/>
									</FormItem>
									<FormItem label="挂接模块" prop="modCode">
										<Select v-model="updModel.modCode" style="width: 170px" clearable>
											<Option v-for="item in modList" :value="item.value" :key="item.value">
												{{ item.label }}
											</Option>
										 </Select>
									</FormItem>
									<FormItem label="视图组件路径" prop="vuePath">
										<Input v-model="updModel.vuePath" style="width: auto" ref="i4"/>
									</FormItem>
									<FormItem label="业务逻辑组件路径" prop="javaPath">
										<Input v-model="updModel.javaPath" style="width: auto" ref="i5"/>
									</FormItem>
									<FormItem label="包名" prop="packName">
										<Input v-model="updModel.packName" style="width: auto" ref="i6"/>
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
import sysDefinition from './sysDefinition_column';
import util from '@/libs/util.js';
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';
import Cookies from 'js-cookie';

	 export default {
        data () {
			var validateAddData = (rule, value, callback) =>{
				var self = this;
				var upperSys = self.addModel.upperSys;
				if (!upperSys && !value) {
					return callback(new Error(rule.message));
				}else {
					callback();
				}
			};
			
			var validateUpdData = (rule, value, callback) =>{
				var self = this;
				var upperSys = self.updModel.upperSys;
				if (!upperSys && !value) {
					return callback(new Error(rule.message));
				}else {
					callback();
				}
			};
			
            return {
				baseData: [],
				treeurl: '/factory/AF0001T.do',
				checkurl: '/factory/AF0001L.do',
				saveurl: '/factory/AF0001I.do',
				updateurl: '/factory/AF0001U.do',
				deleteurl: '/factory/AF0001D.do',
				selecturl: '/business/TK0004T.do',
				deploymenturl: '/factory/AF0004G2.do',
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
				isRoot: '',
				sysModCode: '',
				addRules: {
					sysCode : [{required: true, message: '编码不能为空！'}],
					sysName : [{required: true, message: '系统名称不能为空！'}],
					vuePath : [{validator: validateAddData, message: '视图组件路径不能为空！'}],
					javaPath : [{validator: validateAddData, message: '业务逻辑组件路径不能为空！'}],
					packName : [{validator: validateAddData, message: '包名不能为空！'}]
				},
				updRules: {
					sysCode : [{required: true, message: '编码不能为空！'}],
					sysName : [{required: true, message: '系统名称+不能为空！'}],
					vuePath : [{validator: validateUpdData, message: '视图组件路径不能为空！'}],
					javaPath : [{validator: validateUpdData, message: '业务逻辑组件路径不能为空！'}],
					packName : [{validator: validateUpdData, message: '包名不能为空！'}]
				},
				modList: []
			};
		},
		methods: {
		
			//获取系统树数据
			init() {
				pagetool.setPage(this);
				sysDefinition.setPage(this);
				sysDefinition.getBaseData(this.treeurl);
			},
			
			//选择节点
			selectNode(selectedArray) {
				
				this.classificationFinalSelected = selectedArray.map(item => {
				
					this.systemKey = item.sysKey;
					this.systemName = item.title;
					this.isRoot = item.isRoot;
					this.sysModCode = item.sysModCode;
					
					var params = new URLSearchParams();
					params.append('sysKey', this.systemKey);
					
					//获取节点详细信息
					sysDefinition.getNodeInfo(params);
					
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
				if(this.sysModCode != '' && this.sysModCode != null){
					this.$Modal.warning({
						title: '提示信息',
						content: '该系统已经挂接模块,不允许新增子系统！'
					});
					this.systemName = '';
					this.systemKey = '';
					this.isRoot = '';
					this.sysModCode = '';
					return;
				}
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
				sysDefinition.getModuList(this.selecturl);
				
				//设置相关字段只读
				sysDefinition.setAddField();
			},
			
			//新增取消
			addCansel() {
				this.hideForm();
				this.systemName = '';
				this.systemKey = '';
				this.isRoot = '';
				this.sysModCode = '';
			},
			
			//重置字段
			addReset() {
				pagetool.reset('addFormRef');
			},
			
			//新增提交
			addSubmit () {
				this.addModel.crtDate = datetool.format(new Date());
				this.addModel.upperSys = this.systemKey;
				this.addModel.upperName = this.systemName;
				sysDefinition.save('addFormRef', this.saveurl, this.addModel);
				
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
				sysDefinition.getModuList(this.selecturl);
				
				sysDefinition.setUpdField();
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
				sysDefinition.save('updFormRef', this.updateurl, this.updModel);
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
				sysDefinition.delete(this.deleteurl + "?sysKey=" + this.systemKey);
				this.hideForm();
			},
			
			//隐藏界面
			hideForm (){
				this.addForm = false;
				this.checkForm = false;
				this.updForm = false;
				this.buttonInfo = false;
			},
			codeGeneration () {
				if(this.systemKey == '' || this.systemKey.length == 0){
					this.$Modal.warning({
						title: '提示信息',
						content: '请选择任意节点！'
					});
					
					return;
				}
				var params = new URLSearchParams();
				params.append('sysKey', this.systemKey);
				sysDefinition.codeGeneration(params);
			},
			//系统部署
			sysDeployment () {
				sysDefinition.sysDeployment();
			},
			
			//系统查看
			look () {
				window.open('http://123.125.34.39:8082','_blank');
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
			document.getElementById("Odiv").style.height = (window.innerHeight - 240) + 'px'
			document.getElementById("card1").style.height = (window.innerHeight - 140) + 'px'
			document.getElementById("card2").style.height = (window.innerHeight - 140) + 'px'
		},
	};
</script>