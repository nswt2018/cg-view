import Vue from 'vue';
import iView from 'iview';
import datetool from '@/libs/datetool';

let parmColumn = {};

parmColumn.getColumns = function() {
	return [
				{
			        type: 'selection',
			        width: 60,
			        align: 'center'
			    },
			    {
			        title: '参数类别',
			        key: 'categoryId',
			        align: 'center'
			    },
			    {
			        title: '参数代码',
			        key: 'paraCode',
			        align: 'center'
			    },
			    {
			        title: '参数名称',
			        key: 'paraName',
			        align: 'center'
			    },
			    {
			        title: '参数值',
			        key: 'paraValue',
			        align: 'center'
			    },
			    {
			        title: '参数描述',
			        key: 'paraDesc',
			        align: 'center'
			    },
			    {
			        title: '创建人',
			        key: 'crtUserCode',
			        align: 'center'
			    },
			    {
			        title: '创建人机构',
			        key: 'crtOrgCode',
			        align: 'center'
			    },
			    {
			        title: '创建时间',
			        key: 'crtDate',
			        align: 'center',
			        render: (h, params) => {                        
			            return h('div', datetool.format(params.row.crtDate));
			        }
			    }
			    
	]
};

export default parmColumn;
