import request from '@/utils/request'
// 查询列表
export function tbmaterialstypelist(data) {
  return request({
    url: '/rest/tbMaterialsType/list',
    method: 'post',
    data
  })
}
// 编辑
export function tbmaterialstypeedit(data) {
  return request({
    url: '/rest/tbMaterialsType/update',
    method: 'post',
    data
  })
} // 新增
export function tbmaterialstypeadd(data) {
  return request({
    url: '/rest/tbMaterialsType/add',
    method: 'post',
    data
  })
}
// 删除
export function tbmaterialstypedelete(data) {
  return request({
    url: '/rest/tbMaterialsType/delete',
    method: 'post',
    data
  })
}
