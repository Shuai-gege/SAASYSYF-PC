<template>
  <div class="app-container">
    <div style="margin-top:20px;margin-bottom: 20px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-date-picker
            v-model="listQuery.checkTime"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-col>

        <el-col :span="4">
          <el-select v-model="listQuery.type" placeholder="分配人" clearable>
            <el-option
              v-for="item in assignerList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.userName"></el-input>
        </el-col>

        <el-col :span="4">
          <el-select v-model="listQuery.checkStatus" placeholder="任务状态" clearable>
            <el-option
              v-for="item in checkStatusList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-button
            v-permission="['/rest/deviceInfo/list']"
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >查找</el-button>

          <el-button
            v-permission="['/rest/deviceInfo/exportQR']"
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            @click="handleDownload"
          >导出</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%;"
      height="600"
    >
      <el-table-column width="50" label="序号">
        <template slot-scope="scope">
          <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="checkNo" label="事件编号" />

      <el-table-column prop="checkTime" label="点检任务时间" :formatter="formatCheckTime" />

      <el-table-column prop="examinerName" label="分配人" />

      <el-table-column prop="assignerName" label="点检人" />

      <el-table-column prop="checkStatus" label="任务状态" :formatter="formatCheckStatus" />

      <el-table-column prop="isError" label="异常设备数量" />

      <el-table-column prop="score" label="任务评分" />

      <el-table-column prop="deviceNum" label="已检设备/总设备数" :formatter="formatDeviceNum" />

      <el-table-column prop="overdue" label="逾期状态" :formatter="formatDeviceOverdue" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="infoDetail(scope)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog :visible.sync="dialogVisible" title="详情">
      <el-tag type="warning">未点检设备</el-tag>
      <el-table
        :key="unCheckTableKey"
        v-loading="listLoading"
        :data="unCheckList"
        border
        style="width: 100%;"
      >
        <el-table-column width="50" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="设备名" />
        <el-table-column prop="typeName" label="设备类型" />
        <el-table-column prop="deviceModel" label="设备位置" :formatter="formatAddress" />
        <el-table-column prop="checkTime1" label="点检时间" />
        <el-table-column prop="deviceStatus1" label="设备状态" :formatter="formatDeviceStatus" />
        <el-table-column prop="checkRemark1" label="点检描述" />
        <el-table-column prop="checkImgUrl1" label="点检照片" />
      </el-table>
      <pagination
        v-show="total1>0"
        :total="total1"
        :page.sync="listQuery1.page"
        :limit.sync="listQuery1.limit"
        @pagination="getDetail1"
      />

      <el-tag>已点检设备</el-tag>
      <el-table
        :key="checkTableKey"
        v-loading="listLoading"
        :data="checkList"
        border
        style="width: 100%;"
      >
        <el-table-column width="50" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="设备名" />
        <el-table-column prop="typeName" label="设备类型" />
        <el-table-column prop="deviceModel" label="设备位置" :formatter="formatAddress" />
        <el-table-column prop="checkTime" label="点检时间" />
        <el-table-column prop="deviceStatus" label="设备状态" :formatter="formatDeviceStatus" />
        <el-table-column prop="checkRemark" label="点检描述" />
        <el-table-column prop="checkImg" label="点检照片">
          <template slot-scope="scope">
            <div>
              <el-image
                v-for="item in (scope.row.checkImg ? scope.row.checkImg.split(',') : [])"
                :key="item"
                style="width: 100px; height: 100px"
                :src="item"
                :preview-src-list="scope.row.checkImg ? scope.row.checkImg.split(',') : []"
              ></el-image>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total2>0"
        :total="total2"
        :page.sync="listQuery2.page"
        :limit.sync="listQuery2.limit"
        @pagination="getDetail2"
      />
    </el-dialog>
  </div>
</template>
<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import {
  deviceCheckList,
  deviceCheckDetailRestList,
  deviceCheckListExport
} from '@/api/iguard/device/device'

import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { deepClone } from '@/utils'
import { formatDateTime } from '@/utils'

export default {
  name: 'DeviceCheckInfo',
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      tableKey: 0,
      unCheckTableKey: 1,
      checkTableKey: 2,
      list: null,
      unCheckList: null,
      checkList: null,
      total: 0,
      total1: 0,
      total2: 0,
      assignerList: [
        { key: '1', value: '点检人' },
        { key: '2', value: '分配人' }
      ],
      checkStatusList: [
        { id: '0', title: '未完成' },
        { id: '1', title: '已点检未评分' },
        { id: '2', title: '已完成' }
      ],
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 50,
        userName: '',
        type: '1',
        checkTime: undefined
      },
      listQuery1: {
        page: 1,
        limit: 50
      },
      listQuery2: {
        page: 1,
        limit: 50
      },
      dialogVisible: false,
      currentItem: {}
    }
  },
  created() {
    this.getList()
  },

  methods: {
    async getList() {
      this.listLoading = true
      let params = {
        comanyId: localStorage.getItem('deptid'),
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        name: this.listQuery.name,
        type: this.listQuery.type,
        userName: this.listQuery.userName,
        startTime:
          this.listQuery.checkTime && (this.listQuery.checkTime[0] || ''),
        endTime:
          this.listQuery.checkTime && (this.listQuery.checkTime[1] || ''),
        checkStatus: this.listQuery.checkStatus
      }
      try {
        const res = await deviceCheckList(params)
        this.listLoading = false
        this.list = res.result.rows
        this.total = res.result.records
      } catch (e) {
        this.listLoading = false
      }
    },

    formatCheckTime(row, column) {
      return (
        (row.startTimeToString && row.startTimeToString.slice(0, 16)) +
        '-' +
        (row.endTimeToString && row.endTimeToString.slice(0, 16))
      )
    },

    formatCheckStatus(row, column) {
      if (row.checkStatus == 1) {
        return '已点检未评分'
      } else if (row.checkStatus == 2) {
        return '已完成'
      } else {
        return '未完成'
      }
    },
    formatDeviceOverdue(row, column) {
      if (row.overdue === 1) {
        return '已逾期'
      } else if (row.overdue === 0) {
        return '未逾期'
      } else {
        if (new Date() < new Date(row.endTimeToString)) {
          return '未逾期'
        } else {
          return '已逾期'
        }
      }
    },
    formatDeviceNum(row, column) {
      return row.complete + '/' + row.allDetail
    },

    formatAddress(row, column) {
      return row.buildingName + '/' + row.floorName
    },

    formatDeviceStatus(row, column) {
      if (row.checkStatus == 1) {
        return '正常'
      } else if (row.checkStatus == 2) {
        return '异常'
      } else {
        return '未检点'
      }
    },
    async getDetail1() {
      this.listLoading = true
      // try {
      const unCheckData = {
        comanyId: localStorage.getItem('deptid'),
        deviceCheckId: this.currentItem.id,
        checkStatus: 0,
        page: this.listQuery1.page,
        limit: this.listQuery1.limit
      }

      const unCheckRes = await deviceCheckDetailRestList(unCheckData)
      this.listLoading = false
      this.unCheckList = unCheckRes.result.rows
      this.total1 = unCheckRes.result.records
      // } catch (e) {
      //   this.listLoading = false;
      // }
    },
    async getDetail2() {
      this.listLoading = true
      // try {
      const unCheckData = {
        comanyId: localStorage.getItem('deptid'),
        deviceCheckId: this.currentItem.id,
        checkStatus: 1,
        page: this.listQuery2.page,
        limit: this.listQuery2.limit
      }

      const unCheckRes = await deviceCheckDetailRestList(unCheckData)
      this.listLoading = false
      this.checkList = unCheckRes.result.rows
      this.total2 = unCheckRes.result.records
      // } catch (e) {
      //   this.listLoading = false;
      // }
    },
    infoDetail(scope) {
      this.dialogVisible = true
      this.currentItem = scope.row
      this.getDetail1()
      this.getDetail2()
    },

    handleSearch() {
      this.getList()
    },
    exportExcel(url, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: url, // 请求地址
          data: data, // 参数
          responseType: 'blob', // 表明返回服务器返回的数据类型
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    exportList() {
      window.location.href =
        process.env.VUE_APP_BASE_API_URL +
        '/rest/deviceCheck/export?' +
        this.ooo(this.listQuery)
    },

    ooo(obj) {
      var ary = []
      for (var p in obj)
        if (obj.hasOwnProperty(p) && obj[p]) {
          ary.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
        }
      return ary.join('&')
    },

    formatDateTime(row, column) {
      return formatDateTime(row.timestamp)
    },
    async handleDownload() {
      this.downloadLoading = true
      let params = {
        comanyId: localStorage.getItem('deptid'),
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        name: this.listQuery.name,
        type: this.listQuery.type,
        userName: this.listQuery.userName,
        startTime:
          this.listQuery.checkTime && (this.listQuery.checkTime[0] || ''),
        endTime:
          this.listQuery.checkTime && (this.listQuery.checkTime[1] || ''),
        checkStatus: this.listQuery.checkStatus
      }
      const res = await deviceCheckList(params)
      this.exportList = res.result.rows
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '事件编号',
          '点检任务时间',
          '分配人',
          '点检人',
          '任务状态',
          '异常设备数量',
          '任务评分',
          '已检设备/总设备数',
          '逾期状态'
        ]
        const filterVal = [
          'checkNo',
          'startTimeToString',
          'examinerName',
          'assignerName',
          'checkStatus',
          'isError',
          'score',
          'complete',
          'overdue'
        ]
        const list = this.exportList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '设备检点数量',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'startTimeToString') {
            return v[j].slice(0, 16) + '-' + v['endTimeToString'].slice(0, 16)
          } else if (j === 'checkStatus') {
            return this.formatCheckStatus(v)
          } else if (j === 'complete') {
            return this.formatDeviceNum(v)
          } else if (j === 'overdue') {
            return this.formatDeviceOverdue(v)
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
