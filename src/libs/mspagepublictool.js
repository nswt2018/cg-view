import util from '@/libs/util.js'
import Cookies from 'js-cookie'
import datetool from './datetool.js';

let mspagepublictool = {};
let spa ;
const header = {'Content-Type': 'application/json;charset=UTF-8'};

mspagepublictool.setPage=function(obj){
   this.spa=obj;
};

mspagepublictool.page = function (data) {
    util.ajax.post(this.spa.mslisturl,data,header).then((rres) => { 
    	if(rres && rres.data) {
        	this.spa.msdata_list = rres.data.rows;
        	this.spa.mstotalCount = rres.data.totalCount;
		}else{
	    	this.spa.$Modal.error({
	             title: '提示',
	             content: rres.data.msg
	         });
	    	return;
		}
	}).catch((err) => {                    		
		mspagepublictool.err(err);
	});
};
mspagepublictool.view=function(){
	if(this.spa.msselectedLines != 1){
		this.spa.$Modal.warning({
            title: '提示信息',
            content: '必须且只能选中一条记录！'
        });
	}else{
		this.spa.msviewModal = true; 
	}
};
mspagepublictool.add=function(){
	//清空数据列表中选择的数据项
	//this.spa.$refs.parmList.selectAll(false);
	this.spa.msaddModal = true; 
};
mspagepublictool.update=function(){
	if(this.spa.msselectedLines!=1){
		this.spa.$Modal.warning({
			title:'提示信息',
			content:'必须选中一条记录！'
		});
	}else{
		this.spa.msupdModal = true; 
	}
};
mspagepublictool.delete=function(delurl){
	if(this.spa.msselectedLines<1){
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
            			this.spa.msselectedLines = 0;
            			this.spa.msviewForm={};
            			this.spa.msupdForm={};
            			this.spa.msdeleteKey = [];
            			mspagepublictool.page(this.spa.getMsSearch());
            		}else{
            			this.spa.$Modal.error({
                            title: '错误信息',
                            content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion
                        });
            		}
    			}).catch((err) => {                    		
    				mspagepublictool.err(err);
    			});
			}
		});
	}
};
mspagepublictool.save=function(refValue){
	this.spa.$refs[refValue].validate((valid) => {
		if(valid){
			let data;
			let url;
			if(refValue==='msaddFormRef'){
				data=this.spa.msaddForm
				url=this.spa.mssaveurl;
			}else{
				data=this.spa.msupdForm
				url=this.spa.msupdateurl;
			}
			util.ajax.put(url,data, header).then((rres) => { 
        		if(rres.data.code==='000001'|| rres.data.code==='000003') {
        			this.spa.$Message.success('Success!');
        			this.spa.msaddModal=false;
        			this.spa.msupdModal=false;
        			mspagepublictool.page(this.spa.getMsSearch());
        		}else{
        			this.spa.msloading = false;
        			this.spa.$Modal.error({
                        title: '错误信息',
                        content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion
                    });
        		}
			}).catch((err) => {
				this.spa.msloading = false;
				mspagepublictool.err(err);
			});
		}else{
			this.spa.$Message.error('Fail!');
        	this.spa.msaddloading = false;
        	this.spa.msupdloading = false;
        	this.spa.$nextTick(() => {
        		this.spa.msaddloading = true;
        		this.spa.msupdloading = true;
            });
		}
	})   
};
mspagepublictool.reset=function(ref){
	this.$refs[ref].resetFields();
};
mspagepublictool.choice=function(selection,row){
	this.spa.msselectedLines=selection.length;
	this.spa.msviewForm=row;
	this.spa.msupdForm=row;
};
mspagepublictool.cancel=function(selection,row){
	this.spa.msselectedLines=selection.length;
	if(this.spa.msselectedLines>0){
		this.spa.msviewForm=selection[0];
		this.spa.msupdForm=selection[0];
	}else{
		this.spa.msviewForm={};
		this.spa.msupdForm={};
		this.spa.msdeleteKey=[];
	}
};
mspagepublictool.getButtons = function() {
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
				pagepublictool.doButtonExt(allButtonRights[menucode]);								
			}else{
				this.spa.$Message.error('从服务器端获取功能按钮权限出错!');
				return;
			}
		});
	} else {
		pagepublictool.doButtonExt(JSON.parse(allButtonRights)[menucode]);
	}
};

mspagepublictool.doButtonExt = function(thisMenuButtons) {
	if(!thisMenuButtons) {
		this.spa.$Message.error('没有取到相应的功能按钮权限!');
		return;
	}
	this.spa.buttonInfos = thisMenuButtons;
};
mspagepublictool.err=function(err){
	this.spa.$Modal.error({
        title: '出错啦',
        content: err
    });
}

export default mspagepublictool;