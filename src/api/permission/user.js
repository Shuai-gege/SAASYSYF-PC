import request from '@/utils/request'
import request2 from '../../../utils/request2' //巡更接口域名
export function login(data) {
    return request2({
        url: '/rest/user/login',
        method: 'post',
        data
    })
}

export function getInfo() {
    return request2({
        url: '/rest/user/info',
        method: 'get'
    })
}

export function logout() {
    return request2({
        url: '/rest/user/logout',
        method: 'get'
    })
}

export function modifyPwd(data) {
    return request2({
        url: '/rest/user/modifyPwd',
        method: 'post',
        data
    })
}
export function getSMCode(phone) {
    return request2({
        url: '/rest/appUser/getSMCode',
        method: 'get',
        params: {
            phone
        }
    })
}

export function userList(data) {
    return request2({
        url: '/rest/user/list',
        method: 'post',
        data
    })
}
export function adminTransfer(uid, toUserId, openId) {
    return request2({
        url: '/rest/appUser/adminTransfer',
        method: 'get',
        params: {
            uid,
            toUserId,
            openId
        }
    })
}

export function addUser(data) {
    return request2({
        url: '/rest/user/add',
        method: 'post',
        data
    })
}
export function getUserByPhone(tel) {
    return request2({
        url: '/rest/user/getUserByPhone',
        method: 'get',
        params: {
            tel
        }
    })
}
export function updateUser(data) {
    return request2({
        url: `/rest/user/update`,
        method: 'post',
        data
    })
}

export function updateState(data) {
    return request2({
        url: '/rest/user/updateState',
        method: 'post',
        data
    })
}