import Vue from 'vue';
import iView from 'iview';
import datetool from '@/libs/datetool';

let domain = {};

domain.getColumns = function() {
	return [
		{
			type: 'selection',
			width: 60,
			align: 'center'
		},
		{
			title: '英文名称',
			key: 'ename',
			align: 'center'
		},	
		{
			title: '中文名称',
			key: 'cname',
			align: 'center'
		},		  
		{
			title: '数据类型',
			key: 'dataType',
			align: 'center'
		},	  
		{
			title: '长度',
			key: 'dataLen',
			align: 'center'
		}			    
	]
};

export default domain;
