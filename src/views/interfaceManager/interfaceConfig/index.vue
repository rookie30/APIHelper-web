<!-- 接口管理 -->
<template>
    <div class="interface-container">
        <div class="header">
            <el-page-header 
                @back="goBack" 
                :content="'项目 '+projectInfo.projectName+' 接口管理'"></el-page-header>
            <div class="header-function">
                <el-button 
                    type="primary" 
                    size="medium"
                    class="createBtn functionBtn"
                    icon="el-icon-plus"
                    @click="createInterface">
                    创建
                </el-button>
            </div>
        </div>
        <div class="table-body">
            <el-table 
                class="interfaceTable"
                :data="interfaceData"
                v-loading="isLoading">
                <el-table-column
                    type="index"
                    label="id"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="接口名称"
                    width="120"
                    prop="name">
                </el-table-column>
                <el-table-column
                    label="请求方式"
                    width="100"
                    prop="requestType">
                    <template slot-scope="scope">
                        <el-tag :type="requestTypeHandler(scope.row.requestType)">
                            {{ scope.row.requestType }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="请求地址"
                    prop="requestUrl">
                </el-table-column>
                <el-table-column
                    label="创建者"
                    prop="createBy"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="150"
                    fixed="right">
                    <template slot-scope="scope">
                        <el-button 
                            icon="el-icon-document"
                            circle
                            size="mini">
                        </el-button>
                        <el-button
                            circle
                            icon="el-icon-date"
                            size="mini"
                            @click="checkLog(scope.row)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getInterfaceInfo } from '@/api/system/interfaceManager';


export default {
    data() {
        return {
            projectInfo: {}, // 当前选择的项目
            projectList: [], // 项目列表
            interfaceData: [], // 接口信息
            isLoading: false,
        }
    },
    methods: {
        /**
         * 从url中获取项目信息
         */
        getInfoFromQuery() {
            this.projectInfo = JSON.parse(this.$route.query.info);
        },
        /**
         * 获取接口信息
         */
        getInterfaceInformation() {
            return new Promise((resolve, reject) => {
                getInterfaceInfo(this.projectInfo).then(res => {
                    if(res.status == 200) {
                        resolve(res);
                    } else {
                        reject("获取接口信息失败");
                    }
                });
            });
        },
        init() {
            this.getInfoFromQuery();
            const interfaceInfoPromise = this.getInterfaceInformation();
            interfaceInfoPromise.then(res => {
                console.log(res);
                this.interfaceData = res.interfaceList;
            }).catch(err => {
                console.log(err);
            });
        },
        goBack() {
            this.$router.back(-1);
        },
        /**
         * 创建接口
         */
        createInterface() {
            const params = JSON.stringify({
                type: 'create',
                projectInfo: this.projectInfo
            });
            this.$router.push({ path: '/interface/interfaceConfig/create', query: {info: params}});
        },
        /**
         * 请求类型处理器
         */
        requestTypeHandler(requestType) {
            const typeList = {
                'GET': '', 
                'POST': 'success', 
                'DELETE': 'danger', 
                'PUT': 'success', 
                'PATCH': 'info'
            };
            return typeList[requestType] || '';
        },
        /**
         * 查看接口日志
         */
        checkLog(row) {
            console.log(row);
            const interfaceInfo = JSON.stringify({
                interfaceName: row.name
            });
            this.$router.push({path: '/interface/interfaceLog', query: {
                interfaceInfo: interfaceInfo
            }});
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
        width: 100%;
    }
    .header-function {
        width: 100%;
        /* height: 80px; */
        margin: 15px 0 0 0;
        padding: 5px 10px;
        display: flex;
        flex-direction: column;
    }
    .createBtn {
        width: 90px;
    }
    .interfaceTable {
        width: 100%;
        padding: 0 10px;
    }
</style>