<!-- 项目创建表单组件 -->
<template>
    <el-dialog 
        title="创建项目" 
        class="container"
        :before-close="cancel"
        :close-on-click-modal="false"
        :visible.sync="visible"
        @close="resetForm('projectForm')">
        <el-form 
            :model="projectData" 
            ref="projectForm" 
            label-width="80px" 
            :rules="formRules"
            v-loading="isLoading">
            <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="projectData.projectName"></el-input>
            </el-form-item>
            <el-form-item label="项目简介" prop="introduce">
                <el-input 
                    v-model="projectData.introduce"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    maxlength="100"
                    show-word-limit>
                </el-input>
            </el-form-item>
            <el-form-item class="btnPart">
                <el-button type="primary" @click="confirm">创建</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>    
</template>
<script>
import { createProject as create } from '@/api/system/project';

export default {
    name: 'ProjectAddForm',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        var checkName = (rule, projectName, callback) => {
            if(!(/^[\u4e00-\u9fa5a-zA-Z0-9 ]{1,20}$/).test(projectName)) {
                return callback(new Error('名称非法!'));
            }
            else {
                callback();
            }
        };
        return {
            isLoading: false,
            projectData: {
                projectName: '',
                introduce: ''
            },
            formRules: {
                projectName: [
                    { required: true, trigger: 'blur', message: '项目名称不能为空' },
                    { max: 20, trigger: 'blur', message: '名称长度应小于20个字符' },
                    { validator: checkName, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        /**
         * 重置表单
         */
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        cancel() {
            this.$emit('handleCancel');
        },
        /**
         * 提交表单
         */
        confirm() {
            this.$refs.projectForm.validate(valid => {
                if(valid) {
                    this.isLoading = true;
                    create(this.projectData).then((res) => {
                        console.log(res);
                        if(res.status == "201") {
                            this.$message.success("创建成功");
                            setTimeout(() => {
                                this.$emit('handleConfirm');
                            }, 1000);
                        }
                    }).catch(err => {
                        // console.log(err);
                        this.$message.error("创建失败");
                    }).finally(() => {
                        this.isLoading = false;
                    });
                }
            })
        },
        
    },
}
</script>

<style scoped>
.btnPart {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0;
}
</style>