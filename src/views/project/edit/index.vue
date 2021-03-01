<!-- 项目信息管理 -->
<template>
    <div class="container">
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
                <el-form label-position="right" label-width="80px" :model="projectData" ref="form">
                    <el-form-item label="项目名称">
                        <span v-show="!isEdit" class="editPart">{{ projectData.projectName }}</span>
                        <el-input v-show="isEdit" v-model="projectData.projectName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="项目简介">
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
                        <el-button type="primary" style="margin-left:15px;">保存修改</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <!-- 项目小组管理 -->
            <el-card class="group-card">
                <div slot="header">
                    <span>项目小组管理</span>
                    <el-button
                        style="float:right;padding:3px 0;"
                        type="text">
                        创建小组
                    </el-button>
                </div>
                <el-table :data="groupData">
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
                </el-table>
            </el-card>
        </div>
        <!-- 项目成员管理 -->
        <div class="member-manager">
            <el-card class="member-card">
                <div slot="header">
                    <span>项目成员管理</span>
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
                        width="150px">
                    </el-table-column>
                    <el-table-column
                        prop="nickname"
                        label="昵称"
                        width="150px">
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
                        width="100px">
                        <el-button type="danger" icon="el-icon-delete" circle></el-button>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProjectEdit',
    data() {
        return {
            projectData: {},
            memberData: [],
            groupData: [],
            isEdit: false,
        }
    },
    methods: {
        /**
         * 从url中获取项目信息
         */
        getInfoFromQuery() {
            this.projectData = this.$route.query.info;
            console.log(this.projectData);
        }
    },
    created() {
        this.getInfoFromQuery();
    }
}
</script>

<style scoped>
    .manager-container {
        display: flex;
        justify-content: center;
    }
    .project-card {
        width: 40%;
        height: 400px;
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
    .group-card {
        width: 60%;
        height: 400px;
        margin: 15px 10px;
    }
    .member-manager {
        display: flex;

    }
    .member-card {
        width: 100%;
        height: 40%;
        margin: 10px 10px;
    }

</style>