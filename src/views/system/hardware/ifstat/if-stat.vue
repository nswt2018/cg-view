<template>
   <Row>
   	  <Card>
   	  	<p slot="title"> <Icon type="compose"></Icon>网络流量信息</p>	
		<Row>
		  <Table highlight-row border  :size="size" height="410" :columns="columns"  :stripe="true"  :data="data_list">
	      </Table>
		</Row>
	  </Card> 	
    </Row>
</template>
<script>
	import ifstatColumn from './ifstat-column';
	import hardwareFun  from '@/views/system/hardware/hardwarefun.js';
export default{
	name:'ifStat',
	data(){
		return{
			listurl:'/system/SY0007S.do',
			size:'default',
			columns:[],
			data_list:[]
		}
	},
	methods:{
		init(){
			this.columns=ifstatColumn.getColumns();
			hardwareFun.setThis(this);
			hardwareFun.getHardwareInfo(this.listurl,'ifstat');
		}	
	},
	created(){
		this.init();
	}
}
</script>