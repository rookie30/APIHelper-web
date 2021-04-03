<!-- 接口创建表单组件 -->
<template>
    <div class="container" style="padding-bottom: 10px;">
        <el-form
            :model="interfaceData"
            ref="interfaceForm"
            v-loading="isLoading">
            <el-form-item 
                label="接口名称" 
                label-width="80px" 
                class="form-item">
                <span
                    v-show="!isEditName" 
                    class="projectName"
                    @click="isEditName=true">
                    {{ interfaceData.name }}
                    <i class="el-icon-edit edit-icon"></i>    
                </span>
                <el-input v-model="interfaceData.name" v-show="isEditName">
                    <el-button 
                        slot="append" 
                        icon="el-icon-check"
                        @click="isEditName=false">
                    </el-button>
                </el-input>
            </el-form-item>
            <el-form-item class="form-item">
                <el-collapse class="introduce-collapse">
                    <el-collapse-item>
                        <span class="collapse-title" slot="title">接口简介</span>
                        <div 
                            class="introduce-part" 
                            @click="isEditIntroduce=true"
                            v-show="!isEditIntroduce">
                            {{ interfaceData.introduce }}
                            <i class="el-icon-edit edit-icon"></i>
                        </div>
                        <el-input 
                            v-model="interfaceData.introduce" 
                            v-show="isEditIntroduce"
                            type="textarea"
                            :rows="2"
                            placeholder="请输入接口简介"
                            maxlength="100"
                            resize="none"
                            show-word-limit
                            @blur="isEditIntroduce=false">
                        </el-input>
                    </el-collapse-item>
                </el-collapse>
            </el-form-item>
            <el-form-item class="form-item" prop="requestUrl">
                <div class="url-part">
                    <el-input placeholder="请输入接口URL" v-model="interfaceData.requestUrl" class="input-with-select">
                        <el-select 
                            style="width:100px;" 
                            v-model="interfaceData.requestType" 
                            slot="prepend">
                            <el-option label="GET" value="GET"></el-option>
                            <el-option label="POST" value="POST"></el-option>
                            <el-option label="PUT" value="PUT"></el-option>
                            <el-option label="PATCH" value="PATCH"></el-option>
                            <el-option label="DELETE" value="DELETE"></el-option>
                        </el-select>
                        <el-button 
                            slot="append"
                            @click="testInterface">
                            发送
                        </el-button>
                    </el-input>
                    <el-button 
                        type="primary" 
                        class="save-button"
                        @click="saveInfo">保存
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item class="form-item">
                <el-tabs 
                    v-model="paramsLocation"
                    class="paramsLocation-function">
                    <!-- params-part -->
                    <el-tab-pane label="Params" name="Params">
                        <div>
                            <div class="partHeader">
                                <span class="partTitle">Query Params</span>
                            </div>
                            <ParamsTable
                                :data="interfaceData.params"
                                @deleteItem(index)="deleteParamItem">
                            </ParamsTable>
                            <div class="table-function">
                                <el-button @click="addParamItem">新增</el-button>
                            </div>
                        </div>
                    </el-tab-pane>
                    <!-- headers-part -->
                    <el-tab-pane label="Headers" name="Headers">
                        <div class="partHeader">
                            <span class="partTitle">Headers</span>
                        </div>
                        <ParamsTable
                            :data="interfaceData.headers"
                            @deleteItem(index)="deleteHeadersItem">
                        </ParamsTable>
                        <div class="table-function">
                            <el-button @click="addHeadersItem">新增</el-button>
                        </div>
                    </el-tab-pane>
                    <!-- body-part -->
                    <el-tab-pane label="Body" name="Body">
                        <div style="padding: 0 10px;">
                            <el-radio 
                                v-model="interfaceData.body.status"
                                label="none">
                                none
                            </el-radio>
                            <el-radio
                                v-model="interfaceData.body.status"
                                label="form-data">
                                form-data
                            </el-radio>
                        </div>
                        <div v-show="interfaceData.body.status!='none'">
                            <ParamsTable
                                :data="interfaceData.body.content"
                                @deleteItem(index)="deleteBodyItem">
                            </ParamsTable>
                            <div class="table-function">
                                <el-button @click="addBodyItem">新增</el-button>
                            </div>
                        </div>
                        <span 
                            v-show="interfaceData.body.status=='none'"
                            class="body-tip">
                            此请求没有正文
                        </span>
                    </el-tab-pane>
                </el-tabs>
            </el-form-item>
        </el-form>
        <el-card 
            class="response-card" 
            shadow="never"
            v-loading="responseIsLoading">
            <div slot="header" class="clearfix">
                <span 
                    class="response-header-title title">
                    Response
                </span>
                <el-tag 
                    style="float: right;" 
                    :type="responseStatusHandler()"
                    v-show="responseIsShow">
                    {{ response.status }}
                </el-tag>
            </div>
            <div>
                <div v-show="responseIsShow">
                    <div class="response-body">
                        <span class="response-body-title title">Body</span>
                        <pre v-text="response.data"></pre>
                    </div>
                </div>
                <span 
                    class="response-tip"
                    v-show="!responseIsShow">
                    点击“发送”得到结果
                </span>
            </div>
        </el-card>
    </div>
</template>

<script>
import ParamsTable from '@/components/ParamsTable';
import { createInterface, updateInterface, interfaceTest } from '@/api/system/interfaceManager';

export default {
    name: 'InterfaceInfoForm',
    components: {
        ParamsTable,
    },
    props: {
        projectInfo: {
            type: Object
        },
        type: {
            type: String
        },
        interfaceInfo: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            interfaceData: {
                name: 'web',
                introduce: '请在此输入接口简介',
                requestType: 'GET',
                requestUrl: '',
                params: [],
                headers: [],
                body: {
                    status: 'form-data',
                    content: []
                },
            },
            paramsLocation: 'Params',
            isEditName: false, 
            isEditIntroduce: false, // 是否编辑接口简介
            isLoading: false,
            response: {},
            responseIsShow: false,
            responseIsLoading: false
        }
    },
    created() {
        this.init();
    },
    methods: {
        /**
         * 保存编辑的接口信息
         */
        saveInfo() {
            if(this.interfaceData.requestUrl == '') {
                return this.$message.error('接口URL不能为空');
            }
            // 过滤参数列中全空的项
            this.interfaceData.params = this.checkNull(this.interfaceData.params);
            this.interfaceData.headers = this.checkNull(this.interfaceData.headers);
            this.interfaceData.body.content = this.checkNull(this.interfaceData.body.content);
            // console.log(this.interfaceData);            
            this.isLoading = true;
            // 根据访问类型选择提交事件
            if(this.type == 'create') {
                this.createInterfaceHandler();
            } else {
                this.updateInterfaceHandler();
            }
        },
        /**
         * 创建接口
         */
        createInterfaceHandler() {
            createInterface(this.interfaceData).then(res => {
                // console.log(res);
                if(res.status == '201') {
                    this.$message.success('创建成功');
                } else {
                    throw new Error('创建失败');
                }
            }).catch(err => {
                // console.log(err);
                this.$message.error(err);
            }).finally(() => {
                this.isLoading = false;
            });
        },
        /**
         * 更新接口
         */
        updateInterfaceHandler() {
            updateInterface(this.interfaceData).then(res => {
                if(res.status == '200') {
                    this.$message.success('更新成功');
                } else {
                    throw new Error('更新失败');
                }
            }).catch(err => {
                this.$message.error(err)
            }).finally(() => {
                this.isLoading = false;
            });
        },
        /**
         * 新增param参数项
         */
        addParamItem() {
            this.interfaceData.params.push({
                key: '',
                value: '',
                description: ''
            });
        },
        /**
         * 删除param参数项
         */
        deleteParamItem(index) {
            // const itemIndex = this.interfaceData.params.indexOf(row);
            this.interfaceData.params.splice(index, 1);
        },
        /**
         * 新增headers参数项
         */
        addHeadersItem() {
            this.interfaceData.headers.push({
                key: '',
                value: '',
                description: ''
            });
        },
        /**
         * 删除header参数项
         */
        deleteHeadersItem(index) {
            this.interfaceData.headers.splice(index, 1);
        },
        /**
         * 新增body参数项
         */
        addBodyItem() {
            this.interfaceData.body.content.push({
                key: '',
                value: '',
                description: ''
            });
        },
        /**
         * 删除body参数项
         */
        deleteBodyItem(index) {
            this.interfaceData.body.content.splice(index, 1);
        },
        /**
         * 过滤参数列表中为空的项
         */
        checkNull(paramList) {
            let filteredList = [];
            paramList.forEach((item) => {
                if(!(item.key == '' && item.value == '' && item.description == '')) {
                    filteredList.push(item);
                }
            });
            // console.log(paramList);
            return filteredList;
        },
        init() {
            // 加入项目信息
            this.interfaceData.projectId = this.projectInfo.id;
            this.interfaceData.createBy = this.projectInfo.createBy;
            // 判断是编辑还是创建接口
            if(this.type == 'edit') {
                // 将body、params、header重新解析为数组对象
                this.interfaceInfo.params = JSON.parse(this.interfaceInfo.params);
                this.interfaceInfo.body = JSON.parse(this.interfaceInfo.body);
                this.interfaceInfo.headers = JSON.parse(this.interfaceInfo.headers);
                this.interfaceData = this.interfaceInfo;
            }
        },
        /**
         * 测试接口
         */
        testInterface() {
            this.responseIsLoading = true;
            interfaceTest(this.interfaceData).then(res => {
                console.log(res);
                this.response = res;
            }).catch(err => {
                console.log(err);
                this.response = err;
                console.log(err.data);
            }).finally(() => {
                this.responseIsShow = true;
                this.responseIsLoading = false;
            });
        },
        /**
         * 状态码判断处理
         */
        responseStatusHandler() {
            const status = this.response.status;
            if(status == 200 || status == 201) {
                return 'success';
            }
            return 'danger';
        },
    },
    
}
</script>

<style scoped>
.container {
    padding-bottom: 10px;
}
.form-item {
    padding: 0 10px;
    margin-bottom: 15px;
}
.projectName {
    font-size: inherit;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
}
.projectName:hover .edit-icon {
    display: inline-block;
}
.projectName:hover {
    cursor: pointer;
}
.introduce-part:hover .edit-icon{
    display: inline-block;
}
.introduce-part:hover {
    cursor: pointer;
}
.introduce-part {
    padding: 0 20px;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
}
.edit-icon {
    display: none;
    font-size: 12px;
}
.collapse-title {
    flex: 1 0 90%;
    order: 1;
}
.el-collapse-item__header {
    flex: 1 0 auto;
    order: -1;
}
.url-part {
    display: flex;
}
.save-button {
    margin: 0 10px;
}
/* .params-table-column {
    display: flex;
} */
.table-function {
    margin: 10px 10px;
    display: flex;
    justify-content: flex-end;
}
.body-tip {
    font-size: 13px;
    display: flex;
    justify-content: center;
    width: 100%;
    color: lightgray;
}
.response-card {
    margin: 10px 10px;
}
.response-tip {
    display: block;
    color: rgb(163, 159, 159);
    width: 100%;
    text-align: center;
}
.response-header-title {
    height: 32px;
    line-height: 32px;
    
}
.response-body {
    display: flex;
    flex-direction: column;
}
.response-body-title {
    /* font-size: 15px; */
    margin-bottom: 15px;
}
</style>