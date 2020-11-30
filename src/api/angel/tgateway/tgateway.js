import request from '@/utils/request'
// 查询列表
export function tgatewaylist(data) {
  return request({
    url: '/rest/tGateway/list',
    method: 'post',
    data
  })
}
// 编辑
export function tgatewayedit(data) {
  return request({
    url: '/rest/tGateway/update',
    method: 'post',
    data
  })
}// 新增
export function tgatewayadd(data) {
  return request({
    url: '/rest/tGateway/add',
    method: 'post',
    data
  })
}
// 删除
export function tgatewaydelete(data) {
  return request({
    url: '/rest/tGateway/delete',
    method: 'post',
    data
  })
}