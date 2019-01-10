import Vue from 'vue';
import iView from 'iview';
import util from '@/libs/util.js'
import datetool from '@/libs/datetool';

let businessUnit = {};
const header = {'Content-Type': 'application/json;charset=UTF-8'};
const DEL_SUC='000002';
const SAV_SUC='000001';
const UPD_SUC='000003';
let spa;
//let nodeInfo = {};

businessUnit.setPage = function(obj) {
	this.spa = obj;
};

businessUnit.getColumns = function() {
	return [
				{ 
					type: 'index',
					width: 60,
			        align: 'center'
			    },
			    {
					title: '单元名称',
			        key: 'unitName',
			        align: 'center'
			    },
				{
			        title: '关联表',
			        key: 'relTable',
			        align: 'center',
					render: (h, params) => {
					  return h('div', [
						 h('span', {
							 style: {
								 display: 'inline-block',
								 width: '100%',
								 overflow: 'hidden',
								 textOverflow: 'ellipsis',
								 whiteSpace: 'nowrap'
							 },
							 domProps: {
								 title: params.row.relTable
							 }
						 }, params.row.relTable)
					 ]);
					}
			    },
				{
			        title: '关联字段',
			        key: 'relColumn',
			        align: 'center',
					render: (h, params) => {
					  return h('div', [
						 h('span', {
							 style: {
								 display: 'inline-block',
								 width: '100%',
								 overflow: 'hidden',
								 textOverflow: 'ellipsis',
								 whiteSpace: 'nowrap'
							 },
							 domProps: {
								 title: params.row.relColumn
							 }
						 }, params.row.relColumn)
					 ]);
					}
			    }
    ];
};

businessUnit.delete = function(delurl) {
	if(this.spa.index == -1) {
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
            			this.spa.deletedPks = '';
            			this.spa.selectedLines = 0;
            			this.spa.viewOrUpdateModel= {};
						this.page(this.spa.getSearchCond());
						
						this.spa.$refs.bElement.getElementDataList(-1);
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

businessUnit.update = function(name) {
	this.spa.$refs[name].validate((valid) => {
        if (valid) {
			this.spa.viewOrUpdateModel.crtDate = datetool.format(this.spa.viewOrUpdateModel.crtDate);
			this.spa.viewOrUpdateModel.updDate = datetool.format(this.spa.viewOrUpdateModel.updDate);
        	util.ajax.put(this.spa.updateurl, this.spa.viewOrUpdateModel, header).then((rres) => {        		
        		if(rres.data.code===UPD_SUC) {
        			this.spa.$Message.success('修改成功!');
        			this.spa.viewModal=false;
                    this.page(this.spa.getSearchCond());
					
					this.spa.$refs.bElement.getElementDataList(this.spa.deletedPks);
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

businessUnit.page = function (data) {
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
    		this.spa.unit_list_data = rres.data.rows;
    		this.spa.totalPage = rres.data.totalPage;
    		this.spa.totalCount = rres.data.totalCount;
    		this.spa.pageSize = rres.data.pageSize;
			
			this.spa.deletedPks = '';
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

businessUnit.save = function(name) {
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
        		}
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

businessUnit.getModList = function (selecturl) {
	util.ajax.post(selecturl,header).then((rres) => {   	
		const result = [];
		rres.data.forEach(d => {
			let item = {
				value: d.comCode,
				label: d.comName
			};
			
			result.push(item);
		});
		
		this.spa.modList = result;
	});
};

businessUnit.getColList = function (params) {
	util.ajax.post(this.spa.collisturl, params, header).then((rres) => {   	
		const result = [];
		rres.data.forEach(d => {
			let item = {
				value: d,
				label: d
			};
			
			result.push(item);
		});
		
		this.spa.colList = result;
	});
};

export default businessUnit;