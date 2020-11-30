import request from '@/utils/request'
import request2 from '../../../utils/request2' //巡更接口域名
export function permissions() {
    return request({
        url: '/rest/permission/all',
        method: 'get'
    })
}


export function subPermissions() {
    return request({
        url: '/rest/permission/subPermission',
        method: 'get'
    })
}

export function permissionsByRole(data) {
    return request({
        url: `/rest/permission/allByRole/${data}`,
        method: 'get'
    })
}

export function addPermission(data) {
    return request({
        url: '/rest/permission/add',
        method: 'post',
        data
    })
}

export function updatePermission(data) {
    return request({
        url: `/rest/permission/update`,
        method: 'post',
        data
    })
}
export function deletePermission(id) {
    return request({
        url: `/rest/permission/delete`,
        method: 'get',
        params: {
            id
        }
    })
}
export function updateVisualizedConfig(permIds) {
    return request2({
        url: `/rest/user/updateVisualizedConfig`,
        method: 'get',
        params: {
            permIds
        }
    })
}
export function getVisualizedConfigById() {
    return request2({
        url: `/rest/user/getVisualizedConfigById`,
        method: 'get',

    })
}