<style lang="less">
    @import '../../../styles/common.less';
</style>

<template>
    <div>
        <Row>
            <Card>
                <p slot="title"> <Icon type="compose"></Icon>用户管理</p>
                <Row>
                	<p>
                		<Input v-model="sUserCode" placeholder="请输入姓名编号搜索" icon="search" 
                			style="width: 200px" @on-change="handleSearch"></Input>
                		<Input v-model="sUserName" placeholder="请输入姓名搜索" icon="search" 
                    			style="width: 200px" @on-change="handleSearch"></Input>
                		<Input v-model="sOrgCode" placeholder="请输入机构搜索" icon="search" 
                			style="width: 200px" @on-change="handleSearch">></Input>
                			
                		<Button @click="showing" type="info">查看</Button>
                        <Button @click="adding" type="primary">新增</Button>
                        <Button @click="updating" type="warning">修改</Button>
                        <Button @click="deleting" type="error">删除</Button>
                        <Button @click="editInfo = true" type="success">提交</Button>
        	    	</p>
        	    </Row>        	    
        	    <Row>
                	<Table highlight-row border ref="userList" size="small" height="410" 
                		:columns="columns" :data="userlist_data" :stripe="true" 
                		@on-select="selecting" @on-select-cancel="selcancing" 
                		@on-sort-change="sorting"
                	></Table>
                	<div style="float: right;">
                	<Page  :total="totalCount" :current="1" :page-size="pageSize" 
                		:transfer="true" size="small"
                		@on-change="changePage" @on-page-size-change="changePageSize" 
                		show-total show-elevator show-sizer></Page>
                	</div>
                </Row>  
                
        	 <Modal width="700" v-model="showInfo" title="用户信息">
                <Form ref="userInfo" :model="curUser" :label-width="100">
                    <FormItem label="姓名：">
                        <Input :readonly="true" v-model="curUser.userName" />
                    </FormItem>
                    <FormItem label="英文名：">
                        <Input :readonly="true" v-model="curUser.userNameEn" />
                    </FormItem>
                    <FormItem label="备注：">
                        <Input disabled v-model="curUser.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
                    </FormItem>
                    <FormItem label="性别：">
                        <RadioGroup v-model="curUser.userSex">
                            <Radio label="1">男</Radio>
                            <Radio label="2">女</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>    	
    	    </Modal>
    	    
       	 <Modal width="700" ref="addInfoModal" v-model="addInfo" title="用户新增" ok-text="保存" cancel-text="关闭"
       		:mask-closable="false" :loading="loading"
       		 @on-ok="handleAddSave('userAddForm')" @on-cancel="handleAddReset('userAddForm')"
       	 >
         <Form ref="userAddForm" :model="userAddInfo" :rules="userRules" :label-width="100">
             <FormItem label="编号：" required>
                 <Input v-model="userAddInfo.userCode" placeholder="请输入7位员工编号" />
             </FormItem>
             <FormItem label="姓名：" required>
                 <Input v-model="userAddInfo.userName" placeholder="请输入中文姓名" />
             </FormItem>
             <FormItem label="机构：" required>
	             <Select v-model="userAddInfo.orgCode" placeholder="请选择机构..." filterable>
		             <Option v-for="(option, index) in orgList" :value="option.value" :key="index">{{option.label}}</Option>
		         </Select>
             </FormItem>
             <FormItem label="出生地：">
               <Select v-model="userAddInfo.birthPlace">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
              </Select>
             </FormItem>
             <FormItem label="出生日期：">
             	<DatePicker type="date" placeholder="Select date" v-model="userAddInfo.birthDate"></DatePicker>
             </FormItem>
             <FormItem label="性别：">
	             <RadioGroup v-model="userAddInfo.userSex">
	                 <Radio label="1">男</Radio>
	                 <Radio label="2">女</Radio>
	             </RadioGroup>
	         </FormItem>
             <FormItem label="备注：" prop="remark">
                 <Input v-model="userAddInfo.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" />
             </FormItem>    
             <!-- FormItem
                 Button type="primary" @click="handleAddSave('userAddInfo')"保存/Button
                 Button type="ghost" @click="handleAddReset('userAddInfo')" style="margin-left: 8px"重填/Button
             FormItem-->
         </Form>    	
	    </Modal>
    	    
    	    
                
            </Card>
        </Row>
    </div>


</template>

<script>
import axios from 'axios';
import qs from 'qs';

export default {
    name: 'user-info',
    data () {
        return {
        	headers: {'Content-Type': 'application/json;charset=UTF-8'},
        	url: 'http://localhost:8080',
            showInfo: false,
            addInfo: false,
            editInfo: false,
            loading: true,
            delUserIds: [],
            orderFileds: [],
            orgList: [],
            pageSize: 10,
            currentPage: 1,
            totalPage: 0,
            totalCount: 0,
            sUserCode: '',
            sUserName: '',
            sOrgCode: '',
            selLen: 0,
            curUser: {},
            userAddInfo: {},
            userRules: {
            	remark: [
                    { required: true, message: '请填写该员工所有相关未尽事宜，务必减少疏漏之处', trigger: 'blur' }
                ]
            },
            columns: [
            	{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '编号',
                    key: 'userCode',
                    sortable: 'custom',
                    align: 'center',
                    filter: {
                    	type: 'Input' 
                    },
                    filterMethod (value, row) {
                        return row.userCode===value;
                    }
                },
                {
                    title: '姓名',
                    key: 'userName',
                    align: 'center'
                },
                {
                    title: '机构编号',
                    key: 'orgCode',
                    sortable: 'custom',
                    align: 'center'
                },
                {
                    title: '岗位',
                    key: 'postNo',
                    align: 'center'
                },
                {
                    title: '性别',
                    key: 'userSex',
                    align: 'center',
                    filters: [{
                        label: '男',
                        value: '1'
                    },
                    {
                        label: '女',
                        value: '2'
                    }],
                    filterMultiple: false,
                    filterMethod (value, row) {
                        return row.userSex===value;
                    },            
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.userSex === '1' ? 'blue' : 'red';
                        const text = row.userSex === '1' ? '男' : '女';

                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                },
                {
                    title: '国籍',
                    key: 'nationality',
                    align: 'center',
                    render: (h, params) => {
                        return h('Poptip', {
                            props: {
                                trigger: 'hover',
                                title: '小资料',
                                placement: 'bottom'
                            }
                        }, [
                            h('Tag', params.row.nationality),
                            h('div', {
                                slot: 'content'
                            }, [
                                h('ul', this.userlist_data[params.index].nationality)
                            ])
                        ]);
                    }
                },
                {
                    title: '民族',
                    key: 'ethnic',
                    align: 'center'
                },
                {
                    title: '出生日期',
                    key: 'birthDate',
                    align: 'center',
                    filters: [{
                        label: '大于25岁',
                        value: '1'
                    },
                    {
                        label: '小于等于25岁',
                        value: '2'
                    }],
                    filterMultiple: false,
                    filterMethod (value, row) {
                    	if (value === 1) {
                            return row.birthDate < '1993-01-01';
                        } else  {
                        	return row.birthDate >= '1993-01-01';
                        }
                    },     
                    render: (h, params) => {
                        //return h('Tag', this.formatDate(this.userlist_data[params.index].birthDate));
                    	//console.log(params.row.birthDate);
                        return h('div', this.formatDate(params.row.birthDate));
                    }
                }
            ],
            userlist_data: []
        };
    },
    methods: {
    	pageC(cond) {
            const data2 = cond;                        
            axios.post(this.url+'/system/user/getPageList.do', data2, this.headers).then((rres) => {
            	if(rres.data.pageSize) {
	            	this.userlist_data = rres.data.rows;
	            	this.totalPage = rres.data.totalPage;
	            	this.totalCount = rres.data.totalCount;
	            	this.pageSize = rres.data.pageSize;
            	}
			});
    	},
    	handleSearch () {
    		this.pageC({
    			'pageSize': this.pageSize, 
    			'currentPage': this.currentPage, 
    			'valObj': {'userCode': this.sUserCode, 'userName': this.sUserName, 'orgCode': this.sOrgCode}
    		});
        },
        init () {
            this.pageC({'pageSize': this.pageSize, 'currentPage': this.currentPage, 
    			'valObj': {'userCode': this.sUserCode, 'userName': this.sUserName, 'orgCode': this.sOrgCode}});
        },
        formatDate (d) {
        	//console.log(d);
        	//console.log(new Date(d));
        	//console.log(new Date(d).toLocaleString());
        	if(d) {
        		var date = new Date(d);
        		var m = date.getMonth()+1;
        		var r = date.getDate();
        		return date.getFullYear()+'-'+ (m >= 10 ? m : '0'+m) +'-'+ (r>=10?r : '0'+r);
        	}      	
        	else 
        		return "";
        },
        changePage (page) {
        	this.pageC({'pageSize': this.pageSize, 'currentPage': page, 
    			'valObj': {'userCode': this.sUserCode, 'userName': this.sUserName, 'orgCode': this.sOrgCode}});
        },
        changePageSize (_pageSize) {
        	this.pageC({'pageSize': _pageSize, 'currentPage': this.currentPage, 
    			'valObj': {'userCode': this.sUserCode, 'userName': this.sUserName, 'orgCode': this.sOrgCode}});
        },   
        showing() {        	
        	//this.$refs.userList.clearCurrentRow();
        	//this.$refs.userList.selectAll(status);
        	//alert(this.$refs.userList.data[params.index].nationality);
        	if(this.selLen != 1) {
        		this.$Modal.warning({
                    title: '提示信息',
                    content: '必须且只能选中一条记录！'
                });
        	} else {
        		this.curUser.birthDate = this.formatDate(this.curUser.birthDate);
        		this.showInfo = true;  
        	}
        },
        adding() {
        	this.$refs.userList.selectAll(false);
        	this.userAddInfo = {};
        	this.addInfo = true;  
        },
        updating() {
        	if(this.selLen != 1) {
        		this.$Modal.warning({
                    title: '提示信息',
                    content: '必须且只能选中一条记录！'
                });
        	} else {
        		this.curUser.birthDate = this.formatDate(this.curUser.birthDate);
	        	this.userAddInfo = this.curUser;
	        	this.addInfo = true;  
        	}
        },
        deleting() {
        	if(this.selLen < 1) {
        		this.$Modal.warning({
                    title: '提示信息',
                    content: '必须选中一条记录！'
                });
        	} else {
        		this.$Modal.confirm({
                    title: '提示信息',
                    content: '确认要删除选中的记录吗！',
                    onOk: () => {
                    	console.log(this.curUser);
                    	console.log('userId='+this.curUser.userId);
                        
                        axios.delete(this.url+'/system/user/delete.do?userId='+this.delUserIds.join(','), 
                    			this.headers).then((rres) => {
                    		if(rres.data.code==='300000') {
                    			this.$Message.success('删除成功!');
                    			this.delUserIds = [];
                    			this.selLen = 0;
                    			this.curUser=[];
                                this.pageC({'pageSize': this.pageSize, 'currentPage': this.currentPage});
                    		}else{
                    			this.$Message.error({
                					content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion,
                					duration: 30
                    			});
                    		}
            			});
                    },
                    onCancel: () => {
                    	
                    }
                }); 
        	}
        },
        selecting(selection, row) {
        	this.selLen = selection.length;
        	this.curUser = row;
        	this.delUserIds.push(row.userId);
        	//console.log(selection);
        	console.log(this.delUserIds);
        },
        selcancing(selection, row) {
        	this.selLen = selection.length;
        	
        	if(this.selLen>0) {
        		this.curUser = selection[0];
        		this.delUserIds.splice(this.delUserIds.indexOf(row.userId), 1);
        	}
        	else {
        		this.curUser = {};
        		this.delUserIds = [];
        	}
        	console.log(this.delUserIds);
        	
        },
        handleAddSave(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                	//console.log(valid);
                	axios.put(this.url+'/system/user/save.do', 
                			this.userAddInfo,
                			this.headers).then((rres) => {
                		if(rres.data.code==='100000' || rres.data.code==='200000') {
                			this.$Message.success('Success!');
                            this.addInfo=false;
                            this.pageC({'pageSize': this.pageSize, 'currentPage': this.currentPage});
                		}else{
                			this.$Modal.error({
                                title: '错误信息',
                                content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion
                            });
                		}
        			});
                    
                } else {
                    this.$Message.error('Fail!');
                    this.loading = false;
                    this.$nextTick(() => {
                      this.loading = true;
                    });
                    //this.addInfo.buttonLoading = false;  
                    //this.$refs['addInfoModal'].buttonLoading = false;
                }
            })
        },
        handleAddReset (name) {
            this.$refs[name].resetFields();
        },
        orgSeling () {
        	axios.post(this.url+'/system/org/pageList.do', 
        			{'pageSize': 9999, 'currentPage': 1}, 
        			this.headers).then((rres) => {
        		if(rres.data.rows) {
                	this.orgList = rres.data.rows.map(item => {
                         return {
                            value: item.orgCode,
                            label: item.orgCode + ' - ' + item.orgName
                        };
                    });
        		}
			});
        },
        sorting(data) {
        	//console.log(data);
        	var sort = data.key;
        	var by = data.order;
        	var bys = ["asc", "desc"];
        	for(var v in bys) {
        		var index = this.orderFileds.indexOf(sort+' '+bys[v]);
        		//console.log(sort+' '+v+'\tindex='+index);
        		if(index>-1) 
        			this.orderFileds.splice(index, 1);
        	}      
        	if(by!=='normal') {
        		this.orderFileds.push(sort+' '+by);
        	}
        	console.log(this.orderFileds);
        	this.pageC({'pageSize': this.pageSize, 'currentPage': this.currentPage, 
        		'orderBy': this.orderFileds.join(","),
    			'valObj': {'userCode': this.sUserCode, 'userName': this.sUserName, 'orgCode': this.sOrgCode}});
        }
        
    },
    mounted () {
    },
    activated () {
    	this.init();
    	this.orgSeling();
    }
    
};
</script>
