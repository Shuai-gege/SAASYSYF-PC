import request from '@/utils/request'
// 查询物料使用list
export function getPCMaterialReport(data) {
    return request({
        url: "/rest/tbEventMaterials/getPCMaterialReport",
        method: "post",
        data
    })
}
// 查询物料使用详情list
export function getMaterialReportDetail(data) {
    return request({
        url: "/rest/tbEventMaterials/getMaterialReportDetail",
        method: "post",
        data
    })
}
//设备类型
export function tbMaterialsTypeList(data) {
    return request({
        url: '/rest/tbMaterialsType/list',
        method: 'post',
        data
    })
}
// 设备品牌
export function tbMaterialsBrandList(data) {
    return request({
        url: "/rest/tbMaterialsBrand/list",
        method: 'post',
        data
    })
}