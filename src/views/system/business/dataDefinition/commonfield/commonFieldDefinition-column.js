import Vue from 'vue';
import iView from 'iview';
import util from '@/libs/util.js'
import datetool from '@/libs/datetool';

let commonfield = {};
const header = {'Content-Type': 'application/json;charset=UTF-8'};
let spa;

commonfield.setPage = function(obj) {
	this.spa = obj;
};

commonfield.getColumns = function() {
	return [
		{
			type: 'selection',
			width: 60,
			align: 'center'
		},
		{
			title: '字段英文名称',
			key: 'colCode',
			align: 'center'
		},
		{
			title: '字段中文名称',
			key: 'colName',
			align: 'center'
		},
		{
			title: '字段类型',
			key: 'dataType',
			align: 'center'
		},  
		{
			title: '字段长度',
			key: 'dataLen',
			align: 'center'
		},
		{
			title: '展现形式',
			key: 'uiType',
			align: 'center'
		},
		{
			title: '关联表',
			key: 'joinTabCode',
			align: 'center'
		},
		{
			title: '关联字段',
			key: 'joinColCode',
			align: 'center'
		},
		{
			title: '传递参数',
			key: 'joinWhere',
			align: 'center'
		},	  
		{
			title: '值区间',
			key: 'valBetween',
			align: 'center'
		}	    
	]
};

commonfield.insertCol = function (url, params) {
	
	util.ajax.put(url, params, header).then((rres) => {
		if(rres.data.code=== '000001') {
			this.spa.$Message.success('Success!');
			this.spa.$router.push({
				name: 'tabDefinition'
			});
		}else{
			this.spa.$Modal.error({
				title: '错误信息',
				content: rres.data.code+'\r\n'+rres.data.msg+'\r\n'+rres.data.excetion
			});
		}
	});
}

export default commonfield;