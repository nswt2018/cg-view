import util from '@/libs/util.js'
import Cookies from 'js-cookie'
import datetool from './datetool.js';

let parmfun = {};
let spa ;
const header = {'Content-Type': 'application/json;charset=UTF-8'};

parmfun.setPage=function(obj){
   this.spa=obj;
};

parmfun.page = function (data) {  
    util.ajax.post(this.spa.listurl,data,header).then((rres) => { 
    	if(rres && rres.data) {
        	this.spa.data_list = rres.data.rows;
        	this.spa.totalCount = rres.data.totalCount;
		}else{
	    	this.spa.$Modal.error({
	             title: '提示',
	             content: rres.data.msg
	         });
	    	return;
		}
	}).catch((err) => {                    		
		parmfun.err(err);
	});
};
parmfun.view=function(){
	if(this.spa.selectedLines != 1){
		this.spa.$Modal.warning({
            title: '提示信息',
            content: '必须且只能选中一条记录！'
        });
	}else{
		this.spa.viewModal = true; 
	}
};
parmfun.add=function(){
	//清空数据列表中选择的数据项
	//this.spa.$refs.parmList.selectAll(false);
	this.spa.addModal = true; 
};
parmfun.update=function(){
	if(this.spa.selectedLines!=1){
		this.spa.$Modal.warning({
			title:'提示信息',
			content:'必须选中一条记录！'
		});
	}else{
		this.spa.updModal = true; 
	}
};
parmfun.delete=function(delurl){
	if(this.spa.selectedLines<1){
		this.spa.$Modal.warning({
			title:'提示信息',
			content:'必须选中一条记录！'
		});
	}else{
		this.spa.$Modal.confirm({
			title:'确认信息',
			content:'确认要删除吗！',
			onOk:()=>{
				util.ajax.delete(delurl, header).then((rres) => {
            		if(rres.data.code==='000002') {
            			this.spa.$Message.success('删除成功!');
            			this.spa.selectedLines = 0;
            			this.spa.viewForm={};
            			this.spa.updForm={};
            			this.spa.deleteKey = [];
            			parmfun.page(this.spa.getSearch());
            		}else{
            			this.spa.$Modal.error({
                            title: '错误信息',
                            content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion
                        });
            		}
    			}).catch((err) => {                    		
    				parmfun.err(err);
    			});
			}
		});
	}
};
parmfun.save=function(refValue){
	this.spa.$refs[refValue].validate((valid) => {
		if(valid){
			let data;
			let url;
			if(refValue==='addRef'){
				data=this.spa.addForm
				url=this.spa.saveurl;
			}else{
				data=this.spa.updForm
				url=this.spa.updateurl;
			}
			util.ajax.put(url,data, header).then((rres) => { 
        		if(rres.data.code==='000001'|| rres.data.code==='000003') {
        			this.spa.$Message.success('Success!');
        			this.spa.addModal=false;
        			this.spa.updModal=false;
        			parmfun.page(this.spa.getSearch());
        		}else{
        			this.spa.loading = false;
        			this.spa.$Modal.error({
                        title: '错误信息',
                        content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion
                    });
        		}
			}).catch((err) => {
				this.spa.loading = false;
				parmfun.err(err);
			});
		}else{
			this.spa.$Message.error('Fail!');
        	this.spa.loading = false;
        	this.spa.$nextTick(() => {
        		this.spa.loading = true;
            });
		}
	})   
};

parmfun.choice=function(selection,row){
	this.spa.selectedLines=selection.length;
	this.spa.viewForm=row;
	this.spa.updForm=row;
	this.spa.deleteKey.push(row.paraCode);
};
parmfun.cancel=function(selection,row){
	this.spa.selectedLines=selection.length;
	if(this.spa.selectedLines>0){
		this.spa.viewForm=selection[0];
		this.spa.updForm=selection[0];
		this.spa.deleteKey.splice(this.spa.deleteKey.indexOf(row.paraCode), 1);
	}else{
		this.spa.viewForm={};
		this.spa.updForm={};
		this.spa.deleteKey=[];
	}
};
parmfun.getButtons = function() {
	let menucode = "1001";
	if(!menucode) {
		this.spa.$Message.error('没有配置菜单权限!');
		return;
	}
	let allButtonRights = Cookies.get("allButtonRights");
	if(!allButtonRights) {
		util.ajax.post("/system/SY0005L2.do", {}, header).then((rres) => {
			if(rres.data) {				
				Cookies.set("allButtonRights", allButtonRights = rres.data);
				parmfun.doButtonExt(allButtonRights[menucode]);								
			}else{
				this.spa.$Message.error('从服务器端获取功能按钮权限出错!');
				return;
			}
		});
	} else {
		parmfun.doButtonExt(JSON.parse(allButtonRights)[menucode]);
	}
};

parmfun.doButtonExt = function(thisMenuButtons) {
	if(!thisMenuButtons) {
		this.spa.$Message.error('没有取到相应的功能按钮权限!');
		return;
	}
	this.spa.buttonInfos = thisMenuButtons;
};
parmfun.err=function(err){
	this.spa.$Modal.error({
        title: '出错啦',
        content: err
    });
}

export default parmfun;