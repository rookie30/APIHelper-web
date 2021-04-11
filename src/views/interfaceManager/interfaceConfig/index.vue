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
                            icon="el-icon-edit-outline"
                            circle
                            size="mini"
                            @click="editInterface(scope.row)">
                        </el-button>
                        <el-button
                            circle
                            icon="el-icon-date"
                            size="mini"
                            @click="checkLog(scope.row)">
                        </el-button>
                        <el-button
                            circle
                            icon="el-icon-copy-document"
                            size="mini"
                            @click="autoTest(scope.row)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 开启自动测试提示dialog -->
            <el-dialog
                title="提示"
                :visible.sync="testDialogVisible"
                width="30%"
                v-loading="testLoading">
                <span>确定开始自动测试吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="testDialogVisible=false">取 消</el-button>
                    <el-button type="primary" @click="handelAutoTest">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 测试结果显示dialog -->
            <el-dialog
                title="测试结果"
                :visible.sync="resultDialogVisible">
                <el-table 
                    :data="testResult"
                    height="250"
                    border="">
                    <el-table-column 
                        label="编号" 
                        width="60px"
                        prop="index">
                    </el-table-column>
                    <el-table-column
                        label="参数"
                        prop="params">
                        <template slot-scope="scope">
                            <pre v-text="scope.row.params"></pre>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="测试结果"
                        prop="result">
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        fixed="right">
                        <template slot-scope="scope">
                            <el-tag :type="resultStatusHandler(scope.row.result)">
                                {{ JSON.parse(scope.row.result).status }}
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { getInterfaceInfo, interfaceAutoTest } from '@/api/system/interfaceManager';


export default {
    data() {
        return {
            projectInfo: {}, // 当前选择的项目
            interfaceData: [], // 接口信息
            isLoading: false,
            testDialogVisible: false,
            currentInterface: {}, // 当前选中的接口信息
            testResult: [], // 自动测试结果
            resultDialogVisible: false,
            testLoading: false
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
                this.interfaceData = res.interfaceList;
            }).catch(err => {
                this.$message.error(err);
                // console.log(err);
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
            const interfaceInfo = JSON.stringify({
                interfaceId: row.id,
                interfaceName: row.name
            });
            this.$router.push({path: '/interface/interfaceLog', query: {
                interfaceInfo: interfaceInfo
            }});
        },
        /**
         * 编辑接口信息
         */
        editInterface(row) {
            const params = JSON.stringify({
                type: 'edit',
                projectInfo: this.projectInfo,
                interfaceInfo: row
            });
            this.$router.push({path: '/interface/interfaceConfig/edit', query: {
                info: params
            }});
            // console.log(params);
        },
        /**
         * 自动测试
         */
        autoTest(row) {
            this.testDialogVisible = true;
            // console.log(row);
            this.currentInterface = row;
        },
        /**
         * 自动测试handel事件
         */
        handelAutoTest() {
            this.testLoading = true;
            interfaceAutoTest(this.currentInterface).then(res => {
                const result = JSON.stringify(res.data.data);
                this.testResult = JSON.parse(result);
                console.log(JSON.parse(result));
                this.resultDialogVisible = true;
                setTimeout(() => {
                    this.resultDialogVisible = true;
                }, 500);
            }).catch(err => {
                console.log(err);
                this.$message.error('操作失败');
            }).finally(() => {
                this.testLoading = false;
                this.testDialogVisible = false;
            });
        },
        /**
         * 测试结果类型处理器
         */
        resultStatusHandler(row) {
            let status = JSON.parse(row).status;
            if(status == 200 || status == 201) {
                return "success";
            } else {
                return "danger";
            }
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