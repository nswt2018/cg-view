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
					type: 'index',
			        width: 60,
			        align: 'center'
			    },
			    {
			        title: '英文名称',
			        key: 'eleEName',
			        align: 'center'
			    },
				{
					title: '中文名称',
			        key: 'eleCName',
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
			    }
    ];
};

pageElement.page = function (data) {
    util.ajax.post(this.spa.listurl, data, header).then((rres) => { 
    	if(rres.data) {
    		this.spa.page_list_data = rres.data;
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
				width: 120,
				render: (h, params) => {
 
					if (params.row.$isEdit) {
					
					  if(params.row.propVal != null){
						return h('Select', {
							props:{
								value: params.row.tagValue,
							},
							on: {
								'on-change':(value) => {
									params.row.tagValue = value;
								}
							},
						  },
						  params.row.propVal.split(',').map(function(type){
							return h('Option', {
								props: {value: type}
							}, type);
						  })
						);
					  }else{
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
					  }
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
			this.spa.tagInfo = false;
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