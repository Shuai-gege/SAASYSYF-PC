import request from '../../../../utils/request1'
import request3 from '../../../../utils/request3'
// 未通过人脸核验重置为通过
export function updateUserFaceSign(data) {
    return request3({
        url: '/rest/PCReport/updateUserFaceSign',
        method: "post",
        data
    })
}
// 人脸核验未通过明细
export function faceCheckNoPass(data) {
    return request3({
        url: '/rest/PCReport/faceCheckNoPass',
        method: "post",
        data
    })
}
// 点检人员清单报表
export function getPCReportUser(data) {
    return request3({
        url: '/rest/PCReport/getPCReportUser',
        method: "post",
        data
    })
}
// 人员的未完成事件清单及状态
export function getEventDetailNoCompleteByUid(data) {
    return request3({
        url: '/rest/PCReport/getEventDetailNoCompleteByUid',
        method: "post",
        data
    })
}
// 人员的已完成事件清单及状态
export function getEventDetailCompleteByUid(data) {
    return request3({
        url: '/rest/PCReport/getEventDetailCompleteByUid',
        method: "post",
        data
    })
}
// 点检状态清单
export function getDeviceNoCompleteByDetailId(data) {
    return request3({
        url: '/rest/PCReport/getDeviceNoCompleteByDetailId',
        method: "post",
        data
    })
}
// 人脸核验详情
export function getFaceCheckDetail(data) {
    return request3({
        url: '/rest/PCReport/getFaceCheckDetail',
        method: "post",
        data
    })
}
// 人脸核验详情
export function tu(path) {
    return request3({
        url: '/rest/PCReport/img' + path,
        method: "get",
    })
}