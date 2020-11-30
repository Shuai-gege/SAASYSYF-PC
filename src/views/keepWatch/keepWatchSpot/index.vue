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
        <el-select v-model="value1" filterable placeholder="请选择企业" @change="company">
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
            <el-table-column prop="checkEvents" label="点检任务数" />
            <el-table-column prop="completeCheckEvents" label="点检任务完成数" />
            <el-table-column prop="eventCompletePR" label="事件完成率" :formatter="pr1" />
            <el-table-column prop="checkDeviceCount" label="需点检设备数" />
            <el-table-column prop="completeDevices" label="实际点检设备数" />
            <el-table-column prop="deviceCompletePR" label="点检完成率" :formatter="pr" />
            <el-table-column prop="checkEvents" label="位置核验未通过数" />
            <el-table-column prop="signInFaceNo" label="人脸核验未通过数">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="noFace(scope)"
                >{{scope.row.signInFaceNo}}</el-button>
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
            @pagination="checkSpotUser"
          />
        </el-col>
      </el-row>
    </div>
    <!-- 详情 -->
    <div>
      <el-dialog
        title="个人点检事件详情"
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
                <span>{{ scope.$index+(checkNoEvent.page) * checkNoEvent.pageSize+1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="detailCode" label="点检任务编号" />
            <el-table-column prop="taskName" label="点检任务名称" />
            <el-table-column prop="startTime" label="任务开始时间" />
            <el-table-column prop="endTime" label="任务结束时间" />
            <el-table-column prop="status" label="任务状态">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="noEvent(scope)">未完成</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="deviceIdsCount" label="需点检设备数" />
            <el-table-column prop="deviceIdsNoCount" label="未完成点检设备数" />
            <!-- <el-table-column prop="executeName" label="异常设备数" />
            <el-table-column prop="taskType" label="位置核验未通过数" />-->
            <el-table-column prop="facePatrolPointNoCheckCount" label="人脸核验未通过数" />
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
        <!-- -------------------------------------------- -->
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
                <span>{{ scope.$index+(checkNoEvent.page) * checkNoEvent.pageSize+1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="detailCode" label="点检任务编号" />
            <el-table-column prop="taskName" label="点检任务名称" />
            <el-table-column prop="startTime" label="任务开始时间" />
            <el-table-column prop="endTime" label="任务结束时间" />
            <el-table-column prop="status" label="任务状态">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="noEvent(scope)">已完成</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="deviceIdsCount" label="需点检设备数" />
            <el-table-column prop="deviceIdsNoCount" label="未完成点检设备数" />
            <!-- <el-table-column prop="executeName" label="异常设备数" />
            <el-table-column prop="taskType" label="位置核验未通过数" />-->
            <el-table-column prop="facePatrolPointNoCheckCount" label="人脸核验未通过数" />
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
    <!-- 设备点检明细 -->
    <div>
      <el-dialog
        title="设备点检明细"
        :visible.sync="dialogVisible2"
        width="70%"
        :before-close="handleClose"
        top="3vh"
      >
        <div class="title">
          <div>
            <i>企业</i>：
            <i>{{spotDetail.companyName}}</i>
          </div>
          <div>
            <i>部门</i>：
            <i>{{spotDetail.deptName}}</i>
          </div>
          <div>
            <i>姓名</i>：
            <i>{{spotDetail.userName}}</i>
          </div>
          <div v-if="spotDetail.time != undefined">
            <i>查询时间</i>：
            <i>{{spotDetail.time}}</i>
          </div>
          <div v-else>
            <i>查询时间</i>：
            <i>全部</i>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="title">
          <div>
            <i>点检任务名称</i>：
            <i>{{spotDetail.eventName}}</i>
          </div>
          <div>
            <i>点检任务编号</i>：
            <i>{{spotDetail.eventCode}}</i>
          </div>
        </div>
        <el-tag type="warning">未点检设备</el-tag>
        <div>
          <el-table
            :data="tableData3"
            style="width: 100%;"
            height="300"
            border
            v-loading="loading3"
          >
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+(spotDetails.page) * spotDetails.pageSize+1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="deviceName" label="设备名称" />
            <el-table-column prop="typeName" label="设备类型" />
            <el-table-column prop="modelName" label="设备型号" />
            <el-table-column prop="itemStr" label="检查项参数" :formatter="parameter" width="150" />
            <el-table-column prop="checkResult" label="点检结果" :formatter="result" />
            <el-table-column prop="deviceName" label="设备点检备注" />
            <el-table-column prop="deviceImg" label="设备照片">
              <template slot-scope="scope">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="scope.row.deviceImg"
                  :preview-src-list="scope.row.deviceImg.split(',')"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="executeName" label="位置核验">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="order(scope)">未完成</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="faceCheck" label="人脸核验">
              <template slot-scope="scope">
                <el-button type="text" size="small" v-if="scope.row.faceCheck == 0">--</el-button>
                <el-button type="text" size="small" v-if="scope.row.faceCheck == 1">人脸未核验</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.faceCheck == 2"
                  @click="faceCheck(scope)"
                >核验成功</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.faceCheck == 3"
                  @click="faceCheck(scope)"
                >核验失败</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="signTime" label="点检时间" :formatter="signTime" />
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
        </div>
        <!-- -------------------------------------------- -->
        <el-tag type="success">已点检设备</el-tag>
        <div>
          <el-table
            :data="tableData4"
            style="width: 100%;"
            height="300"
            border
            v-loading="loading4"
          >
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+(spotDetails.page) * spotDetails.pageSize+1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="deviceName" label="设备名称" />
            <el-table-column prop="typeName" label="设备类型" />
            <el-table-column prop="modelName" label="设备型号" />
            <el-table-column prop="itemStr" label="检查项参数" :formatter="parameter" width="150" />
            <el-table-column prop="checkResult" label="点检结果" :formatter="result" />

            <el-table-column prop="deviceName" label="设备点检备注" />
            <el-table-column prop="deviceImg" label="设备照片">
              <template slot-scope="scope">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="scope.row.deviceImg"
                  :preview-src-list="scope.row.deviceImg.split(',')"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="executeName" label="位置核验">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="order(scope)">未完成</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="taskType" label="人脸核验">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.faceCheck == 0"
                  @click="faceCheck(scope)"
                >--</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.faceCheck == 1"
                  @click="faceCheck(scope)"
                >人脸未核验</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.faceCheck == 2"
                  @click="faceCheck(scope)"
                >核验成功</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.faceCheck == 3"
                  @click="faceCheck(scope)"
                >核验失败</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="signTime" label="点检时间" :formatter="signTime" />
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :page-sizes="[50,100, 200, 500]"
            :page-size="50"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total4"
          ></el-pagination>
        </div>
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
        <el-table :data="tableData5" style="width: 100%;" height="800" border v-loading="loading5">
          <el-table-column width="50" label="序号">
            <template slot-scope="scope">
              <span>{{ scope.$index+(noFaceCanShu.page ) * noFaceCanShu.pageSize+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="eventCode" label="点检任务编号" />
          <el-table-column prop="eventName" label="点检任务名称" />
          <el-table-column prop="deviceName" label="点检设备名称" />
          <el-table-column prop="signTime" label="点检时间" :formatter="formattingTime" />
          <el-table-column label="人脸核验状态">
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
          :total="total5"
        ></el-pagination>
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
        <div class="con" v-if="PIM.status == 1">核验结果：通过</div>
        <div class="con" v-if="PIM.status == 2">核验结果：未通过</div>
        <div class="con" v-if="PIM.status == null">核验结果：未人脸核验</div>
        <div class="con">人工核验：{{PIM.adminOperation}}</div>
        <div class="imgs">
          <div>
            人员照片
            <el-image :src="PIM.src1"></el-image>
          </div>
          <div>
            核验照片
            <el-image :src="PIM.src"></el-image>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible1 = false">关 闭</el-button>
          <el-button type="primary" @click="reset" v-if="PIM.status == 2">重置为通过</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { subCompanyList, getCompanyByUid } from '@/api/iguard/incidentOrder'
import {
  faceCheckNoPass, //人脸核验未通过明细
  getFaceCheckDetail, // 人脸核验详情
  getPCReportUser, // 点检人员清单报表
  getEventDetailNoCompleteByUid, // 人员的未完成事件清单及状态
  getEventDetailCompleteByUid, // 人员的已完成事件清单及状态
  getDeviceNoCompleteByDetailId, // 点检状态清单
  updateUserFaceSign, // 未通过人脸核验重置为通过
  tu
} from '@/api/iguard/keepWatchSpot'
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
        page: 1,
        pageSize: 50,
        uid: localStorage.getItem('uid')
      },
      faceDetails: {
        page: 0,
        pageSize: 50,
        uid: ''
      },
      checkNoEvent: {
        uid: localStorage.getItem('uids'),
        page: 0,
        pageSize: 50
      },
      spotDetails: {
        page: 0,
        pageSize: 50,
        status: '1'
      }, //点检任务状态详情参数
      spotDetails1: {
        page: 0,
        pageSize: 50,
        status: '2'
      }, //点检任务状态详情参数
      faceHeYanDetails: {
        uid: localStorage.getItem('uid')
      }, //人脸核验详情
      updateFace: {
        uid: localStorage.getItem('uid')
      },
      noFaceCanShu: {
        page: 0,
        pageSize: 50,
        startTime: '',
        endTime: ''
      }, // 人脸核验未通过明细
      noFaceCheck1: {
        uid: localStorage.getItem('uid')
      },
      PIM: {}, //个人信息
      spotDetail: {}, //个人点检详情
      loading: true,
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true,
      loading5: true,
      tableData: [], //巡更报表list
      tableData1: [], //巡更报表详情未完成list
      tableData2: [], //巡更报表详情完成list
      tableData3: [], //点检任务状态详情未完成
      tableData4: [], //点检任务状态详情完成
      tableData5: [], //人脸核验未通过明细
      total: 0, //数据总条数人员list
      total1: 0, //数据总条数未完成事件
      total2: 0, //数据总条数已完成事件
      total3: 0, //点检任务状态详情未完成
      total4: 0, //点检任务状态详情完成
      total5: 0, //人脸核验未通过明细
      dialogVisible: false, //详情弹窗
      dialogVisible1: false, //人脸核验详情
      dialogVisible2: false, //设备点检明细
      dialogVisible3: false, //人脸核验未通过详情
      PIM: {
        src: '',
        src1: '',
        adminOperation: ''
      }
    }
  },

  mounted() {
    this.time([new Date(), new Date()])
    if (localStorage.getItem('uid') == 1) {
      this.getList()
    } else {
      this.getCompany()
    }
    this.checkSpotUser()
  },
  methods: {
    //时间处理
    signTime(row, column) {
      if (row.signTime == null) {
        return '-'
      } else {
        let startTime = new Date(row.signTime)
        let FF = startTime.getFullYear()
        let MM = this.p(startTime.getMonth() + 1)
        let DD = this.p(startTime.getDate())
        let HH = this.p(startTime.getHours())
        let fen = this.p(startTime.getMinutes())
        let SS = this.p(startTime.getSeconds())
        return FF + '-' + MM + '-' + DD + ' ' + HH + ':' + fen + ':' + SS
      }
    },
    // 检查项参数
    parameter(row, column) {
      if (row.itemStr == null) {
        return '-'
      } else {
        return row.itemStr.replace(/,/g, ';\n')
      }
    },
    // 点检结果
    result(row, column) {
      if (row.checkResult == '0') {
        return '正常'
      } else {
        return '-'
      }
    },
    //设备点检明细人脸核验点击事件
    faceCheck(scope) {
      console.log(scope)
      this.dialogVisible1 = true
      this.faceHeYanDetails.deviceId = scope.row.deviceId
      this.faceHeYanDetails.taskDetailId = scope.row.detailId
      this.updateFace.patrolPointId = scope.row.deviceId
      this.updateFace.taskDetailId = scope.row.detailId

      this.faceHeYan(this.faceHeYanDetails)
    },
    // 完成率数据处理
    pr(row, column) {
      console.log(row)
      return row.deviceCompletePR + '%'
    },
    // 完成率数据处理
    pr1(row, column) {
      console.log(row)
      return row.eventCompletePR + '%'
    },
    // 重置人脸核验
    reset() {
      this.faceReset(this.updateFace)
    },
    // 人脸核验未通过明细
    noFace(scope) {
      this.dialogVisible3 = true
      console.log(scope)
      this.noFaceCanShu.uid = scope.row.uid
      this.noFaceCheck1.executeUid = scope.row.uid
      this.updateFace.executeUid = scope.row.uid
      this.noFaceDetails(this.noFaceCanShu)
    },
    noFaceCheck(scope) {
      this.dialogVisible1 = true
      console.log(scope)
      this.noFaceCheck1.deviceId = scope.row.deviceId
      this.noFaceCheck1.taskDetailId = scope.row.taskDetailId
      this.updateFace.deviceId = scope.row.deviceId
      this.updateFace.taskDetailId = scope.row.taskDetailId
      this.faceHeYan(this.noFaceCheck1)
    },
    // 人脸核验未通过明细
    async noFaceDetails(data) {
      this.loading5 = true
      try {
        const res = await faceCheckNoPass(data)
        console.log(res)
        this.loading5 = false
        this.total5 = res.count
        this.tableData5 = res.data
      } catch (err) {
        console.log(err)
      }
    },
    async faceReset(data) {
      try {
        const res = await updateUserFaceSign(data)
        console.log(res)
        this.dialogVisible1 = false
        this.faceHeYan(this.faceHeYanDetails)
      } catch (err) {
        console.log(err)
      }
    },
    // async tuTu(path) {
    //   try {
    //     const res = await tu(path)
    //     this.PIM.src =
    //       process.env.VUE_APP_BASE_API_URL3 + '/rest/PCReport/img' + path
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },
    // 人脸核验详情
    async faceHeYan(data) {
      try {
        const res = await getFaceCheckDetail(data)
        this.PIM.src = res.data.nowBase64
        this.PIM.src1 = res.data.oldBase64
        this.PIM.adminOperation = res.data.adminOperation
        this.PIM.status = res.data.status
        let path = res.data.nowBase64.substr(
          res.data.nowBase64.lastIndexOf('/')
        )
        this.PIM.src =
          process.env.VUE_APP_BASE_API_URL3 + '/rest/PCReport/img' + path
      } catch (err) {
        console.log(err)
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
    // 点检人员清单报表
    async checkSpotUser() {
      try {
        const res = await getPCReportUser(this.listQuery)
        console.log(res)
        this.tableData = res.data
        this.total = res.count
        this.loading = false
      } catch (err) {
        console.log(err)
      }
    },
    // 人员的未完成事件清单及状态
    async eventDetailNo() {
      try {
        const res = await getEventDetailNoCompleteByUid(this.checkNoEvent)
        console.log(res)
        this.tableData1 = res.data
        this.total1 = res.count
        this.loading1 = false
        this.tableData1.forEach(item => {
          this.$set(
            item,
            'deviceIdsNoCount',
            item.deviceIdsCount - item.deviceIdsEdCount
          )
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 人员的未完成事件清单及状态
    async eventDetailComplete() {
      try {
        const res = await getEventDetailCompleteByUid(this.checkNoEvent)
        console.log(res)
        this.tableData2 = res.data
        this.total2 = res.count
        this.loading2 = false
        this.tableData2.forEach(item => {
          this.$set(
            item,
            'deviceIdsNoCount',
            item.deviceIdsCount - item.deviceIdsEdCount
          )
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 翻页
    handleSizeChange(val) {
      this.checkNoEvent.uid = localStorage.getItem('uids')
      this.checkNoEvent.pageSize = val
      this.eventDetailNo()
    },
    // 翻页
    handleCurrentChange(val) {
      this.checkNoEvent.uid = localStorage.getItem('uids')
      this.checkNoEvent.pageSize = 50
      this.checkNoEvent.page = val - 1
      this.eventDetailNo()
    },
    // 翻页
    handleSizeChange1(val) {
      this.checkNoEvent.uid = localStorage.getItem('uids')
      this.checkNoEvent.pageSize = val
      this.eventDetailComplete()
    },
    // 翻页
    handleCurrentChange1(val) {
      this.checkNoEvent.uid = localStorage.getItem('uids')
      this.checkNoEvent.pageSize = 50
      this.checkNoEvent.page = val - 1
      this.eventDetailComplete()
    },
    // 查看详情
    order(scope) {
      this.dialogVisible = true
      console.log(scope)
      localStorage.setItem('uids', scope.row.uid)
      this.checkNoEvent.uid = scope.row.uid
      this.faceHeYanDetails.executeUid = scope.row.uid
      this.updateFace.executeUid = scope.row.uid
      this.PIM.userName = scope.row.userName
      this.PIM.companyName = scope.row.companyName
      this.PIM.deptName = scope.row.deptName
      this.spotDetail.userName = scope.row.userName
      this.spotDetail.companyName = scope.row.companyName
      this.spotDetail.deptName = scope.row.deptName
      this.eventDetailNo()
      this.eventDetailComplete()
    },
    // 点检任务详情未完成
    noEvent(scope) {
      this.dialogVisible2 = true
      console.log(scope)
      this.spotDetail.eventCode = scope.row.detailCode
      this.spotDetail.eventName = scope.row.taskName
      this.spotDetails.detailId = scope.row.id
      this.spotDetails1.detailId = scope.row.id
      this.noSpotList(this.spotDetails)
      this.completeSpotList(this.spotDetails1)
    },
    // 点检任务详情已完成
    completeSpot(scope) {
      this.dialogVisible2 = true
      console.log(scope)
      this.spotDetail.eventCode = scope.row.detailCode
      this.spotDetail.eventName = scope.row.taskName
      this.spotDetails.detailId = scope.row.id
      this.spotDetails1.detailId = scope.row.id
      this.noSpotList(this.spotDetails)
      this.completeSpotList(this.spotDetails1)
    },
    // 未完成点检任务list
    async noSpotList(data) {
      try {
        const res = await getDeviceNoCompleteByDetailId(data)
        console.log(res)
        this.loading3 = false
        this.tableData3 = res.data
        this.total3 = res.count
      } catch (err) {
        console.log(err)
      }
    },
    // 已完成完成点检任务list
    async completeSpotList(data) {
      try {
        const res = await getDeviceNoCompleteByDetailId(data)
        console.log(res)
        this.loading4 = false
        this.tableData4 = res.data
        this.total4 = res.count
      } catch (err) {
        console.log(err)
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
        this.listQuery.companyId = res.result.id

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
    shu(value) {
      console.log(value)
      this.listQuery.deptId = value
      console.log(this.listQuery)
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
      this.noFaceCanShu.startTime = FF + '-' + MM + '-' + DD + ' 00:00:00'
      let endTime = new Date(val[1])
      let FF1 = endTime.getFullYear()
      let MM1 = this.p(endTime.getMonth() + 1)
      let DD1 = this.p(endTime.getDate())
      this.listQuery.endDate = FF1 + '-' + MM1 + '-' + DD1 + ' 23:59:59'
      this.noFaceCanShu.endTime = FF1 + '-' + MM1 + '-' + DD1 + ' 23:59:59'
      this.PIM.time =
        FF + '-' + MM + '-' + DD + '~' + FF1 + '-' + MM1 + '-' + DD1
      this.spotDetail.time =
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
      this.noFaceCanShu.startTime = FF + '-' + MM + '-' + DD + ' 00:00:00'
      let endTime = new Date(val[1])
      let FF1 = endTime.getFullYear()
      let MM1 = this.p(endTime.getMonth() + 1)
      let DD1 = this.p(endTime.getDate())
      this.listQuery.endDate = FF1 + '-' + MM1 + '-' + DD1 + ' 23:59:59'
      this.noFaceCanShu.endTime = FF1 + '-' + MM1 + '-' + DD1 + ' 23:59:59'
      this.PIM.time =
        FF + '-' + MM + '-' + DD + '~' + FF1 + '-' + MM1 + '-' + DD1
      this.spotDetail.time =
        FF + '-' + MM + '-' + DD + '~' + FF1 + '-' + MM1 + '-' + DD1
    },
    // 获取公司ID
    company(val) {
      this.listQuery.companyId = val
    },
    // 查询
    check() {
      console.log('asd')
      this.listQuery.userName = this.value2
      this.checkSpotUser()
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