<template>
  <div>
	<Modal width="700" @on-ok="ok" @on-cancel="cancel" v-model="isViewModal" title="用户信息">
       <Form :model="viewOrUpdateModel" :label-width="100">
            <FormItem label="姓名：">
                <Input :readonly="true" v-model="viewOrUpdateModel.userName" />
            </FormItem>
            <FormItem label="英文名：">
                <Input :readonly="true" v-model="viewOrUpdateModel.userNameEn" />
            </FormItem>
            <FormItem label="备注：">
                <Input disabled v-model="viewOrUpdateModel.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
            </FormItem>
            <FormItem label="性别：">
                <RadioGroup v-model="viewOrUpdateModel.userSex">
                    <Radio label="1">男</Radio>
                    <Radio label="2">女</Radio>
                </RadioGroup>
            </FormItem>
        </Form>    	
    </Modal>
  </div>    
</template>

<script>
export default {
    name: 'userView',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        dataModel: {
            type: Object,
        	default: {}
        }
    },
    data() {
    	return {
    		isViewModal: false,
    		viewOrUpdateModel: this.dataModel
    	}
    },    
    watch: {
    	value(val) {
            this.isViewModal = val;
        },
        isViewModal(val) {
        	this.$emit("on-change",val);
        },
    	dataModel(val) {
    		this.viewOrUpdateModel = val;
    	}
    },
    methods: {
    	ok () {
    		this.isViewModal = false;
    	},
    	cancel() {
    		this.isViewModal = false;
    	}
    }
};
</script>
