import request from '@/utils/request'
// 查询列表
export function tarealist(data) {
  return request({
    url: '/rest/tArea/list',
    method: 'post',
    data
  })
}
// 编辑
export function tareaedit(data) {
  return request({
    url: '/rest/tArea/update',
    method: 'post',
    data
  })
}// 新增
export function tareaadd(data) {
  return request({
    url: '/rest/tArea/add',
    method: 'post',
    data
  })
}
// 删除
export function tareadelete(data) {
  return request({
    url: '/rest/tArea/delete',
    method: 'post',
    data
  })
}