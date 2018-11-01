//import axios from 'axios';
import util from '@/libs/util.js'
import datetool from './datetool.js'
import Cookies from 'js-cookie';
//import table2excel from '@/libs/table2excel.js';

let pagetool = {};
let spa ;
const header = {'Content-Type': 'application/json;charset=UTF-8'};
const ORGLISTURL = '/system/SY0002L.do';
const BUTTONRIGHTSURL = '/system/SY0005L2.do';
const DEL_SUC='000002';
const SAV_SUC='000001';
const UPD_SUC='000003';
const DUR_TIME=30;

pagetool.setPage = function(obj) {
	this.spa = obj;
};

pagetool.page = function (data) {   
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
    		pagetool.err(rres.data);
		}
	}).catch((err) => {
		Cookies.remove('access');
		Cookies.remove('user');                    		
		this.spa.$Modal.error({
            title: '出错啦',
            content: err
        });
	});
};

pagetool.add = function() {        	
	this.spa.$refs.dataList.selectAll(false);
	this.spa.addModel = {};
	this.spa.addModal = true;  
};

pagetool.choice = function(selection, row) {
	this.spa.selectedLines = selection.length;
	this.spa.viewOrUpdateModel = row;
	this.spa.deletedPks.push(row.userId);
	//console.log(selection);
	//console.log(this.deletedPks);
};

pagetool.cancel = function(selection, row) {
	this.spa.selectedLines = selection.length;
	
	if(this.spa.selectedLines>0) {
		this.spa.viewOrUpdateModel = selection[0];
		this.spa.deletedPks.splice(this.spa.deletedPks.indexOf(row.userId), 1);
	}
	else {
		this.spa.viewOrUpdateModel = {};
		this.spa.deletedPks = [];
	}
	//console.log(this.spa.deletedPks);
	
};
pagetool.view = function() {        	
	if(this.spa.selectedLines != 1) {
		this.spa.$Modal.warning({
            title: '提示信息',
            content: '必须且只能选中一条记录！'
        });
	} else {
		this.spa.viewOrUpdateModel.birthDate = datetool.format(this.spa.viewOrUpdateModel.birthDate);
		this.spa.viewModal = true;  
	}
};

pagetool.update = function() {        	
	if(this.spa.selectedLines != 1) {
		this.spa.$Modal.warning({
            title: '提示信息',
            content: '必须且只能选中一条记录！'
        });
	} else {
		this.spa.viewOrUpdateModel.birthDate = datetool.format(this.spa.viewOrUpdateModel.birthDate);
		this.spa.addModel = this.spa.viewOrUpdateModel;
		this.spa.addModal = true;  
	}
};

pagetool.delete = function(delurl) {
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
                        pagetool.page({'pageSize': this.spa.pageSize, 'currentPage': this.spa.currentPage});
            		}else{
            			pagetool.err(rres.data);
            		}
    			});
            },
            onCancel: () => {
            	
            }
        }); 
	}
};

pagetool.save = function(name) {
	this.spa.$refs[name].validate((valid) => {
        if (valid) {
        	//console.log(valid);
        	util.ajax.put(this.spa.saveurl, this.spa.addModel, header).then((rres) => {        		
        		if(rres.data.code===SAV_SUC || rres.data.code===UPD_SUC) {
        			this.spa.$Message.success('Success!');
        			this.spa.addModal=false;
                    pagetool.page({'pageSize': this.spa.pageSize, 'currentPage': this.spa.currentPage});
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

pagetool.reset = function(name) {
	this.spa.$refs[name].resetFields();
};

pagetool.orgList = function() {
	//console.log("pagetool.orgList --  "+url);
	util.ajax.post(ORGLISTURL, {'pageSize': 9999, 'currentPage': 1}, header).then((rres) => {
		if(rres.data.rows) {
			this.spa.orgList = rres.data.rows.map(item => {
                 return {
                    value: item.orgCode,
                    label: item.orgCode + ' - ' + item.orgName
                };
            });
		}
	});
};

pagetool.sort = function(sortdata, listdata) {
	console.log(sortdata);
	var sort = sortdata.key;
	var by = sortdata.order;
	var bys = ["asc", "desc"];
	for(var v in bys) {
		var index = this.spa.orderFileds.indexOf(sort+' '+bys[v]);
		//console.log(sort+' '+v+'\tindex='+index);
		if(index>-1) 
			this.spa.orderFileds.splice(index, 1);
	}      
	if(by!=='normal') {
		this.spa.orderFileds.push(sort+' '+by);
	}	
	listdata.orderBy = this.spa.orderFileds.join(",");
	console.log(listdata);
	pagetool.page(listdata);
};

pagetool.getButtons = function() {
	let menucode = Cookies.get("menucode");
	if(!menucode) {
		this.spa.$Message.error('没有配置菜单权限!');
		return;
	}
	
	let allButtonRights = Cookies.get("allButtonRights");
	if(!allButtonRights) {
		util.ajax.post(BUTTONRIGHTSURL, {}, header).then((rres) => {
			if(rres.data) {				
				Cookies.set("allButtonRights", allButtonRights = rres.data);
				pagetool.doButtonExt(allButtonRights[menucode]);								
			}else{
				this.spa.$Message.error('从服务器端获取功能按钮权限出错!');
				return;
			}
		});
	} else {
		pagetool.doButtonExt(JSON.parse(allButtonRights)[menucode]);
	}
};

pagetool.doButtonExt = function(thisMenuButtons) {
	if(!thisMenuButtons) {
		this.spa.$Message.error('没有取到相应的功能按钮权限!');
		return;
	}
	this.spa.buttonInfos = thisMenuButtons;
};

pagetool.err = function (data) {   
	this.spa.$Message.error({
		content: data.code+'\r\n'+data.msg+'\r\n'+data.excetion,
		duration: DUR_TIME
	});
};

export default pagetool;
