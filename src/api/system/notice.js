import request from '@/utils/request'


/**
 * 获取未读通知数量
 * @returns 
 */
export function getUnreadNoticeCount() {
    return request({
        url: '/api/notice/getUnreadCount',
        method: 'get',
    })
}

/**
 * 获取消息列表
 * @returns 
 */
export function getNoticeList() {
    return request({
        url: '/api/notice/getNoticeList',
        method: 'get'
    })
}

/**
 * 将消息标记为已读
 * @param {*} data 
 * @returns 
 */
export function setReadNotice(data) {
    return request({
        url: '/api/notice/setReadNotice',
        method: 'post',
        data
    })
}
