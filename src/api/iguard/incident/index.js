import request from '@/utils/request'
// 报事任务List
export function getPCReportEventByPage(data) {
    return request({
        url: "/rest/tbEventReport/getPCReportEventByPage",
        method: "post",
        data
    })
}
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
// 根据公司查询下面所有部门
export function subDeptByDeptId(deptId) {
    return request({
        url: "/rest/department/subDeptByDeptId",
        method: "get",
        params: {
            deptId
        }
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
// 查询事件类型
export function getEventTypes(data) {
    return request({
        url: "/rest/tbEventTypeConfig/list",
        method: "post",
        data
    })
}
//查询所有部门
export function subDepartments(deptId) {
    return request({
        url: '/rest/department/subDeptByDeptId',
        method: 'get',
        params: {
            deptId
        }
    })
}