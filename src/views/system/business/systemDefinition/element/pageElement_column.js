import Vue from 'vue';
import iView from 'iview';
import util from '@/libs/util.js'
import datetool from '@/libs/datetool';

let pageElement = {};
const header = {'Content-Type': 'application/json;charset=UTF-8'};
const DEL_SUC='000002';
const SAV_SUC='000001';
const UPD_SUC='000003';
let spa;
//let nodeInfo = {};

pageElement.setPage = function(obj) {
	this.spa = obj;
};

pageElement.getColumns = function() {
	return [
				{ 
					type: 'selection',
			        width: 60,
			        align: 'center'
			    },
			    {
					title: '中文名称',
			        key: 'eleCName',
			        align: 'center'
			    },
			    {
			        title: '英文名称',
			        key: 'eleEName',
			        align: 'center'
			    },
				{
			        title: '单元编号',
			        key: 'unitCode',
			        align: 'center'
			    },
				{
			        title: '模块编号',
			        key: 'moduCode',
			        align: 'center'
			    },
				{
			        title: '组件类型',
			        key: 'comName',
			        align: 'center'
			    },
				{
			        title: '标签信息',
			        key: 'tagInfo',
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
								 title: params.row.tagInfo
							 }
						 }, params.row.tagInfo)
					 ]);
					}
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

pageElement.getBaseData = function(data) {
	
	util.ajax.post(this.spa.treeurl, data, header).then((rres) => {  	
		this.spa.baseData = pageElement.convertTree(rres.data);
	});
};

pageElement.convertTree = function(tree) {
	const result = [];
    tree.forEach(d=>{
		let item = {
            code: d.code,
            title: d.value,
			children: d.children,
			isRoot: d.isRoot,
            expand: true
        };
		// 如果有子节点，递归
        if (item.children) {
            item.children = pageElement.convertTree(item.children);
        }

        result.push(item);
	});
	
	return result;
}

pageElement.delete = function(delurl) {
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

pageElement.update = function(name) {
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

pageElement.page = function (data) {   
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

pageElement.choice = function(selection, row) {
	this.spa.selectedLines = selection.length;
	this.spa.viewOrUpdateModel = row;
	this.spa.deletedPks.push(row.unitCode);
};

pageElement.cancel = function(selection, row) {
	this.spa.selectedLines = selection.length;
	
	if(this.spa.selectedLines>0) {
		this.spa.viewOrUpdateModel = selection[0];
		this.spa.deletedPks.splice(this.spa.deletedPks.indexOf(row.unitCode), 1);
	}
	else {
		this.spa.viewOrUpdateModel = {};
		this.spa.deletedPks = [];
	}
};

pageElement.getTagData = function(data) {
	
	util.ajax.post(this.spa.tagurl, data, header).then((rres) => {  	
		this.spa.tagData = pageElement.eidtTree(rres.data);
	});
};

pageElement.eidtTree = function(tree) {
	const result = [];
    tree.forEach(d=>{
		let item = {
            tagId: d.tagId,
            title: d.tagName,
			children: d.children,
			isRoot: d.isRoot,
            expand: true
        };
		
		// 如果有子节点，递归
        if (item.children) {
            item.children = pageElement.eidtTree(item.children);
        }

        result.push(item);
	});
	
	return result;
}

pageElement.getTagDataInfo = function(url,data){
	
	util.ajax.post(url, data, header).then((rres) => {
		const result = [];
		rres.data.forEach(d=>{
			let item = {
				tagKey: d.tagKey,
				tagProp: d.tagProp,
				propType: d.propType,
				useRule: d.useRule,
				propVal: d.propVal,
				tagValue: d.tagValue,
				tagName: d.tagName,
				$isEdit: false
			};
			result.push(item);
		});
		this.spa.tagDatas = result;
	});
}

pageElement.getTagColumns = function() {
	return [
			{
				title: '属性',
				key: 'tagProp',
				align: 'center',
			},
			{
				title: '属性类别',
				key: 'propType',
				align: 'center',
				render: (h, params) => {
				  let _this = this;
				  let texts = '';
				  if(params.row.propType == 1){
					  texts = "静态标签"
				  }else if(params.row.propType == 2){
					  texts = "动态标签"
				  }else if(params.row.propType == 3){
					  texts = "方法"
				  }
				  return h('div',texts);
				 },
			},
			{
				title: '可选值',
				key: 'propVal',
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
							 title: params.row.propVal
						 }
					 }, params.row.propVal)
				 ]);
				}
			},
			{
				title: '使用规则',
				key: 'useRule',
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
							 title: params.row.useRule
						 }
					 }, params.row.useRule)
				 ]);
				}
			},
			{
				title: '属性值',
				key: 'tagValue',
				align: 'center',
				render: (h, params) => {
 
					if (params.row.$isEdit) {
					
					  return h('input', {

						domProps: {
						  value: params.row.tagValue
						},
						on: {
						  input: function (event) {
							params.row.tagValue = event.target.value
						  }
						}
					  });
					} else  {
					  return h('div', params.row.tagValue);
					}
				}
			},
			{
				title: '操作',
				key: 'action',
				align: 'center',
				render: (h, params) => {
					return h('Button', {
							props: {
								type: 'text',
								size: 'small'
							},
							on: {
							  click: () => {
								if (params.row.$isEdit) {
									this.spa.handleSave(params.row)
								} else {
									this.spa.handleEdit(params.row)
								}
							  }
							}
						}, params.row.$isEdit ? '保存' : '编辑')
				}
			},
		];
};


pageElement.saveColumns = function (row) {
		
	util.ajax.put('/business/TK0003I1.do', row, header).then((rres) => {  	
		if(rres.data.code===SAV_SUC || rres.data.code===UPD_SUC) {
			this.spa.$Message.success('Success!');
		}else{
			this.spa.$Modal.error({
				title: '错误信息',
				content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion
			});
		}
	});
};

pageElement.assembleJson = function (params) {
	
	util.ajax.put('/business/TK0003I2.do', params, header).then((rres) => {  	
		if(rres.data.code===SAV_SUC || rres.data.code===UPD_SUC) {
			this.spa.$Message.success('Success!');
			//this.spa.viewOrUpdateModel.tagInfo = "122222";
			var params = new URLSearchParams();
			params.append('eleCode', this.spa.viewOrUpdateModel.eleCode);
			pageElement.setTagValue(params);
		}else{
			this.spa.$Modal.error({
				title: '错误信息',
				content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion
			});
		}
	});
};

pageElement.setTagValue = function (params) {
	
	util.ajax.post('/business/TK0003L2.do', params, header).then((rres) => {  
		//debugger;	
		this.spa.viewOrUpdateModel.tagInfo = rres.data[0].tagInfo;
	});
};

export default pageElement;