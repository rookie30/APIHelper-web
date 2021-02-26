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
 * 获取数据总数
 */
export function getTotalCount() {
    return request({
        url: '/api/project/getTotalCount',
        method: 'get'
    })
}

/**
 * 获取信息
 * @param {*} data 
 */
export function getMessage(data) {
    return request({
        url: '/api/project/getMessage',
        method: 'get',
        data
    })
}

export function deleteProject() {
    return request({
        url: '/api/project/deleteProject',
        method: 'delete'
    })
}