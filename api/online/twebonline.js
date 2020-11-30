import request from '@/utils/request'
// 查询生成的表的列表
export function onlineList(data) {
  return request({
    url: '/rest/tWebOnline/list',
    method: 'post',
    data
  })
}
// 删除生成的表的列表
export function deleteOnline(data) {
  return request({
    url: '/rest/tWebOnline/delete',
    method: 'post',
    data
  })
}

// 新增生成的表的列表
export function addOnline(data) {
  return request({
    url: '/rest/tWebOnline/add',
    method: 'post',
    data
  })
}
