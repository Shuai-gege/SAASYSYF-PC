import request from '@/utils/request'
import request3 from '../../../../utils/request3'

export function deviceList(data) {
    return request3({
        url: '/rest/deviceInfo/list',
        method: 'post',
        data
    })
}
// 给设备添加检查项
export function checkAddDevice(companyId) {
    return request3({
        url: '/rest/checkTask/checkAddDevice',
        method: 'get',
        params: {
            companyId
        }
    })
}
// 判断是否有权限新增超过10条
export function addInspectionItemsByDeviceId(data) {
    return request3({
        url: '/rest/deviceInfo/addInspectionItemsByDeviceId',
        method: 'post',
        data
    })
}
// 查询添加的检查项
export function getInspectionItemsByDeviceId(deviceId) {
    return request3({
        url: '/rest/deviceInfo/getInspectionItemsByDeviceId',
        method: 'get',
        params: {
            deviceId
        }
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
    return request3({
        url: '/rest/deviceInfo/addDevice',
        method: 'post',
        data
    })
}

export function updateDevice(data) {
    return request3({
        url: `/rest/deviceInfo/editDevice`,
        method: 'post',
        data
    })
}

export function deleteDevice(id) {
    return request3({
        url: `/rest/deviceInfo/delete`,
        method: 'get',
        params: {
            id
        }
    })
}


export function deviceCheckList(data) {
    return request({
        url: '/rest/newDeviceCheck/list',
        // url: '/rest/deviceCheck/list',
        method: 'post',
        data
    })
}

export function deviceCheckDetailRestList(data) {
    return request({
        url: '/rest/newDeviceCheck/detailList',
        // url: '/rest/deviceCheckDetail/list',
        method: 'post',
        data
    })
}

export function deviceCheckListExport(data) {
    return request({
        url: '/rest/deviceCheck/export',
        method: 'post',
        data
    })
}