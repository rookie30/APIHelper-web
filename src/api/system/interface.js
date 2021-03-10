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