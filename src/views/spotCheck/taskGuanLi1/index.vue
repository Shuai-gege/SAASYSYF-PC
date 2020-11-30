<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="3">
        <el-select v-model="value" placeholder="部门" @change="company">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 人员 -->
      <el-col :span="3">
        <el-input v-model="name" placeholder="人员"></el-input>
      </el-col>
      <!-- 任务名称 -->
      <el-col :span="3">
        <el-input v-model="taskName" placeholder="任务名称"></el-input>
      </el-col>
      <!-- 状态 -->
      <el-col :span="3">
        <el-select v-model="value1" placeholder="状态" @change="state">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 按钮 -->
      <el-col :span="5">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="xinZeng">新增</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = true">新增</el-button> -->
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <div
        class="pour"
        v-if="num.check_task_count != 0"
      >注：此功能支持免费使用，{{num.level_name}}仅支持录入{{num.check_task_count}}个任务！请联系客服159-5174-1967购买服务，提高授权数量</div>
    </el-row>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <!-- 展示List -->
    <div>
      <el-row>
        <el-col :span="23">
          <el-table :data="tableData2" style="width: 100%;" height="600" border v-loading="loading">
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+listQuery1.page * listQuery1.pageSize + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="taskName" label="任务名称" />
            <el-table-column prop="ruleType1" label="规则类型" />
            <el-table-column prop="ruleName" label="巡更规则" />
            <el-table-column prop="defaultUserName" label="默认分配人" />
            <el-table-column prop="patroType1" label="周期调班" />
            <el-table-column prop="checkPatrolPointIdsCount" label="位置核验点数" />
            <el-table-column prop="faceDeviceIdsCount" label="人脸核验点数" />
            <el-table-column prop="stop" label="状态" />
            <el-table-column prop="zip" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="stop(scope)">{{scope.row.stop1}}</el-button>
                <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
                <el-button type="text" size="small" @click="checkOrder(scope)">查看</el-button>
                <el-button type="text" size="small" @click="shanChu(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery1.page"
            :limit.sync="listQuery1.pageSize"
            @pagination="taskGuanLi"
          />
        </el-col>
      </el-row>
    </div>
    <!-- 新增 -->
    <div>
      <el-dialog
        title="新增"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose"
        top="3vh"
      >
        <el-form ref="form" :model="form" label-width="120px">
          <div class="flex">
            <div style="padding-right:10px">
              <!-- 任务名称 -->
              <el-form-item label="任务名称">
                <el-input v-model="form.taskName" placeholder="任务名称"></el-input>
              </el-form-item>
              <!-- 巡更规则 -->
              <el-form-item label="巡更规则">
                <el-select v-model="form.value" placeholder="任务规则" @change="task">
                  <el-option
                    v-for="item in form.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 巡更人员 -->
              <el-form-item label="巡更人员">
                <el-select v-model="form.value1" placeholder="巡更人员" @change="task1">
                  <el-option
                    v-for="item in form.options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 默认分配人员 -->
              <el-form-item label="默认分配人员" v-if="flag1">
                <el-select v-model="form.value5" filterable placeholder="请选择" @change="danXuan">
                  <el-option
                    v-for="item in form.options5"
                    :key="item.uid"
                    :label="item.vserName"
                    :value="item.uid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 调班起始日期 -->
              <el-form-item label="调班起始日期" v-if="flag1">
                <el-date-picker
                  v-model="form.time"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions0"
                  @change="actionTime"
                ></el-date-picker>
              </el-form-item>
              <!-- 调班周期 -->
              <el-form-item label="调班周期" v-if="flag1">
                <el-input
                  v-model="form.cycle"
                  placeholder="调班周期"
                  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                ></el-input>
              </el-form-item>
              <!-- 唯一选择 -->
              <el-form-item label="人员选择" v-if="!flag1">
                <el-select v-model="form.value6" filterable placeholder="请选择" @change="danXuan0">
                  <el-option
                    v-for="item in form.options6"
                    :key="item.uid"
                    :label="item.vserName"
                    :value="item.uid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 人员选择 -->
              <el-form-item label="人员选择" v-if="flag1">
                <el-select
                  v-model="form.value2"
                  filterable
                  multiple
                  placeholder="请选择"
                  @change="duoXuan"
                >
                  <el-option
                    v-for="item in form.options2"
                    :key="item.uid"
                    :label="item.vserName"
                    :value="item.uid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!--  -->
              <!-- 增加巡更点 -->
              <el-form-item label="新增点检设备">
                <el-button type="primary" @click="newTask">新增点检设备</el-button>
              </el-form-item>
            </div>
            <!-- 巡更点 -->
            <div style="border-left:1px solid #000;padding-left:10px;width: 80%;" v-if="flag2">
              <el-row :span="23">
                <el-col :span="8">
                  <el-select v-model="form.value3" placeholder="建筑" @change="comPanyId">
                    <el-option
                      v-for="item in form.options3"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="form.value4" placeholder="楼层" @change="floor">
                    <el-option
                      v-for="item in form.options4"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <!-- 表格 -->
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                height="350px"
                row-key="id"
                @selection-change="handleSelectionChange"
                @select-all="selectAll"
                @select="eidtCheck"
              >
                <el-table-column type="selection" :reserve-selection="true"></el-table-column>
                <el-table-column prop="buildingName" label="建筑"></el-table-column>
                <el-table-column prop="floorName" label="楼层"></el-table-column>
                <el-table-column prop="deviceCode" label="设备编号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="deviceName" label="设备名称" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="人脸核验">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checked" @change="check(scope)"></el-checkbox>
                  </template>
                </el-table-column>-->
                <!-- <el-table-column label="位置核验">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checked1"></el-checkbox>
                  </template>
                </el-table-column>-->
              </el-table>
            </div>
          </div>
          <!-- 已勾选的巡更点 -->
          <p style="font-size:20px;color:#000" v-if="flag2">已勾设备↓</p>
          <el-table :data="tableData1" style="width: 100%" height="251px" v-if="flag2">
            <el-table-column prop="buildingName" label="建筑"></el-table-column>
            <el-table-column prop="floorName" label="楼层"></el-table-column>
            <el-table-column prop="deviceCode" label="巡更点编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deviceName" label="设备名称" show-overflow-tooltip></el-table-column>
            <el-table-column label="人脸核验">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" @change="check(scope)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="位置核验">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.checked1"
                  @change="check2(scope)"
                  v-if="scope.row.patrolPointId != null"
                ></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <!-- 按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="end">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 编辑 -->
    <div>
      <el-dialog
        title="编辑"
        :visible.sync="dialogVisible1"
        width="80%"
        :before-close="handleClose"
        top="3vh"
      >
        <el-form ref="form" :model="form" label-width="120px">
          <div class="flex">
            <div style="padding-right:10px">
              <!-- 任务名称 -->
              <el-form-item label="任务名称">
                <el-input v-model="form.taskName" placeholder="任务名称" @input="ipt"></el-input>
              </el-form-item>
              <!-- 巡更规则 -->
              <el-form-item label="巡更规则">
                <el-select v-model="form.value" placeholder="任务规则" @change="task">
                  <el-option
                    v-for="item in form.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 巡更人员 -->
              <el-form-item label="巡更人员">
                <el-select v-model="form.value1" placeholder="巡更人员" @change="task1">
                  <el-option
                    v-for="item in form.options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 默认分配人员 -->
              <el-form-item label="默认分配人员" v-if="flag1">
                <el-select v-model="form.value5" filterable placeholder="请选择" @change="danXuan">
                  <el-option
                    v-for="item in form.options5"
                    :key="item.uid"
                    :label="item.vserName"
                    :value="item.uid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 调班起始日期 -->
              <el-form-item label="调班起始日期" v-if="flag1">
                <el-date-picker
                  v-model="form.time"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions0"
                  @change="actionTime"
                ></el-date-picker>
              </el-form-item>
              <!-- 调班周期 -->
              <el-form-item label="调班周期" v-if="flag1">
                <el-input
                  v-model="form.cycle"
                  placeholder="调班周期"
                  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                  @input="ipt1"
                ></el-input>
              </el-form-item>
              <!-- 唯一选择 -->
              <el-form-item label="人员选择" v-if="!flag1">
                <el-select v-model="form.value6" filterable placeholder="请选择" @change="danXuan0">
                  <el-option
                    v-for="item in form.options6"
                    :key="item.uid"
                    :label="item.vserName"
                    :value="item.uid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 人员选择 -->
              <el-form-item label="人员选择" v-if="flag1">
                <el-select
                  v-model="form.value2"
                  filterable
                  multiple
                  placeholder="请选择"
                  @change="duoXuan"
                >
                  <el-option
                    v-for="item in form.options2"
                    :key="item.uid"
                    :label="item.vserName"
                    :value="item.uid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!--  -->
              <!-- 增加巡更点 -->
              <el-form-item label="新增巡更点">
                <el-button type="primary" @click="newTask">新增巡更点</el-button>
              </el-form-item>
            </div>
            <!-- 巡更点 -->
            <div style="border-left:1px solid #000;padding-left:10px;width: 80%;">
              <el-row :span="23">
                <el-col :span="8">
                  <el-select v-model="form.value3" placeholder="建筑" @change="comPanyId">
                    <el-option
                      v-for="item in form.options3"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="form.value4" placeholder="楼层" @change="floor">
                    <el-option
                      v-for="item in form.options4"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <!-- 表格 -->
              <el-table
                ref="multipleTable1"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                height="350px"
                row-key="id"
                @selection-change="handleSelectionChange"
                @select-all="selectAll"
                @select="eidtCheck"
              >
                <el-table-column type="selection" :reserve-selection="true"></el-table-column>
                <el-table-column prop="buildingName" label="建筑"></el-table-column>
                <el-table-column prop="floorName" label="楼层"></el-table-column>
                <el-table-column prop="deviceCode" label="巡更点编号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="deviceName" label="名称" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="人脸核验">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checked" @change="check(scope)"></el-checkbox>
                  </template>
                </el-table-column>-->
                <!-- <el-table-column label="位置核验">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checked1"></el-checkbox>
                  </template>
                </el-table-column>-->
              </el-table>
            </div>
          </div>
          <!-- 已勾选的巡更点 -->
          <p style="font-size:20px;color:#000">已勾选巡更点↓</p>
          <el-table :data="tableData1" style="width: 100%" height="251px">
            <el-table-column prop="buildingName" label="建筑"></el-table-column>
            <el-table-column prop="floorName" label="楼层"></el-table-column>
            <el-table-column prop="deviceCode" label="巡更点编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deviceName" label="名称" show-overflow-tooltip></el-table-column>
            <el-table-column label="人脸核验">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" @change="check1(scope)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="位置核验">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.checked1"
                  @change="check3(scope)"
                  v-if="scope.row.patrolPointId != null"
                ></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <!-- 按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="editEnd">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 查看 -->
    <div>
      <el-dialog title="详情" :visible.sync="dialogVisible2" width="80%">
        <!-- 筛选 -->
        <!-- 时间选择 -->
        <div style="display:flex">
          <el-date-picker
            v-model="timeVal"
            type="datetimerange"
            format="yyyy-MM-dd"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="arrTime"
            @blur="move"
          ></el-date-picker>
          <!-- 被分配人 -->
          <el-input v-model="input" placeholder="请输入被分配人" style="width:200px;margin:0 50px;"></el-input>
          <el-button type="primary" @click="queDing">确定</el-button>
        </div>
        <el-row>
          <!-- 分割线 -->
          <el-divider></el-divider>
          <!-- 展示List -->
          <el-col :span="23">
            <el-table :data="tableData3" style="width: 100%;" height="400" border>
              <el-table-column prop="executeUserName" label="被分配人" />
              <el-table-column prop="startTime" label="开始时间" :formatter="startTime" />
              <el-table-column prop="endTime" label="结束时间" :formatter="endTime" />
              <!-- <el-table-column prop="defaultUserName" label="设备点数" /> -->
              <el-table-column prop="faceDeviceIdsCount" label="人脸核验" />
              <el-table-column prop="checkPatrolPointIdsCount" label="位置核验" />
            </el-table>
            <!-- <pagination
              v-show="total1>0"
              :total="total1"
              :page.sync="listQuery2.page"
              :limit.sync="listQuery2.pageSize"
              @pagination="chaKan"
            />-->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[50, 100, 200, 500,1000]"
              :page-size="50"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total1"
            ></el-pagination>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getCompanyAllUser,
  add,
  getCheckTaskList,
  stopCheckTask,
  removeCheckTask,
  getTaskDetailsByParam,
  editCheckTask,
  checkAddTask
} from '@/api/iguard/checkTask'
import {
  getCompanyDeptByCompanyId,
  getBuildingLocationFloor,
  getPatrolPointList
} from '@/api/iguard/keepWatch'
import { deviceList } from '@/api/iguard/device/device'
import { subDeptByDeptId } from '@/api/iguard/incident'
import { getTaskRulesByParam } from '@/api/iguard/taskRule'
import Pagination from '@/components/Pagination' // Secondary
export default {
  components: { Pagination },
  watch: {
    timeVal: function(val) {
      if (val == null) {
        this.listQuery2.startTime = ''
        this.listQuery2.endTime = ''
      }
    }
  },
  data() {
    return {
      input: '', //查看详情查询的被分配人
      pickerOptions0: {
        disabledDate(time) {
          // return time.getTime() < Date.now() - 8.64e7 //如果没有后面的-8.64e7就是不可以选择今天的
          return time.getTime() < Date.now() //如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      listQuery: { uid: localStorage.getItem('uid') },
      listQuery1: {
        page: 0,
        pageSize: 50,
        uid: localStorage.getItem('uid')
      },
      listQuery2: {
        page: 1,
        pageSize: 50,
        uid: localStorage.getItem('uid')
      },
      multipleSelection: [],
      value: '', //部门
      options: [], //部门
      value1: '', //状态
      timeVal: [], //选择时间
      options1: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '启用'
        },
        {
          value: '1',
          label: '停用'
        }
      ], //状态
      name: '', //人员
      taskName: '', //任务名称
      dialogVisible: false, //新增弹出框
      dialogVisible1: false, //编辑弹出框
      dialogVisible2: false, //查看弹出框
      checked: '',
      checked1: '',
      flag: true,
      flag1: false,
      flag2: false,
      form: {
        time: '', //调班起始日期
        taskName: '', //任务名称
        cycle: '', //调班周期
        value: '', //巡更规则
        options: [], //巡更规则
        value1: '0', //巡更人员
        options1: [
          {
            value: '0',
            label: '指定人员'
          },
          {
            value: '1',
            label: '周期调班'
          }
        ], //巡更人员
        value2: '', //人员选择
        options2: [], //人员选择
        value3: '0', //建筑
        options3: [], //建筑
        value4: '0', //楼层
        options4: [], //楼层
        value5: '', //默认分配人员
        options5: [], //默认分配人员
        value6: '', //人员选择
        options6: [] //人员选择
      },
      tableData: [], //全部的任务list
      tableData1: [], //勾选的任务list
      tableData2: [], //任务展示list
      tableData3: [], //查询详情展示list
      num: {},
      total: 0, //总条数
      total1: 0, //详情总条数
      loading: true,
      facePatrolPointIdsArr: [],
      locationPatrolPointIdsArr: [],
      arr: [],
      newTaskList: {
        uid: localStorage.getItem('uid'),
        companyId: localStorage.getItem('deptid'),
        patroType: '1',
        faceDeviceIds: '',
        checkPatrolPointIds: ''
      } //新增任务对象
    }
  },
  mounted() {
    this.tbEventTypeConfig()
    this.companyDept(localStorage.getItem('deptid'))
    this.getTaskList()
    this.taskRule()
    this.taskGuanLi()
    this.buMen()
    this.getFloor('')
    JSON.parse(localStorage.getItem('vip')).forEach(item => {
      if (localStorage.getItem('vipStatus') == item.id) {
        this.num = item
      }
    })
  },
  methods: {
    // 查询是否还可以据需报事
    async checkTaskAdd(obj) {
      try {
        const res = await checkAddTask(localStorage.getItem('deptid'))
        this.newAdd(obj)
      } catch (err) {
        console.log(err)
      }
    },
    //格式化时间
    startTime(row, column, cellValue, index) {
      let date = new Date(cellValue)
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

      return Y + M + D + h + m
    },
    endTime(row, column, cellValue, index) {
      let date = new Date(cellValue)
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

      return Y + M + D + h + m
    },
    arrTime(val) {
      console.log(val)
      // 开始时间
      let stateTime = val[0]
      let FF = stateTime.getFullYear()
      let MM = this.p(stateTime.getMonth() + 1)
      let DD = this.p(stateTime.getDate())
      let HH = this.p(stateTime.getHours())
      let fen = this.p(stateTime.getMinutes())
      this.listQuery2.startTime =
        FF + '/' + MM + '/' + DD + ' ' + HH + ':' + fen + ':00'
      // 结束时间
      let endTime = val[1]
      let nian = endTime.getFullYear()
      let yue = this.p(endTime.getMonth() + 1)
      let ri = this.p(endTime.getDate())
      let shi = this.p(endTime.getHours())
      let fenzhong = this.p(endTime.getMinutes())
      this.listQuery2.endTime = nian + '/' + yue + '/' + ri + ' ' + '23:59:59'
      console.log(FF + '-' + MM + '-' + DD)
      console.log(nian + '-' + yue + '-' + ri)
    },
    move(val) {
      console.log(val)
    },
    async buMen() {
      try {
        const res = await subDeptByDeptId(localStorage.getItem('deptid'))
        console.log(res)
        this.options = res.result
        this.options.forEach(item => {
          this.$set(item, 'value', item.id)
          this.$set(item, 'label', item.name)
        })
        this.options.unshift({
          value: '',
          label: '全部'
        })
        console.log(this.options)
      } catch (e) {
        console.log(e)
      }
    },
    // 任务管理List
    async taskGuanLi() {
      this.listQuery1.page = 0
      try {
        const res = await getCheckTaskList(this.listQuery1)
        console.log(res)
        this.loading = false
        this.total = res.data.records
        this.tableData2 = res.data.rows
        this.tableData2.forEach(item => {
          if (item.stopTag == 0) {
            this.$set(item, 'stop', '启用')
            this.$set(item, 'stop1', '停用')
          } else {
            this.$set(item, 'stop', '停用')
            this.$set(item, 'stop1', '启用')
          }
          // ---------------------------------------
          if (item.ruleType == 0) {
            this.$set(item, 'ruleType1', '日任务')
          } else if (item.ruleType == 1) {
            this.$set(item, 'ruleType1', '周任务')
          } else if (item.ruleType == 2) {
            this.$set(item, 'ruleType1', '月任务')
          } else if (item.ruleType == 3) {
            this.$set(item, 'ruleType1', '季任务')
          }
          // ---------------------------------------
          if (item.patroType == 1) {
            this.$set(item, 'patroType1', '唯一指定')
          } else {
            this.$set(item, 'patroType1', '周期调班')
          }
        })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 删除
    async delete(id) {
      try {
        const res = await removeCheckTask(id)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.taskGuanLi()
      } catch (e) {
        console.log(e)
      }
    },
    async taskRule() {
      try {
        const res = await getTaskRulesByParam({
          uid: localStorage.getItem('uid')
        })
        this.form.options = res.data.rows
        this.form.options.forEach(item => {
          this.$set(item, 'value', item.id)
          this.$set(item, 'label', item.ruleName)
        })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    //查看任务详情
    async chaKan() {
      // this.listQuery2.page = 1
      try {
        const res = await getTaskDetailsByParam(this.listQuery2)
        this.total1 = res.count
        this.tableData3 = res.data
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 详情筛选
    queDing() {
      this.listQuery2.executeUserName = this.input
      console.log(this.listQuery2)
      this.chaKan()
    },
    // 新增按钮
    xinZeng() {
      this.dialogVisible = true
      this.tbEventTypeConfig()
      this.taskRule()
      this.getTaskList()
    },
    //新增巡更点
    newTask() {
      if (!this.flag2) {
        this.flag2 = true
      } else {
        this.flag2 = false
      }
    },
    // 编辑巡更点
    edit(scope) {
      this.tbEventTypeConfig()
      this.taskRule()
      console.log(scope)
      let obj = scope.row
      this.dialogVisible1 = true
      // ------------------------------------
      this.form.value5 = obj.defaultUserId
      this.form.time = obj.trimWorkDate
      this.form.cycle = obj.trimWorkCycle
      if (obj.allocationUserIds != null) {
        this.form.value2 = obj.allocationUserIds.split(',')
      }
      // ------------------------------------巡更点已勾选的显示勾选
      this.$nextTick(() => {
        this.tableData1.forEach(item => {
          this.$refs.multipleTable1.toggleRowSelection(item, true)
        })
      })
      // ------------------------------------
      if (obj.patroType == 2) {
        this.flag1 = true
        this.value1 = '1'
      } else {
        this.flag1 = false
        this.value1 = '0'
      }
      this.form.taskName = obj.taskName
      this.form.value = obj.ruleName
      if (obj.patroType == 1) {
        // 指定人员
        this.form.value1 = '0'
        this.form.value6 = obj.defaultUserId
      } else {
        // 周期调班
        this.form.value1 = '1'
      }
      let patrolPointIdsArr = obj.deviceIds.split(',')
      for (let i = 0; i < patrolPointIdsArr.length; i++) {
        for (let j = 0; j < this.tableData.length; j++) {
          if (this.tableData[j].id == patrolPointIdsArr[i]) {
            this.tableData1.push(this.tableData[j])
          }
        }
      }
      if (obj.faceDeviceIds != null) {
        let facePatrolPointIdsArr = obj.faceDeviceIds.split(',')
        for (let i = 0; i < facePatrolPointIdsArr.length; i++) {
          for (let j = 0; j < this.tableData1.length; j++) {
            if (this.tableData1[j].id == facePatrolPointIdsArr[i]) {
              this.tableData1[j].checked = true
            }
          }
        }
      }

      if (obj.checkPatrolPointIds != null) {
        let locationCheckPatrolPointIds = obj.checkPatrolPointIds.split(',')
        for (let i = 0; i < locationCheckPatrolPointIds.length; i++) {
          for (let j = 0; j < this.tableData1.length; j++) {
            if (
              this.tableData1[j].patrolPointId == locationCheckPatrolPointIds[i]
            ) {
              this.tableData1[j].checked1 = true
            }
          }
        }
      }
      console.log(this.tableData)
      console.log(this.newTaskList)
      this.newTaskList.allocationUserIds = obj.allocationUserIds
      this.newTaskList.ruleId = obj.ruleId
      this.newTaskList.patroType = obj.patroType
      this.newTaskList.defaultUserId = obj.defaultUserId
      this.newTaskList.faceDeviceIds = obj.faceDeviceIds
      this.newTaskList.defaultUserId = obj.defaultUserId
      this.newTaskList.trimWorkDate = obj.trimWorkDate
      this.newTaskList.trimWorkCycle = obj.trimWorkCycle
      this.newTaskList.taskName = obj.taskName
      this.newTaskList.deviceIds = obj.deviceIds
      this.newTaskList.checkPatrolPointIds = obj.checkPatrolPointIds
      this.newTaskList.id = obj.id
    },
    // 编辑任务名称
    ipt(val) {
      this.newTaskList.taskName = val
    },
    // 编辑调班周期
    ipt1(val) {
      this.newTaskList.trimWorkCycle = val
    },
    // 编辑
    async bianJi(obj) {
      try {
        const res = await editCheckTask(obj)
        console.log(res)
        if (res.code == 20000) {
          history.go(0)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 编辑确定
    editEnd() {
      let newArr = []
      this.tableData1.forEach(item => {
        newArr.push(item.id)
      })
      this.newTaskList.deviceIds = newArr.join()
      this.newTaskList.trimWorkCycle = this.form.cycle
      if (this.tableData1.length == 0) {
        this.$message({
          message: '请选择巡更点',
          type: 'warning'
        })
      } else {
        this.bianJi(this.newTaskList)
        // console.log(this.newTaskList)
        // console.log(this.tableData1)
      }
    },
    // 删除
    shanChu(scope) {
      this.delete(scope.row.id)
    },
    // 查看
    checkOrder(scope) {
      console.log(scope)
      this.dialogVisible2 = true //编辑弹出框
      this.listQuery2.taskId = scope.row.id
      console.log(this.listQuery2)
      this.chaKan()
    },
    // 停用and启用
    async taskStop(obj) {
      try {
        const res = await stopCheckTask(obj)
        setTimeout(() => {
          this.taskGuanLi()
        }, 100)
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 停用and启用
    stop(scope) {
      let obj = scope.row.id
      console.log(scope)
      this.taskStop(obj)
    },
    // 部门
    company(value) {
      console.log(value)
      this.listQuery1.deptId = value
    },
    // 关闭弹出窗时需要确认
    handleClose(done) {
      this.$confirm('确认关闭？关闭后页面将刷新')
        .then(_ => {
          // this.tableData1 = []
          // ;(this.form = {
          //   time: '', //调班起始日期
          //   taskName: '', //任务名称
          //   cycle: '', //调班周期
          //   value: '', //巡更规则
          //   options: [], //巡更规则
          //   value1: '0', //巡更人员
          //   options1: [
          //     {
          //       value: '0',
          //       label: '指定人员'
          //     },
          //     {
          //       value: '1',
          //       label: '周期调班'
          //     }
          //   ], //巡更人员
          //   value2: '', //人员选择
          //   options2: [], //人员选择
          //   value3: '0', //建筑
          //   options3: [], //建筑
          //   value4: '0', //楼层
          //   options4: [], //楼层
          //   value5: '', //默认分配人员
          //   options5: [], //默认分配人员
          //   value6: '', //人员选择
          //   options6: [] //人员选择
          // }),
          // this.companyDept(localStorage.getItem('deptid'))
          // this.getTaskList()
          // this.flag2 = false
          history.go(0)
          done()
        })
        .catch(_ => {})
    },
    // 状态
    state(val) {
      this.listQuery1.stopTag = val
    },
    // 巡更规则
    task(val) {
      console.log(val)
      this.newTaskList.ruleId = val
    },
    async getTaskList() {
      try {
        const res = await deviceList(this.listQuery)
        console.log(res)
        this.tableData = res.data
        this.tableData.forEach(item => {
          this.$set(item, 'checked', false)
          this.$set(item, 'checked1', false)
        })
        console.log(this.tableData)
      } catch (e) {
        console.log(e)
      }
    },
    // 巡更人员
    task1(val) {
      console.log(val)
      if (val == 0) {
        this.flag1 = false
        this.newTaskList.patroType = '1'
      } else {
        this.flag1 = true
        this.newTaskList.patroType = '2'
      }
    },
    // 人员选择
    duoXuan(val) {
      console.log(val)
      this.newTaskList.allocationUserIds = val.join(',')
    },
    // 是否勾选人脸核验
    check(val) {
      console.log(val)
      if (val.row.checked == true) {
        this.facePatrolPointIdsArr.push(val.row.id)
      } else {
        if (this.facePatrolPointIdsArr.indexOf(val.row.id) != -1) {
          this.facePatrolPointIdsArr.splice(
            this.facePatrolPointIdsArr.indexOf(val.row.id),
            1
          )
        }
      }
      this.newTaskList.faceDeviceIds = this.facePatrolPointIdsArr.join()
      console.log(this.newTaskList.faceDeviceIds)
    },
    // 编辑是否勾选人脸核验
    check1(val) {
      this.newTaskList.faceDeviceIds.split(',').forEach(item => {
        if (item != '') {
          this.facePatrolPointIdsArr = this.newTaskList.faceDeviceIds.split(',')
        }
      })
      if (val.row.checked == false) {
        if (this.facePatrolPointIdsArr.indexOf(val.row.id) != -1) {
          this.facePatrolPointIdsArr.splice(
            this.facePatrolPointIdsArr.indexOf(val.row.id),
            1
          )
        }
      } else {
        this.facePatrolPointIdsArr.push(val.row.id)
      }
      console.log(this.facePatrolPointIdsArr)
      console.log('this.facePatrolPointIdsArr')
      this.newTaskList.faceDeviceIds = this.facePatrolPointIdsArr.join()
      console.log(this.newTaskList.faceDeviceIds)
    },
    // 新增位置核验
    check2(val) {
      console.log(val.row.patrolPointId)
      if (val.row.checked1 == true) {
        this.locationPatrolPointIdsArr.push(val.row.patrolPointId)
      } else {
        if (
          this.locationPatrolPointIdsArr.indexOf(val.row.patrolPointId) != -1
        ) {
          this.locationPatrolPointIdsArr.splice(
            this.locationPatrolPointIdsArr.indexOf(val.row.patrolPointId),
            1
          )
        }
      }
      this.newTaskList.checkPatrolPointIds = this.locationPatrolPointIdsArr.join()
      console.log(this.newTaskList.checkPatrolPointIds)
    },
    // 编辑位置核验
    check3(val) {
      this.newTaskList.checkPatrolPointIds.split(',').forEach(item => {
        if (item != '') {
          this.locationPatrolPointIdsArr = this.newTaskList.checkPatrolPointIds.split(
            ','
          )
        }
      })
      if (val.row.checked1 == false) {
        if (
          this.locationPatrolPointIdsArr.indexOf(val.row.patrolPointId) != -1
        ) {
          this.locationPatrolPointIdsArr.splice(
            this.locationPatrolPointIdsArr.indexOf(val.row.patrolPointId),
            1
          )
        }
      } else {
        this.locationPatrolPointIdsArr.push(val.row.patrolPointId)
      }
      this.newTaskList.checkPatrolPointIds = this.locationPatrolPointIdsArr.join()
    },
    // 默认人员分配
    danXuan(val) {
      console.log(val)
      this.newTaskList.defaultUserId = val
    },
    // 人员分配
    danXuan0(val) {
      console.log(val)
      this.newTaskList.defaultUserId = val
    },
    async tbEventTypeConfig() {
      try {
        const res = await getCompanyAllUser(localStorage.getItem('uid'))
        this.form.options2 = res.result
        this.form.options2.forEach(item => {
          this.$set(item, 'value', item.uid)
          this.$set(item, 'label', item.vserName)
        })
        this.form.options5 = res.result
        this.form.options5.forEach(item => {
          this.$set(item, 'value', item.uid)
          this.$set(item, 'label', item.vserName)
        })
        this.form.options6 = res.result
        this.form.options6.forEach(item => {
          this.$set(item, 'value', item.uid)
          this.$set(item, 'label', item.vserName)
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 获取公司下面的建筑
    async companyDept(company_id) {
      try {
        const res = await getCompanyDeptByCompanyId(company_id)
        this.form.options3 = res.result
        this.form.options3.forEach(item => {
          this.$set(item, 'label', item.locationName)
          this.$set(item, 'value', item.id)
        })
        this.form.options3.unshift({
          value: '0',
          label: '全部'
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 查询建筑下楼层&房间
    async getFloor(parentId) {
      try {
        const res = await getBuildingLocationFloor(parentId)
        this.form.options4 = res.result
        this.form.options4.forEach(item => {
          this.$set(item, 'label', item.locationName)
          this.$set(item, 'value', item.id)
        })
        this.form.options4.unshift({
          value: '0',
          label: '全部'
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 新增任务
    async newAdd(obj) {
      try {
        const res = await add(obj)
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        history.go(0)
        this.taskGuanLi()
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    floor(val) {
      if (val == 0) {
        this.listQuery.floorId = ''
        this.getTaskList()
      } else {
        this.listQuery.floorId = val
        this.getTaskList()
      }
      console.log(val)
    },
    // 时间不够前面补0
    p(s) {
      return s < 10 ? '0' + s : s
    },
    // 周期性调班开始时间
    actionTime(value) {
      console.log(value)
      let start = new Date(value)
      this.newTaskList.trimWorkDate =
        this.p(start.getFullYear()) +
        '-' +
        this.p(start.getMonth() + 1) +
        '-' +
        this.p(start.getDate())
    },
    // 获取建筑ID
    comPanyId(val) {
      if (val == 0) {
        this.listQuery.buildingId = ''
        this.getTaskList()
      } else {
        this.getFloor(val)
        this.listQuery.buildingId = val
        this.getTaskList()
      }
      console.log(val)
    },
    // 确定新增
    end() {
      this.newTaskList.trimWorkCycle = this.form.cycle //调班周期
      this.newTaskList.taskName = this.form.taskName //任务名称
      let newArr = []
      this.tableData1.forEach(item => {
        newArr.push(item.id)
      })
      this.newTaskList.deviceIds = newArr.join()
      console.log()
      if (this.form.taskName == '') {
        this.$message({
          message: '请填写任务名称',
          type: 'warning'
        })
      } else if (this.form.value == '') {
        this.$message({
          message: '请选择任务规则',
          type: 'warning'
        })
      } else if (this.form.value1 == '0') {
        console.log('我是指定')
        if (this.form.value6 == '') {
          this.$message({
            message: '请选择人员',
            type: 'warning'
          })
        } else if (this.tableData1 == []) {
          this.$message({
            message: '请选择巡更点',
            type: 'warning'
          })
        } else {
          this.dialogVisible = false
          this.checkTaskAdd(this.newTaskList)
          this.form = {
            time: '', //调班起始日期
            taskName: '', //任务名称
            cycle: '', //调班周期
            value: '', //巡更规则
            options: [], //巡更规则
            value1: '0', //巡更人员
            options1: [
              {
                value: '0',
                label: '指定人员'
              },
              {
                value: '1',
                label: '周期调班'
              }
            ], //巡更人员
            value2: '', //人员选择
            options2: [], //人员选择
            value3: '0', //建筑
            options3: [], //建筑
            value4: '0', //楼层
            options4: [], //楼层
            value5: '', //默认分配人员
            options5: [], //默认分配人员
            value6: '', //人员选择
            options6: [] //人员选择
          }
        }
      } else if (this.form.value1 == '1') {
        console.log('我是周期')
        if (this.form.value5 == '') {
          this.$message({
            message: '请选择默认人员',
            type: 'warning'
          })
        } else if (this.form.time == '') {
          this.$message({
            message: '请选起始日期',
            type: 'warning'
          })
        } else if (this.form.cycle == '') {
          this.$message({
            message: '请填写调班周期',
            type: 'warning'
          })
        } else if (this.form.value2 == '') {
          console.log('是不是你')
          this.$message({
            message: '请选择人员',
            type: 'warning'
          })
        } else if (this.tableData1 == []) {
          this.$message({
            message: '请选择巡更点',
            type: 'warning'
          })
        } else {
          this.dialogVisible = false
          this.checkTaskAdd(this.newTaskList)
          this.form = {
            time: '', //调班起始日期
            taskName: '', //任务名称
            cycle: '', //调班周期
            value: '', //巡更规则
            options: [], //巡更规则
            value1: '0', //巡更人员
            options1: [
              {
                value: '0',
                label: '指定人员'
              },
              {
                value: '1',
                label: '周期调班'
              }
            ], //巡更人员
            value2: '', //人员选择
            options2: [], //人员选择
            value3: '0', //建筑
            options3: [], //建筑
            value4: '0', //楼层
            options4: [], //楼层
            value5: '', //默认分配人员
            options5: [], //默认分配人员
            value6: '', //人员选择
            options6: [] //人员选择
          }
        }
      }
      console.log(this.newTaskList)
      console.log(this.tableData1)
    },
    allTask(val) {
      console.log(val)
      if (val == 0) {
        this.flag = true
      } else {
        this.flag = false
      }
    },
    // 多选如果勾选去掉，就把人脸、位置核验去掉
    eidtCheck(selection, row) {
      console.log(row)
      let str = this.newTaskList.faceDeviceIds.split(',')
      if (row.checked == true) {
        if (str.indexOf(row.id) != -1) {
          str.splice(str.indexOf(row.id), 1)
        }
      } else {
        if (str.indexOf(row.id) != -1) {
          str.splice(str.indexOf(row.id), 1)
        }
      }
      let str1 = this.newTaskList.checkPatrolPointIds.split(',')
      if (row.checked1 == true) {
        if (str1.indexOf(row.patrolPointId) != -1) {
          str1.splice(str1.indexOf(row.patrolPointId), 1)
        }
      } else {
        if (str1.indexOf(row.patrolPointId) != -1) {
          str1.splice(str1.indexOf(row.patrolPointId), 1)
        }
      }

      this.$set(row, 'checked', false)
      this.$set(row, 'checked1', false)
      this.newTaskList.faceDeviceIds = str.join(',')
      this.newTaskList.checkPatrolPointIds = str1.join(',')
      console.log(this.newTaskList)
    },
    // 全选
    selectAll(selected) {
      console.log(selected)
      if (selected.length == 0) {
        this.tableData1 = []
        this.newTaskList.checkPatrolPointIds = ''
        this.newTaskList.faceDeviceIds = ''
      } else {
        let arr = []
        let arr1 = []
        this.tableData1.forEach(item => {
          if (item.checked == true) {
            arr.push(item.id)
          }
          if (item.checked1 == true) {
            arr1.push(item.patrolPointId)
          }
          this.newTaskList.faceDeviceIds = arr.join(',')
          this.newTaskList.checkPatrolPointIds = arr1.join(',')
        })
        console.log(this.newTaskList)
      }
    },
    // 勾选巡更点，下面已勾选同步。
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.arr = []

      val.forEach(item => {
        this.arr.push(item.id)
        // this.tableData1.push(item)
      })
      this.tableData1.forEach(item => {
        val.forEach(item1 => {
          if (item.id == item1.id) {
            item1.checked = item.checked
            item1.checked1 = item.checked1
          }
        })
      })
      this.tableData1 = val
      // let obj = {}
      // this.tableData1 = this.tableData1.reduce((cur, next) => {
      //   obj[next.id] ? '' : (obj[next.id] = true && cur.push(next))
      //   return cur
      // }, []) //设置cur默认类型为数组，并且初始值为空的数组
    },
    // 任务详情分页
    handleSizeChange(val) {
      this.listQuery2.pageSize = val
      this.chaKan()
    },
    handleCurrentChange(val) {
      this.listQuery2.page = val
      this.chaKan()
    },
    // 查询
    query() {
      this.listQuery1.taskName = this.taskName
      this.listQuery1.defaultUserName = this.name
      console.log(this.listQuery1)
      this.taskGuanLi()
    }
  }
}
</script>
<style lang='less' scoped>
.app-container {
  .pour {
    color: #44b3ff;
  }
  .flex {
    display: flex;
  }
}
</style>