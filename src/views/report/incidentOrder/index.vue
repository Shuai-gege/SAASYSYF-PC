<template>
  <div class="app-container">
    <!-- 查询板块 -->
    <el-row :gutter="24">
      <el-col :span="3">
        <el-select v-model="value11" placeholder="时间" @change="typeTime">
          <el-option
            v-for="item in options8"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-date-picker
          v-model="value"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="time"
        ></el-date-picker>
      </el-col>
      <el-col :span="3">
        <el-select v-model="value2" placeholder="企业" @change="company" v-if="listQuery.uid == 1">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!--  -->
        <el-select v-model="value111" placeholder="企业" @change="company1" v-else>
          <el-option
            v-for="item in options111"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <!-- 建筑 -->
      <el-col :span="3">
        <el-select v-model="value3" multiple placeholder="建筑" @change="jianZhu">
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
        <el-select v-model="value5" placeholder="楼层" :disabled="flag" @change="floorId">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- POI -->
      <el-col :span="3">
        <el-select v-model="value6" placeholder="POI" :disabled="flag" @change="poiId">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="24">
      <!--  -->
      <!-- 事件编号 -->
      <el-col :span="3">
        <el-input v-model="input" placeholder="事件编号"></el-input>
      </el-col>
      <!-- 事件类型 -->
      <el-col :span="3">
        <el-select v-model="value7" placeholder="事件类型" @change="eventTypeId">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 任务状态 -->
      <el-col :span="3">
        <el-select v-model="value8" placeholder="任务状态" @change="taskType">
          <el-option
            v-for="item in options5"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 逾期状态 -->
      <el-col :span="3">
        <el-select v-model="value9" placeholder="逾期状态" @change="delay">
          <el-option
            v-for="item in options6"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="value10" placeholder="报事人" @change="userTask">
          <el-option
            v-for="item in options7"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 报事人 -->
      <el-col :span="3">
        <el-input v-model="userName" placeholder="姓名"></el-input>
      </el-col>
      <!--  -->
      <el-col :span="5">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="excel">导出</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <!-- 展示面板 -->
    <div>
      <el-row>
        <el-col :span="23">
          <el-table :data="tableData" style="width: 100%;" height="600" border v-loading="loading">
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="eventCode" label="事件编号" />
            <el-table-column prop="reporter_name" label="报事人" />
            <el-table-column prop="event_type_name" label="事件类型" />
            <el-table-column prop="report_time" label="报事时间" :formatter="formatDateTime" />
            <el-table-column prop="finish_time" label="结束时间" :formatter="formatDateTime1" />
            <el-table-column prop="weiZhi" label="报事位置" />
            <el-table-column prop="distributeName" label="分配人" :formatter="fenPei" />
            <el-table-column prop="executeName" label="执行人" />
            <el-table-column prop="taskType" label="事件状态" />
            <el-table-column prop="delay" label="逾期状态" />
            <el-table-column prop="zip" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="order(scope)">详情</el-button>
                <!-- <el-button type="text" size="small" @click="order(scope)">二次评分</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="orderList"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
const entityVO = {
  uid: localStorage.getItem('uid'),
  buildingIds: [], //建筑id集合
  companyId: '', //公司id
  delayStatus: '', //逾期状态 2: 已逾期 1:未逾期
  deptId: '', //部门id
  detailEndTime: '', //详情结束时间
  detailStartTime: '', //详情开始时间
  detailUserName: '', //详情人员名称
  endTime: '', //时间结束
  eventCode: '', //事件编号
  eventStatus: '', //事件状态 1: 已结束(全部) 2:已结束（指派部门） 3:已结束（自行处理） 4:已结束（上报事件） 5: 未结束 6: 被合并
  eventTypeId: '', //事件类型ID
  floorId: '', //楼层id
  poiid: '', //房间位置
  startTime: '', //时间开始
  timeStatus: '', //时间状态 1: 报事时间 2: 结束时间
  userName: '', //人名
  userStatus: '1', //人员角色 1: 报事人 2: 分配人 3: 执行人
  page: 1,
  limit: 50
}
import {
  subCompanyList,
  getCompanyDeptByCompanyId,
  getPCReportEventDetailByPage,
  getBuildingLocationFloor,
  getEventTypes,
  getCompanyByUid
} from '@/api/iguard/incidentOrder'
import Pagination from '@/components/Pagination' // Secondary
import { formatTimeToStr } from '@/utils/dateUtil' //处理后台传来的时间
export default {
  components: { Pagination },
  name: 'incidentOrder',
  watch: {
    $route: function(newUrl, oldUrl) {
      if (newUrl.name == 'incident' || oldUrl.name == 'incident') {
        this.listQuery.userStatus = this.$route.params.value10
        this.value10 = this.$route.params.value10
        if (this.$route.params.value11 == undefined) {
          this.listQuery.timeStatus = '1'
        } else {
          this.listQuery.timeStatus = this.$route.params.value11
        }

        this.value11 = this.$route.params.value11
        this.listQuery.userName = this.$route.params.userName
        this.listQuery.detailUserName = this.$route.params.userName
        this.userName = this.$route.params.userName
        this.value = [this.$route.params.startTime, this.$route.params.endTime]

        this.listQuery.detailStartTime = this.$route.params.startTime
        this.listQuery.detailEndTime = this.$route.params.endTime
        this.listQuery.startTime = this.$route.params.startTime
        this.listQuery.endTime = this.$route.params.endTime

        this.listQuery.eventStatus = this.$route.params.value8
        this.value8 = this.$route.params.value8
        this.listQuery.eventCode = this.$route.params.code
        this.input = this.$route.params.code
        if (this.value10 == undefined) {
          this.value10 = '1'
          this.listQuery.userStatus = '1'
        }
        if (this.value11 == undefined) {
          this.value11 = '1'
        }
        if (this.userName == undefined) {
          this.userName = ''
        }
        if (this.value[0] == undefined && this.value[1] == undefined) {
          let time =
            new Date().getFullYear() +
            '-' +
            (new Date().getMonth() + 1) +
            '-' +
            this.p(new Date().getDate())
          this.value = [time, time]
          // 开始时间
          this.listQuery.detailStartTime = time
          // 结束日期
          this.listQuery.detailEndTime = time
        }
        if (this.value8 == undefined) {
          this.value8 = ''
        }

        // ---------------------------------------------------
        if (this.listQuery.userName != '') {
          this.orderList()
        } else {
          this.orderList()
        }
      }
    }
  },
  data() {
    return {
      value: ['2020-06-16', '2020-06-16'], //时间选择
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      loading: true,
      value2: '',
      value111: '',
      value3: [], //建筑多选
      value4: 4.4, //评价星星
      value5: '', //楼层多选
      value6: '', //POI多选
      value7: '', //事件类型
      value8: '', //任务状态
      value9: '', //逾期状态
      value10: '1', //报事人&分配人&执行人
      value11: '1', //时间选择
      options: [], //企业选择
      options111: [], //企业选择
      options1: [], //建筑
      options2: [
        {
          value: '',
          label: '楼层(全部)'
        }
      ], //楼层
      options3: [
        {
          value: '',
          label: '空间位置(全部)'
        }
      ], //POI
      options4: [
        //品牌
        {
          value: '',
          label: '事件类型(全部)'
        }
      ], //事件类型
      options5: [
        {
          value: '',
          label: '事件状态(全部)'
        },
        {
          value: '1',
          label: '已完成(全部)'
        },
        {
          value: '2',
          label: '已完成（验收通过）'
        },
        {
          value: '3',
          label: '已完成（自行处理）'
        },
        {
          value: '4',
          label: '已完成（上报事件）'
        },
        {
          value: '5',
          label: '未完成'
        },
        {
          value: '6',
          label: '被合并'
        }
      ], //任务状态
      options6: [
        {
          value: '',
          label: '逾期状态(全部)'
        },
        {
          value: '2',
          label: '已逾期'
        },
        {
          value: '1',
          label: '未逾期'
        }
      ], //逾期状态
      options7: [
        {
          value: '1',
          label: '报事人'
        },
        {
          value: '2',
          label: '分配&验收人'
        },
        {
          value: '3',
          label: '执行人'
        },
        {
          value: '4',
          label: '无效任务审核人'
        }
      ], //人员选择
      options8: [
        {
          value: '1',
          label: '报事时间'
        },
        {
          value: '2',
          label: '结束时间'
        }
      ], //时间选择
      input: '',
      tableData: [], //详情list
      total: 0, //数据总条数
      listQuery: Object.assign({}, entityVO),
      company_id: '', //公司ID
      userName: '', //报事人
      flag: false, //建筑多选时后面的禁选
      daoChu: false //导出List
    }
  },
  mounted() {
    if (localStorage.getItem('uid') == 1) {
      this.getList()
    } else {
      this.getCompany()
    }
    // ---------------------------------------------------
    this.listQuery.userStatus = this.$route.params.value10
    this.value10 = this.$route.params.value10
    this.listQuery.timeStatus = this.$route.params.value11
    this.value11 = this.$route.params.value11
    this.listQuery.userName = this.$route.params.userName
    this.listQuery.detailUserName = this.$route.params.userName
    this.userName = this.$route.params.userName
    this.value = [this.$route.params.startTime, this.$route.params.endTime]

    console.log(this.value)

    this.listQuery.detailStartTime = this.$route.params.startTime
    this.listQuery.detailEndTime = this.$route.params.endTime
    this.listQuery.startTime = this.$route.params.startTime
    this.listQuery.endTime = this.$route.params.endTime

    this.listQuery.eventStatus = this.$route.params.value8
    this.value8 = this.$route.params.value8
    this.listQuery.eventCode = this.$route.params.code
    this.input = this.$route.params.code
    if (this.value10 == undefined) {
      this.value10 = '1'
      this.listQuery.userStatus = '1'
    }
    if (this.value11 == undefined) {
      this.value11 = '1'
    }
    if (this.userName == undefined) {
      this.userName = ''
    }
    if (this.value[0] == undefined && this.value[1] == undefined) {
      let time =
        new Date().getFullYear() +
        '-' +
        (new Date().getMonth() + 1) +
        '-' +
        this.p(new Date().getDate())
      this.value = [time, time]
      // 开始时间
      this.listQuery.detailStartTime = time
      // 结束日期
      this.listQuery.detailEndTime = time
    }
    if (this.value8 == undefined) {
      this.value8 = ''
    }

    // ---------------------------------------------------
    if (this.listQuery.userName != '') {
      this.orderList()
    } else {
      this.orderList()
    }

    this.getTypeEvent()
    this.listQuery.timeStatus = this.value11
  },
  methods: {
    // 时间格式化
    formatDateTime(row, column) {
      return formatTimeToStr(row.report_time, 'yyyy-MM-dd hh:mm:ss')
    },
    // 时间格式化
    formatDateTime1(row, column) {
      if (row.finish_time == null) {
        if (row.eventStatus == 2) {
          return formatTimeToStr(row.report_time, 'yyyy-MM-dd hh:mm:ss')
        } else {
          return ''
        }
      } else {
        return formatTimeToStr(row.finish_time, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    // 分配人
    fenPei(row, column) {
      if (row.disposalType == 2) {
        return '-'
      } else {
        return row.distributeName
      }
      console.log(row)
      console.log(column)
    },
    // 查询当前人的公司
    async getCompany() {
      try {
        const res = await getCompanyByUid(localStorage.getItem('uid'))
        console.log(res)
        this.options111.push(res.result)
        this.options111.forEach(item => {
          this.$set(item, 'label', item.name)
          this.$set(item, 'value', item.id)
        })
        this.value111 = res.result.id
        this.companyDept(this.value111)
        console.log(this.options111)
      } catch (e) {
        console.log(e)
      }
    },
    // 查询list
    async orderList() {
      this.loading = true
      try {
        console.log(this.listQuery)
        const res = await getPCReportEventDetailByPage(this.listQuery)
        this.tableData = res.result.rows
        this.total = res.result.records
        this.tableData.forEach(item => {
          if (item.eventStatus == 1) {
            this.$set(item, 'taskType', '未完成')
          } else {
            this.$set(item, 'taskType', '已完成')
          }

          if (item.delayStatus == 1) {
            this.$set(item, 'delay', '未逾期')
          } else {
            this.$set(item, 'delay', '已逾期')
          }
          if (
            item.building_name != null &&
            item.floor_name != null &&
            item.location_name != null
          ) {
            this.$set(
              item,
              'weiZhi',
              item.building_name +
                '/' +
                item.floor_name +
                '/' +
                item.location_name
            )
          } else if (
            item.building_name != null &&
            item.floor_name != null &&
            item.location_name == null
          ) {
            this.$set(
              item,
              'weiZhi',
              item.building_name + '/' + item.floor_name
            )
          } else if (
            item.building_name != null &&
            item.floor_name == null &&
            item.location_name == null
          ) {
            this.$set(item, 'weiZhi', item.building_name)
          }
          this.$set(
            item,
            'kaiShiDay',
            formatTimeToStr(item.report_time, 'yyyy-MM-dd')
          )
          this.$set(
            item,
            'kaiShiTime',
            formatTimeToStr(item.report_time, 'hh:mm:ss')
          )
          // 自行处理结束时间等于开始时间
          if (item.finish_time == null) {
            if (item.eventStatus == 2) {
              this.$set(
                item,
                'endDay',
                formatTimeToStr(item.report_time, 'yyyy-MM-dd')
              )
              this.$set(
                item,
                'endTime',
                formatTimeToStr(item.report_time, 'hh:mm:ss')
              )
            } else {
              return this.$set(item, 'endTime', '')
            }
          } else {
            this.$set(
              item,
              'endTime',
              formatTimeToStr(item.finish_time, 'yyyy-MM-dd hh:mm:ss')
            )
          }
          // 自行处理分配人为空
          if (item.disposalType == 2) {
            this.$set(item, 'distributeName', '')
            this.$set(item, 'executeName', item.reporter_name)
          }
          // 上报事件，退回事件都没执行人
          if (
            item.eventStatusNow == 16 ||
            item.eventStatusNow == 5 ||
            item.eventStatusNow == 17 ||
            item.eventStatusNow == 11 ||
            item.eventStatusNow == 12 ||
            item.eventStatusNow == 7
          ) {
            this.$set(item, 'executeName', '-')
          }
        })
        this.loading = false
        if (this.daoChu) {
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require('../../../api/iguard/excel/Export2Excel')
            const tHeader = [
              '事件编号',
              '报事人',
              '事件类型',
              '报事日期',
              '报事时间',
              '结束日期',
              '结束时间',
              '报事位置',
              '分配人',
              '执行人',
              '事件状态',
              '逾期状态'
            ]
            const filterVal = [
              'eventCode',
              'reporter_name',
              'event_type_name',
              'kaiShiDay',
              'kaiShiTime',
              'endDay',
              'endTime',
              'weiZhi',
              'distributeName',
              'executeName',
              'taskType',
              'delay'
            ]
            const list = this.tableData
            const data = this.formatJson(filterVal, list)
            if (
              this.listQuery.detailStartTime != undefined &&
              this.listQuery.detailEndTime != undefined
            ) {
              export_json_to_excel(
                tHeader,
                data,
                '工维事件明细报表' +
                  this.listQuery.detailStartTime +
                  '~' +
                  this.listQuery.detailEndTime
              )
            } else {
              export_json_to_excel(
                tHeader,
                data,
                '工维事件明细报表' +
                  new Date().getFullYear() +
                  '-' +
                  (new Date().getMonth() + 1) +
                  '-' +
                  new Date().getDate()
              )
            }
          })
        }
        this.daoChu = false
      } catch (e) {
        console.log(e)
      }
    },
    // 公司列表
    async getList() {
      try {
        const res = await subCompanyList(localStorage.getItem('uid'))
        console.log(res)
        this.options = res.result
        this.options.forEach(item => {
          this.$set(item, 'label', item.name)
          this.$set(item, 'value', item.id)
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 点击选择公司获取id
    company(value) {
      console.log(value)
      this.company_id = value
      this.listQuery.companyId = value
      this.companyDept(this.company_id)
    },
    company1(value) {
      console.log(value)
      this.company_id = value
      this.listQuery.companyId = value
      this.companyDept(this.value111)
    },
    // 获取公司下面的建筑
    async companyDept(company_id) {
      try {
        const res = await getCompanyDeptByCompanyId(company_id)
        this.options1 = res.result
        this.options1.forEach(item => {
          this.$set(item, 'label', item.locationName)
          this.$set(item, 'value', item.id)
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 获取建筑的信息
    jianZhu(value) {
      console.log(value)
      this.listQuery.buildingIds = value
      let parentId = value.join()
      console.log(parentId)
      this.getFloor(parentId)
      if (value.length > 1) {
        this.flag = true
        this.listQuery.floorId = ''
        this.listQuery.poiid = ''
      } else {
        this.flag = false
      }
    },
    // 查询建筑下楼层&房间
    async getFloor(parentId) {
      try {
        const res = await getBuildingLocationFloor(parentId)
        console.log(res)
        res.result.forEach(item => {
          this.options2.push(item)
          this.$set(item, 'label', item.locationName)
          this.$set(item, 'value', item.id)
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 查询建筑下楼层&房间
    async getFloor1(parentId) {
      try {
        const res = await getBuildingLocationFloor(parentId)
        console.log(res)
        res.result.forEach(item => {
          this.options3.push(item)
          this.$set(item, 'label', item.locationName)
          this.$set(item, 'value', item.id)
        })
      } catch (e) {
        console.log(e)
      }
    },
    floorId(value) {
      this.listQuery.floorId = value
      this.getFloor1(value)
    },
    poiId(value) {
      this.listQuery.poiid = value
    },
    // 获取事件类型
    async getTypeEvent() {
      let obj = { uid: localStorage.getItem('uid') }
      try {
        const res = await getEventTypes(obj)
        res.result.rows.forEach(item => {
          this.options4.push(item)
          this.$set(item, 'label', item.eventType)
          this.$set(item, 'value', item.id)
        })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 获取事件类型id
    eventTypeId(value) {
      console.log(value)
      this.listQuery.eventTypeId = value
    },
    // 详情页面
    order(obj) {
      localStorage.setItem('baseUrl', 'http://47.100.240.228')
      // localStorage.setItem('baseUrl', 'http://bsbx.mallmis.com')
      this.$router.push({
        name: 'orderDetails',
        query: {
          eventStatusNow: obj.row.eventStatus,
          event_id: obj.row.eventId,
          delay: obj.row.delay
        }
      })
      console.log(obj)
    },
    // 时间不够两位数补零
    p(s) {
      return s < 10 ? '0' + s : s
    },
    // 时间
    time(value) {
      // 开始日期
      if (value != null) {
        let startTime = new Date(value[0])
        let YY = startTime.getFullYear()
        let MM = this.p(startTime.getMonth() + 1)
        let DD = this.p(startTime.getDate())
        this.listQuery.detailStartTime = YY + '-' + MM + '-' + DD
        // 结束日期
        let endTime = new Date(value[1])
        let YY1 = endTime.getFullYear()
        let MM1 = this.p(endTime.getMonth() + 1)
        let DD1 = this.p(endTime.getDate())
        this.listQuery.detailEndTime = YY1 + '-' + MM1 + '-' + DD1
      } else {
        this.listQuery.detailEndTime = ''
        this.listQuery.detailStartTime = ''
      }
    },
    typeTime(value) {
      console.log(value)
      this.listQuery.timeStatus = value
    },
    // 事件状态
    taskType(value) {
      console.log(value)
      this.listQuery.eventStatus = value
    },
    // 逾期状态
    delay(value) {
      this.listQuery.delayStatus = value
    },
    // 报事人选择
    userTask(value) {
      this.listQuery.userStatus = value
    },
    // 筛选
    query() {
      this.listQuery.eventCode = this.input
      this.listQuery.detailUserName = this.userName
      this.loading = true
      this.orderList()
    },
    // 导出表格
    excel(res) {
      this.$message({
        message: '数据量较大，请耐心等待！~',
        type: 'warning'
      })
      this.listQuery.limit = 99999999
      this.daoChu = true
      this.orderList()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
<style lang='less' scoped>
.app-container {
  /deep/.el-drawer__body {
    overflow-y: auto;
  }
  .order {
    padding: 10px;
    .title {
      font-size: 13px;
      color: #999;
    }
    .time {
      p {
        border-bottom: 1px solid #ccc;
      }
    }
    .message {
      border-bottom: 1px solid #aaa;
      .img {
        .el-image {
          margin: 0 5px;
        }
      }
    }
    .overMessage {
      border-bottom: 1px solid #aaa;
      .img {
        .el-image {
          margin: 0 5px;
        }
      }
    }
    .check {
      border-bottom: 1px solid #aaa;
      .img {
        .el-image {
          margin: 0 5px;
        }
      }
    }
    .pingJia {
      .xx {
        display: flex;
      }
    }
    .course {
      border-bottom: 1px solid #999;
      .flex_l {
        justify-content: flex-start;
        display: flex;
        align-items: center;
      }
      .name {
        color: #7ac4ff;
      }
      .time {
        color: #999;
      }
    }
  }
}
</style>