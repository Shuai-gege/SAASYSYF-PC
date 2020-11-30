import request from '@/utils/request'
import request3 from '../../../utils/request3'
export function dictList(data) {
    return request({
        url: '/rest/dict/list',
        method: 'post',
        data
    })
}


export function companyDictListByType(type, companyId) {
    return request3({
        url: `/rest/dict/companyDictListByType`,
        method: 'get',
        params: {
            type,
            companyId
        }
    })
}


export function dictInfo(type) {
    return request({
        url: `/rest/dict/info`,
        method: 'get',
        params: {
            type
        }
    })
}

export function addDict(data) {
    return request({
        url: '/rest/dict/add',
        method: 'post',
        data
    })
}

export function updateDict(data) {
    return request({
        url: `/rest/dict/update`,
        method: 'post',
        data
    })
}

export function deleteDict(id) {
    return request3({
        url: `/rest/dict/delete`,
        method: 'get',
        params: {
            id
        }
    })
}

export function addDeviceDic(data) {
    return request3({
        url: `/rest/dict/addDeviceDic`,
        method: 'post',
        data
    })
}

export function updateDeviceDic(data) {
    return request3({
        url: `/rest/dict/updateDeviceDic`,
        method: 'post',
        data
    })
}