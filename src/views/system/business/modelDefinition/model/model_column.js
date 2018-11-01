import Vue from 'vue';
import iView from 'iview';
import datetool from '@/libs/datetool';
import util from '@/libs/util.js'
//import util from '../../util';

let modelcolumn = {};
let spa ;
const header = {'Content-Type': 'application/json;charset=UTF-8'};
const DEL_SUC='000002';
const UPD_SUC='000003';
const DUR_TIME=30;

modelcolumn.setPage = function(obj) {
	this.spa = obj;
};

modelcolumn.getColumns = function() {
	return [
				{ 
					type: 'selection',
			        width: 60,
			        align: 'center'
			    },
				{
					title: '模型代码',
			        key: 'modCode',
			        sortable: 'custom',
			        align: 'center'
			    },
			    {
					title: '模型名称',
			        key: 'modName',
			        align: 'center'
			    },
			    {
			        title: '版本',
			        key: 'modVersion',
			        align: 'center',
			    },
			    {
			        title: '创建日期',
			        key: 'crtDate',
			        sortable: 'custom',
			        align: 'center',
					render: (h, params) => {                        
			            return h('div', datetool.format(params.row.crtDate));
			        }
			    },
			    {
			        title: '修改日期',
			        key: 'updDate',
					sortable: 'custom',
					align: 'center',
					render: (h, params) => {                        
			            return h('div', datetool.format(params.row.updDate));
			        }
			    }
    ];
};

modelcolumn.choice = function(selection, row) {
	this.spa.selectedLines = selection.length;
	this.spa.viewOrUpdateModel = row;
	this.spa.deletedPks.push(row.modCode);
};

modelcolumn.cancel = function(selection, row) {
	this.spa.selectedLines = selection.length;
	
	if(this.spa.selectedLines>0) {
		this.spa.viewOrUpdateModel = selection[0];
		this.spa.deletedPks.splice(this.spa.deletedPks.indexOf(row.modCode), 1);
	}
	else {
		this.spa.viewOrUpdateModel = {};
		this.spa.deletedPks = [];
	}
	//console.log(this.spa.deletedPks);
	
};

modelcolumn.update = function(name) {
	this.spa.$refs[name].validate((valid) => {
        if (valid) {
			this.spa.viewOrUpdateModel.crtDate = datetool.format(this.spa.viewOrUpdateModel.crtDate);
			this.spa.viewOrUpdateModel.updDate = datetool.format(this.spa.viewOrUpdateModel.updDate);
        	util.ajax.put(this.spa.updateurl, this.spa.viewOrUpdateModel, header).then((rres) => {        		
        		if(rres.data.code===UPD_SUC) {
        			this.spa.$Message.success('修改成功!');
        			this.spa.viewModal=false;
                    this.page({'pageSize': this.spa.pageSize, 'currentPage': this.spa.currentPage});
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

modelcolumn.delete = function(delurl) {
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
                        this.page({'pageSize': this.spa.pageSize, 'currentPage': this.spa.currentPage});
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

modelcolumn.page = function (data) {   
	//console.log(this.spa);
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

modelcolumn.err = function (data) {   
	this.spa.$Message.error({
		content: data.code+'\r\n'+data.msg+'\r\n'+data.excetion,
		duration: DUR_TIME
	});
};


export default modelcolumn;
