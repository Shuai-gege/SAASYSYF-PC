import request from '../../../../utils/request1'
import request1 from '@/utils/request'
import request2 from '../../../../utils/request2'
// list
export function getPatrolCheckGroupByParam(data) {
    return request({
        url: "/rest/patrolCheckGroup/getPatrolCheckGroupByParam",
        method: "post",
        data
    })
}
// 查询是否有权限创建
export function checkCreateGroup(companyId, status) {
    return request({
        url: "/rest/patrolCheckGroup/checkCreateGroup",
        method: "get",
        params: {
            companyId,
            status
        }
    })
}
// 查询可选组长
export function getGroupManage(companyId) {
    return request({
        url: "/rest/patrolCheckGroup/getGroupManage",
        method: "get",
        params: {
            companyId
        }
    })
}
// 查询可选组员
export function getGroupWorkers(companyId) {
    return request({
        url: "/rest/patrolCheckGroup/getGroupWorkers",
        method: "get",
        params: {
            companyId
        }
    })
}
// 新增
export function add(data) {
    return request({
        url: "/rest/patrolCheckGroup/add",
        method: "post",
        data
    })
}
// 编辑
export function editPatrolCheckGroup(data) {
    return request({
        url: "/rest/patrolCheckGroup/editPatrolCheckGroup",
        method: "post",
        data
    })
}
// 删除
export function removePatrolCheckGroup(id) {
    return request({
        url: "/rest/patrolCheckGroup/removePatrolCheckGroup",
        method: "get",
        params: {
            id
        }
    })
}