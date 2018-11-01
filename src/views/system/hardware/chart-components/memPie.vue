<template>
	<div>
		<Col :md="24" :lg="8" :style="{marginBottom: '10px'}" align="center">
	       <Card>
	          <p slot="title" class="card-title">
	           <Icon type="ios-pulse-strong"></Icon>
	                        物理内存统计
	          </p>
	          <div class="data-source-row" id=""></div>         
	        </Card>         
	    </Col>
	    <Col :md="24" :lg="8" :style="{marginBottom: '10px'}" align="center">
	       <Card>
	          <p slot="title" class="card-title">
	           <Icon type="ios-pulse-strong"></Icon>
	                        物理内存统计
	          </p>
	          <div class="data-source-row" id="data_source_con"></div>         
	        </Card>         
	    </Col>
	    <Col :md="24" :lg="8" :style="{marginBottom: '10px'}" align="center">
	       <Card>
	          <p slot="title" class="card-title">
	           <Icon type="ios-pulse-strong"></Icon>
	                        物理内存统计
	          </p>
	          <div class="data-source-row" id=""></div>         
	        </Card>         
	    </Col>
    </div>
</template>

<script>
import echarts from 'echarts';
import util from '@/libs/util.js'

export default {
    name: 'memPie',
    data () {
        return {
        };
    },
    methods:{
    	setMemPie(ram,free){
    		this.$nextTick(() => {
		            var dataSourcePie = echarts.init(document.getElementById('data_source_con'));
		            const option = {
		                tooltip: {
		                    trigger: 'item',
		                    formatter: '{a} <br/>{b} : {c} ({d}%)'
		                },
		                legend: {
		                    orient: 'vertical',
		                    left: 'right',
		                    data: ['内存使用量', '内存剩余量']
		                },
		                series: [
		                    {
		                        name: '物理内存',
		                        type: 'pie',
		                        radius: '66%',
		                        center: ['50%', '60%'],
		                        data: [
		                            {value: ram, name: '内存使用量', itemStyle: {normal: {color: '#9bd598'}}},
		                            {value: free, name: '内存剩余量', itemStyle: {normal: {color: '#ffd58f'}}}
		                               ],
		                        itemStyle: {
		                            emphasis: {
		                                shadowBlur: 10,
		                                shadowOffsetX: 0,
		                                shadowColor: 'rgba(0, 0, 0, 0.5)'
		                            }
		                        }
		                    }
		                ]
		            };
		            dataSourcePie.setOption(option);
		            window.addEventListener('resize', function () {
		                dataSourcePie.resize();
		            });
		        });
    	}
    },
    mounted () {
    	const header = {'Content-Type': 'application/json;charset=UTF-8'};
	   	util.ajax.post("/system/SY0007S.do", "", header).then((rres) => {
	    	if(rres.data.mem) {
	    		const use=rres.data.mem.actualUsed;
				const free=rres.data.mem.actualFree;
				this.setMemPie(use,free);
			}else{
				this.spa.$Modal.error({
	                title: '提示',
	                content: rres.data.msg
	            });
			}
		}).catch((err) => {              		
			this.spa.$Modal.error({
	            title: '出错啦',
	            content: err
	        });
		});
    }
};
</script>

<style scoped>
    .data-source-row{
    height: 300px;
	}
</style>
