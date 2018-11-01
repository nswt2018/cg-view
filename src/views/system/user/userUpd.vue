<template>
  <div>
  <Modal width="700" v-model="isUpdModal" title="用户信息" ok-text="保存" cancel-text="关闭"
 		:mask-closable="false" :loading="loading"
 		 @on-ok="saving('addFormRef')" @on-cancel="reseting('addFormRef')"
 	 >
   <Form ref="addFormRef" :model="viewOrUpdateModel" :rules="userRules" :label-width="100">
       <FormItem label="编号：" required>
           <Input v-model="viewOrUpdateModel.userCode" placeholder="请输入7位员工编号" />
       </FormItem>
       <FormItem label="姓名：" required>
           <Input v-model="viewOrUpdateModel.userName" placeholder="请输入中文姓名" />
       </FormItem>
       <FormItem label="机构：" required>
           <Select v-model="viewOrUpdateModel.orgCode" placeholder="请选择机构..." filterable>
	             <Option v-for="(option, index) in orgList" :value="option.value" :key="index">{{option.label}}</Option>
	         </Select>
       </FormItem>
       <FormItem label="出生地：">
         <Select v-model="viewOrUpdateModel.birthPlace">
          <Option value="beijing">New York</Option>
          <Option value="shanghai">London</Option>
          <Option value="shenzhen">Sydney</Option>
        </Select>
       </FormItem>
       <FormItem label="出生日期：">
       	<DatePicker type="date" placeholder="Select date" v-model="viewOrUpdateModel.birthDate"></DatePicker>
       </FormItem>
       <FormItem label="性别：">
           <RadioGroup v-model="viewOrUpdateModel.userSex">
               <Radio label="1">男</Radio>
               <Radio label="2">女</Radio>
           </RadioGroup>
       </FormItem>
       <FormItem label="备注：" prop="remark">
           <Input v-model="viewOrUpdateModel.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" />
       </FormItem>    
   </Form>    	
  </Modal>
  </div>    
</template>

<script>
import pagetool from '@/libs/pagetool';

export default {
    name: 'userUpd',
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
    		isUpdModal: this.value,
    		viewOrUpdateModel: this.dataModel,
    		orgList: [],
    		loading: true,
    		userRules: {
            	remark: [
                    { required: true, message: '请填写该员工所有相关未尽事宜，务必减少疏漏之处', trigger: 'blur' }
                ]
            }
    	}
    },    
    watch: {
    	value(val) {
            this.isUpdModal = val;
        },
        isUpdModal(val) {
        	this.$emit("on-change",val);
        },
    	dataModel(val) {
    		this.viewOrUpdateModel = val;
    	}
    },
    methods: {
    	saving(name) {
    		/*console.log(this.$refs[name]);
    		let obj = this.$refs[name];
    		obj.validate((valid) => {
    			console.log(valid);
    	    });*/
    	    
        	pagetool.save(this, name);
        },
        reseting (name) {
        	this.isUpdModal=false;
        },
    }
};
</script>
