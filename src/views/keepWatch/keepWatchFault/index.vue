<template>
  <div class="app-container">
    <!-- 筛选 -->
    <el-row :gutter="24">
      <!-- 时间选项 -->
      <el-col :span="5.5">
        <el-date-picker
          v-model="value"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="time"
          :clearable="false"
        ></el-date-picker>
      </el-col>
      <!-- 选择企业 -->
      <el-col :span="3">
        <el-select v-model="value5" filterable placeholder="请选择企业" @change="company">
          <el-option
            v-for="item in options5"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 设备类型 -->
      <el-col :span="3">
        <el-select v-model="value1" placeholder="请选择类型" @change="type">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 建筑 -->
      <el-col :span="3">
        <el-select v-model="value2" placeholder="请选择建筑" @change="location">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 楼层 -->
      <el-col :span="3">
        <el-select v-model="value3" placeholder="请选择楼层" @change="floor">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 设备名称 -->
      <el-col :span="3">
        <el-input v-model="value4" placeholder="输入设备名称"></el-input>
      </el-col>
      <!-- 按钮 -->
      <el-col :span="4">
        <el-button type="primary" @click="check">查询</el-button>
        <el-button type="primary">导出</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <!-- 展示list -->
    <div>
      <el-table :data="tableData" style="width: 100%;" height="600" border v-loading="loading">
        <el-table-column width="50" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index+(listQuery1.page) * listQuery1.pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceName" label="故障设备名" />
        <el-table-column prop="typeName" label="类型" />
        <el-table-column prop="modelName" label="型号" />
        <el-table-column prop="completePatrolEvents" label="位置" :formatter="weiZhi" />
        <el-table-column prop="signTime" label="故障提交时间" :formatter="formatting" />
        <el-table-column prop="executeName" label="故障提交人" />
        <el-table-column prop="itemStr" label="检查参数详情" :formatter="canShu" />
        <el-table-column prop="checkRemark" label="故障描述" />
        <el-table-column prop="deviceImg" label="故障照片">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.deviceImg"
              :preview-src-list="scope.row.deviceImg.split(',')"
            ></el-image>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery1.page"
        :limit.sync="listQuery1.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import {
  getCompanyBuildingLocation,
  getBuildingLocationFloor
} from '@/api/iguard/tbbuildinglocation/tbbuildinglocation'
import { getDeviceDefaultDetail } from '@/api/iguard/keepWatchFault'
import { companyDictListByType } from '@/api/permission/dict'
import { subCompanyList, getCompanyByUid } from '@/api/iguard/incidentOrder' //查询所有企业
import Pagination from '@/components/Pagination' // Secondary
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        uid: localStorage.getItem('uid'),
        companyId: localStorage.getItem('deptid'),
        page: 1,
        limit: 50,
        deviceName: '',
        buildingId: undefined,
        floorId: undefined
      },
      listQuery1: {
        page: 0,
        pageSize: 50,
        uid: localStorage.getItem('uid')
      },
      total: 0,
      loading: true,
      tableData: [],
      value: [new Date(), new Date()], //时间选择框
      options: [], //设备类型
      value1: '', //设备类型
      options1: [], //建筑
      value2: '', //建筑
      options2: [], //楼层
      value3: '', //楼层
      value4: '', //设备名称
      options5: [], //企业
      value5: '' //企业
    }
  },
  mounted() {
    this.newTime([new Date(), new Date()])
    if (localStorage.getItem('uid') == 1) {
      this.getList1()
    } else {
      this.getCompany()
    }
    this.getBuildings()
    this.getDeviceTypes()
  },
  methods: {
    // 公司列表
    async getList1() {
      try {
        const res = await subCompanyList(localStorage.getItem('uid'))
        console.log(res)
        this.options5 = res.result
        this.options5.forEach(item => {
          this.$set(item, 'label', item.name)
          this.$set(item, 'value', item.id)
        })
        this.getList()
      } catch (e) {
        console.log(e)
      }
    },
    // 查询当前人的公司
    async getCompany() {
      try {
        const res = await getCompanyByUid(localStorage.getItem('uid'))
        console.log(res)
        this.options5.push(res.result)
        this.options5.forEach(item => {
          this.$set(item, 'label', item.name)
          this.$set(item, 'value', item.id)
        })
        this.value5 = res.result.id
        this.listQuery1.companyId = res.result.id
        this.getList()
      } catch (e) {
        console.log(e)
      }
    },
    // 获取公司ID
    company(val) {
      this.listQuery1.companyId = val
    },
    //转换时间不够10前面补0
    p(s) {
      return s < 10 ? '0' + s : s
    },
    // 时间处理
    time(val) {
      console.log(val)
      let startTime = new Date(val[0])
      let FF = startTime.getFullYear()
      let MM = this.p(startTime.getMonth() + 1)
      let DD = this.p(startTime.getDate())
      this.listQuery1.startTime = FF + '-' + MM + '-' + DD + ' 00:00:00'
      let endTime = new Date(val[1])
      let FF1 = endTime.getFullYear()
      let MM1 = this.p(endTime.getMonth() + 1)
      let DD1 = this.p(endTime.getDate())
      this.listQuery1.endTime = FF1 + '-' + MM1 + '-' + DD1 + ' 23:59:59'
    },
    // 时间处理
    newTime(val) {
      console.log(val)
      let startTime = new Date(val[0])
      let FF = startTime.getFullYear()
      let MM = this.p(startTime.getMonth() + 1)
      let DD = this.p(startTime.getDate())
      this.listQuery1.startTime = FF + '-' + MM + '-' + DD + ' 00:00:00'
      let endTime = new Date(val[1])
      let FF1 = endTime.getFullYear()
      let MM1 = this.p(endTime.getMonth() + 1)
      let DD1 = this.p(endTime.getDate())
      this.listQuery1.endTime = FF1 + '-' + MM1 + '-' + DD1 + ' 23:59:59'
    },
    formatting(row, column) {
      let startTime = new Date(row.signTime)
      let FF = startTime.getFullYear()
      let MM = this.p(startTime.getMonth() + 1)
      let DD = this.p(startTime.getDate())
      let HH = this.p(startTime.getHours())
      let fen = this.p(startTime.getMinutes())
      let SS = this.p(startTime.getSeconds())
      return FF + '-' + MM + '-' + DD + ' ' + HH + ':' + fen + ':' + SS
    },
    weiZhi(row, column) {
      return row.buildingName + '/' + row.floorName
    },
    canShu(row, column) {
      return row.itemStr.replace(/,/g, '\n,')
    },
    async getList() {
      this.listQuery1.page = 0
      try {
        const res = await getDeviceDefaultDetail(this.listQuery1)
        console.log(res)
        this.total = res.count
        this.tableData = res.data
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    },
    async getDeviceTypes() {
      this.listLoading = true
      try {
        const res = await companyDictListByType(
          'device_type',
          localStorage.getItem('deptid')
        )
        this.options = res.data
        this.options.forEach(item => {
          this.$set(item, 'value', item.dataKey)
          this.$set(item, 'label', item.dataValue)
        })
      } catch (e) {
        console.log(e)
      }
    },
    async getBuildings() {
      try {
        const res = await getCompanyBuildingLocation()
        console.log('下面是位置')
        console.log(res)
        this.options1 = res.result
        this.options1.forEach(item => {
          this.$set(item, 'value', item.id)
          this.$set(item, 'label', item.locationName)
        })
      } catch (err) {
        console.log(err)
      }
    },
    async getFloors(vId) {
      try {
        const res = await getBuildingLocationFloor(vId)
        this.options2 = res.result
        this.options2.forEach(item => {
          this.$set(item, 'value', item.id)
          this.$set(item, 'label', item.locationName)
        })
      } catch (err) {
        console.log(err)
      }
    },
    check() {
      this.listQuery1.deviceName = this.value4
      this.getList()
    },
    location(val) {
      console.log(val)
      this.listQuery1.buildingId = val
      this.getFloors(val)
    },
    floor(val) {
      this.listQuery1.floorId = val
    },
    type(val) {
      this.listQuery1.deviceTypeId = val
    }
  }
}
</script>
<style lang='less' scoped>
.app-container {
  // element-ui表格换行css，内容必须加\n
  /deep/.el-table .cell {
    white-space: pre-line;
  }
}
</style>