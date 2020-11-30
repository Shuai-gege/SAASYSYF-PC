import request from '@/utils/request'
// 查询列表
export function tgatewaymodellist(data) {
  return request({
    url: '/rest/tGatewayModel/list',
    method: 'post',
    data
  })
}
// 编辑
export function tgatewaymodeledit(data) {
  return request({
    url: '/rest/tGatewayModel/update',
    method: 'post',
    data
  })
}// 新增
export function tgatewaymodeladd(data) {
  return request({
    url: '/rest/tGatewayModel/add',
    method: 'post',
    data
  })
}
// 删除
export function tgatewaymodeldelete(data) {
  return request({
    url: '/rest/tGatewayModel/delete',
    method: 'post',
    data
  })
}