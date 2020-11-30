import request from '@/utils/request'
import request2 from '../../../../utils/request2'
// 查询列表
export function tbbuildinglocationlist(data) {
    return request2({
        url: '/rest/buildingLocation/list',
        method: 'post',
        data
    })
}

export function companyBuildingLocationList(data) {
    return request2({
        url: 'POST /rest/buildingLocation/companyBuildingLocationList',
        method: 'post',
        data
    })
}

// 编辑
export function tbbuildinglocationedit(data) {
    return request({
        url: '/rest/tbBuildingLocation/update',
        method: 'post',
        data
    })
} // 新增
export function tbbuildinglocationadd(data) {
    return request2({
        url: '/rest/buildingLocation/add',
        method: 'post',
        data
    })
}
// 删除
export function tbbuildinglocationdelete(data) {
    return request2({
        url: '/rest/buildingLocation/removeBuildingById',
        method: 'post',
        data
    })
}
//查看当前登录人所属公司所有建筑
export function getCompanyDept(uid) {
    return request2({
        url: '/rest/buildingLocation/getCompanyDept',
        method: 'get',
        params: {
            uid
        }
    })
}


//查看当前登录人所属公司所有建筑
export function getCompanyBuildingLocation() {
    return request({
        url: '/rest/tbBuildingLocation/getCompanyBuildingLocation',
        method: 'get'
    })
}


//查看建筑楼层
export function getBuildingLocationFloor(parentId) {
    return request2({
        url: '/rest/buildingLocation/getBuildingLocationFloor',
        method: 'get',
        params: {
            parentId
        }
    })
}