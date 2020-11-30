import request from '@/utils/request'
// 查询列表
export function personlist(data) {
  return request({
    url: '/rest/person/list',
    method: 'post',
    data
  })
}
// 编辑
export function personedit(data) {
  return request({
    url: '/rest/person/update',
    method: 'post',
    data
  })
}
// 新增
export function personadd(data) {
  return request({
    url: '/rest/person/add',
    method: 'post',
    data
  })
}
// 删除
export function persondelete(data) {
  return request({
    url: '/rest/person/delete',
    method: 'post',
    data
  })
}
