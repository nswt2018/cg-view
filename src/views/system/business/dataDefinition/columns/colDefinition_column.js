import Vue from 'vue';
import iView from 'iview';
import util from '@/libs/util.js'
import datetool from '@/libs/datetool';

let colDefinition = {};
const header = {'Content-Type': 'application/json;charset=UTF-8'};
const DEL_SUC='000002';
const SAV_SUC='000001';
const UPD_SUC='000003';
let spa;
//let nodeInfo = {};

colDefinition.setPage = function(obj) {
	this.spa = obj;
};

colDefinition.getColumns = function() {
	return [
				{ 
					type: 'selection',
			        width: 60,
			        align: 'center'
			    },
				{
					title: '字段名',
			        key: 'colCode',
					width: 120,
			        sortable: 'custom',
			        align: 'center'
			    },
			    {
					title: '中文名',
			        key: 'colName',
					width: 120,
			        align: 'center'
			    },
			    {
			        title: '字段类型',
			        key: 'dataType',
			        align: 'center',
			    },
				{
			        title: '字段长度',
			        key: 'dataLen',
			        align: 'center',
			    },
				{
			        title: '主键策略',
			        key: 'pkGen',
			        align: 'center',
					render: (h, params) => {
					  let _this = this;
					  let texts = '';
					  if(params.row.pkGen == 0){
						  texts = "0-手动录入"
					  }else if(params.row.pkGen == 1){
						  texts = "1-自动生成"
					  }
					  return h('div',texts);
					}
				},
    ];
};

colDefinition.delete = function(delurl) {
	if(this.spa.selectedLines < 1) {
		this.spa.$Modal.warning({
            title: '提示信息',
            content: '必须选中一条记录！'
        });
	} else {
		this.spa.$Modal.confirm({
            title: '提示信息',
            content: '确认要删除选中的记录吗！',
            onOk: () => {
            	//console.log(this.viewOrUpdateModel);
            	//console.log('userId='+this.viewOrUpdateModel.userId);
                
                util.ajax.delete(delurl, header).then((rres) => {
            		if(rres.data.code===DEL_SUC) {
            			this.spa.$Message.success('删除成功!');
            			this.spa.deletedPks = [];
            			this.spa.selectedLines = 0;
            			this.spa.viewOrUpdateModel= {};
						this.page(this.spa.getSearchCond());
            		}else{
            			this.err(rres.data);
            		}
    			});
            },
            onCancel: () => {
            	
            }
        }); 
	}
};

colDefinition.update = function(name) {
	this.spa.$refs[name].validate((valid) => {
        if (valid) {
			this.spa.viewOrUpdateModel.crtDate = datetool.format(this.spa.viewOrUpdateModel.crtDate);
			this.spa.viewOrUpdateModel.updDate = datetool.format(this.spa.viewOrUpdateModel.updDate);
        	util.ajax.put(this.spa.updateurl, this.spa.viewOrUpdateModel, header).then((rres) => {        		
        		if(rres.data.code===UPD_SUC) {
        			this.spa.$Message.success('修改成功!');
        			this.spa.viewModal=false;
                    this.page(this.spa.getSearchCond());
        		}else{
        			this.spa.$Modal.error({
                        title: '错误信息',
                        content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion
                    });
        		}
			});
            
        } else {
        	this.spa.$Message.error('修改失败!');
        	this.spa.loading = false;
        	this.spa.$nextTick(() => {
        		this.spa.loading = true;
            });
        }
    })
};

colDefinition.page = function (data) {   
    util.ajax.post(this.spa.listurl, data, header).then((rres) => { 
    	if(rres && rres.data && !rres.data.pageSize) {
    		this.spa.$Modal.error({
                title: '提示',
                content: rres.data.msg
            });
    		//this.spa.$router.push({name: 'home_index'});
    		return;
		}
    	if(rres.data.pageSize) {
    		this.spa.list_data = rres.data.rows;
    		this.spa.totalPage = rres.data.totalPage;
    		this.spa.totalCount = rres.data.totalCount;
    		this.spa.pageSize = rres.data.pageSize;
			
			this.spa.deletedPks = [];
			this.spa.selectedLines = 0;
    	}else{
    		this.err(rres.data);
		}
	}).catch((err) => {                   		
		this.spa.$Modal.error({
            title: '出错啦',
            content: err
        });
	});
};

colDefinition.choice = function(selection, row) {
	this.spa.selectedLines = selection.length;
	this.spa.viewOrUpdateModel = row;
	this.spa.deletedPks.push(row.colCode + "/" +this.spa.sTabCode);
};

colDefinition.cancel = function(selection, row) {
	this.spa.selectedLines = selection.length;
	
	if(this.spa.selectedLines>0) {
		this.spa.viewOrUpdateModel = selection[0];
		this.spa.deletedPks.splice(this.spa.deletedPks.indexOf(row.colCode + "/" +this.spa.sTabCode), 1);
	}
	else {
		this.spa.viewOrUpdateModel = {};
		this.spa.deletedPks = [];
	}
};

colDefinition.save = function(name) {
	this.spa.$refs[name].validate((valid) => {
        if (valid) {
        	//console.log(valid);
        	util.ajax.put(this.spa.saveurl, this.spa.addModel, header).then((rres) => {
        		if(rres.data.code===SAV_SUC || rres.data.code===UPD_SUC) {
        			this.spa.$Message.success('Success!');
        			this.spa.addModal=false;
                    this.page(this.spa.getSearchCond());
        		}else{
        			this.spa.$Modal.error({
                        title: '错误信息',
                        content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion
                    });
        		}k
			});
            
        } else {
        	this.spa.$Message.error('Fail!');
        	this.spa.loading = false;
        	this.spa.$nextTick(() => {
        		this.spa.loading = true;
            });
        }
    })
};

colDefinition.findTable = function(params) {
	util.ajax.put('/business/TK0008L1.do', params, header).then((rres) => {        		
		if(rres.data.code===SAV_SUC || rres.data.code===UPD_SUC) {
			this.spa.exist = false;
		}else{
			this.spa.exist = true;
		}
	});
};

colDefinition.getTabList = function(url){
	util.ajax.post(url,header).then((rres) => {   	
		const result = [];
		rres.data.forEach(d => {
			let tab = {
				value: d,
				label: d
			};
			
			result.push(tab);
		});
		
		this.spa.tabList = result;
	});
};

colDefinition.getColList = function(url, params){
	util.ajax.post(url, params, header).then((rres) => {   	
		const result = [];
		rres.data.forEach(d => {
			let tab = {
				value: d,
				label: d
			};
			
			result.push(tab);
		});
		
		this.spa.colList = result;
	});
};

export default colDefinition;