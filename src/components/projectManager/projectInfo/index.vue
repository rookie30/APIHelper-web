<template>
    <el-dialog 
        title="项目信息管理" 
        :visible.sync="visible"
        :close-on-click-modal="false"
        class="container">
        <el-form
            :data="projectData"
            ref="projectForm"
            label-width="80px">
            
        </el-form>
    </el-dialog>
</template>

<script>
export default {
    name: 'ProjectInfo',
    data() {
        return {
            visible: false,
            projectData: {},

        }
    }
}
</script>

<style>

</style>