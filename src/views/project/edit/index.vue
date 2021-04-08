<!-- 项目信息管理 -->
<template>
    <div class="container" v-loading="isLoading">
        <div class="manager-container">
            <!-- 项目信息管理 -->
            <el-card class="project-card">
                <div slot="header">
                    <span>项目信息管理</span>
                    <el-button 
                        style="float:right;padding:3px 0" 
                        type="text"
                        @click="isEdit=!isEdit">
                        编辑
                    </el-button>
                </div>
                <el-form 
                    label-position="right" 
                    label-width="80px" 
                    :model="projectData" 
                    ref="groupInfoForm"
                    :rules="groupRules">
                    <el-form-item label="项目名称" prop="projectName">
                        <span v-show="!isEdit" class="editPart">{{ projectData.projectName }}</span>
                        <el-input v-show="isEdit" v-model="projectData.projectName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="项目简介" prop="introduce">
                        <div class="introducePart" v-show="!isEdit">
                            {{ projectData.introduce }}
                        </div>
                        <el-input 
                            v-show="isEdit" 
                            v-model="projectData.introduce" 
                            clearable
                            type="textarea"
                            :rows="4"
                            resize="none"
                            maxlength="100"
                            show-word-limit>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="创建者">
                        <span class="editPart">{{ projectData.createBy }}</span>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <span class="editpart">{{ projectData.createTime }}</span>
                    </el-form-item>
                    <el-form-item label="更新时间">
                        <span class="updateTime">{{ projectData.updateTime }}</span>
                    </el-form-item>
                    <el-form-item v-show="isEdit" label-width="0">
                        <el-button 
                            type="primary" 
                            style="margin-left:15px;"
                            @click="handelEdit()">
                            保存修改
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <!-- 项目成员管理 -->
            <el-card 
                class="member-card management-card"
                v-loading="memberIsLoading">
                <div slot="header">
                    <span>项目成员管理</span>
                    <el-button
                        style="float:right;padding:3px 0;"
                        type="text"
                        @click="invitationDialogVisible = true">
                        邀请成员
                    </el-button>
                </div>
                <el-table
                    :data="memberData">
                    <el-table-column
                        prop="username"
                        label="账号"
                        width="100px">
                    </el-table-column>
                    <el-table-column
                        prop="nickname"
                        label="昵称"
                        width="100px">
                    </el-table-column>
                    <el-table-column
                        prop="email"
                        label="邮箱">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="联系方式">
                    </el-table-column>
                    <el-table-column
                        prop="gender"
                        label="性别"
                        width="80px">
                        <template slot-scope="scope">
                            {{ scope.row.gender | genderFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="100px"
                        fixed="right">
                        <template slot-scope="scope">
                            <!-- <el-button 
                                type="text"
                                size="mini"
                                style="color:red;"
                                @click="removeMember(scope.row)">
                                移除
                            </el-button> -->
                            <el-popconfirm
                                confirm-button-text='确定'
                                cancel-button-text='取消'
                                icon="el-icon-info"
                                icon-color="red"
                                title="确定移除该成员吗?"
                                @onConfirm="removeMem(scope.row)">
                                <el-button 
                                    slot="reference" 
                                    type="text"
                                    size="mini"
                                    style="color:red;">
                                    移除
                                </el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 成员邀请dialog -->
                <el-dialog
                    title="成员邀请"
                    :visible.sync="invitationDialogVisible"
                    :close-on-click-modal="false"
                    @closed="resetInvitationForm"
                    v-loading="invitationLoading">
                    <el-form 
                        :model="personalData"
                        :rules="personalRules"
                        ref="invitationForm"
                        label-width="80px">
                        <el-form-item label="账号" prop="username">
                            <el-input v-model="personalData.username"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="invitationDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handelInvite">确 定</el-button>
                    </div>
                </el-dialog>
            </el-card>
        </div>
    </div>
</template>

<script>
import { getMemberInfo, invitationMember, updateProject, removeMember } from '@/api/system/project';
import CreateGroupForm from '@/components/projectManager/createGroupForm'; 

export default {
    name: 'ProjectEdit',
    components: {
        CreateGroupForm,
    },
    filters: {
        genderFilter(gender) {
            const genderMap = {
                0: '女',
                1: '男'
            };
            return genderMap[gender];
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
        var checkAccount = (rule, value, callback) => {
            if (!(/^[0-9a-zA-Z@.]{5,20}$/).test(value)) {
                return callback(new Error('账号应由数字、字母或@与.构成'))
            } else {
                callback()
            }
        };
        return {
            projectData: {},
            memberData: [],
            personalData: {
                username: '', // 成员邀请账号信息
            }, 
            isEdit: false,
            createFormVisible: false,
            isLoading: false,
            memberIsLoading: false, // 成员管理模块loading判断
            invitationLoading: false,
            groupRules: {
                projectName: [
                    { trigger: 'blur', message: '项目名称不能为空' },
                    { max: 20, trigger: 'blur', message: '名称长度应小于20个字符' },
                    { validator: checkName, trigger: 'blur' }
                ]
            },
            personalRules: {
                username: [
                    { trygger: 'blur', message: '请输入用户账号' },
                    { min: 5, max: 20, trigger: 'blur', message: '账号长度应在 5 到 20 个字符内' },
                    { validator: checkAccount, trigger: 'blur' }
                ]
            },
            invitationDialogVisible: false,
        }
    },
    methods: {
        /**
         * 从url中获取项目信息
         */
        getInfoFromQuery() {
            this.projectData = JSON.parse(this.$route.query.info);
            // console.log(this.projectData);
        },
        /**
         * 获取项目成员信息
         */
        getMemberInformation() {
            this.memberIsLoading = true;
            let params = { projectId: this.projectData.id };
            getMemberInfo(params).then(res => {
                if(res.status == '200') {
                    this.memberData = res.users;
                } else {
                    throw new Error("获取成员信息失败");
                }
            }).catch(err => {
                this.$message.error(err);
            }).finally(() => {
                this.memberIsLoading = false;
            });
        },
        init() {
            this.getMemberInformation();
        },
        createCancel() {
            this.createFormVisible = false;
        },
        /**
         * 创建小组成功
         */
        createSucceed() {
            this.createFormVisible = false;
            this.init();
        },
        /**
         * 修改项目信息
         */
        handelEdit() {
            this.isLoading = true;
            updateProject(this.projectData).then(res => {
                // console.log(res);
                if(res.status == "200") {
                    this.$message.success("修改成功");
                    setTimeout(() => {
                        const params = JSON.stringify(this.projectData);
                        this.$router.push({path: '/project/edit', query: {info: params}});
                        this.isEdit = false;
                    }, 1000);
                }
                else {
                    throw new Error("修改失败");
                }
            }).catch(err => {
                console.log(err);
                this.$message.error(err);
            }).finally(() => {
                this.isLoading = false;
            });
        },
        /**
         * 邀请成员
         */
        handelInvite() {
            this.$refs.invitationForm.validate(valid => {
                if(valid) {
                    const params = {
                        projectId: this.projectData.id,
                        username: this.personalData.username
                    }
                    this.invitationLoading = true;
                    invitationMember(params).then(res => {
                        // console.log(res);
                        if(res.status == '200') {
                            this.$message.success('操作成功');
                            this.getMemberInformation();
                            this.invitationDialogVisible = false;
                        } else {
                            throw new Error('操作失败');
                        }
                    }).catch(err => {
                        console.log(err);
                        this.$message.error(err);
                    }).finally(() => {
                        this.invitationLoading = false;
                    });
                }
            });
        },
        resetInvitationForm() {
            this.$refs['invitationForm'].resetFields();
        },
        /**
         * 移除成员
         */
        removeMem(row) {
            const data = {
                username: row.username,
                projectId: this.projectData.id
            };
            this.memberIsLoading = true;
            removeMember(data).then(res => {
                console.log(res);
                if(res.status == '200') {
                    this.$message.success('操作成功');
                    this.getMemberInformation();
                } else {
                    throw new Error('操作失败');
                }
            }).catch(err => {
                console.log(err);
                this.$message.error(err);
            }).finally(() => {
                this.memberIsLoading = false;
            });
        }
    },
    created() {
        this.getInfoFromQuery();
        this.init();
    },
}
</script>

<style scoped>
.manager-container {
    display: flex;
    justify-content: center;
}
.project-card {
    width: 40%;
    height: 100%;
    max-height: 500px;
    margin: 15px 10px;
}
.editPart {
    display: inline-block;
    padding: 0 30px 0 15px;
    height: 40px;
    font-size: 14px;
    font-family: sans-serif;
}
.introducePart {
    width: 100%;
    height: auto;
    padding: 0 30px 0 15px;
    height: 40px;
    font-size: 14px;
    font-family: sans-serif;
}
/* .group-card {
    width: 60%;
    height: 100%;
    max-height: 500px;
    margin: 15px 10px;
} */
.member-manager {
    display: flex;

}
/* .member-card {
    width: 100%;
    height: 40%;
    margin: 10px 10px;
} */
.management-card {
    width: 60%;
    height: 100%;
    max-height: 500px;
    margin: 15px 10px;
}
.changeBtn {
    float: right;
    margin-left: 15px;
}

</style>