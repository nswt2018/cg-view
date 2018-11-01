import Vue from 'vue';
import iView from 'iview';
import datetool from '@/libs/datetool';

let usercolumn = {};
let spa ;

usercolumn.setPage = function(obj) {
	this.spa = obj;
};

usercolumn.getColumns = function() {
	return [
				{
			        type: 'selection',
			        width: 60,
			        align: 'center'
			    },
			    {
			        title: '主键',
			        key: 'userId',
			        align: 'center'
			    },
			    {
			        title: '编号',
			        key: 'userCode',
			        sortable: 'custom',
			        align: 'center',
			        filter: {
			        	type: 'Input' 
			        },
			        filterMethod (value, row) {
			            return row.userCode===value;
			        }
			    },
			    {
			        title: '姓名',
			        key: 'userName',
			        align: 'center'
			    },
			    {
			        title: '机构编号',
			        key: 'orgCode',
			        sortable: 'custom',
			        align: 'center'
			    },
			    {
			        title: '岗位',
			        key: 'postNo',
			        align: 'center'
			    },
			    {
			        title: '性别',
			        key: 'userSex',
			        align: 'center',
			        filters: [{
			            label: '男',
			            value: '1'
			        },
			        {
			            label: '女',
			            value: '2'
			        }],
			        filterMultiple: false,
			        filterMethod (value, row) {
			            return row.userSex===value;
			        },            
			        render: (h, params) => {
			            const row = params.row;
			            const color = row.userSex === '1' ? 'blue' : 'red';
			            const text = row.userSex === '1' ? '男' : '女';
			
			            return h('Tag', {
			                props: {
			                    type: 'dot',
			                    color: color
			                }
			            }, text);
			        }
			    },
			    {
			        title: '国籍',
			        key: 'nationality',
			        align: 'center',
			        render: (h, params) => {
			            return h('Poptip', {
			                props: {
			                    trigger: 'hover',
			                    title: '小资料',
			                    placement: 'bottom'
			                }
			            }, [
			                h('Tag', params.row.nationality),
			                h('div', {
			                    slot: 'content'
			                }, [
			                    h('ul', this.spa.list_data[params.index].nationality)
			                ])
			            ]);
			        }
			    },
			    {
			        title: '民族',
			        key: 'ethnic',
			        align: 'center'
			    },
			    {
			        title: '出生日期',
			        key: 'birthDate',
			        align: 'center',
			        filters: [{
			            label: '大于18岁',
			            value: '1'
			        },
			        {
			            label: '小于等于18岁',
			            value: '2'
			        }],
			        filterMultiple: false,
			        filterMethod (value, row) {
			        	if (value === 1) {
			                return row.birthDate < '1993-01-01';
			            } else  {
			            	return row.birthDate >= '1993-01-01';
			            }
			        },     
			        render: (h, params) => {                        
			            return h('div', datetool.format(params.row.birthDate));
			        }
			    }
    ];
};

export default usercolumn;
