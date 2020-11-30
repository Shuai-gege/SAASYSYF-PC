import request from '@/utils/request'
// 查询列表
export function tbassessconfiglist(data) {
  return request({
    url: '/rest/tbAssessConfig/list',
    method: 'post',
    data
  })
}
// 编辑
export function tbassessconfigedit(data) {
  return request({
    url: '/rest/tbAssessConfig/update',
    method: 'post',
    data
  })
} // 新增
export function tbassessconfigadd(data) {
  return request({
    url: '/rest/tbAssessConfig/add',
    method: 'post',
    data
  })
}
// 删除
export function tbassessconfigdelete(data) {
  return request({
    url: '/rest/tbAssessConfig/delete',
    method: 'post',
    data
  })
}
