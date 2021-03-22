<template>
    <div class="container">
        <div class="header">
            <el-page-header @back="goBack" :content="'接口 ' + interfaceInfo.interfaceName + ' 接口日志'">
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
            <div class="blank-tip" v-show="checkNull()">
                <span class="tip-content">暂无内容</span>
            </div>
        </div>
    </div>
</template>

<script>
import { getInterfaceLog } from '@/api/system/interfaceManager';

export default {
    filters: {
        typeFilter(type) {
            const typeMap = { create: 'success', delete: 'danger', update: 'info' };
            return typeMap[type];
        }
    },
    data() {
        return {
            logData: [],
            isLoading: false,
            interfaceInfo: {},
        }
    },
    methods: {
        goBack() {
            this.$router.back(-1);
        },
        /**
         * 获取接口日志信息
         */
        getLogInfo() {
            return new Promise((resolve, reject) => {
                getInterfaceLog(this.interfaceInfo).then(res => {
                    if(res.status == 200) {
                        resolve(res);
                    } else {
                        reject('获取接口日志失败');
                    }
                });
            });
        },
        /**
         * 从query中获取接口信息
         */
        getInfoFromQuery() {
            this.interfaceInfo = JSON.parse(this.$route.query.interfaceInfo);
        },
        init() {
            const logPromise = this.getLogInfo();
            logPromise.then(res => {
                console.log(res);
                this.logData = res.logData;
            }).catch(err => {
                this.$message.error(err);
            });
        },
        /**
         * 判断日志内容是否为空，以控制空白提示是否显示
         */
        checkNull() {
            if(this.logData.length == 0) {
                return true;
            } else {
                return false;
            }
        }
    },
    created() {
        this.getInfoFromQuery();
        this.init();
    }
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