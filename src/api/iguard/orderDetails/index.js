import request from '@/utils/request'
// 查询事件详情
export function getEventInfoByEventId(uid, eventStatusNow, event_id) {
    return request({
        url: "/rest/tbEventReport/getEventInfoByEventId",
        method: "get",
        params: {
            uid,
            eventStatusNow,
            event_id
        }
    })
}