import Vue from 'vue';
import iView from 'iview';

let orgColumn = {};

orgColumn.getColumns = function() {
	return [
				{
			        type: 'selection',
			        width: 60,
			        align: 'center'
			    },
			    {
			        title: '机构ID',
			        key: 'orgId',
			        align: 'center'
			    },
			    {
			        title: '机构编码',
			        key: 'orgCode',
			        align: 'center'
			    },
			    {
			        title: '机构简称',
			        key: 'orgBrief',
			        align: 'center'
			    },
			    {
			        title: '直接上级机构ID',
			        key: 'upOrgCode',
			        align: 'center'
			    },
			    {
			        title: '机构类别',
			        key: 'orgCategory',
			        align: 'center'
			    },
			    {
			        title: '机构级别',
			        key: 'orgGrade',
			        align: 'center'
			    },
			    {
			        title: '机构层级',
			        key: 'orgLevel',
			        align: 'center'
			    }
			    
	]
};

export default orgColumn;
