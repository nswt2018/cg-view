import Vue from 'vue';
import iView from 'iview';
import util from '@/libs/util.js'
import datetool from '@/libs/datetool';

let tag = {};
const header = {'Content-Type': 'application/json;charset=UTF-8'};
const DEL_SUC='000002';
const SAV_SUC='000001';
const UPD_SUC='000003';
let spa;
//let nodeInfo = {};

tag.setPage = function(obj) {
	this.spa = obj;
};

tag.getBaseData = function(data) {
	
	util.ajax.post(this.spa.treeurl, data, header).then((rres) => {  	
		this.spa.baseData = tag.convertTree(rres.data);
	});
};

tag.convertTree = function(tree) {
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
            item.children = tag.convertTree(item.children);
        }

        result.push(item);
	});
	
	return result;
}

tag.getColumns = function() {
	return [
				{ 
					type: 'selection',
			        width: 60,	
			        align: 'center'
			    },
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
			        title: '属性值',
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
					title: '默认值',
			        key: 'defaultValue',
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

 tag.delete = function(delurl) {
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

 tag.update = function(name) {
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

 tag.page = function (data) {   
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

 tag.save = function(name) {
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

 tag.choice = function(selection, row) {
	this.spa.selectedLines = selection.length;
	this.spa.viewOrUpdateModel = row;
	this.spa.deletedPks.push(row.tagKey);
};

 tag.cancel = function(selection, row) {
	this.spa.selectedLines = selection.length;
	
	if(this.spa.selectedLines>0) {
		this.spa.viewOrUpdateModel = selection[0];
		this.spa.deletedPks.splice(this.spa.deletedPks.indexOf(row.tagKey), 1);
	}
	else {
		this.spa.viewOrUpdateModel = {};
		this.spa.deletedPks = [];
	}
};

export default tag;