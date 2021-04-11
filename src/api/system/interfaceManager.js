import request from '@/utils/request';
import testRequest from '@/utils/testRequest';

/**
 * 获取参与的所有项目信息
 * @returns 
 */
export function getAllProject() {
    return request({
        url: '/api/interface/getAll',
        method: 'get'
    })
}


/**
 * 获取项目中的接口信息
 * @param {*} params 
 * @returns 
 */
export function getInterfaceInfo(params) {
    return request({
        url: '/api/interface/getInfo',
        method: 'get',
        params
    })
} 

/**
 * 创建接口
 * @param {*} data 
 * @returns 
 */
export function createInterface(data) {
    return request({
        url: '/api/interface/create',
        method: 'post',
        data
    })
}

/**
 * 更新接口
 * @param {*} data 
 * @returns 
 */
export function updateInterface(data) {
    return request({
        url: '/api/interface/update',
        method: 'post',
        data
    })
}


/**
 * 获取接口日志
 * @param {*} params 
 */
export function getInterfaceLog(params) {
    return request({
        url: '/api/interface/getLog',
        method: 'get',
        params
    })
}

/**
 * 手动测试
 * @param {*} data 
 * @returns 
 */
export function interfaceTest(data) {
    return testRequest({
        url: '/api/interface/manualTest',
        method: 'post',
        data
    })
}

/**
 * 自动测试
 * @param {*} data 
 */
export function interfaceAutoTest(data) {
    return testRequest({
        url: '/api/interface/autoTest',
        method: 'post',
        data
    })    
}

/**
 * params参数处理
 * @param {*} dataParams 
 * @returns 
 */
function handleParams(dataParams) {
    let params = {};
    dataParams.forEach(item => {
        // console.log(item);
        let key = item.key;
        let value = item.value;
        params[key] = value;
    });
    return params;
}

/**
 * body参数处理
 * @param {*} dataBody 
 * @returns 
 */
function handleBody(dataBody) {
    let body = [];
    dataBody.forEach(item => {
        let key = item.key;
        let value = item.value;
        let obj = {};
        obj[key] = value;
        body.push(obj);
    });
    return body;
}

/**
 * headers参数处理
 * @param {*} dataHeaders 
 * @returns 
 */
function handleHeaders(dataHeaders) {
    let headers = [];
    dataHeaders.forEach(item => {
        let key = item.key;
        let value = item.value;
        let obj = {};
        obj[key] = value;
        headers.push(obj);
    });
    return headers;
}