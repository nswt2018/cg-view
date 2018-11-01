<template>
    <div style="display:inline-block;padding:0 6px;">
        <Dropdown trigger="click" @on-click="setSize">
            <a href="javascript:void(0)">
                <Icon :style="{marginTop: '-2px', verticalAlign: 'middle'}" color="#495060" :size="18" type="eye"></Icon>
                <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem v-for="(item, index) in sizeList" :key="index" :name="item.name">
                    <Row type="flex" justify="center" align="middle">
                        <span><Icon :size="item.size" type="record" :color="item.element"/></span>
                    </Row>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import config from '../../../../build/config.js';
export default {
    name: 'sizeSwitch',
    data () {
        return {
            sizeList: [
                {   
                    name:'small',   
                    size:20,           
                    element: '#2d8cf0'
                },
                {
                    name: 'default',
                    size: 25,
                    element: '#00a854'
                },
                {  
                    name:'large',
                    size:30,
                    element: '#e96500'
                }
            ]
        };
    },
    methods: {
        setSize(sizeValue){
			 this.$store.commit('changeFont',sizeValue);
			 Cookies.set('sizeValue',sizeValue);
        }
    } 
};
</script>
