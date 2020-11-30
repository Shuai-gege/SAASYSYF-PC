import request from '@/utils/request'
// 查询列表
export function tbeventtypeconfiglist(data) {
    return request({
        url: '/rest/tbEventTypeConfig/list',
        method: 'post',
        data
    })
}
// 编辑
export function tbeventtypeconfigedit(data) {
    return request({
        url: '/rest/tbEventTypeConfig/update',
        method: 'post',
        data
    })
} // 新增
export function tbeventtypeconfigadd(data) {
    return request({
        url: '/rest/tbEventTypeConfig/add',
        method: 'post',
        data
    })
}
// 删除
export function tbeventtypeconfigdelete(data) {
    return request({
        url: '/rest/tbEventTypeConfig/delete',
        method: 'post',
        data
    })
}
// 查找登录人所属公司所有部门
export function getcompanydept(uid) {
    return request({
        url: "/rest/department/getCompanyDept",
        method: "get",
        params: {
            uid
        }
    })
}
// 查询本公司所有员工信息
export function getcompanyalluser(id) {
    return request({
        url: "/rest/department/getCompanyAllUser",
        method: "get",
        params: {
            id
        }
    })
}
//查询某部门下所有人员
export function getuserlist(data) {
    return request({
        url: "/rest/user/list",
        method: "post",
        data
    })
}
// 选择相应人A&B
export function tbEventTypeConfig(uid, responseStatus) {
    return request({
        url: "/rest/tbEventTypeConfig/getUserIdA",
        method: "get",
        params: {
            uid,
            responseStatus
        }
    })
}