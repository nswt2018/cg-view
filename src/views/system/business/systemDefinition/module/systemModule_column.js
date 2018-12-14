import Vue from 'vue';
import iView from 'iview';
import datetool from '@/libs/datetool';
import util from '@/libs/util.js'
//import util from '../../util';

let systemModule = {};
let spa ;
const header = {'Content-Type': 'application/json;charset=UTF-8'};
const SAV_SUC='000001';
const DEL_SUC='000002';
const UPD_SUC='000003';
const DUR_TIME=30;

systemModule.setPage = function(obj) {
	this.spa = obj;
};

systemModule.getColumns = function() {
	return [
				{ 
					type: 'selection',
			        width: 60,
			        align: 'center'
			    },
				{
					title: '模块代码',
			        key: 'moduCode',
			        sortable: 'custom',
			        align: 'center'
			    },
			    {
					title: '中文名称',
			        key: 'moduCName',
			        align: 'center'
			    },
			    {
			        title: '模块交易号',
			        key: 'moduTC',
			        align: 'center',
			    },
				{
					title: '所属模型',
			        key: 'modName',
			        align: 'center'
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

systemModule.choice = function(selection, row) {
	this.spa.selectedLines = selection.length;
	this.spa.viewOrUpdateModel = row;
	this.spa.deletedPks.push(row.moduCode);
};

systemModule.cancel = function(selection, row) {
	this.spa.selectedLines = selection.length;
	
	if(this.spa.selectedLines>0) {
		this.spa.viewOrUpdateModel = selection[0];
		this.spa.deletedPks.splice(this.spa.deletedPks.indexOf(row.moduCode), 1);
	}
	else {
		this.spa.viewOrUpdateModel = {};
		this.spa.deletedPks = [];
	}
	//console.log(this.spa.deletedPks);
	
};

systemModule.update = function(name) {
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

systemModule.delete = function(delurl) {
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

systemModule.page = function (data) {   
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

systemModule.err = function (data) {   
	this.spa.$Message.error({
		content: data.code+'\r\n'+data.msg+'\r\n'+data.excetion,
		duration: DUR_TIME
	});
};

systemModule.getModList = function (selecturl) {
	util.ajax.post(selecturl,header).then((rres) => {   	
		const result = [];
		rres.data.forEach(d => {
			let item = {
				value: d.modCode,
				label: d.modName
			};
			
			result.push(item);
		});
		
		this.spa.modList = result;
	});
};

systemModule.getTabList = function (gettaburl) {
	util.ajax.post(gettaburl,header).then((rres) => {   	
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

//获取表字段
systemModule.getColList = function (tabCode) {
	var params = new URLSearchParams();
	params.append('tabCode', tabCode);
	util.ajax.post(this.spa.getcolurl, params, header).then((rres) => {
		
		const result = [];
		rres.data.forEach(d => {
			let tab = {
				value: d,
				label: d
			};
			
			result.push(tab);
		});
		
		let tab = {
			code: tabCode,
			list: result,
		};
		
		this.spa.selectList.push(tab);
	});
};

//获取树数据
systemModule.getTreeData = function(relInfo) {
	var params = new URLSearchParams();
	params.append('relInfo', relInfo);
	util.ajax.post(this.spa.treeurl, params, header).then((rres) => {  	
		this.spa.treeData = systemModule.eidtTree(rres.data);
	});
};

//处理后台返回的树形数据
systemModule.eidtTree = function(tree) {
	const result = [];
    tree.forEach(d=>{
		let item = {
            nodCode: d.nodCode,
            title: d.nodName,
			children: d.children,
			tranCode: d.tranCode,
            expand: true
        };
		
		// 如果有子节点，递归
        if (item.children) {
            item.children = systemModule.eidtTree(item.children);
        }

        result.push(item);
	});
	
	return result;
}

//获取节点详细信息
systemModule.getNodeInfo = function (params){
	
	util.ajax.post(this.spa.scanurl, params, header).then((rres) => {
		this.spa.scanModel = rres.data;
		this.spa.updModel = rres.data;
		
		//回显交易号字段
		if(rres.data.tranCode){
			let tranCode = rres.data.tranCode;
			if(tranCode.indexOf('r') == 0 && tranCode.length == 3){
				this.spa.scanModel.tranCode = '根节点编号 / ' + tranCode;
			}else{
				this.spa.scanModel.tranCode = '模块交易号 / ' + tranCode;
			}
		}
	});
};

//获取根节点编号及模块交易号
systemModule.getTranCodeList = function (nodCode, moduTC){
	var params = new URLSearchParams();
	params.append('nodCode', nodCode);
	params.append('moduTC', moduTC);
	util.ajax.post(this.spa.trancodeurl, params, header).then((rres) => {
		
		this.spa.tCodeData = rres.data;
	});
};

//树模型新增、修改提交
systemModule.save = function(name,url,model) {
	
	this.spa.$refs[name].validate((valid) => {
        if (valid) {
        	util.ajax.put(url, model, header).then((rres) => {   
				let relInfo = this.spa.addModel.relInfo ? this.spa.addModel.relInfo : this.spa.viewOrUpdateModel.relInfo;
        		if(rres.data.code===UPD_SUC) {
        			this.spa.$Message.success('修改成功!');
					//清空相关字段
					this.spa.clearCol();
					//刷新树
					systemModule.getTreeData(relInfo);
        		}else if(rres.data.code===SAV_SUC){
					this.spa.$Message.success('添加成功!');
					//设置关联关系字段
					if(rres.data.nodCode){
						this.spa.addModel.relInfo = rres.data.nodCode;
						relInfo = rres.data.nodCode;
					}
					
					//清空相关字段
					this.spa.clearCol();
					//隐藏所有界面
					this.spa.hideForm();
					//刷新树
					systemModule.getTreeData(relInfo);
				}else{
        			this.spa.$Modal.error({
                        title: '错误信息',
                        content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion
                    });
        		}
			});
            
        } else {
        	this.spa.$Message.error('修改失败!');
        }
    })
};

systemModule.delTrans = function(url) {
	let relInfo = this.spa.addModel.relInfo ? this.spa.addModel.relInfo : this.spa.viewOrUpdateModel.relInfo;
	util.ajax.delete(url, header).then((rres) => {
		if(rres.data.code===DEL_SUC) {
			this.spa.$Message.success('删除成功!');
			//清空相关字段
			this.spa.clearCol();
			//隐藏所有界面
			this.spa.hideForm();
			//刷新树
			systemModule.getTreeData(relInfo);
		}else{
			pagetool.err(rres.data);
		}
	});
}

export default systemModule;
