import request from '@/utils/request'
// 新增
export function add(data) {
    return request({
        url: "/rest/tbDifficultyConfig/add",
        method: "post",
        data
    })
}
// 报事任务List
export function getList(data) {
    return request({
        url: "/rest/tbDifficultyConfig/getList",
        method: "post",
        data
    })
}
// 删除
export function shan(data) {
    return request({
        url: "/rest/tbDifficultyConfig/delete",
        method: "post",
        data
    })
}
// 编辑
export function update(data) {
    return request({
        url: "/rest/tbDifficultyConfig/update",
        method: "post",
        data
    })
}