import request3 from '../../../../utils/request3'


export function addInspectionItem(data) {
    return request3({
        url: '/rest/inspectionItem/addInspectionItem',
        method: 'post',
        data
    })
}
export function list(data) {
    return request3({
        url: '/rest/inspectionItem/list',
        method: 'post',
        data
    })
}
export function editInspectionItem(data) {
    return request3({
        url: '/rest/inspectionItem/editInspectionItem',
        method: 'post',
        data
    })
}