import request1 from '../../../../utils/request1' //巡更接口域名
import request from '@/utils/request' //报事报修接口域名
// 查询所有人
export function getCompanyAllUser(id) {
    return request({
        url: "/rest/department/getCompanyAllUser",
        method: "get",
        params: {
            id
        }
    })
}
// 新增任务
export function add(data) {
    return request1({
        url: "/rest/patrolTask/add",
        method: "post",
        data
    })
}
// 巡更任务List
export function getPatrolTaskList(data) {
    return request1({
        url: "/rest/patrolTask/getPatrolTaskList",
        method: "post",
        data
    })
}
// 停用and启用
export function stopPatrolTask(id) {
    return request1({
        url: "/rest/patrolTask/stopPatrolTask",
        method: "get",
        params: {
            id
        }
    })
}
// 删除
export function removePatrolTask(id) {
    return request1({
        url: "/rest/patrolTask/removePatrolTask",
        method: "get",
        params: {
            id
        }
    })
}
// 查询详情
export function getTaskDetailsByParam(data) {
    return request1({
        url: "/rest/patrolTask/getTaskDetailsByParam",
        method: "post",
        data
    })
}
// 编辑
export function editPatrolTask(data) {
    return request1({
        url: "/rest/patrolTask/editPatrolTask",
        method: "post",
        data
    })
}