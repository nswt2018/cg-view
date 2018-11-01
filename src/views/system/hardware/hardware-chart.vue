<template>
  <Row :gutter="10" class="margin-top-10">
  	<mem-pie></mem-pie>
  </Row>
</template>  
<script>
	import memPie from './chart-components/memPie.vue';
export default {
    name: 'hardware-chart',
    data () {
        return {
        };
    },
    components:{
    	memPie
    }
};
</script>
<style scoped>
    .margin-top-10{
    	margin-top: 10px;
	}
</style>
