import request from '@/utils/request'
// 查询列表
export function tagconflist(data) {
  return request({
    url: '/rest/tagConf/list',
    method: 'post',
    data
  })
}
// 编辑
export function tagconfedit(data) {
  return request({
    url: '/rest/tagConf/update',
    method: 'post',
    data
  })
}// 新增
export function tagconfadd(data) {
  return request({
    url: '/rest/tagConf/add',
    method: 'post',
    data
  })
}
// 删除
export function tagconfdelete(data) {
  return request({
    url: '/rest/tagConf/delete',
    method: 'post',
    data
  })
}