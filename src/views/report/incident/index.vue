<template>
  <div class="app-container">
    <!-- 查询板块 -->
    <el-row :gutter="24">
      <el-col :span="6">
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
      <!--  -->
      <!-- <el-col :span="3">
        <el-select v-model="value4" placeholder="报事类型" @change="eventId">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>-->
      <!--  -->
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

      <!--  -->
      <el-col :span="5">
        <!-- <el-select v-model="value3" placeholder="部门" @change="dept">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>-->
        <treeselect
          v-model="listQuery.deptid"
          :options="departments"
          :normalizer="normalizer"
          @input="shu"
          placeholder="选择部门"
        />
      </el-col>
      <el-col :span="3">
        <el-input v-model="input" placeholder="姓名"></el-input>
      </el-col>
      <el-col :span="3">
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
            <el-table-column prop="userName" label="姓名" />
            <el-table-column prop="deptName" label="部门" />
            <el-table-column prop="reportEvents" label="报事数" :sortable="true" :sort-method="paiXu">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="order(scope)">{{scope.row.reportEvents}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="completeEventsTotal"
              label="完工数(总)"
              :sortable="true"
              :sort-method="paiXu1"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="order1(scope)"
                >{{scope.row.completeEventsTotal}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="completeEventSelf"
              label="完工数(自行处理)"
              :sortable="true"
              :sort-method="paiXu2"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="order2(scope)"
                >{{scope.row.completeEventSelf}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="completeEventsReport"
              label="完工数(报事事件)"
              :sortable="true"
              :sort-method="paiXu3"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="order3(scope)"
                >{{scope.row.completeEventsReport}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="completeEventsRC"
              label="完工数(日常事件)"
              :sortable="true"
              :sort-method="paiXu4"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="order4(scope)"
                >{{scope.row.completeEventsRC}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="allocationAndChecks"
              label="分配&验收数"
              :sortable="true"
              :sort-method="paiXu5"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="order5(scope)"
                >{{scope.row.allocationAndChecks}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="invalidEvents"
              label="无效上报处理数"
              :sortable="true"
              :sort-method="paiXu6"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="order6(scope)"
                >{{scope.row.invalidEvents}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="scoreTotal" label="评分总值" :sortable="true" :sort-method="paiXu7" />
            <el-table-column prop="scoreAvg" label="评分均值" :sortable="true" :sort-method="paiXu8" />
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  getPCReportEventByPage,
  subCompanyList,
  subDeptByDeptId,
  getCompanyByUid,
  getEventTypes,
  subDepartments
} from '@/api/iguard/incident'
import Pagination from '@/components/Pagination' // Secondary
const entityVO = {
  uid: localStorage.getItem('uid'),
  startTime: '',
  endTime: '',
  companyId: '',
  eventTypeId: '',
  deptId: '',
  userName: '',
  page: 1,
  limit: 50
}
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Pagination, Treeselect },
  name: 'incident',
  data() {
    return {
      value: [
        new Date().getFullYear() +
          '-' +
          (new Date().getMonth() + 1) +
          '-' +
          this.p(new Date().getDate()),
        new Date().getFullYear() +
          '-' +
          (new Date().getMonth() + 1) +
          '-' +
          this.p(new Date().getDate())
      ],
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
      value2: '',
      value3: '',
      value4: '',
      total: 0, //数据总条数
      deptId: '', //公司ID
      options: [], //查询所有公司
      options1: [], //指定公司下所有部门
      options4: [], //事件类型
      input: '',
      tableData: [],
      listQuery: Object.assign({}, entityVO),
      startTime: '', //开始时间
      endTime: '', //结束时间
      companyId: '', //公司ID
      deptId: '', //部门ID
      options111: [], //当前登录人公司
      value111: '', //当前登录人公司id
      loading: true,
      departments: [],
      daoChu: false //请求完成后导出
    }
  },
  mounted() {
    if (localStorage.getItem('uid') == 1) {
      this.companyList()
    } else {
      this.getCompany()
    }
    this.getList()
    this.getTypeEvent()
    // 开始时间
    this.listQuery.startTime =
      new Date().getFullYear() +
      '-' +
      (new Date().getMonth() + 1) +
      '-' +
      this.p(new Date().getDate())
    this.startTime =
      new Date().getFullYear() +
      '-' +
      (new Date().getMonth() + 1) +
      '-' +
      this.p(new Date().getDate())
    // 结束日期
    this.listQuery.endTime =
      new Date().getFullYear() +
      '-' +
      (new Date().getMonth() + 1) +
      '-' +
      this.p(new Date().getDate())
    this.endTime =
      new Date().getFullYear() +
      '-' +
      (new Date().getMonth() + 1) +
      '-' +
      this.p(new Date().getDate())
  },
  methods: {
    shu(value) {
      console.log(value)
      this.listQuery.deptId = value
      console.log(this.listQuery)
    },
    // 查询公司下所有部门
    async getSubDepartments(deptId) {
      const res = await subDepartments(deptId)
      const result = res.result
      console.log(res)
      this.diGuiTree(result)
      this.departments = result
    },
    // 递归便利树结构
    diGuiTree(item) {
      item.forEach(item => {
        item.childrens === '' ||
        item.childrens === undefined ||
        item.childrens === null
          ? delete item.childrens
          : this.diGuiTree(item.childrens)
      })
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.childrens
      }
    },
    // 排序方法报事数
    paiXu(a, b) {
      return a.reportEvents - b.reportEvents
    },
    // 排序方法完工数总
    paiXu1(a, b) {
      return a.completeEventsTotal - b.completeEventsTotal
    },
    // 排序方法完完工数(自行处理)
    paiXu2(a, b) {
      return a.completeEventSelf - b.completeEventSelf
    },
    // 排序方法完工数(报事验收)
    paiXu3(a, b) {
      return a.completeEventsReport - b.completeEventsReport
    },
    // 排序方法完工数(日常分配)
    paiXu4(a, b) {
      return a.completeEventsRC - b.completeEventsRC
    },
    // 排序方法分配&验收
    paiXu5(a, b) {
      return a.allocationAndChecks - b.allocationAndChecks
    },
    // 排序方法无效上报处理数
    paiXu6(a, b) {
      return a.invalidEvents - b.invalidEvents
    },
    // 排序方法评分总值
    paiXu7(a, b) {
      return a.scoreTotal - b.scoreTotal
    },
    // 排序方法评分均值
    paiXu8(a, b) {
      return a.scoreAvg - b.scoreAvg
    },
    //转换时间不够10前面补0
    p(s) {
      return s < 10 ? '0' + s : s
    },
    // 时间
    time(value) {
      if (value != null) {
        // 开始日期
        let startTime = new Date(value[0])
        let YY = startTime.getFullYear()
        let MM = this.p(startTime.getMonth() + 1)
        let DD = this.p(startTime.getDate())
        this.listQuery.startTime = YY + '-' + MM + '-' + DD
        this.startTime = YY + '-' + MM + '-' + DD
        // 结束日期
        let endTime = new Date(value[1])
        let YY1 = endTime.getFullYear()
        let MM1 = this.p(endTime.getMonth() + 1)
        let DD1 = this.p(endTime.getDate())
        this.listQuery.endTime = YY1 + '-' + MM1 + '-' + DD1
        this.endTime = YY1 + '-' + MM1 + '-' + DD1
      } else {
        this.listQuery.endTime = ''
        this.listQuery.startTime = ''
      }
    },
    // 详情页面报事数
    order(obj) {
      this.$router.push({
        name: 'incidentOrder',
        params: {
          userName: obj.row.userName, //人名
          value10: '1', //报事人&分配人&执行人
          startTime: this.startTime, //开始时间
          endTime: this.endTime, //结束时间
          companyId: this.companyId, //公司ID
          value8: '', //事件状态
          value11: '1', //报事开始时间
          deptId: this.deptId //部门ID
        }
      })
    },
    // 详情页面完工数（总）
    order1(obj) {
      this.$router.push({
        name: 'incidentOrder',
        params: {
          userName: obj.row.userName, //人名
          value10: '3', //报事人&分配人&执行人
          startTime: this.startTime, //开始时间
          endTime: this.endTime, //结束时间
          companyId: this.companyId, //公司ID
          deptId: this.deptId, //部门ID
          value11: '2', //报事开始时间
          value8: '1' //事件状态
        }
      })
    },
    // 详情页面完工数（自行处理）
    order2(obj) {
      this.$router.push({
        name: 'incidentOrder',
        params: {
          userName: obj.row.userName, //人名
          value10: '3', //报事人&分配人&执行人
          startTime: this.startTime, //开始时间
          endTime: this.endTime, //结束时间
          companyId: this.companyId, //公司ID
          deptId: this.deptId, //部门ID
          value11: '2', //报事开始时间
          value8: '3' //完工数
        }
      })
    },
    // 详情页面完工数（报事验收）
    order3(obj) {
      this.$router.push({
        name: 'incidentOrder',
        params: {
          userName: obj.row.userName, //人名
          value10: '3', //报事人&分配人&执行人
          startTime: this.startTime, //开始时间
          endTime: this.endTime, //结束时间
          companyId: this.companyId, //公司ID
          deptId: this.deptId, //部门ID
          value11: '2', //报事开始时间
          code: 'BS',
          value8: '2' //完工数
        }
      })
    },
    // 详情页面完工数（日常分配）
    order4(obj) {
      this.$router.push({
        name: 'incidentOrder',
        params: {
          userName: obj.row.userName, //人名
          value10: '3', //报事人&分配人&执行人
          startTime: this.startTime, //开始时间
          endTime: this.endTime, //结束时间
          companyId: this.companyId, //公司ID
          deptId: this.deptId, //部门ID
          value11: '2', //报事开始时间
          code: 'RC',
          value8: '2' //完工数
        }
      })
    },
    // 详情页面分配&验收
    order5(obj) {
      this.$router.push({
        name: 'incidentOrder',
        params: {
          userName: obj.row.userName, //人名
          value10: '2', //报事人&分配人&执行人
          startTime: this.startTime, //开始时间
          endTime: this.endTime, //结束时间
          companyId: this.companyId, //公司ID
          deptId: this.deptId, //部门ID
          value11: '2', //报事开始时间
          value8: '2' //
        }
      })
    },
    // 详情页面无效上报
    order6(obj) {
      this.$router.push({
        name: 'incidentOrder',
        params: {
          userName: obj.row.userName, //人名
          value10: '4', //报事人&分配人&执行人
          startTime: this.startTime, //开始时间
          endTime: this.endTime, //结束时间
          companyId: this.companyId, //公司ID
          deptId: this.deptId, //部门ID
          value11: '2', //报事开始时间
          value8: '4' //完工数
        }
      })
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
    eventId(value) {
      this.listQuery.eventTypeId = value
    },
    // 事件List
    async getList() {
      this.loading = true
      try {
        console.log(this.listQuery)
        const res = await getPCReportEventByPage(this.listQuery)
        console.log(res)
        this.total = res.result.records
        this.tableData = res.result.rows
        this.loading = false
        if (this.daoChu) {
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require('../../../api/iguard/excel/Export2Excel')
            const tHeader = [
              '姓名',
              '部门',
              '报事数',
              '完工数(总)',
              '完工数(自行处理)',
              '完工数(报事验收)',
              '完工数(日常分配)',
              '分配&验收',
              '无效上报处理数',
              '评分总值',
              '评分均值'
            ]
            const filterVal = [
              'userName',
              'deptName',
              'reportEvents',
              'completeEventsTotal',
              'completeEventSelf',
              'completeEventsReport',
              'completeEventsRC',
              'allocationAndChecks',
              'invalidEvents',
              'scoreTotal',
              'scoreAvg'
            ]
            const list = this.tableData
            const data = this.formatJson(filterVal, list)
            if (this.startTime != '' && this.endTime != '') {
              export_json_to_excel(
                tHeader,
                data,
                '工维人员统计报表' + this.startTime + '~' + this.endTime
              )
            } else {
              export_json_to_excel(
                tHeader,
                data,
                '工维人员统计报表' +
                  new Date().getFullYear() +
                  '-' +
                  (new Date().getMonth() + 1) +
                  '-' +
                  new Date().getDate()
              )
            }
          })
          this.daoChu = false
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 查询所有公司
    async companyList() {
      try {
        const res = await subCompanyList(localStorage.getItem('uid'))
        console.log(res)
        this.options = res.result
        this.options.forEach(item => {
          this.$set(item, 'label', item.name)
          this.$set(item, 'value', item.id)
        })
        console.log(res.result.id)
      } catch (e) {
        console.log(e)
      }
    },
    // 点击选择公司获取id
    company(value) {
      console.log(value)
      this.deptId = value
      this.listQuery.companyId = value
      this.companyId = value
      // this.deptid(this.deptId)
      this.getSubDepartments(this.deptId)
    },
    company1(value) {
      console.log(value)
      this.deptId = value
      this.listQuery.companyId = value
      // this.deptid(this.deptId)
      this.getSubDepartments(this.deptId)
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
        this.listQuery.companyId = res.result.id
        // this.deptid(this.value111)
        this.getSubDepartments(this.value111)
      } catch (e) {
        console.log(e)
      }
    },
    // // 根据公司获取下属部门
    // async deptid(deptId) {
    //   try {
    //     const res = await subDeptByDeptId(deptId)
    //     this.options1 = res.result
    //     this.options1.forEach(item => {
    //       this.$set(item, 'label', item.name)
    //       this.$set(item, 'value', item.id)
    //     })
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },
    // 点击选择部门获取id
    // dept(value) {
    //   console.log(value)
    //   this.listQuery.deptId = value
    //   this.deptId = value
    // },
    // 查询
    query() {
      this.listQuery.userName = this.input
      this.loading = true
      this.getList()
      console.log(this.listQuery)
    },
    // 导出表格
    excel(res) {
      this.$message({
        message: '数据量较大，请耐心等待！~',
        type: 'warning'
      })
      this.listQuery.limit = 100000
      this.daoChu = true
      this.getList()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
<style lang='less' scoped>
.box {
  .con {
  }
}
</style>