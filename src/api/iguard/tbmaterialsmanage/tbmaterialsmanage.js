import request from '@/utils/request'
// 查询列表
export function tbmaterialsmanagelist(data) {
  return request({
    url: '/rest/tbMaterialsManage/list',
    method: 'post',
    data
  })
}
// 编辑
export function tbmaterialsmanageedit(data) {
  return request({
    url: '/rest/tbMaterialsManage/update',
    method: 'post',
    data
  })
} // 新增
export function tbmaterialsmanageadd(data) {
  return request({
    url: '/rest/tbMaterialsManage/add',
    method: 'post',
    data
  })
}
// 删除
export function tbmaterialsmanagedelete(data) {
  return request({
    url: '/rest/tbMaterialsManage/delete',
    method: 'post',
    data
  })
}
// 查询物料/设备品牌
export function tbMaterialsBrandList(data) {
  return request({
    url: "/rest/tbMaterialsBrand/list",
    method: 'post',
    data
  })
}
//查询物料/设备类型
export function tbMaterialsTypeList(data) {
  return request({
    url: '/rest/tbMaterialsType/list',
    method: 'post',
    data
  })
}
