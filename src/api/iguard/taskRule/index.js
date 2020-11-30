import request1 from '../../../../utils/request1'
import request from '@/utils/request'
// 任务规则管理
export function getTaskRulesByParam(data) {
    return request1({
        url: "/rest/taskRule/getTaskRulesByParam",
        method: "post",
        data
    })
}
// 新增任务规则
export function add(data) {
    return request1({
        url: "/rest/taskRule/add",
        method: "post",
        data
    })
}
// 查询任务规则
export function getTaskRuleDetailByRuleId(ruleId, uid) {
    return request1({
        url: "/rest/taskRule/getTaskRuleDetailByRuleId",
        method: "get",
        params: {
            ruleId,
            uid
        }
    })
}
// 删除任务规则
export function removeTaskRule(ruleId) {
    return request1({
        url: "/rest/taskRule/removeTaskRule",
        method: "get",
        params: {
            ruleId
        }
    })
}
// 编辑任务规则
export function editTaskRule(data) {
    return request1({
        url: "/rest/taskRule/editTaskRule",
        method: "post",
        data
    })
}