import request from '@/utils/request'

/**
 * 创建项目
 * @param {*} data 
 */
export function createProject(data) {
    return request({
        url: '/api/project/create',
        method: 'post',
        data
    })
}

/**
 * 获取信息
 * @param {*} params 
 */
export function getMessage(params) {
    return request({
        url: '/api/project/getMessage',
        method: 'get',
        params
    })
}

/**
 * 删除项目
 */
export function deleteProject(data) {
    return request({
        url: '/api/project/deleteProject',
        method: 'delete',
        data
    })
}