import request2 from '../../../../utils/request2' //巡更接口域名
// 查询List
export function getList(data) {
    return request2({
        url: "/rest/serviceLevelConfig/list",
        method: "post",
        data
    })
}
// 新增
export function getAdd(data) {
    return request2({
        url: "/rest/serviceLevelConfig/add",
        method: "post",
        data
    })
}
// 编辑
export function modify(data) {
    return request2({
        url: "/rest/serviceLevelConfig/modify",
        method: "post",
        data
    })
}
// 新增
export function defaultLevel(id) {
    return request2({
        url: "/rest/serviceLevelConfig/defaultLevel",
        method: "get",
        params: {
            id
        }
    })
}