import Vue from 'vue';
import iView from 'iview';

let cpupercColumn = {};

cpupercColumn.getColumns = function() {
	return [
			    {
			        title: '用户使用率',
			        key: 'user',
			        align: 'center'
			    },
			    {
			        title: '系统使用率',
			        key: 'sys',
			        align: 'center'
			    },
			    {
			        title: '当前等待率',
			        key: 'wait',
			        align: 'center'
			    },
			    {
			        title: '当前错误率',
			        key: 'nice',
			        align: 'center'
			    },
			    {
			        title: '当前空闲率',
			        key: 'idle',
			        align: 'center'
			    },
			    {
			        title: '总的使用率',
			        key: 'combined',
			        align: 'center'
			    }
	]
};

export default cpupercColumn;
