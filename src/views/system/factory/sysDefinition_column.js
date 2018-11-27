import Vue from 'vue';
import iView from 'iview';
import util from '@/libs/util.js'
import datetool from '@/libs/datetool';

let sysDefinition = {};
const header = {'Content-Type': 'application/json;charset=UTF-8'};
let spa;
const DEL_SUC='000002';
const SAV_SUC='000001';
const UPD_SUC='000003';

sysDefinition.setPage = function(obj) {
	this.spa = obj;
};

//获取树数据
sysDefinition.getBaseData = function(url) {
	
	util.ajax.post(url, header).then((rres) => {
		this.spa.baseData = sysDefinition.convertTree(rres.data);
	});
};

//解析树数据
sysDefinition.convertTree = function(tree) {
	const result = [];
    tree.forEach(d=>{
		let item = {
            sysKey: d.sysKey,
            title: d.sysName,
			children: d.children,
			isRoot: d.isRoot
        };
		
		// 如果有子节点，递归
        if (item.children) {
            item.children = sysDefinition.convertTree(item.children);
        }

        result.push(item);
	});
	
	return result;
};

//获取节点详细信息
sysDefinition.getNodeInfo = function (params){
	
	util.ajax.post(this.spa.checkurl, params, header).then((rres) => {
		this.spa.checkModel = rres.data;
		this.spa.updModel = rres.data;
	});
};

//新增/修改提交
sysDefinition.save = function(name,url,model) {
	this.spa.$refs[name].validate((valid) => {
        if (valid) {
        	util.ajax.put(url, model, header).then((rres) => {        		
        		if(rres.data.code===SAV_SUC || rres.data.code===UPD_SUC) {
        			this.spa.$Message.success('Success!');
					this.getBaseData(this.spa.treeurl);//刷新树
					this.spa.systemName = '';
					this.spa.systemKey = '';
					this.spa.isRoot = '';
        		}else{
        			this.spa.$Modal.error({
                        title: '错误信息',
                        content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion
                    });
        		}
			});
            
        } else {
        	this.spa.$Message.error('Fail!');
        }
    })
};

sysDefinition.delete = function(url) {
	
	util.ajax.delete(url, header).then((rres) => {
		if(rres.data.code===DEL_SUC) {
			this.spa.$Message.success('删除成功!');
			this.spa.systemName = '';
			this.spa.systemKey = '';
			this.spa.isRoot = '';
			this.getBaseData(this.spa.treeurl);
		}else{
			pagetool.err(rres.data);
		}
	});
}

sysDefinition.getModuList = function (selecturl) {
	util.ajax.post(selecturl,header).then((rres) => {   	
		const result = [];
		rres.data.forEach(d => {
			let item = {
				value: d.moduCode,
				label: d.moduCName
			};
			
			result.push(item);
		});
		
		this.spa.modList = result;
	});
};

//设置字段属性
sysDefinition.setUpdField = function(){
	if(this.spa.isRoot == '0'){
		this.spa.$refs.i4.disabled = false;
		this.spa.$refs.i5.disabled = false;
		this.spa.$refs.i6.disabled = false;
	}else{
		this.spa.$refs.i4.disabled = true;
		this.spa.$refs.i5.disabled = true;
		this.spa.$refs.i6.disabled = true;
	}
};

//设置字段属性
sysDefinition.setAddField = function(){
	if(this.spa.isRoot == ''){
		this.spa.$refs.i1.disabled = false;
		this.spa.$refs.i2.disabled = false;
		this.spa.$refs.i3.disabled = false;
	}else{
		this.spa.$refs.i1.disabled = true;
		this.spa.$refs.i2.disabled = true;
		this.spa.$refs.i3.disabled = true;
	}
};
//代码生成
sysDefinition.codeGeneration = function(params) {
	
	util.ajax.post('/business/TK0004G.do', params, header).then((rres) => {  
		if(rres.data) {
			this.spa.$Message.success('Success!');
		}else{
			this.spa.$Modal.error({
				title: '错误信息',
				content:'文件生成失败！'
			});
		}
	});
};

sysDefinition.sysDeployment = function(model) {
	util.ajax.post(this.spa.deploymenturl, model, header).then((rres) => {   	
		if(rres.data.code==='000001') {
			this.spa.$Message.success('系统部署成功!');
		}else{
			this.spa.$Modal.error({
				title: '错误信息',
				content: '系统部署失败!'
			});
		}
	});
};

export default sysDefinition;