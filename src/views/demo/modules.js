import Vue from 'vue';
import iView from 'iview';
import util from '@/libs/util.js'

let modules = {};
const header = {'Content-Type': 'application/json;charset=UTF-8'};
let spa;
//let nodeInfo = {};

modules.setPage = function(obj) {
	this.spa = obj;
};

modules.getBaseData = function(data) {
	
	util.ajax.post(this.spa.treeurl, data, header).then((rres) => {
		//debugger;    	
		this.spa.baseData = modules.convertTree(rres.data);
	});
};

modules.convertTree = function(tree) {
	const result = [];
    tree.forEach(d=>{
		let item = {
            moduCode: d.moduCode,
            title: d.moduName,
			children: d.children,
            expand: true
        };
		
		// 如果有子节点，递归
        if (item.children) {
            item.children = modules.convertTree(item.children);
        }

        result.push(item);
	});
	
	return result;
}

modules.getNodeData = function(url,data){
	
	util.ajax.post(url, data, header).then((rres) => {
		  	
		rres.data.forEach(d=>{
			let nodeInfo = {
				moduCode : d.moduCode, 
				moduName : d.moduName,
				upModuCode : d.upModuCode,
				moduTc : d.moduTc,
				moduModal : d.moduModal,
				crtUserCode : d.crtUserCode,
				crtOrgCode : d.crtOrgCode,
				crtDate : d.crtDate,
				updUserCode : d.updUserCode,
				updOrgCode : d.updOrgCode,
				updDate : d.updDate
			}
			
			this.spa.formValidate = nodeInfo;
		});
	});
}

export default modules;