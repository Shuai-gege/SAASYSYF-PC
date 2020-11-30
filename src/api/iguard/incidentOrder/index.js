import request from '@/utils/request'
import request2 from '../../../../utils/request2'
// 查询所有企业
export function subCompanyList(uid) {
    return request({
        url: "/rest/department/subCompanyList",
        method: "get",
        params: {
            uid
        }
    })
}
// 查询公司下的建筑
export function getCompanyDeptByCompanyId(company_id) {
    return request2({
        url: "/rest/buildingLocation/getCompanyDeptByCompanyId",
        method: "get",
        params: {
            company_id
        }
    })
}
// 查询报事详情list
export function getPCReportEventDetailByPage(data) {
    return request({
        url: "/rest/tbEventReport/getPCReportEventDetailByPage",
        method: "post",
        data
    })
}
// 查询某建筑下楼层或者房间
export function getBuildingLocationFloor(parentId) {
    return request2({
        url: "/rest/buildingLocation/getBuildingLocationFloor",
        method: "get",
        params: {
            parentId
        }
    })
}
// 查询事件类型
export function getEventTypes(data) {
    return request({
        url: "/rest/tbEventTypeConfig/list",
        method: "post",
        data
    })
}
// 获取当前人的公司
export function getCompanyByUid(uid) {
    return request({
        url: "/rest/department/getCompanyByUid",
        method: "get",
        params: {
            uid
        }
    })
}