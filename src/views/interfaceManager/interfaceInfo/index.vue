<!-- 接口信息管理——创建/编辑 -->
<template>
    <div class="container">
        <div class="header">
            <el-page-header @back="goBack" :content="pageTitle"></el-page-header>
        </div>
        <div class="body">
            <InterfaceCreateForm
                v-show="type=='create'"
                :projectInfo="projectInfo">
            </InterfaceCreateForm>
        </div>
    </div>
</template>

<script>
import InterfaceCreateForm from '@/components/interfaceManager/createInterface';

export default {
    components: {
        InterfaceCreateForm
    },
    data() {
        return {
            pageTitle: '', // 页面标题
            type: '', // 访问类型
            projectInfo: {}
        }
    },
    methods: {
        goBack() {
            this.$router.back(-1);
        },
        /**
         * 初始化，判断访问类型并获取项目信息
         */
        init() {
            const params = JSON.parse(this.$route.query.info);
            this.type = params.type;
            this.projectInfo = params.projectInfo;
            if(this.type == 'create') {
                this.pageTitle = '接口创建';
            } else {
                this.pageTitle = '接口信息编辑';
            }
        }
    },
    created() {
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
    padding: 10px 8px;
    width: 100%;
}
</style>