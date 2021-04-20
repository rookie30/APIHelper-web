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

/**
 * 获取项目成员
 * @param {*} params 
 */
export function getMemberInfo(params) {
    return request({
        url: '/api/project/getMemberInfo',
        method: 'get',
        params,
    })
}

/**
 * 获取项目日志
 * @param {*} params 
 * @returns 
 */
export function getProjectLog(params) {
    return request({
        url: '/api/project/getLog',
        method: 'get',
        params
    })
}

/**
 * 更新项目信息
 * @param {*} data 
 * @returns 
 */
export function updateProject(data) {
    return request({
        url: '/api/project/updateInfo',
        method: 'post',
        data
    })
}

/**
 * 邀请成员
 * @param {*} data 
 * @returns 
 */
export function invitationMember(data) {
    return request({
        url: '/api/project/invite',
        method: 'post',
        data
    })
}

/**
 * 移除用户
 * @param {*} data 
 * @returns 
 */
export function removeMember(data) {
    return request({
        url: '/api/project/removeMember',
        method: 'delete',
        data
    })
}