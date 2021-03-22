<!-- 创建项目小组 -->
<template>
    <el-dialog 
        title="创建项目小组"
        :close-on-click-modal="false"
        :visible.sync="visible"
        :before-close="cancel"
        @close="resetForm('groupForm')">
        <el-form 
            :model="groupInfo" 
            label-width="100px"
            label-position="right"
            ref="groupForm">
            <el-form-item label="小组名称" prop="groupName">
                <el-input 
                    v-model="groupInfo.groupName"
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="项目组长" prop="leader">

            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handelCreate">创建</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { createGroup } from '@/api/system/project';

export default {
    name: 'CreateGroupForm',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        projectId: {
            type: Number
        }
    },
    data() {
        return {
            groupInfo: {
                groupName: '',
                leader: '',
                project: '',
            },
            isShow: false,
        }
    },
    methods: {
        cancel() {
            this.$emit("handelCancel");
        },
        handelCreate() {
            createGroup(this.groupInfo).then(res => {
                // console.log(res);
                if(res.status == '201') {
                    this.$message.success("创建成功");
                    this.$emit("handelGroupCreated");
                }
                else {
                    throw new Error("创建失败");
                }
            }).catch(err => {
                console.log(err);
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    created() {
        this.groupInfo.project = this.projectId;
    }
}
</script>

<style>

</style>