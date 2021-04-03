import request from '@/utils/request'

export function getUnreadNoticeCount() {
    return request({
        url: '/api/notice/getUnreadCount',
        method: 'get',
    })
}

export function getNoticeList() {
    return request({
        url: '/api/notice/getNoticeList',
        method: 'get'
    })
}