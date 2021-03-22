<!-- 项目管理 -->
<template>
    <div class="project-container">
        <div class="function-bar">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="dialogVisible=true"></el-button>
            <ProjectAddForm 
                :visible="dialogVisible"
                @handleCancel="handleCancel"
                @handleConfirm="handleConfirm">
            </ProjectAddForm>
            <el-input 
                v-model="pageData.searchCont" 
                placeholder="请输入搜索内容" 
                class="searchInput"
                suffix-icon="el-icon-search">
            </el-input>
            <el-button type="primary" class="searchBtn" @click="search">搜索</el-button>
        </div>
        <div class="table-body">
            <el-table
                :data="tableData"
                stripe
                class="project-table"
                :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }"
                v-loading="isLoading">
                <el-table-column
                    type="index"
                    :index="handelIndex"
                    label="id">
                </el-table-column>
                <el-table-column
                    prop="projectName"
                    label="名称">
                    <template slot-scope="scope">
                        {{ scope.row.projectName }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="introduce"
                    label="简介"
                    width="140"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.introduce }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createBy"
                    label="创建者">
                    <template slot-scope="scope">
                        {{ scope.row.createBy }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | timeFilter }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="更新时间"
                    width="180">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="190">
                    <template slot-scope="scope">
                        <el-button 
                            circle 
                            icon="el-icon-edit-outline" 
                            size="mini"
                            @click="handelEdit(scope.row)">
                        </el-button>
                        <el-button
                            circle
                            icon="el-icon-folder-opened"
                            size="mini"
                            @click="interfaceManage(scope.row)">
                        </el-button>
                        <el-button
                            circle
                            icon="el-icon-date"
                            size="mini"
                            @click="checkLog(scope.row)">
                        </el-button>
                        <el-button 
                            circle 
                            icon="el-icon-delete" 
                            size="mini" 
                            style="color:red;"
                            @click="handelDelete(scope.$index, scope.row)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-part">
            <el-pagination
                :current-page.sync="pageData.currentPage"
                :page-size="pageData.size"
                layout="sizes, prev, pager, next, jumper"
                :page-sizes="[7, 11]"
                @size-change="handelSizeChange"
                @current-change="handleCurrentChange"
                :total="pageData.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import ProjectAddForm from '@/components/projectForm/addForm';
import { getMessage, deleteProject } from '@/api/system/project';

export default {
    name: 'Project',
    components: {
        ProjectAddForm,
    },
    filters: {
        timeFilter(time) {
            let date = time.split(" ");
            return date[0];
        }
    },
    data() {
        return {
            tableData: [],
            pageData: {
                currentPage: 1, // 当前页
                size: 7, // 每页数据量
                total: 0,
                searchCont: '',
            },
            dialogVisible: false,
            isLoading: false,
        }
    },
    methods: {
        /**
         * 取消创建项目
         */
        handleCancel() {
            this.dialogVisible = false;
        },
        /**
         * 创建项目成功回调函数
         */
        handleConfirm() {
            this.init();
            this.dialogVisible = false;
        },
        /**
         * 分页
         */
        handelSizeChange(val) {
            this.pageData.size = val;
            this.init();
        },
        handelIndex(index) {
            return index + this.pageData.size * (this.pageData.currentPage - 1) + 1;
        },
        /**
         * 获取项目信息
         */
        getInfo() {
            return new Promise((resolve, reject) => {
                getMessage(this.pageData).then(res => {
                    if(res.status == '200') {
                        resolve(res);
                    }
                    else {
                        reject({msg: '获取信息失败'});
                    }
                });
            });
        },
        init() {
            this.isLoading = true;
            const infoPromise = this.getInfo();
            infoPromise.then(res => {
                // console.log(res);
                if(res.status == '200') {
                    if(this.pageData.total != res.total) {
                        this.pageData.total = res.total;
                    }
                    this.tableData = res.rows;
                }
                else {
                    throw new Error('初始化失败');
                }
            }).catch(err => {
                console.log(err);
                this.$message.error('初始化失败');
            }).finally(() => {
                this.isLoading = false;
            });
        },
        /**
         * 删除项目
         */
        handelDelete(index, row) {
            this.row = row;
            this.index = index;
            this.$confirm('确定要删除该项目吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await deleteProject(this.row).then(res => {
                    if(res.status == '200') {
                        this.$message.success('删除成功');
                        this.init();
                    }
                    else {
                        throw new Error("删除失败");
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error('删除失败');
                });
            }).catch(err => {
                console.log(err);
                this.$message.info('已取消操作');
            });
        },
        /**
         * 查询
         */
        search() {
            this.pageData.currentPage = 1;
            const infoPromise = this.getInfo();
            infoPromise.then(res => {
                // console.log(res);
                if(res.status == '200') {
                    this.tableData = res.rows;
                    this.pageData.total = res.total;
                }
                else {
                    throw new Error('获取信息失败');
                }
            }).catch(err => {
                console.log(err);
                throw new Error('获取信息失败');
            });
        },
        /**
         * 换页
         */
        handleCurrentChange() {
            const infoPromise = this.getInfo();
            infoPromise.then(res => {
                if(res.status == '200') {
                    this.tableData = res.rows;
                }
                else {
                    throw new Error('获取信息失败');
                }
            }).catch(err => {
                console.log(err);
                throw new Error('获取信息失败');
            })
        },
        /**
         * 项目编辑
         */
        handelEdit(row) {
            const params = JSON.stringify(row);
            this.$router.push({path: '/project/edit', query: {info: params}});
        },
        /**
         * 查看项目日志
         */
        checkLog(row) {
            const params = JSON.stringify(row);
            this.$router.push({path: '/project/log', query: {info: params}});
        },
        /**
         * 接口管理
         */
        interfaceManage(row) {
            const params = JSON.stringify({ 
                id: row.id, 
                projectName: row.projectName, 
                createBy: row.createBy
            });
            this.$router.push({path: '/interface/interfaceConfig', query: {info: params}});    
        }
    },
    mounted() {
        this.init();
    }
}
</script>

<style scoped>
    .project-container {
        margin: 0 auto;
        padding: 0;
    }
    .function-bar {
        display: flex;
        margin: 15px 15px;
    }
    .searchInput {
        width: 200px;
        margin: 0 15px;
    }
    .table-body {
        margin: 0 15px;
    }
    .pagination-part {
        margin: 15px 10px;
        float: right;
    }
</style>