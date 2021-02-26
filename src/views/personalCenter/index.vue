<!-- 个人中心 -->
<template>
    <div class="personalCenter-container">
        <el-page-header content="个人中心" class="header" @back="goback()"></el-page-header>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>个人信息</span>
            </div>
            <el-form 
                label-width="80px" 
                :model="user" 
                v-loading="isLoading" 
                ref="personalForm"
                :rules="personalFormRules">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="user.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="user.nickname"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="user.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="user.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-radio v-model="user.gender" :label="0">女</el-radio>
                    <el-radio v-model="user.gender" :label="1">男</el-radio>
                </el-form-item>
                <el-form-item label="安全设置">
                    <el-button type="text" size="small" @click="dialogFormVisible = true">修改密码</el-button>
                    <el-dialog 
                        title="修改密码" 
                        :visible.sync="dialogFormVisible" 
                        width="450px"
                        :close-on-click-modal="false"
                        @closed="resetPasswordForm('passwordForm')">
                        <el-form 
                            ref="passwordForm" 
                            class="password-form" 
                            :model="passwordForm" 
                            label-width="80px" 
                            :rules="passwordRules"
                            v-loading="passwordFormLoading">
                            <el-form-item prop="oldPassword" label="旧密码">
                                <el-input v-model="passwordForm.oldPassword" show-password></el-input>
                            </el-form-item>
                            <el-form-item prop="newPassword" label="新密码">
                                <el-input v-model="passwordForm.newPassword" show-password></el-input>
                            </el-form-item>
                            <el-form-item prop="checkPassword" label="确认密码">
                                <el-input v-model="passwordForm.checkPassword" show-password></el-input>
                            </el-form-item>
                            <el-form-item style="display: flex;justify-content: flex-end;">
                                <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
                                <el-button 
                                    type="primary" 
                                    @click="changePassword()" 
                                    size="small">确 定</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitPersonalForm()">保存设置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { changePwd, editInfo, getInfo } from '@/api/system/user'; 
import { mapActions } from 'vuex';
export default {
    name: 'PersonalCenter',
    data() {
        var checkPassword = (rule, password, callback) => {
            if (!(/^[0-9a-zA-Z.@]{5,15}$/).test(password)) {
                return callback(new Error('密码应由字母或数字组成'))
            } else {
                callback()
            }
        };
        var checkConfirmPwd = (rule, pwd, callback) => {
            if (pwd != this.passwordForm.newPassword) {
                return callback(new Error('两次密码输入不一致'))
            } else {
                callback()
            }
        };
        var checknickname = (rule, name, callback) => {
            if (!(/^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/).test(name)) {
                return callback(new Error('含有非法字符!'))
            } else {
                callback()
            }
        };
        var checkPhone = (rule, phone, callback) => {
            var reg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/
            if (!reg.test(phone) && phone.length != 0) {
                return callback(new Error('手机号非法'))
            } else {
                callback()
            }
        };
        var checkEmail = (rule, email, callback) => {
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
            if (!reg.test(email)) {
                return callback(new Error('邮箱格式非法!'))
            } else {
                callback()
            }
        };
        return {
            user: {},
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                checkPassword: ''
            },
            dialogFormVisible: false,
            isLoading: false,
            passwordFormLoading: false,
            passwordRules: {
                oldPassword: [
                    { required: true, trigger: 'blur', message: '密码不能为空' },
                    { min: 5, max: 15, message: '密码长度应在 5 到 15 个字符内', trigger: 'blur' },
                    { validator: checkPassword, trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, trigger: 'blur', message: '密码不能为空' },
                    { min: 5, max: 15, message: '密码长度应在 5 到 15 个字符内', trigger: 'blur' },
                    { validator: checkPassword, trigger: 'blur' }
                ],
                checkPassword: [
                    { required: true, trigger: 'blur', message: '密码不能为空' },
                    { validator: checkConfirmPwd, trigger: 'blur' }
                ],
            },
            personalFormRules: {
                nickname: [
                    { required: true, trigger: 'blur', message: '昵称不能为空' },
                    { min: 1, max: 10, trigger: 'blur', message: '昵称应为 1 到 10 个字符内' },
                    { validator: checknickname, trigger: 'blur' }
                ],
                email: [
                    { required: true, trigger: 'blur', message: '邮箱不能为空' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                phone: [
                    { validator: checkPhone, trigger: 'blur' },
                    { required: true, trigger: 'blur', message: '请输入手机号' }
                ],
            }
        }
    },
    methods: {
        ...mapActions([
            'getInfo'
        ]),
        goback() {
            this.$router.back(-1);
        }, 
        getUserInfo() {
            this.user = JSON.parse(window.sessionStorage.getItem('user'));
        },
        /**
         * 修改密码
         */
        changePassword() {
            this.$refs.passwordForm.validate(valid => {
                if(valid) {
                    this.passwordFormLoading = true;
                    changePwd(this.passwordForm).then(res => {
                    // console.log(res.code);
                    if(res.code == '200') {
                        this.$message.success("修改成功");
                        this.passwordFormLoading = false;
                    }
                    }).catch(err => {
                        // this.$message.error('修改失败');
                        console.log(err);
                        this.passwordFormLoading = false;
                    });
                }
            });
        },
        resetPasswordForm(formName) {
            this.$refs.passwordForm.resetFields();
        },
        /**
         * 编辑个人信息
         */
        submitPersonalForm() {
            this.$refs.personalForm.validate(valid => {
                if(valid) {
                    this.isLoading = true;
                    editInfo(this.user).then(res => {
                        this.$store.dispatch('GetInfo').then(() => {
                            this.isLoading = false;
                            this.$message.success('修改成功');
                        });
                    }).catch(err => {
                        console.log(err);
                        this.isLoading = false;
                    });
                }
            });
        },
    },
    created() {
        this.getUserInfo();
    },
    mounted() {
        // console.log(this.$store.dispatch('getInfo'));
        // console.log(this.$store);
    }

}
</script>

<style scoped>
    .personalCenter-container {
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .personalCenter-container .el-page-header {
        padding: 10px;
        width: 100%;
        /* border-bottom: 1px solid #333; */
    }
    .personalCenter-container .box-card {
        width: 50%;
        margin-top: 30px;
    }
    .personalCenter-container .password-form .el-form-item{
        margin: 0 10px 20px 0;
    }
</style>