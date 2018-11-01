import Vue from 'vue';
import iView from 'iview';

let ifstatColumn = {};

ifstatColumn.getColumns = function() {
	return [
			    {
			        title: '接收的总包裹数',
			        key: 'rxBytes',
			        align: 'center'
			    },
			    {
			        title: '发送的总包裹数',
			        key: 'txBytes',
			        align: 'center'
			    },
			    {
			        title: '接收到的总字节数',
			        key: 'rxPackets',
			        align: 'center'
			    },
			    {
			        title: '发送的总字节数',
			        key: 'txPackets',
			        align: 'center'
			    },
			    {
			        title: '接收到的错误包数',
			        key: 'rxErrors',
			        align: 'center'
			    },
			    {
			        title: '发送数据包时的错',
			        key: 'txErrors',
			        align: 'center'
			    },
			    {
			        title: '接收时丢弃的包数',
			        key: 'rxDropped',
			        align: 'center'
			    },
			    {
			        title: '发送时丢弃的包数',
			        key: 'txDropped',
			        align: 'center'
			    }
			    
	]
};

export default ifstatColumn;
