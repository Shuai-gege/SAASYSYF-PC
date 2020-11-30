import request3 from '../../../../utils/request3'
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
// 新增
export function add(data) {
    return request3({
        url: '/rest/checkTask/add',
        method: 'post',
        data
    })
}
// 查询是否还可以据需报事
export function checkAddTask(companyId) {
    return request3({
        url: '/rest/checkTask/checkAddTask',
        method: 'get',
        params: { companyId }
    })
}
// 编辑
export function editCheckTask(data) {
    return request3({
        url: '/rest/checkTask/editCheckTask',
        method: 'post',
        data
    })
}
// 查询任务list
export function getCheckTaskList(data) {
    return request3({
        url: '/rest/checkTask/getCheckTaskList',
        method: 'post',
        data
    })
}
// 查询任务详情
export function getTaskDetailsByParam(data) {
    return request3({
        url: '/rest/checkTask/getTaskDetailsByParam',
        method: 'post',
        data
    })
}
// 删除任务
export function removeCheckTask(id) {
    return request3({
        url: "/rest/checkTask/removeCheckTask",
        method: "get",
        params: {
            id
        }
    })
}
// 停用and启用
export function stopCheckTask(id) {
    return request3({
        url: "/rest/checkTask/stopCheckTask",
        method: "get",
        params: {
            id
        }
    })
}