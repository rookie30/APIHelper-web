<!-- 项目日志 -->
<template>
    <div class="container">
        <div class="header">
            <el-page-header @back="goBack" :content="projectData.projectName+' 项目日志'">
            </el-page-header>
        </div>
        <div class="body" v-loading="isLoading">
            <div>
                <el-timeline 
                    v-for="(item, index) in logData"
                    :key="index">
                    <el-timeline-item 
                        :type="item.type | typeFilter"
                        :timestamp="item.recordTime"
                        placement="top"
                        class="log-item">
                        <el-card>
                            <h4>{{ item.title }}</h4>
                            <p>{{ item.content }}</p>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>
    </div>
</template>

<script>
import { getProjectLog } from '@/api/system/project';

export default {
    filters: {
        typeFilter(type) {
            const typeMap = { 
                create: 'success', 
                delete: 'danger', 
                update: 'info', 
                invite: 'warning',
                remove: 'warning'
            };
            return typeMap[type];
        }
    },
    data() {
        return {
            projectData: '',
            logData: [],
            isLoading: false,
        }
    },
    methods: {
        /**
         * 从url中获取项目信息
         */
        getInfoFromQuery() {
            this.projectData = JSON.parse(this.$route.query.info);
        },
        goBack() {
            this.$router.back(-1);
        },
        /**
         * 获取日志信息
         */
        getLog() {
            return new Promise((resolve, reject) => {
                const params = { projectId: this.projectData.id };
                getProjectLog(params).then(res => {
                    // console.log(res);
                    if(res.status == '200') {
                        resolve(res);
                    }
                    else {
                        reject("获取日志失败");
                    }
                });
            });
        },
        init() {
            this.isLoading = true;
            const logPromise = this.getLog();
            logPromise.then(res =>{
                // console.log(res);
                // 将日志根据记录时间倒叙排序
                let logs = res.logs.sort((a, b) => {
                    return a.recordTime > b.recordTime ? -1 : 1;
                });
                this.logData = logs;
                // 切割日志内容
                this.splitTitle();
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                this.isLoading = false;
            });
        },
        /**
         * 分割日志内容，提取日志标题
         */
        splitTitle() {
            this.logData.forEach(item => {
                const title = item.content.split(' ')[0] + ' ' +  
                        item.content.split(' ')[4];
                item.title = title;
            });
        },
        
    },
    created() {
        this.getInfoFromQuery();
        this.init();
    },
}
</script>

<style scoped>
.container {
    margin: 0 auto;
    padding: 0;
}
.header {
    width: 100%;
    padding: 10px;
}
.body {
    margin-top: 10px;
}
.body .title {
    display: block;
    font-size: 25px;
    margin: 10px 0 15px 15px;
}
.log-item {
    width: 90%;
}
</style>