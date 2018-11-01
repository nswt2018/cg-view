<style lang="less">
    @import '../../styles/common.less';
    @import './system-modules.less';
</style>
<template>
	<div>
		<Row>
			<Col span="5">
				<Card padding="10">
					<p slot="title">
						<Icon type="ios-pricetags-outline"></Icon>
						节点
					</p>
					<div class="divstyle">
						<Tree :data="baseData" @on-select-change="selectNode" ref="tree"></Tree>
					</div>
					<div>
						<Row class="buttonstyle">
							<Button @click="deleteNode" type="primary">删除</Button>
						</Row>
					</div>
				</Card>
			</Col>
			<Col span="17">
				<div v-show="detailedInfo">
					<Card padding="10" bordered="false">
						<p slot="title" align="center">
							<Icon type="compose"></Icon>
							节点详细信息
						</p>
						<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" inline>
							<FormItem label="模块代码" prop="moduCode">
								<Input v-model="formValidate.moduCode"></Input>
							</FormItem>
							<FormItem label="模块名称" prop="moduName">
								<Input v-model="formValidate.moduName"></Input>
							</FormItem>
							<FormItem label="上级模块" prop="upModuCode">
								<Input v-model="formValidate.upModuCode"></Input>
							</FormItem>
							<FormItem label="模块交易号前缀" prop="moduTc">
								<Input v-model="formValidate.moduTc"></Input>
							</FormItem>
							<FormItem label="所属模块" prop="moduModal">
								<Input v-model="formValidate.moduModal"></Input>
							</FormItem>
							<FormItem label="创建人" prop="crtUserCode">
								<Input v-model="formValidate.crtUserCode"></Input>
							</FormItem>
							<FormItem label="创建机构" prop="crtOrgCode">
								<Input v-model="formValidate.crtOrgCode"></Input>
							</FormItem>
							<FormItem label="创建日期" prop="crtDate">
								<DatePicker type="date" v-model="formValidate.crtDate"></DatePicker>
							</FormItem>
							<FormItem label="修改人" prop="updUserCode">
								<Input v-model="formValidate.updUserCode"></Input>
							</FormItem>
							<FormItem label="修改机构" prop="updOrgCode">
								<Input v-model="formValidate.updOrgCode"></Input>
							</FormItem>
							<FormItem label="修改日期" prop="updDate">
								<DatePicker type="date" v-model="formValidate.updDate"></DatePicker>
							</FormItem>
						</Form>
					</Card>
				</div>
				<div v-show="insertNodeInfo">
					<Card padding="10" bordered="false">
						<p slot="title" align="center">
							<Icon type="compose"></Icon>
							节点详细信息
						</p>
						<Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="110" inline>
							<FormItem label="模块代码" prop="moduCode">
								<Input v-model="formValidate1.moduCode"></Input>
							</FormItem>
							<FormItem label="模块名称" prop="moduName">
								<Input v-model="formValidate1.moduName"></Input>
							</FormItem>
							<FormItem label="上级模块" prop="upModuCode">
								<Input v-model="formValidate.moduCode"></Input>
							</FormItem>
							<FormItem label="模块交易号前缀" prop="moduTc">
								<Input v-model="formValidate1.moduTc"></Input>
							</FormItem>
							<FormItem label="所属模块" prop="moduModal">
								<Input v-model="formValidate.moduName"></Input>
							</FormItem>
							<FormItem label="创建人" prop="crtUserCode">
								<Input v-model="formValidate1.crtUserCode"></Input>
							</FormItem>
							<FormItem label="创建机构" prop="crtOrgCode">
								<Input v-model="formValidate1.crtOrgCode"></Input>
							</FormItem>
							<FormItem label="创建日期" prop="crtDate">
								<DatePicker type="date" v-model="formValidate1.crtDate"></DatePicker>
							</FormItem>
							<FormItem label="修改人" prop="updUserCode">
								<Input v-model="formValidate1.updUserCode"></Input>
							</FormItem>
							<FormItem label="修改机构" prop="updOrgCode">
								<Input v-model="formValidate1.updOrgCode"></Input>
							</FormItem>
							<FormItem label="修改日期" prop="updDate">
								<DatePicker type="date" v-model="formValidate1.updDate"></DatePicker>
							</FormItem>
							<div>
								<Row class="buttonstyle">
									<FormItem>
										<Button type="primary" @click="handleSubmit('formValidate1')">提交</Button>
										<Button type="primary" style="margin-left: 8px" @click="handleReset('formValidate1')">取消</Button>
									</FormItem>
								</Row>
							</div>
						</Form>
					</Card>
				</div>
			</Col>
		</Row>
	</div>	
</template>
<script>
import modules from './modules';
import util from '@/libs/util.js';

    export default {
        data () {
            return {
				treeurl: '/system/SY0011S.do',
				nodeurl: '/system/SY0012S.do',
                baseData: [], //目录
				classificationFinalSelected: [], // 最后实际选择的目录
				detailedInfo: false,
				insertNodeInfo: false,
				formValidate: {},
				formValidate1: {
					moduCode: '',
					moduName: '',
					upModuCode: '',
					moduTc: '',
					moduModal: '',
					crtUserCode: '',
					crtOrgCode: '',
					crtDate: '',
					updUserCode: '',
					updOrgCode: '',
					updDate: ''
				},
				ruleValidate: {},
				ruleValidate1: {
					moduCode : [{required: true}],
					moduName : [{required: true}]
				},
				nodeData: [],
            };
        },
		methods: {
			//获取数据	
			getData () {
				modules.setPage(this);
				modules.getBaseData("");
			},
			
			selectNode (selectedArray) { //选择节点
				
				this.classificationFinalSelected = selectedArray.map(item => {
				
					var params = new URLSearchParams();
					params.append('moduCode', item.moduCode);
					
					modules.setPage(this);
					modules.getNodeData(this.nodeurl, params);
					//console.log(this.formValidate);
					
					this.detailedInfo = true;
					this.insertNodeInfo = false;
					
					return item.moduCode;
				});
			},
			
			insertNode () { //新增节点
				
				if(this.classificationFinalSelected.length == 0){ //选定节点才可以出现新增页面
					this.$Modal.warning({
						title: '提示信息',
						content: '请先选定任意节点！'
					});
					
					return;
				};	
				
				this.detailedInfo = false;
				this.insertNodeInfo = true;
				this.handleReset('formValidate1');
			},
			
			deleteNode () { //删除节点
			
				if(this.classificationFinalSelected.length == 0){ 
					this.$Modal.warning({
						title: '提示信息',
						content: '请先选定任意节点！'
					});
					
					return;
				};
				
				this.detailedInfo = false;
				this.insertNodeInfo = false;
				
				var params = new URLSearchParams();
				params.append('moduCode', this.classificationFinalSelected[0]);
				util.ajax.post('/system/SY0012D.do', params).then((response) => {
					if(response.data.code==='000001'){
						this.$Message.success('删除成功！');
					}else{
						this.$Message.error(response.data.msg);
					};
				});
			},
			
			handleReset (name) {
			 
                this.$refs[name].resetFields(); //对整个表单进行重置，将所有字段值重置为空并移除校验结果
            },
			
			handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
						this.formValidate1.upModuCode = this.formValidate.moduCode;
						this.formValidate1.moduModal = this.formValidate.moduName;
						util.ajax.post('/system/SY0012I.do', this.formValidate1).then((response) => {
							if(response.data.code==='000001'){
								this.$Message.success('添加成功！');
							}else{
								this.$Message.error(response.data.msg);
							};
						});
                        
                    } else {
						this.$Message.error('网络连接异常！');
                    }
                });
            }
		},
		created () {
			this.getData();
		}
	};
</script>
