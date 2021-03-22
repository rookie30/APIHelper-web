<template>
    <el-table :data="tableData">
        <el-table-column label="键" prop="key">
            <template slot-scope="scope">
                <el-input v-model="scope.row.key"></el-input>
            </template>
        </el-table-column>
        <el-table-column label="值" prop="value">
            <template slot-scope="scope">
                <el-input v-model="scope.row.value"></el-input>
            </template>
        </el-table-column>
        <el-table-column label="参数简介" prop="description">
            <template slot-scope="scope">
                <el-input v-model="scope.row.description"></el-input>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="70">
            <template slot-scope="scope">
                <el-button 
                    type="danger" 
                    icon="el-icon-delete" 
                    circle
                    size="mini"
                    @click="deleteParamItem(scope.row)"
                    v-show="isEnableToDelete">
                </el-button>
                <el-button 
                    type="danger" 
                    icon="el-icon-delete" 
                    circle
                    size="mini"
                    disabled
                    v-show="!isEnableToDelete">
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'ParamsTable',
    props: {
        data: {
            type: Array
        }
    },
    data() {
        return {
            tableData: [],
            isEnableToDelete: false,
        }
    },
    watch: {
        tableData: function(data){
            this.judgeEnabelToDelete(data);
        }
    },
    created() {
        this.tableData = this.data;
        this.initTableData();
    },
    methods: {
        /**
         * 删除参数项
         */
        deleteParamItem(row) {
            const itemIndex = this.tableData.indexOf(row);
            this.tableData.splice(itemIndex, 1);
            this.$emit("deleteItem", itemIndex);
        },
        /**
         * 判断数据项是否能删除，保证至少有一项
         */
        judgeEnabelToDelete(data) {
            if(data.length == 1) {
                this.isEnableToDelete = false;
            } else {
                this.isEnableToDelete = true;
            }
        },
        /**
         * 初始化
         */
        initTableData() {
            if(this.tableData.length == 0) {
                this.tableData.push({
                    key: '',
                    value: '',
                    description: ''
                });
            }
        }
    }
}
</script>

<style scoped>

</style>