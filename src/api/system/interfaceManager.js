import request from '@/utils/request';

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