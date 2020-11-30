import request from '@/utils/request'

export function deviceList(data) {
  return request({
    url: '/rest/deviceInfo/list',
    method: 'post',
    data
  })
}

export function exportQR(data) {
  return request({
    url: '/rest/deviceInfo/exportQR',
    method: 'post',
    data
  })
}

export function addDevice(data) {
  return request({
    url: '/rest/deviceInfo/add',
    method: 'post',
    data
  })
}

export function updateDevice(data) {
  return request({
    url: `/rest/deviceInfo/update`,
    method: 'post',
    data
  })
}

export function deleteDevice(id) {
  return request({
    url: `/rest/deviceInfo/delete`,
    method: 'get',
    params: { id }
  })
}


export function deviceCheckList(data) {
  return request({
    url: '/rest/deviceCheck/list',
    method: 'post',
    data
  })
}

export function deviceCheckDetailRestList(data) {
  return request({
    url: '/rest/deviceCheckDetail/list',
    method: 'post',
    data
  })
}





