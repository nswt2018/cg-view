import Vue from 'vue';
import iView from 'iview';
import util from '@/libs/util.js'
import datetool from '@/libs/datetool';

let appFactory = {};
const header = {'Content-Type': 'application/json;charset=UTF-8'};
let spa;
const DEL_SUC='000002';
const SAV_SUC='000001';
const UPD_SUC='000003';

appFactory.setPage = function(obj) {
	this.spa = obj;
};

//获取树数据
appFactory.getBaseData = function(url) {
	
	util.ajax.post(url, header).then((rres) => {
		this.spa.baseData = appFactory.convertTree(rres.data);
	});
};

//解析树数据
appFactory.convertTree = function(tree) {
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
            item.children = appFactory.convertTree(item.children);
        }

        result.push(item);
	});
	
	return result;
};

//获取节点详细信息
appFactory.getNodeInfo = function (params){
	
	util.ajax.post(this.spa.checkurl, params, header).then((rres) => {
		this.spa.checkModel = rres.data;
		this.spa.updModel = rres.data;
	});
};

//新增/修改提交
appFactory.save = function(name,url,model) {
	this.spa.$refs[name].validate((valid) => {
        if (valid) {
        	util.ajax.put(url, model, header).then((rres) => {        		
        		if(rres.data.code===SAV_SUC || rres.data.code===UPD_SUC) {
        			this.spa.$Message.success('Success!');
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

appFactory.delete = function(url) {
	
	util.ajax.delete(url, header).then((rres) => {
		if(rres.data.code===DEL_SUC) {
			this.spa.$Message.success('删除成功!');
		}else{
			pagetool.err(rres.data);
		}
	});
}

appFactory.getModuList = function (selecturl) {
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

export default appFactory;