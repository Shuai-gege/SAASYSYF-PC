import request from '@/utils/request'
import request2 from '../../../utils/request2' //巡更接口域名
export function departments() {
    return request2({
        url: '/rest/department/all',
        method: 'get'
    })
}

export function subDepartments() {
    return request2({
        url: '/rest/department/subDept',
        method: 'get'
    })
}


export function subDeptByDeptId(deptId) {
    return request2({
        url: '/rest/department/subDeptByDeptId',
        method: 'get',
        params: {
            deptId
        }
    })
}


export function companySubDeptList() {
    return request2({
        url: '/rest/department/companySubDeptList',
        method: 'get',
    })
}

export function subCompanyList() {
    return request2({
        url: '/rest/department/subCompanyList',
        method: 'get'
    })
}

export function addDpartment(data) {
    return request2({
        url: '/rest/department/add',
        method: 'post',
        data
    })
}

export function addCompany(data) {
    return request({
        url: '/rest/department/companyAdd',
        method: 'post',
        data
    })
}

export function addTopCompany(data) {
    return request({
        url: '/rest/department/topCompanyAdd',
        method: 'post',
        data
    })
}

export function updateDpartment(data) {
    return request({
        url: `/rest/department/update`,
        method: 'post',
        data
    })
}
export function deleteDpartment(id) {
    return request({
        url: '/rest/department/delete',
        method: 'get',
        params: {
            id
        }
    })
}
export function deptSubDept() {
    return request2({
        url: '/rest/department/deptSubDept',
        method: 'get',
    })
}