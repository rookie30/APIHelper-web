<!-- 接口配置 -->
<template>
    <div class="interface-container">
        <div class="header">
            <el-select v-model="project" placeholder="请选择项目">
                <el-option
                    v-for="project in projectList"
                    :key="project.id"
                    :label="project.projectName"
                    :value="project.id">
                </el-option>
            </el-select>
            <el-button 
                type="primary" 
                size="middle"
                class="createBtn"
                icon="el-icon-plus">
                创建
            </el-button>
        </div>
        <div class="table-body">
            <el-table 
                class="interfaceTable" 
                stripe
                style="width:100%;margin:0 10px;"
                :data="interfaceData">
                <el-table-column
                    type="index"
                    label="id"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="名称"
                    width="150"
                    prop="name">
                </el-table-column>
                <el-table-column
                    label="请求方式"
                    width="100"
                    prop="requestType">

                </el-table-column>
                <el-table-column
                    label="状态"
                    width="100"
                    prop="type">

                </el-table-column>
                <el-table-column
                    label="请求地址"
                    prop="requestUrl">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="150"
                    fixed="right">
                    <el-button 
                        icon="el-icon-document"
                        circle
                        size="mini">
                    </el-button>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getAllProject } from '@/api/system/interface';

export default {
    data() {
        return {
            project: '', // 当前选择的项目
            projectList: [],
            interfaceData: [
                {id: 1, name: '123', requestType: 'post', type: '开发中', requestUrl: '123123'}
            ],

        }
    },
    methods: {
        /**
         * 获取所有项目信息
         */
        getProjectInfo() {
            return new Promise((resolve, reject) => {
                getAllProject().then(res => {
                    if(res.code == '200') {
                        resolve(res);
                    }
                    else {
                        reject("获取项目信息失败");
                    }
                });
            });
        },
        init() {
            const projectPromise = this.getProjectInfo();
            projectPromise.then(res => {
                console.log(res);
                this.projectList = res.projectList;
            }).catch(err => {
                console.log(err);
            })
            // Promise.all([projectPromise]).then(res => {
            //     console.log(res[0]);
            // }).catch(err => {
            //     console.log(err);
            // });
        }
    },
    created() {
        this.init();
    }
}
</script>

<style scoped>
    .interface-container {
        margin: 0 auto;  
        padding: 0;  
    }
    .header {
        padding: 10px 8px;
    }
    .createBtn {
        margin: 0 10px;
    }
</style>