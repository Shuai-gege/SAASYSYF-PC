import request from '../../../../utils/request1'
import request1 from '@/utils/request'
import request2 from '../../../../utils/request2'
// 获取当前人的公司
export function getCompanyByUid(uid) {
    return request1({
        url: "/rest/department/getCompanyByUid",
        method: "get",
        params: {
            uid
        }
    })
}
// 查询公司下的建筑
export function getCompanyDeptByCompanyId(company_id) {
    return request2({
        url: "/rest/buildingLocation/getCompanyDeptByCompanyId",
        method: "get",
        params: {
            company_id
        }
    })
}
// 查询某建筑下楼层或者房间
export function getBuildingLocationFloor(parentId) {
    return request2({
        url: "/rest/buildingLocation/getBuildingLocationFloor",
        method: "get",
        params: {
            parentId
        }
    })
}
//查询巡更点列表
export function getPatrolPointList(data) {
    return request({
        url: "/rest/patrolPoint/getPatrolPointList",
        method: "post",
        data
    })
}
//新增巡更点
export function add(data) {
    return request({
        url: "/rest/patrolPoint/add",
        method: "post",
        data
    })
}
// 启用禁用
export function stopOrStart(id, uid) {
    return request({
        url: "/rest/patrolPoint/stopOrStart",
        method: "get",
        params: {
            id,
            uid
        }
    })
}
//删除巡更点
export function remove(id, uid) {
    return request({
        url: "/rest/patrolPoint/remove",
        method: "get",
        params: {
            id,
            uid
        }
    })
}
//编辑巡更点
export function modify(data) {
    return request({
        url: "/rest/patrolPoint/modify",
        method: "post",
        data
    })
}
// 巡更点默认设置
export function saveOrModify(data) {
    return request({
        url: "/rest/patrolDefaultConfig/saveOrModify",
        method: "post",
        data
    })
}
// 查看巡更点是否重复
export function patrolPointRepeat(data) {
    return request({
        url: "/rest/patrolPoint/patrolPointRepeat",
        method: "post",
        data
    })
}

// 巡更点默认配置
export function getPatrolPointDefault(companyId) {
    return request({
        url: "/rest/patrolDefaultConfig/getPatrolPointDefault",
        method: "get",
        params: {
            companyId
        }
    })
}