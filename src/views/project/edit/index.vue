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
            <!-- 项目小组管理 -->
            <el-card class="group-card management-card"         v-show="managementChoose">
                    <div slot="header">
                        <span>项目小组管理</span>
                        <el-button
                            icon="el-icon-refresh"
                            circle
                            class="changeBtn"
                            size="mini"
                            @click="managementChoose=!managementChoose">
                        </el-button>
                        <el-button
                            style="float:right;padding:3px 0;"
                            type="text"
                            @click="createFormVisible=true">
                            创建小组
                        </el-button>
                    </div>
                    <el-table :data="groupData" height="400">
                        <el-table-column 
                            prop="groupName"
                            label="小组名称"
                            width="150px">
                        </el-table-column>
                        <el-table-column
                            prop="leader"
                            label="组长"
                            width="150px">
                        </el-table-column>
                        <el-table-column
                            prop="member"
                            label="项目组成员">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="100px"
                            fixed="right">
                            <el-button
                                icon="el-icon-edit"
                                circle
                                size="mini">
                            </el-button>
                            <el-button 
                                type="danger" 
                                icon="el-icon-delete" 
                                circle
                                size="mini">
                            </el-button>
                        </el-table-column>
                    </el-table>
                    <CreateGroupForm
                        :visible="createFormVisible"
                        :projectId="projectData.id"
                        @handelCancel="createCancel"
                        @handelGroupCreated="createSucceed">
                    </CreateGroupForm>
            </el-card>
            <!-- 项目成员管理 -->
            <el-card class="member-card management-card" v-show="!managementChoose">
                <div slot="header">
                    <span>项目成员管理</span>
                    <el-button
                        icon="el-icon-refresh"
                        circle
                        class="changeBtn"
                        size="mini"
                        @click="managementChoose=!managementChoose">
                    </el-button>
                    <el-button
                        style="float:right;padding:3px 0;"
                        type="text">
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
                        prop="group"
                        label="所属小组">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="100px"
                        fixed="right">
                        <el-button 
                            type="danger" 
                            icon="el-icon-delete" 
                            circle
                            size="mini">
                        </el-button>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<script>
import { getMemberInfo, getGroupInfo, updateProject } from '@/api/system/project';
import CreateGroupForm from '@/components/projectManager/createGroupForm'; 

export default {
    name: 'ProjectEdit',
    components: {
        CreateGroupForm,
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
            projectData: {},
            memberData: [],
            groupData: [],
            isEdit: false,
            managementChoose: true, // 成员管理/项目管理切换
            createFormVisible: false,
            isLoading: false,
            groupRules: {
                projectName: [
                    { trigger: 'blur', message: '项目名称不能为空' },
                    { max: 20, trigger: 'blur', message: '名称长度应小于20个字符' },
                    { validator: checkName, trigger: 'blur' }
                ]
            }
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
         * 获取项目组成员信息
         */
        getMemberInformation() {
            return new Promise((resolve, reject) => {
                let params = { projectId: this.projectData.id };
                getMemberInfo(params).then(res => {
                    if(res.code == '200') {
                        resolve(res);
                    }
                    else {
                        reject("获取成员信息失败");
                    }
                });
            });
        },
        /**
         * 获取项目组信息
         */
        getGroupInformation() {
            return new Promise((resolve, reject) => {
                let params = { projectId: this.projectData.id };
                getGroupInfo(params).then(res => {
                    if(res.code == '200') {
                        resolve(res);
                    }
                    else {
                        reject("获取项目组信息失败");
                    }
                });
            });
        },
        init() {
            this.isLoading = true;
            const groupPromise = this.getGroupInformation();
            // memberPromise.then(res => {
            //     console.log(res);
            // }).catch(err => {
            //     console.log(err);
            // });
            groupPromise.then(res => {
                // console.log(res);
                this.groupData = res.groups;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                this.isLoading = false;
            });
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
                console.log(res);
                if(res.code == "200") {
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