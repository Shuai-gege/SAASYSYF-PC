import request from '../../../../utils/request1'
// 巡更人员报表list查询
export function getParsonList(data) {
    return request({
        url: '/rest/PCReportController/getPCReportUser',
        method: "post",
        data
    })
}
// 人员的已完成事件清单及状态list查询
export function getEventDetailCompleteByUid(data) {
    return request({
        url: '/rest/PCReportController/getEventDetailCompleteByUid',
        method: "post",
        data
    })
}
// 人员的未完成事件清单及状态list查询
export function getEventDetailNoCompleteByUid(data) {
    return request({
        url: '/rest/PCReportController/getEventDetailNoCompleteByUid',
        method: "post",
        data
    })
}
// 巡更点状态清单
export function getPointNoCompleteByDetailId(data) {
    return request({
        url: '/rest/PCReportController/getPointNoCompleteByDetailId',
        method: "post",
        data
    })
}
// 人脸核验详情
export function getFaceCheckDetail(data) {
    return request({
        url: '/rest/PCReportController/getFaceCheckDetail',
        method: "post",
        data
    })
}
// 人脸核验未通过明细
export function faceCheckNoPass(data) {
    return request({
        url: '/rest/PCReportController/faceCheckNoPass',
        method: "post",
        data
    })
}
// 未通过人脸核验重置为通过
export function updateUserFaceSign(data) {
    return request({
        url: '/rest/PCReportController/updateUserFaceSign',
        method: "post",
        data
    })
}