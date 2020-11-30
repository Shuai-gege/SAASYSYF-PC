<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="10">
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
        <el-select v-model="value2" placeholder="分类" @change="fenLei">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="value3" placeholder="品牌" @change="paiZi">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input v-model="input" placeholder="名称"></el-input>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="excel">导出</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <!-- 展示区域 -->
    <div>
      <el-row>
        <el-col :span="23">
          <el-table :data="tableData" style="width: 100%;" height="550" border v-loading="loading">
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="materialTypeName" label="分类" />
            <el-table-column prop="materialBrandName" label="品牌" />
            <el-table-column prop="materialName" label="物料名称" />
            <el-table-column prop="useNumber" label="使用数量" sortable :sort-method="paiXu" />
            <el-table-column prop="materialUnit" label="单位" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="aa(scope)">详情</el-button>
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
        </el-col>
      </el-row>
    </div>
    <!-- 物料详情 -->
    <div>
      <el-dialog title="物料使用详情" :visible.sync="drawer" width="70%">
        <el-row>
          <el-col :span="23">
            <el-table :data="tableData1" style="width: 100%;" height="550" border>
              <el-table-column width="50" label="序号">
                <template slot-scope="scope">
                  <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="useTime" label="时间" />
              <el-table-column prop="checkUserName" label="使用确认人" />
              <el-table-column prop="useNumber" label="使用数量" />
              <el-table-column prop="eventCode" label="事件编号">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="bb(scope)">{{scope.row.eventCode}}</el-button>
                </template>
              </el-table-column>
              <pagination
                v-show="total1>0"
                :total="total1"
                :page.sync="listQuery1.page"
                :limit.sync="listQuery1.limit"
                @pagination="orderList"
              />
            </el-table>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
const entityVO = {
  uid: localStorage.getItem('uid'),
  endTime: '', //结束时间
  limit: 50,
  materialBrandId: '', //物料品牌ID
  materialId: '', //物料ID
  materialName: '', //物料名称
  materialTypeId: '', //物料分类ID
  page: 1,
  startTime: '' //开始时间
}
import {
  getPCMaterialReport,
  getMaterialReportDetail,
  tbMaterialsTypeList,
  tbMaterialsBrandList
} from '@/api/iguard/material'
import Pagination from '@/components/Pagination' // Secondary
export default {
  components: { Pagination },
  name: 'material',
  watch: {
    // $route: function(newUrl, oldUrl) {
    //   console.log(newUrl)
    //   console.log(oldUrl)
    // }
  },
  data() {
    return {
      value: '', //时间选择
      drawer: false, //物料详情
      innerDrawer: false, //物料详情
      options: [
        //分类
        {
          value: '',
          label: '全部(分类)'
        }
      ],
      value2: '',
      input: '',
      options1: [
        //品牌
        {
          value: '',
          label: '全部(品牌)'
        }
      ],
      value3: '',
      tableData: [], //物料使用列表
      tableData1: [], //物料使用详情列表
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
      listQuery: Object.assign({}, entityVO),
      listQuery1: Object.assign({}, entityVO),
      total: 0, //总条数
      total1: 0, //物料详情总条数
      startTime: '', //开始时间
      loading: true,
      endTime: '', //结束时间
      materialType: {
        //查询物料/设备类型接口
        uid: localStorage.getItem('uid'),
        id: '', // 物料类型的数据id
        typeName: '' // 物料类型名称
      },
      pinPai: {
        uid: localStorage.getItem('uid'),
        brandName: '',
        id: ''
      }
    }
  },
  mounted() {
    this.listQuery.company_id = localStorage.getItem('deptid')
    this.getList()
    this.materialTypeList()
    this.tbMaterialsBrandList()
    console.log(this.value)
  },
  methods: {
    // 排序方法
    paiXu(a, b) {
      return a.useNumber - b.useNumber
    },
    // 物料list
    async getList() {
      this.loading = true
      try {
        const res = await getPCMaterialReport(this.listQuery)
        this.total = res.result.records
        this.tableData = res.result.rows
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    },
    // 物料使用详情List
    async orderList(order) {
      try {
        order.company_id = localStorage.getItem('deptid')
        const res = await getMaterialReportDetail(order)
        this.total1 = res.result.records
        this.tableData1 = res.result.rows
      } catch (e) {
        console.log(e)
      }
    },
    // 查看物料详情
    aa(value) {
      this.listQuery1.materialId = value.row.materialId
      this.orderList(this.listQuery1)
      this.drawer = true
    },
    // 物料分类
    async materialTypeList() {
      try {
        const res = await tbMaterialsTypeList(this.materialType)
        res.result.rows.forEach(item => {
          this.options.push(item)
          this.$set(item, 'label', item.typeName)
          this.$set(item, 'value', item.id)
        })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 物料品牌
    async tbMaterialsBrandList() {
      try {
        const res = await tbMaterialsBrandList(this.pinPai)
        res.result.rows.forEach(item => {
          this.options1.push(item)
          this.$set(item, 'label', item.brandName)
          this.$set(item, 'value', item.id)
        })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 分类选择
    fenLei(value) {
      console.log(value)
      this.listQuery.materialTypeId = value
      this.listQuery1.materialTypeId = value
    },
    // 品牌选择
    paiZi(value) {
      console.log(value)
      this.listQuery.materialBrandId = value
      this.listQuery1.materialBrandId = value
    },
    //转换时间不够10前面补0
    p(s) {
      return s < 10 ? '0' + s : s
    },
    // 时间控件
    time(value) {
      console.log(value)
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
        console.log(this.startTime)
        console.log(this.endTime)
      }
    },
    // 物{料使用在那个任务里
    bb(value) {
      localStorage.setItem('baseUrl', 'http://47.100.240.228')
      // localStorage.setItem('baseUrl', 'http://bsbx.mallmis.com')
      this.drawer = false
      this.$router.push({
        name: 'orderDetails',
        query: {
          eventStatusNow: 2,
          event_id: value.row.eventId,
          delay: '未逾期'
        }
      })
      // this.innerDrawer = true
    },
    // // 物料详情关闭前确认
    // handleClose(done) {
    //   this.$confirm('确定关闭吗')
    //     .then(_ => {
    //       done()
    //     })
    //     .catch(_ => {})
    // },
    // 导出表格
    excel(res) {
      this.$message({
        message: '数据量较大，请耐心等待！~',
        type: 'warning'
      })
      this.listQuery.limit = 100000
      this.getList()
      setTimeout(() => {
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require('../../../api/iguard/excel/Export2Excel')
          const tHeader = ['分类', '品牌', '物料名称', '使用数量', '单位']
          const filterVal = [
            'materialTypeName',
            'materialBrandName',
            'materialName',
            'useNumber',
            'materialUnit'
          ]
          const list = this.tableData
          const data = this.formatJson(filterVal, list)
          if (this.value == '') {
            export_json_to_excel(
              tHeader,
              data,
              '物料使用报表' +
                new Date().getFullYear() +
                '-' +
                (new Date().getMonth() + 1) +
                '-' +
                new Date().getDate()
            )
          } else {
            export_json_to_excel(
              tHeader,
              data,
              '物料使用报表' +
                this.listQuery.startTime +
                '~' +
                this.listQuery.endTime
            )
          }
        })
      }, 5000)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    query() {
      this.loading = true
      this.listQuery.materialName = this.input
      this.getList()
    }
  }
}
</script>
<style lang='less' scoped>
.app-container {
  .el-col-10 {
    width: 39%;
  }
}
</style>