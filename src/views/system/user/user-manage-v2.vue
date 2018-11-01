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
                			style="width: 200px" @on-change="searching"></Input>
                		<Input v-model="sUserName" placeholder="请输入姓名搜索" icon="search" 
                    			style="width: 200px" @on-change="searching"></Input>
                		<Input v-model="sOrgCode" placeholder="请输入机构搜索" icon="search" 
                			style="width: 200px" @on-change="searching">></Input>
                			
                		<Button @click="viewing" type="info">查看</Button>
                        <Button @click="adding" type="primary">新增</Button>
                        <Button @click="updating" type="warning">修改</Button>
                        <Button @click="deleting" type="error">删除</Button>                      
        	    	</p>
        	    </Row>        	    
        	    <Row>
                	<Table highlight-row border ref="dataList" size="small" height="410" 
                		:columns="columns" :data="list_data" :stripe="true" 
                		@on-select="choicing" @on-select-cancel="cancing" 
                		@on-sort-change="sorting"
                	></Table>
                	<div style="float: right;">
                	<Page  :total="totalCount" :current="1" :page-size="pageSize" 
                		:transfer="true" size="small"
                		@on-change="changePage" @on-page-size-change="changePageSize" 
                		show-total show-elevator show-sizer></Page>
                	</div>
                </Row>  
                
        	 <Modal width="700" v-model="viewModal" title="用户信息">
                <Form :model="viewOrUpdateModel" :label-width="100">
                    <FormItem label="姓名：">
                        <Input :readonly="true" v-model="viewOrUpdateModel.userName" />
                    </FormItem>
                    <FormItem label="英文名：">
                        <Input :readonly="true" v-model="viewOrUpdateModel.userNameEn" />
                    </FormItem>
                    <FormItem label="备注：">
                        <Input disabled v-model="viewOrUpdateModel.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
                    </FormItem>
                    <FormItem label="性别：">
                        <RadioGroup v-model="viewOrUpdateModel.userSex">
                            <Radio label="1">男</Radio>
                            <Radio label="2">女</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>    	
    	    </Modal>
    	    
       	 <Modal width="700" v-model="addModal" title="用户新增" ok-text="保存" cancel-text="关闭"
       		:mask-closable="false" :loading="loading"
       		 @on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')"
       	 >
         <Form ref="addFormRef" :model="addModel" :rules="userRules" :label-width="100">
             <FormItem label="编号：" required>
                 <Input v-model="addModel.userCode" placeholder="请输入7位员工编号" />
             </FormItem>
             <FormItem label="姓名：" required>
                 <Input v-model="addModel.userName" placeholder="请输入中文姓名" />
             </FormItem>
             <FormItem label="机构：" required>
	             <Select v-model="addModel.orgCode" placeholder="请选择机构..." filterable>
		             <Option v-for="(option, index) in orgList" :value="option.value" :key="index">{{option.label}}</Option>
		         </Select>
             </FormItem>
             <FormItem label="出生地：">
               <Select v-model="addModel.birthPlace">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
              </Select>
             </FormItem>
             <FormItem label="出生日期：">
             	<DatePicker type="date" placeholder="Select date" v-model="addModel.birthDate"></DatePicker>
             </FormItem>
             <FormItem label="性别：">
	             <RadioGroup v-model="addModel.userSex">
	                 <Radio label="1">男</Radio>
	                 <Radio label="2">女</Radio>
	             </RadioGroup>
	         </FormItem>
             <FormItem label="备注：" prop="remark">
                 <Input v-model="addModel.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" />
             </FormItem>    
         </Form>    	
	    </Modal>
    	    
    	    
                
            </Card>
        </Row>
    </div>


</template>

<script>
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';

export default {
    name: 'user-info',
    data () {
        return {
        	headers: {'Content-Type': 'application/json;charset=UTF-8'},
        	listurl: '/system/SY0001L.do', 
        	saveurl: '/system/SY0001I.do',
        	deleteurl: '/system/SY0001D.do',        	
            viewModal: false,
            addModal: false,
            viewOrUpdateModel: {},
            addModel: {},
            loading: true,
            pageSize: 10,
            currentPage: 1,
            totalPage: 0,
            totalCount: 0,
            list_data: [],
            orgList: [],
            deletedPks: [],
            orderFileds: [],
            sUserCode: '',
            sUserName: '',
            sOrgCode: '',
            selectedLines: 0,
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
                                h('ul', this.list_data[params.index].nationality)
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
                        return h('div', datetool.format(params.row.birthDate));
                    }
                }
            ]            
        };
    },
    methods: {  
    	getSearchCond() {
        	return {'pageSize': this.pageSize, 'currentPage': this.currentPage, 
        		'valObj': {'userCode': this.sUserCode, 'userName': this.sUserName, 'orgCode': this.sOrgCode}
        	};
        },
        init () {
        	pagetool.setPage(this);
        	pagetool.page(this.getSearchCond());
        },        
        searching () {
    		pagetool.page(this.getSearchCond());
        },
        changePage (page) {
        	let cond = this.getSearchCond();
        	cond.currentPage = page;
        	pagetool.page(cond);
        },
        changePageSize (_pageSize) {
        	let cond = this.getSearchCond();
        	cond.pageSize = _pageSize;
        	pagetool.page(cond);        	
        },   
        viewing() {        	
        	pagetool.view();
        },
        adding() {
        	pagetool.add();
        },
        updating() {
        	pagetool.update();
        },
        deleting() {
        	pagetool.delete(this.deleteurl+"?userId="+this.deletedPks.join(','));
        },
        choicing(selection, row) {
        	pagetool.choice(selection, row);
        },
        cancing(selection, row) {
        	pagetool.cancel(selection, row);        	
        },
        saving(name) {
        	pagetool.save(name);
        },
        reseting (name) {
        	pagetool.reset(name);
        },
        orgListing () {
        	pagetool.orgList();
        },
        sorting(data) {
        	pagetool.sort(data, this.getSearchCond());
        }
        
    },
    mounted () { 
    	this.init();
    	this.orgListing();
    },
    
    activated () {    	
    }
    
};
</script>
