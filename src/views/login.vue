<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    {{ $t('welLogin') }}
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" :placeholder="$t('enterUserName')">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" :placeholder="enterPass">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>{{ $t('login') }}</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import util from '@/libs/util.js';
export default {
    data () {
        return {
        	enterUserName: this.$t('enterUserName'),
        	enterPass: this.$t('enterPass'),
            form: {
                userName: 'admin',
                password: '000000'
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
				this.$router.push({
								name: 'home_index'
							});
							
                    Cookies.set('user', this.form.userName);
                    Cookies.set('password', this.form.password);
                    this.$store.commit('setAvator', 'http://127.0.0.1:8080/images/green-bird.jpg');
					//http://localhost:8080/login?username=admin&password=000000
					//{username: this.form.userName, password: this.form.password}                    
					var params = new URLSearchParams();
					params.append('username', this.form.userName);
					params.append('password', this.form.password);
					util.ajax.post('/login', params).then((response) => {                
						//console.log(response);						
						if(response.data.code==='000000') {							
							util.ajax.get('/system/SY0005L5.do').then((rres) => {
								
								//console.log(rres.data.join(","));								
								//var aa = Cookies.get('access');
								//var ab = aa.split(",");
								//alert("1-:  "+aa+"\t\t"+ab.join("|")+"\t\t"+typeof(aa)+"\t"+typeof(ab));		
								//for (var i=0; i<ab.length; i++) {
								//	alert("2-----:"+ab[i]+":");
								//}
								
								Cookies.set('access', rres.data.join(","));
								Cookies.set('user', this.form.userName);
								this.$router.push({name: 'home_index'});						
							});
						} else {
							//alert(''.concat(response.data.code, '\r\n', response.status, '\r\n', response.statusText, '\r\n', response.headers, '\r\n', response.data.message));
							Cookies.remove('access');
							Cookies.remove('user');
							this.$Modal.warning({
	                            title: '提示信息',
	                            content: response.data.code+'\r\n'+response.data.message
	                        });
							return;
						}
					}).catch((err) => {		
						let rs = ['1001','1002'];
						Cookies.set('access', rs.join(","));
						Cookies.set('user', this.form.userName);                    	
						this.$router.push({name: 'home_index'});	
								
						this.$Modal.error({
                            title: '出错啦',
                            content: err
                        });
					});  
                    
                }
            });
        }
    }
};
</script>

<style>

</style>
