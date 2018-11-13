import Vue from 'vue';
import iView from 'iview';
import datetool from '@/libs/datetool';

let testColumn = {};

testColumn.getColumns = function() {
	return [
		   {
			 type: 'selection',
			 width: 60,
			 align: 'center'
		    },
    
		  {
			title: '测试主键',
			key: 'testKey',
			align: 'center'
		  },    
		  {
			title: '测试第一个字段',
			key: 'testOne',
			align: 'center'
		  },    
		  {
			title: '测试第二个字段',
			key: 'testTwo',
			align: 'center'
		  }			    
	]
};

export default testColumn;