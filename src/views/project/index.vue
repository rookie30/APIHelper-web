<template>
    <div class="project-container">
        <div class="function-bar">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="dialogVisible=true"></el-button>
            <ProjectAddForm 
                :visible="dialogVisible"
                @handleCancel="handleCancel"
                @handleConfirm="handleConfirm"></ProjectAddForm>
            <el-input 
                v-model="pageData.searchCont" 
                placeholder="请输入搜索内容" 
                class="searchInput"
                suffix-icon="el-icon-search">
            </el-input>
            <el-button type="primary" class="searchBtn">搜索</el-button>
        </div>
        <div class="table-body">
            <el-table
                :data="tableData"
                stripe
                class="project-table">
                <el-table-column
                    prop="id"
                    label="id">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    prop="introduce"
                    label="简介">
                </el-table-column>
                <el-table-column
                    prop="createBy"
                    label="创建者">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <el-button circle icon="el-icon-document-copy" size="mini"></el-button>
                    <el-button circle icon="el-icon-delete" size="mini" style="color:red;"></el-button>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-part">
            <el-pagination
                :current-page.sync="pageData.currentPage"
                :page-size="pageData.size"
                layout="prev, pager, next, jumper"
                :total="pageData.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import ProjectAddForm from '@/components/projectForm/addForm';
import { getTotalCount, getMessage } from '@/api/system/project';

export default {
    name: 'Project',
    components: {
        ProjectAddForm,
    },
    data() {
        return {
            tableData: [{
                id: 1,
                name: 'hello',
                introduce: 'test',
                createBy: 'admin',
                createTime: '123',
                
            }],
            pageData: {
                currentPage: 1, // 当前页
                size: 15, // 每页数据量
                total: 0,
                searchCont: '',
            },
            dialogVisible: false,
        }
    },
    methods: {
        handleCancel() {
            this.dialogVisible = false;
        },
        handleConfirm() {
            this.dialogVisible = false;
        },
        /**
         * 获取数据总量
         */
        // getMsgCount() {
        //     return new Promise((resolve, reject) => {
        //         getTotalCount().then(res => {
        //             if(res.code == '200') {
        //                 resolve(res);
        //             }
        //             else {
        //                 reject({msg: "获取数据总量失败"});
        //             }
        //         });
        //     });
        // },
        getInfo() {
            return new Promise((resolve, reject) => {
                console.log(this.pageData);
                getMessage(this.pageData).then(res => {
                    if(res.code == '200') {
                        resolve(res);
                    }
                    else {
                        reject({msg: '获取信息失败'});
                    }
                });
            });
        },
        init() {
            const infoPromise = this.getInfo();
            infoPromise.then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },
        deleteProject() {
            
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