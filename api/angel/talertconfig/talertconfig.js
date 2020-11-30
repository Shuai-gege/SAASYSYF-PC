import request from '@/utils/request'
// 查询列表
export function talertconfiglist(data) {
  return request({
    url: '/rest/tAlertConfig/list',
    method: 'post',
    data
  })
}
// 编辑
export function talertconfigedit(data) {
  return request({
    url: '/rest/tAlertConfig/update',
    method: 'post',
    data
  })
}// 新增
export function talertconfigadd(data) {
  return request({
    url: '/rest/tAlertConfig/add',
    method: 'post',
    data
  })
}
// 删除
export function talertconfigdelete(data) {
  return request({
    url: '/rest/tAlertConfig/delete',
    method: 'post',
    data
  })
}