import request3 from '../../../../utils/request3'
// 设备故障明细查询
export function getDeviceDefaultDetail(data) {
    return request3({
        url: '/rest/PCReport/getDeviceDefaultDetail',
        method: "post",
        data
    })
}