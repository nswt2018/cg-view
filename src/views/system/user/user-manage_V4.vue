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
                			
                		<Button style="margin: 2px;" :key="item.code" 
                			@click="onClicking(item.href)" size="default" :type="item.icon" 
                			v-for="(item,index) in buttonInfos">{{ item.title }}</Button>
                			
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
                
        	 <userView v-model="isViewModal" :data-model="viewOrUpdateModel"
        		 @on-change="setViewModal"></userView>
    	    
        	 <userUpd v-model="isUpdModal" :data-model="viewOrUpdateModel"
        		 @on-change="setUpdModal"></userUpd>
        	 
            </Card>
        </Row>
    </div>


</template>

<script>
import datetool from '@/libs/datetool';
import pagetool from '@/libs/pagetool';
import usercolumn from './user-column';
import Cookies from 'js-cookie';
import userView from './userView.vue';
import userUpd from './userUpd.vue';

export default {
    name: 'user-info',
    components: {
    	userView,
    	userUpd
    },
    data () {
        return {
        	headers: {'Content-Type': 'application/json;charset=UTF-8'},
        	listurl: '/system/SY0001L.do', 
        	saveurl: '/system/SY0001I.do',
        	deleteurl: '/system/SY0001D.do',        	
        	isViewModal: false,
        	isUpdModal: false,
            viewOrUpdateModel: {},            
            pageSize: 10,
            currentPage: 1,
            totalPage: 0,
            totalCount: 0,
            list_data: [],            
            deletedPks: [],
            orderFileds: [],
            sUserCode: '',
            sUserName: '',
            sOrgCode: '',
            selectedLines: 0,
            buttonInfos: [],            
            columns: []            
        };
    },
    methods: {  
    	setViewModal(val) {
    		this.isViewModal = val;
    	},
    	setUpdModal(val) {
    		this.isUpdModal = val;
    	},
    	getSearchCond() {
    		let menuCode = Cookies.get('menucode');
    		if(menuCode) {
    			this.$Message.error('菜单的id没有取到:'+menuCode);
    			return;
    		}
        	return {'menuCode': menuCode, 'pageSize': this.pageSize, 'currentPage': this.currentPage, 
        		'valObj': {'userCode': this.sUserCode, 'userName': this.sUserName, 'orgCode': this.sOrgCode}
        	};
        },
        onClicking(type) {
        	if(type==='VIEW' || type==='view') pagetool.view();
        	else if(type==='ADD'  || type==='add') pagetool.add();
        	else if(type==='UPD' || type==='upd') pagetool.update();
        	else if(type==='DEL' || type==='del') pagetool.delete(this.deleteurl+"?userId="+this.deletedPks.join(','));
        },
        init () {
        	pagetool.setPage(this);
        	usercolumn.setPage(this);
        	pagetool.page(this.getSearchCond());
        	pagetool.getButtons();
        	this.columns = usercolumn.getColumns();    
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
        choicing(selection, row) {
        	pagetool.choice(selection, row);
        },
        cancing(selection, row) {
        	pagetool.cancel(selection, row);        	
        },        
        orgListing () {
        	pagetool.orgList();
        },
        sorting(data) {
        	pagetool.sort(data, this.getSearchCond());
        }
        
    },
    mounted() {     	    	
    }, 
    created() {
    	this.init();
    	this.orgListing();	
    },   
    activated() {  
    }    
};
</script>
