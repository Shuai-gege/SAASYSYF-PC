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
        ></el-date-picker>
      </el-col>
      <!-- 选择企业 -->
      <el-col :span="3">
        <el-select v-model="value1" placeholder="请选择企业" @change="qiYe">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 选择部门 -->
      <el-col :span="4">
        <treeselect
          v-model="listQuery.deptId"
          :options="departments"
          :normalizer="normalizer"
          @input="shu"
          placeholder="选择部门"
        />
      </el-col>
      <!-- 姓名 -->
      <el-col :span="3">
        <el-input v-model="value2" placeholder="输入姓名"></el-input>
      </el-col>
      <!-- 按钮 -->
      <el-col :span="4">
        <el-button type="primary" @click="check">查询</el-button>
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
                <span>{{ scope.$index+(listQuery.page - 1) * listQuery.pageSize + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="userName" label="姓名" />
            <el-table-column prop="deptName" label="部门" />
            <el-table-column prop="patrolEvents" label="巡更事件数" />
            <el-table-column prop="completePatrolEvents" label="事件完成数" />
            <el-table-column prop="eventCompletePR" label="事件完成率" :formatter="wanChengPR" />
            <el-table-column prop="patrolPointCount" label="巡更点位数" />
            <el-table-column prop="completePoints" label="点位完成数" />
            <el-table-column prop="pointCompletePR" label="点位完成率" :formatter="dianWeiPR" />
            <el-table-column prop="signInFaceNo" label="人脸核验未通过数">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="num(scope)">{{scope.row.signInFaceNo}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="zip" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="order(scope)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.pageSize"
            @pagination="parsonList"
          />
        </el-col>
      </el-row>
    </div>
    <!-- 详情 -->
    <div>
      <el-dialog
        title="个人巡更事件详情"
        :visible.sync="dialogVisible"
        width="70%"
        :before-close="handleClose"
        top="3vh"
      >
        <div class="title">
          <div>
            <i>企业</i>：
            <i>{{PIM.companyName}}</i>
          </div>
          <div>
            <i>部门</i>：
            <i>{{PIM.deptName}}</i>
          </div>
          <div>
            <i>姓名</i>：
            <i>{{PIM.userName}}</i>
          </div>
          <div v-if="PIM.time != undefined">
            <i>查询时间</i>：
            <i>{{PIM.time}}</i>
          </div>
          <div v-else>
            <i>查询时间</i>：
            <i>全部</i>
          </div>
        </div>
        <el-tag type="warning">未完成事件</el-tag>
        <div>
          <el-table
            :data="tableData1"
            style="width: 100%;"
            height="300"
            border
            v-loading="loading1"
          >
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+(eventComplte.page ) * eventComplte.pageSize+1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="detailCode" label="事件编号" />
            <el-table-column prop="taskName" label="巡更事件名称" />
            <el-table-column prop="startTime" label="开始时间" />
            <el-table-column prop="endTime" label="结束时间" />
            <el-table-column prop="zhuangTai" label="状态">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="undone(scope)">{{scope.row.zhuangTai}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="patrolPointIdsCount" label="巡更点数" />
            <el-table-column prop="patrolPointIdsNoCount" label="未完成点数" />
            <el-table-column prop="facePatrolPointNoCheckCount" label="人脸核验未通过数">
              <template slot-scope="scope">
                <span style="color:#f00;">{{scope.row.facePatrolPointNoCheckCount}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[50,100, 200, 500]"
            :page-size="50"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1"
          ></el-pagination>
        </div>
        <el-divider></el-divider>
        <el-tag type="success">完成事件</el-tag>
        <div>
          <el-table
            :data="tableData2"
            style="width: 100%;"
            height="300"
            border
            v-loading="loading2"
          >
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+(eventComplte.page ) * eventComplte.pageSize+1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="detailCode" label="事件编号" />
            <el-table-column prop="taskName" label="巡更事件名称" />
            <el-table-column prop="startTime" label="开始时间" />
            <el-table-column prop="endTime" label="结束时间" />
            <el-table-column prop="zhuangTai" label="状态">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="done(scope)">{{scope.row.zhuangTai}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="patrolPointIdsCount" label="巡更点数" />
            <el-table-column prop="patrolPointIdsNoCount" label="未完成点数" />
            <el-table-column prop="facePatrolPointNoCheckCount" label="人脸核验未通过数">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="order1(scope)"
                  style="color:#f00;"
                >{{scope.row.facePatrolPointNoCheckCount}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :page-sizes="[50,100, 200, 500]"
            :page-size="50"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total2"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
    <!-- 人脸核验详情 -->
    <div>
      <el-dialog
        title="人脸核验详情"
        :visible.sync="dialogVisible1"
        width="40%"
        :before-close="handleClose"
      >
        <div class="con" v-if="imgs.status == 1">核验结果：通过</div>
        <div class="con" v-else>核验结果：未通过</div>
        <div class="con">人工核验：{{adminOperation}}</div>
        <div class="imgs">
          <div>
            人员照片
            <el-image :src="imgs.src"></el-image>
          </div>
          <div>
            核验照片
            <el-image :src="imgs.src1"></el-image>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateLian" v-if="imgs.status != 1">重置为通过</el-button>
          <el-button type="primary" @click="dialogVisible1 = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 人脸核验详情 -->
    <div>
      <el-dialog
        title="人脸核验详情"
        :visible.sync="dialogVisible4"
        width="40%"
        :before-close="handleClose"
      >
        <div class="con" v-if="imgs.status == 1">核验结果：通过</div>
        <div class="con" v-else>核验结果：未通过</div>
        <div class="con">人工核验：{{adminOperation}}</div>
        <div class="imgs">
          <div>
            人员照片
            <el-image :src="imgs.src"></el-image>
          </div>
          <div>
            核验照片
            <el-image :src="imgs.src1"></el-image>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateLian" v-if="imgs.status != 1">重置为通过</el-button>
          <el-button type="primary" @click="dialogVisible4 = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 巡更点状态详情 -->
    <div>
      <el-dialog
        title="巡更点签到详情"
        :visible.sync="dialogVisible2"
        width="70%"
        :before-close="handleClose"
        top="3vh"
      >
        <div class="title">
          <div>
            <i>企业</i>：
            <i>{{PIM.companyName}}</i>
          </div>
          <div>
            <i>部门</i>：
            <i>{{PIM.deptName}}</i>
          </div>
          <div>
            <i>姓名</i>：
            <i>{{PIM.userName}}</i>
          </div>
          <div v-if="PIM.time != undefined">
            <i>查询时间</i>：
            <i>{{PIM.time}}</i>
          </div>
          <div v-else>
            <i>查询时间</i>：
            <i>全部</i>
          </div>
        </div>
        <el-tag type="warning">未完成巡更点</el-tag>
        <el-table :data="tableData3" style="width: 100%;" height="330" border v-loading="loading3">
          <el-table-column width="50" label="序号">
            <template slot-scope="scope">
              <span>{{ scope.$index+(eventComplte.page ) * eventComplte.pageSize+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="buildingName" label="建筑" />
          <el-table-column prop="floorName" label="楼层" />
          <el-table-column prop="patrolPointName" label="巡更点名称" />
          <el-table-column prop="zhuangTai" label="人脸核验状态" :formatter="face">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.faceCheck == '0'">--</el-button>
              <el-button type="text" size="small" v-if="scope.row.faceCheck == '1'">人脸未核验</el-button>
              <el-button
                type="text"
                size="small"
                @click="face(scope)"
                v-if="scope.row.faceCheck == '2'"
              >通过</el-button>
              <el-button
                type="text"
                size="small"
                @click="face(scope)"
                v-if="scope.row.faceCheck == '3'"
              >未通过</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="signTime" label="巡更时间" :formatter="shiJian" />
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[50,100, 200, 500]"
          :page-size="50"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total3"
        ></el-pagination>
        <!-- ----------------------------------------------- -->
        <el-tag type="success">已完成巡更点</el-tag>
        <el-table :data="tableData6" style="width: 100%;" height="330" border v-loading="loading6">
          <el-table-column width="50" label="序号">
            <template slot-scope="scope">
              <span>{{ scope.$index+(eventComplte.page ) * eventComplte.pageSize+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="buildingName" label="建筑" />
          <el-table-column prop="floorName" label="楼层" />
          <el-table-column prop="patrolPointName" label="巡更点名称" />
          <el-table-column prop="zhuangTai" label="人脸核验状态" :formatter="face">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.faceCheck == '0'">--</el-button>
              <el-button
                type="text"
                size="small"
                @click="face(scope)"
                v-if="scope.row.faceCheck == '1'"
              >人脸未核验</el-button>
              <el-button
                type="text"
                size="small"
                @click="face(scope)"
                v-if="scope.row.faceCheck == '2'"
              >通过</el-button>
              <el-button
                type="text"
                size="small"
                @click="face(scope)"
                v-if="scope.row.faceCheck == '3'"
              >未通过</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="signTime" label="巡更时间" :formatter="shiJian" />
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[50,100, 200, 500]"
          :page-size="50"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total6"
        ></el-pagination>
      </el-dialog>
    </div>
    <!-- 人脸核验未通过 -->
    <div>
      <el-dialog
        title="人脸核验未通过详情"
        :visible.sync="dialogVisible3"
        width="70%"
        :before-close="handleClose"
        top="3vh"
      >
        <el-table :data="tableData4" style="width: 100%;" height="800" border v-loading="loading4">
          <el-table-column width="50" label="序号">
            <template slot-scope="scope">
              <span>{{ scope.$index+(eventComplte.page ) * eventComplte.pageSize+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="eventCode" label="事件编号" />
          <el-table-column prop="eventName" label="巡更事件名称" />
          <el-table-column prop="patrolPointName" label="巡更点名称" />
          <el-table-column prop="signTime" label="巡更时间" :formatter="formattingTime" />
          <el-table-column label="人脸核验状态" :formatter="face">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="noFaceCheck(scope)">未通过</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[50,100, 200, 500]"
          :page-size="50"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total4"
        ></el-pagination>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { subCompanyList, getCompanyByUid } from '@/api/iguard/incidentOrder'
import {
  getParsonList,
  getEventDetailCompleteByUid,
  getEventDetailNoCompleteByUid,
  getPointNoCompleteByDetailId,
  getFaceCheckDetail,
  faceCheckNoPass,
  updateUserFaceSign
} from '@/api/iguard/keepWatchReport'
import { subDepartments } from '@/api/iguard/incident'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Pagination from '@/components/Pagination' // Secondary
export default {
  components: { Pagination, Treeselect },
  data() {
    return {
      value: [new Date(), new Date()], //时间
      value1: '', //企业
      value2: '', //名字
      options: [], //企业
      departments: [], //部门
      listQuery: {
        uid: localStorage.getItem('uid'),
        page: 1,
        pageSize: 50,
        startDate: ''
      }, //人员巡更查询list
      eventComplte: {
        uid: localStorage.getItem('uids'),
        startDate: '',
        page: 0,
        pageSize: 50
      }, //人员的已完成事件清单及状态
      undoneDatail: {
        detailId: '',
        page: 0,
        pageSize: 50
      }, //巡更点状态详情参数未完成
      undoneDatail1: {
        detailId: '',
        page: 0,
        pageSize: 50
      }, //巡更点状态详情参数已完成
      faceList: {
        page: 0,
        pageSize: 50
      }, //人脸未通过
      updateFace: {
        uid: localStorage.getItem('uid')
      }, //人脸人工操作&查看
      adminOperation: '',
      faceDetail: {},
      PIM: {}, //个人信息
      tableData: [], //巡更报表list
      loading: true, //巡更报表list
      loading1: true, //人员的未完成事件清单及状态
      loading2: true, //人员的已完成事件清单及状态
      loading3: true, //巡更点状态详未完成
      loading4: true, //人脸核验未通过
      loading6: true, //巡更点状态详已完成
      tableData1: [], //巡更报表详情未完成list
      tableData2: [], //巡更报表详情完成list
      tableData3: [], //巡更点状态详未完成
      tableData4: [], //人脸核验未通过
      tableData6: [], //巡更点状态详已完成
      total: 0, //数据总条数
      total1: 0, //数据总条数
      total2: 0, //数据总条数
      total3: 0, //巡更点状态详未完成
      total4: 0, //人脸核验未通过
      total6: 0, //巡更点状态详已完成
      dialogVisible: false, //详情弹窗
      dialogVisible1: false, //人脸核验详情
      dialogVisible2: false, //巡更点状态详情
      dialogVisible3: false, //人脸核验未通过
      dialogVisible4: false, //人脸核验详情
      imgs: {
        src: '',
        src1: '',
        status: ''
      }
    }
  },
  mounted() {
    this.time1([new Date(), new Date()])
    if (localStorage.getItem('uid') == 1) {
      this.getList()
    } else {
      this.getCompany()
    }
    this.parsonList()
  },
  methods: {
    // 人脸未通过明细
    async noFace() {
      try {
        const res = await faceCheckNoPass(this.faceList)
        console.log(res)
        this.tableData4 = res.data
        this.total4 = parseInt(res.recode)
        this.loading4 = false
      } catch (err) {
        console.log(err)
      }
    },
    // 巡更点状态清单
    async startDetail(data) {
      try {
        const res = await getPointNoCompleteByDetailId(data)
        console.log(res)
        if ((res.code = 20000)) {
          this.total3 = parseInt(res.recode)
          this.tableData3 = res.data
          this.loading3 = false
        } else {
          this.$message(res.code)
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 巡更点状态清单
    async startDetail1(data) {
      try {
        const res = await getPointNoCompleteByDetailId(data)
        console.log(res)
        if ((res.code = 20000)) {
          this.total6 = parseInt(res.recode)
          this.tableData6 = res.data
          this.loading6 = false
        } else {
          this.$message(res.code)
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 报事人员查询list
    async parsonList() {
      try {
        const res = await getParsonList(this.listQuery)
        console.log(res)
        this.tableData = res.data
        this.total = parseInt(res.recode)
        this.loading = false
      } catch (err) {
        console.log(err)
      }
    },
    // 人员的已完成事件清单及状态
    async getStartEvent(obj) {
      try {
        const res = await getEventDetailCompleteByUid(obj)
        this.loading2 = false
        console.log(res)
        this.tableData2 = res.data
        this.tableData2.forEach(item => {
          this.$set(
            item,
            'patrolPointIdsNoCount',
            item.patrolPointIdsCount - item.patrolPointIdsEdCount
          )
          this.$set(item, 'zhuangTai', '完成')
        })
        this.total2 = parseInt(res.recode)
      } catch (err) {
        console.log(err)
      }
    },
    // 人员的未完成事件清单及状态
    async getEndEvent(obj) {
      try {
        const res = await getEventDetailNoCompleteByUid(obj)
        this.loading1 = false
        console.log(res)
        this.tableData1 = res.data
        this.tableData1.forEach(item => {
          this.$set(
            item,
            'patrolPointIdsNoCount',
            item.patrolPointIdsCount - item.patrolPointIdsEdCount
          )
          this.$set(item, 'zhuangTai', '未完成')
        })
        this.total1 = parseInt(res.recode)
      } catch (err) {
        console.log(err)
      }
    },
    // 公司列表
    async getList() {
      try {
        const res = await subCompanyList(localStorage.getItem('uid'))
        console.log(res)
        this.options.push(res.result)
        this.options.forEach(item => {
          this.$set(item, 'label', item.name)
          this.$set(item, 'value', item.id)
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 查询当前人的公司
    async getCompany() {
      try {
        const res = await getCompanyByUid(localStorage.getItem('uid'))
        console.log(res)
        this.options.push(res.result)
        this.options.forEach(item => {
          this.$set(item, 'label', item.name)
          this.$set(item, 'value', item.id)
        })
        this.value1 = res.result.id
        this.getSubDepartments(res.result.id)
      } catch (e) {
        console.log(e)
      }
    },
    // 查询公司下所有部门
    async getSubDepartments(deptId) {
      const res = await subDepartments(deptId)
      const result = res.result
      console.log(res)
      this.diGuiTree(result)
      this.departments = result
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.childrens
      }
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
      this.listQuery.startDate = FF + '-' + MM + '-' + DD + ' 00:00:00'
      this.eventComplte.startDate = FF + '-' + MM + '-' + DD + ' 00:00:00'
      let endTime = new Date(val[1])
      let FF1 = endTime.getFullYear()
      let MM1 = this.p(endTime.getMonth() + 1)
      let DD1 = this.p(endTime.getDate())
      this.listQuery.endDate = FF1 + '-' + MM1 + '-' + DD1 + ' 23:59:59'
      this.eventComplte.endTime = FF1 + '-' + MM1 + '-' + DD1 + ' 23:59:59'
      this.PIM.time =
        FF + '-' + MM + '-' + DD + '~' + FF1 + '-' + MM1 + '-' + DD1
    },
    // 时间处理
    time1(val) {
      console.log(val)
      let startTime = new Date(val[0])
      let FF = startTime.getFullYear()
      let MM = this.p(startTime.getMonth() + 1)
      let DD = this.p(startTime.getDate())
      this.listQuery.startDate = FF + '-' + MM + '-' + DD + ' 00:00:00'
      this.eventComplte.startDate = FF + '-' + MM + '-' + DD + ' 00:00:00'
      let endTime = new Date(val[1])
      let FF1 = endTime.getFullYear()
      let MM1 = this.p(endTime.getMonth() + 1)
      let DD1 = this.p(endTime.getDate())
      this.listQuery.endDate = FF1 + '-' + MM1 + '-' + DD1 + ' 23:59:59'
      this.eventComplte.endTime = FF1 + '-' + MM1 + '-' + DD1 + ' 23:59:59'
      this.PIM.time =
        FF + '-' + MM + '-' + DD + '~' + FF1 + '-' + MM1 + '-' + DD1
    },
    shu(value) {
      // this.listQuery.deptId = value
    },
    qiYe(val) {
      console.log(val)
      console.log('asdasdasd')
    },
    check() {
      console.log('asd')
      this.listQuery.userName = this.value2
      this.listQuery.companyId = this.value1
      this.parsonList()
    },
    excel() {
      console.log('asdsadasdad')
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    wanChengPR(row, column) {
      console.log(row)
      if (row.eventCompletePR == '0.0') {
        return '0%'
      } else {
        return row.eventCompletePR + '%'
      }
    },
    dianWeiPR(row, column) {
      if (row.pointCompletePR == '0.0') {
        return '0%'
      } else {
        return row.pointCompletePR + '%'
      }
    },
    handleSizeChange(val) {
      this.eventComplte.uid = localStorage.getItem('uids')
      this.eventComplte.pageSize = val
      this.getEndEvent(this.eventComplte)
    },
    handleCurrentChange(val) {
      this.eventComplte.uid = localStorage.getItem('uids')
      this.eventComplte.pageSize = 50
      this.eventComplte.page = val - 1
      this.getEndEvent(this.eventComplte)
    },
    handleSizeChange1(val) {
      this.eventComplte.uid = localStorage.getItem('uids')
      this.eventComplte.pageSize = val
      this.getStartEvent(this.eventComplte)
    },
    handleCurrentChange1(val) {
      this.eventComplte.uid = localStorage.getItem('uids')
      this.eventComplte.pageSize = 50
      this.eventComplte.page = val - 1
      this.getStartEvent(this.eventComplte)
    },
    order(scope) {
      console.log(scope)
      this.faceDetail.executeUid = scope.row.uid
      this.dialogVisible = true
      this.faceList.uid = scope.row.uid
      localStorage.setItem('uids', scope.row.uid)
      this.eventComplte.uid = localStorage.getItem('uids')
      this.getStartEvent(this.eventComplte)
      this.getEndEvent(this.eventComplte)
      this.PIM.userName = scope.row.userName
      this.PIM.companyName = scope.row.companyName
      this.PIM.deptName = scope.row.deptName
    },
    order1(scope) {
      console.log(scope)
      this.dialogVisible = true
      localStorage.setItem('uids', scope.row.uid)
      this.eventComplte.uid = localStorage.getItem('uids')
      this.getStartEvent(this.eventComplte)
      this.getEndEvent(this.eventComplte)
      this.PIM.userName = scope.row.userName
      this.PIM.companyName = scope.row.companyName
      this.PIM.deptName = scope.row.deptName
    },
    shiJian(row, column) {
      console.log(row)
      if (row.signTime == null) {
        return '-'
      } else {
        return row.signTime
      }
    },
    formattingTime(row, column) {
      let time = new Date(row.signTime)
      let FF = time.getFullYear()
      let MM = this.p(time.getMonth() + 1)
      let DD = this.p(time.getDate())
      let HH = this.p(time.getHours())
      let fen = this.p(time.getMinutes())
      let SS = this.p(time.getSeconds())
      return FF + '-' + MM + '-' + DD + ' ' + HH + ':' + fen + ':' + SS
    },
    face(scope) {
      console.log(scope)
      this.dialogVisible4 = true
      this.faceDetail.taskDetailId = scope.row.detailId
      this.faceDetail.patrolPointId = scope.row.patrolPointId
      this.updateFace.patrolPointId = scope.row.patrolPointId
      this.updateFace.taskDetailId = scope.row.detailId
      this.faceCheckDetail('4')
    },
    num(scope) {
      this.dialogVisible3 = true
      console.log(scope)
      this.faceList.uid = scope.row.uid
      this.faceDetail.executeUid = scope.row.uid
      this.updateFace.executeUid = scope.row.uid
      this.noFace()
    },
    async faceCheckDetail(num) {
      try {
        const res = await getFaceCheckDetail(this.faceDetail)
        console.log(res)
        if (res.code == 20000) {
          if (num == '4') {
            this.imgs.src = res.data.oldBase64
            this.imgs.src1 = res.data.nowBase64
            this.imgs.status = res.data.status
            this.adminOperation = res.data.adminOperation
            let path = res.data.nowBase64.substr(
              res.data.nowBase64.lastIndexOf('/')
            )
            this.imgs.src1 =
              process.env.VUE_APP_BASE_API_URL3 + '/rest/PCReport/img' + path
          } else {
            this.dialogVisible1 = true
            this.imgs.src = res.data.oldBase64
            this.imgs.src1 = res.data.nowBase64
            this.imgs.status = res.data.status
            let path = res.data.nowBase64.substr(
              res.data.nowBase64.lastIndexOf('/')
            )
            this.imgs.src1 =
              process.env.VUE_APP_BASE_API_URL3 + '/rest/PCReport/img' + path
            this.adminOperation = res.data.adminOperation
          }
          console.log(this.imgs)
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 查看未通过照片
    noFaceCheck(scope) {
      this.updateFace.patrolPointId = scope.row.patrolPointId
      this.updateFace.taskDetailId = scope.row.taskDetailId
      this.faceDetail.patrolPointId = scope.row.patrolPointId
      this.faceDetail.taskDetailId = scope.row.taskDetailId
      this.faceCheckDetail()
    },
    async updateLian() {
      try {
        const res = await updateUserFaceSign(this.updateFace)
        if (res.code == 20000) {
          this.dialogVisible1 = false
          this.dialogVisible4 = false
          this.noFace()
          this.parsonList()
        }
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    // 巡更点状态清单未完成
    undone(scope) {
      this.dialogVisible2 = true
      console.log(scope)
      this.undoneDatail.status = '1'
      this.undoneDatail.detailId = scope.row.id
      this.undoneDatail1.status = '2'
      this.undoneDatail1.detailId = scope.row.id
      this.startDetail(this.undoneDatail)
      this.startDetail1(this.undoneDatail1)
    },
    // 巡更点状态清单已完成
    done(scope) {
      this.dialogVisible2 = true
      console.log(scope)
      this.undoneDatail.status = '2'
      this.undoneDatail.detailId = scope.row.id
      this.undoneDatail1.status = '1'
      this.undoneDatail1.detailId = scope.row.id
      this.startDetail(this.undoneDatail1)
      this.startDetail1(this.undoneDatail)
    }
  }
}
</script>
<style lang='less' scoped>
.app-container {
  .title {
    color: #000;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
  }
  .con {
    color: #000;
    font-size: 14px;
    padding: 10px 0;
  }
  .imgs {
    display: flex;
    justify-content: space-between;
    .el-image {
      padding: 10px;
      height: 320px;
    }
  }
}
</style>