<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="3">
        <el-select v-model="value" placeholder="任务类型" @change="company1">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 有效期 -->
      <el-col :span="3">
        <el-select v-model="value1" placeholder="有效期" @change="company">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 规则名称 -->
      <el-col :span="3">
        <el-input v-model="input" placeholder="规则名称"></el-input>
      </el-col>
      <!-- 按钮 -->
      <el-col :span="5">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-col>
    </el-row>
    <!-- 展示模块 -->
    <el-divider></el-divider>
    <!-- 展示面板 -->
    <!-- <div>
      <el-row>
        <el-col :span="23">
          <el-table :data="tableData" style="width: 100%;" height="600" border v-loading="loading">
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+listQuery.page * listQuery.pageSize + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="taskName" label="任务名称" />
            <el-table-column prop="ruleType" label="规则类型" />
            <el-table-column prop="ruleName" label="巡更规则" />
            <el-table-column prop="defaultUserName" label="默认分配人" />
            <el-table-column prop="patroType" label="周期调班" />
            <el-table-column prop="patrolPointIds" label="巡检点数" />
            <el-table-column prop="facePatrolPointIds" label="人脸核验点数" />
            <el-table-column prop="stop" label="状态" />
            <el-table-column prop="zip" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="stop(scope)">停用</el-button>
                <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
                <el-button type="text" size="small" @click="checkOrder(scope)">查看</el-button>
                <el-button type="text" size="small" @click="shanChu(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.pageSize"
            @pagination="getList"
          />
        </el-col>
      </el-row>
    </div>-->
    <div>
      <el-row>
        <el-col :span="23">
          <el-table :data="tableData" style="width: 100%;" height="600" border v-loading="loading">
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+listQuery.page * listQuery.pageSize + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ruleName" label="规则名称" />
            <el-table-column prop="ruleType" label="规则类型" />
            <el-table-column prop="time" label="有效期" />
            <el-table-column prop="timeSlot" label="时间段" />
            <el-table-column prop="pattern" label="循环模式" />
            <el-table-column prop="checkCount" label="巡检次数" />
            <el-table-column prop="zip" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
                <el-button type="text" size="small" @click="checkOrder(scope)">查看</el-button>
                <el-button type="text" size="small" @click="shanChu(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.pageSize"
            @pagination="getList"
          />
        </el-col>
      </el-row>
    </div>
    <!-- 任务规则详情 -->
    <el-dialog title="规则详情" :visible.sync="dialogTableVisible">
      <p
        style="font-size:16px;color:#000;text-align:center"
      >规则名称：{{ruleName}}，规则类型：{{ruleType}}，有效期：{{ruleTime}}</p>
      <el-table :data="gridData" style="width: 100%;" height="450px">
        <el-table-column width="50" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index+listQuery.page * listQuery.pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column property="timeStart" label="开始时间"></el-table-column>
        <el-table-column property="timeEnd" label="结束时间"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 新增 -->
    <div>
      <el-dialog title="新增" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="90px">
          <!-- 规则名称 -->
          <el-form-item label="规则名称">
            <el-input v-model="form.ruleName"></el-input>
          </el-form-item>
          <!-- 有效期 -->
          <el-form-item label="有效期">
            <el-date-picker
              v-model="form.value"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              @change="time"
            ></el-date-picker>
          </el-form-item>
          <!-- 任务类型 -->
          <el-form-item label="任务类型">
            <el-select v-model="form.value1" placeholder="任务类型" @change="task">
              <el-option
                v-for="item in form.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 日任务开始执行时间 -->
          <el-form-item label="时间" v-if="flag">
            <el-time-picker
              is-range
              v-model="form.value2"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              :clearable="false"
              format="HH:mm"
              @change="actionTime"
            ></el-time-picker>
          </el-form-item>
          <!-- 周任务开始执行时间 -->
          <el-form-item label="周时间" v-if="flag1">
            <div style="display:flex;">
              <div class="zhouTime">
                <el-select v-model="form.value3" placeholder="周X" @change="task1">
                  <el-option
                    v-for="item in form.options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-picker
                  v-model="form.value5"
                  placeholder="任意时间点"
                  :clearable="false"
                  format="HH:mm"
                  @change="startTime"
                ></el-time-picker>
              </div>
              <div>——</div>
              <div class="zhouTime">
                <el-select v-model="form.value4" placeholder="周X" @change="task2">
                  <el-option
                    v-for="item in form.options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-picker
                  v-model="form.value6"
                  placeholder="任意时间点"
                  :clearable="false"
                  format="HH:mm"
                  @change="endTime"
                ></el-time-picker>
              </div>
            </div>
          </el-form-item>
          <!-- 月任务开始执行时间 -->
          <el-form-item label="月时间" v-if="flag2">
            <div style="display:flex;">
              <div class="zhouTime">
                <el-select v-model="form.value7" placeholder="日" @change="task3">
                  <el-option
                    v-for="item in form.options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-picker
                  v-model="form.value8"
                  placeholder="任意时间点"
                  :clearable="false"
                  format="HH:mm"
                  @change="startTime"
                ></el-time-picker>
              </div>
              <div>——</div>
              <div class="zhouTime">
                <el-select v-model="form.value9" placeholder="日" @change="task4">
                  <el-option
                    v-for="item in form.options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-picker
                  v-model="form.value10"
                  placeholder="任意时间点"
                  :clearable="false"
                  format="HH:mm"
                  @change="endTime"
                ></el-time-picker>
              </div>
            </div>
          </el-form-item>
          <!-- 季任务开始执行时间 -->
          <el-form-item label="季时间" v-if="flag3">
            <div style="display:flex;">
              <div class="zhouTime">
                <el-select v-model="form.value11" placeholder="每季度" @change="task5">
                  <el-option
                    v-for="item in form.options5"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-select v-model="form.value7" placeholder="日" @change="task3">
                  <el-option
                    v-for="item in form.options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-picker
                  v-model="form.value8"
                  placeholder="任意时间点"
                  :clearable="false"
                  format="HH:mm"
                  @change="startTime"
                ></el-time-picker>
              </div>
              <div>——</div>
              <div class="zhouTime">
                <el-select v-model="form.value12" placeholder="每季度" @change="task6">
                  <el-option
                    v-for="item in form.options6"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-select v-model="form.value9" placeholder="日" @change="task4">
                  <el-option
                    v-for="item in form.options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-picker
                  v-model="form.value10"
                  placeholder="任意时间点"
                  :clearable="false"
                  format="HH:mm"
                  @change="endTime"
                ></el-time-picker>
              </div>
            </div>
          </el-form-item>
          <!-- 巡检次数 -->
          <el-form-item label="巡检次数">
            <el-input v-model="form.num" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"></el-input>
          </el-form-item>
          <!-- 日循环条件 -->
          <el-form-item label="日循环条件" v-if="flag">
            <el-checkbox v-model="form.checked" @change="check">周一</el-checkbox>
            <el-checkbox v-model="form.checked1" @change="check1">周二</el-checkbox>
            <el-checkbox v-model="form.checked2" @change="check2">周三</el-checkbox>
            <el-checkbox v-model="form.checked3" @change="check3">周四</el-checkbox>
            <el-checkbox v-model="form.checked4" @change="check4">周五</el-checkbox>
            <el-checkbox v-model="form.checked5" @change="check5">周六</el-checkbox>
            <el-checkbox v-model="form.checked6" @change="check6">周日</el-checkbox>
            <el-checkbox v-model="form.checked7" @change="check7">全选</el-checkbox>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="end">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 编辑 -->
    <div>
      <el-dialog title="编辑" :visible.sync="dialogVisible1" width="50%" :before-close="handleClose">
        <el-form ref="form" :model="form1" label-width="90px">
          <!-- 规则名称 -->
          <el-form-item label="规则名称">
            <el-input v-model="form1.ruleName"></el-input>
          </el-form-item>
          <!-- 有效期 -->
          <el-form-item label="有效期">
            <el-date-picker
              v-model="form1.value"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="time"
            ></el-date-picker>
          </el-form-item>
          <!-- 任务类型 -->
          <el-form-item label="任务类型">
            <el-select disabled v-model="form1.value1" placeholder="任务类型" @change="task">
              <el-option
                v-for="item in form1.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 日任务开始执行时间 -->
          <el-form-item label="时间" v-if="flag">
            <el-time-picker
              is-range
              v-model="form1.value2"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              format="HH:mm"
              @change="actionTime"
            ></el-time-picker>
          </el-form-item>
          <!-- 周任务开始执行时间 -->
          <el-form-item label="周时间" v-if="flag1">
            <div style="display:flex;">
              <div class="zhouTime">
                <el-select v-model="form1.value3" placeholder="周X" @change="task1">
                  <el-option
                    v-for="item in form1.options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-picker v-model="form1.value5" placeholder="任意时间点" @change="startTime"></el-time-picker>
              </div>
              <div>——</div>
              <div class="zhouTime">
                <el-select v-model="form1.value4" placeholder="周X" @change="task2">
                  <el-option
                    v-for="item in form1.options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-picker v-model="form1.value6" placeholder="任意时间点" @change="endTime"></el-time-picker>
              </div>
            </div>
          </el-form-item>
          <!-- 月任务开始执行时间 -->
          <el-form-item label="月时间" v-if="flag2">
            <div style="display:flex;">
              <div class="zhouTime">
                <el-select v-model="form1.value7" placeholder="日" @change="task3">
                  <el-option
                    v-for="item in form1.options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-picker v-model="form1.value8" placeholder="任意时间点" @change="startTime"></el-time-picker>
              </div>
              <div>——</div>
              <div class="zhouTime">
                <el-select v-model="form1.value9" placeholder="日" @change="task4">
                  <el-option
                    v-for="item in form1.options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-picker v-model="form1.value10" placeholder="任意时间点" @change="endTime"></el-time-picker>
              </div>
            </div>
          </el-form-item>
          <!-- 季任务开始执行时间 -->
          <el-form-item label="季时间" v-if="flag3">
            <div style="display:flex;">
              <div class="zhouTime">
                <el-select v-model="form1.value11" placeholder="每季度" @change="task5">
                  <el-option
                    v-for="item in form1.options5"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-select v-model="form1.value7" placeholder="日" @change="task3">
                  <el-option
                    v-for="item in form1.options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-picker v-model="form1.value8" placeholder="任意时间点" @change="startTime"></el-time-picker>
              </div>
              <div>——</div>
              <div class="zhouTime">
                <el-select v-model="form1.value12" placeholder="每季度" @change="task6">
                  <el-option
                    v-for="item in form1.options6"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-select v-model="form1.value9" placeholder="日" @change="task4">
                  <el-option
                    v-for="item in form1.options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-time-picker v-model="form1.value10" placeholder="任意时间点" @change="endTime"></el-time-picker>
              </div>
            </div>
          </el-form-item>
          <!-- 巡检次数 -->
          <el-form-item label="巡检次数">
            <el-input v-model="form1.num" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"></el-input>
          </el-form-item>
          <!-- 日循环条件 -->
          <el-form-item label="日循环条件" v-if="flag">
            <el-checkbox v-model="form1.check[0].checked" @change="check">周一</el-checkbox>
            <el-checkbox v-model="form1.check[1].checked" @change="check1">周二</el-checkbox>
            <el-checkbox v-model="form1.check[2].checked" @change="check2">周三</el-checkbox>
            <el-checkbox v-model="form1.check[3].checked" @change="check3">周四</el-checkbox>
            <el-checkbox v-model="form1.check[4].checked" @change="check4">周五</el-checkbox>
            <el-checkbox v-model="form1.check[5].checked" @change="check5">周六</el-checkbox>
            <el-checkbox v-model="form1.check[6].checked" @change="check6">周日</el-checkbox>
            <el-checkbox v-model="form1.check[7].checked" @change="check7">全选</el-checkbox>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="end1">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getTaskRulesByParam,
  add,
  getTaskRuleDetailByRuleId,
  removeTaskRule,
  editTaskRule
} from '@/api/iguard/taskRule'
import Pagination from '@/components/Pagination' // Secondary
const entityVO = {
  uid: localStorage.getItem('uid'),
  page: 0,
  pageSize: 50
}
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: Object.assign({}, entityVO),
      value: '', //任务类型
      options: [
        {
          valur: '',
          label: '全部'
        },
        {
          value: '0',
          label: '日任务'
        },
        {
          value: '1',
          label: '周任务'
        },
        {
          value: '2',
          label: '月任务'
        },
        {
          value: '3',
          label: '季任务'
        }
      ], //任务类型
      value1: '', //有效期
      flag: true, //隐藏、显示
      flag1: false, //周隐藏、显示
      flag2: false, //月隐藏、显示
      flag3: false, //季隐藏、显示
      week: [], //日任务循环条件
      dialogTableVisible: false, //任务规则详情
      gridData: [], //规则详情
      ruleType: '', //任务规则
      ruleName: '', //任务名称
      ruleTime: '', //有效期
      loading: true,
      tableData: [],
      total: 0, //数据总条数
      newTaskRule: {
        uid: localStorage.getItem('uid')
      }, //新增任务规则
      options1: [
        {
          value: '',
          label: '全部'
        },
        { value: '0', label: '生效' },
        { value: '1', label: '无效' }
      ], //有效期
      dialogVisible: false, //新增弹出框
      dialogVisible1: false, //编辑弹出框
      input: '', //规则名称
      form: {
        ruleName: '', //规则名称
        value: '', //时间选择
        value1: '0', //任务类型
        value2: '', //任务开始执行时间
        value3: '', //周任务开始执行时间
        value4: '', //周任务开始执行时间
        value5: '', //周任务开始执行时间
        value6: '', //周任务开始执行时间
        value7: '', //月任务开始执行时间
        value8: '', //月任务开始执行时间
        value9: '', //月任务开始执行时间
        value10: '', //月任务开始执行时间
        value11: '', //季任务开始执行时间
        value12: '', //季任务开始执行时间
        num: '', //循环次数
        checked: false,
        checked1: false,
        checked2: false,
        checked3: false,
        checked4: false,
        checked5: false,
        checked6: false,
        checked7: false,
        options: [
          {
            value: '0',
            label: '日任务'
          },
          {
            value: '1',
            label: '周任务'
          },
          {
            value: '2',
            label: '月任务'
          },
          {
            value: '3',
            label: '季任务'
          }
        ], //任务类型
        options1: [
          {
            value: '1',
            label: '周一'
          },
          {
            value: '2',
            label: '周二'
          },
          {
            value: '3',
            label: '周三'
          },
          {
            value: '4',
            label: '周四'
          },
          {
            value: '5',
            label: '周五'
          },
          {
            value: '6',
            label: '周六'
          },
          {
            value: '7',
            label: '周日'
          }
        ], //周任务周几
        options2: [
          {
            value: '1',
            label: '周一'
          },
          {
            value: '2',
            label: '周二'
          },
          {
            value: '3',
            label: '周三'
          },
          {
            value: '4',
            label: '周四'
          },
          {
            value: '5',
            label: '周五'
          },
          {
            value: '6',
            label: '周六'
          },
          {
            value: '7',
            label: '周日'
          }
        ], //周任务周几
        options3: [
          {
            value: '01',
            label: '01'
          },
          {
            value: '02',
            label: '02'
          },
          {
            value: '03',
            label: '03'
          },
          {
            value: '04',
            label: '04'
          },
          {
            value: '05',
            label: '05'
          },
          {
            value: '06',
            label: '06'
          },
          {
            value: '07',
            label: '07'
          },
          {
            value: '08',
            label: '08'
          },
          {
            value: '09',
            label: '09'
          },
          {
            value: '10',
            label: '10'
          },
          {
            value: '11',
            label: '11'
          },
          {
            value: '12',
            label: '12'
          },
          {
            value: '13',
            label: '13'
          },
          {
            value: '14',
            label: '14'
          },
          {
            value: '15',
            label: '15'
          },
          {
            value: '16',
            label: '16'
          },
          {
            value: '17',
            label: '17'
          },
          {
            value: '18',
            label: '18'
          },
          {
            value: '19',
            label: '19'
          },
          {
            value: '20',
            label: '20'
          },
          {
            value: '21',
            label: '21'
          },
          {
            value: '22',
            label: '22'
          },
          {
            value: '23',
            label: '23'
          },
          {
            value: '24',
            label: '24'
          },
          {
            value: '25',
            label: '25'
          },
          {
            value: '26',
            label: '26'
          },
          {
            value: '27',
            label: '27'
          },
          {
            value: '28',
            label: '28'
          },
          {
            value: '29',
            label: '29'
          },
          {
            value: '30',
            label: '30'
          },
          {
            value: '31',
            label: '31'
          }
        ], //月任务那一日
        options4: [
          {
            value: '01',
            label: '01'
          },
          {
            value: '02',
            label: '02'
          },
          {
            value: '03',
            label: '03'
          },
          {
            value: '04',
            label: '04'
          },
          {
            value: '05',
            label: '05'
          },
          {
            value: '06',
            label: '06'
          },
          {
            value: '07',
            label: '07'
          },
          {
            value: '08',
            label: '08'
          },
          {
            value: '09',
            label: '09'
          },
          {
            value: '10',
            label: '10'
          },
          {
            value: '11',
            label: '11'
          },
          {
            value: '12',
            label: '12'
          },
          {
            value: '13',
            label: '13'
          },
          {
            value: '14',
            label: '14'
          },
          {
            value: '15',
            label: '15'
          },
          {
            value: '16',
            label: '16'
          },
          {
            value: '17',
            label: '17'
          },
          {
            value: '18',
            label: '18'
          },
          {
            value: '19',
            label: '19'
          },
          {
            value: '20',
            label: '20'
          },
          {
            value: '21',
            label: '21'
          },
          {
            value: '22',
            label: '22'
          },
          {
            value: '23',
            label: '23'
          },
          {
            value: '24',
            label: '24'
          },
          {
            value: '25',
            label: '25'
          },
          {
            value: '26',
            label: '26'
          },
          {
            value: '27',
            label: '27'
          },
          {
            value: '28',
            label: '28'
          },
          {
            value: '29',
            label: '29'
          },
          {
            value: '30',
            label: '30'
          },
          {
            value: '31',
            label: '31'
          }
        ], //月任务那一日
        options5: [
          {
            value: '1',
            label: '第一个月'
          },
          {
            value: '2',
            label: '第二个月'
          },
          {
            value: '3',
            label: '第三个月'
          }
        ],
        options6: [
          {
            value: '1',
            label: '第一个月'
          },
          {
            value: '2',
            label: '第二个月'
          },
          {
            value: '3',
            label: '第三个月'
          }
        ]
      },
      form1: {
        ruleName: '', //规则名称
        value: '', //时间选择
        value1: '0', //任务类型
        value2: '', //任务开始执行时间
        value3: '', //周任务开始执行时间
        value4: '', //周任务开始执行时间
        value5: '', //周任务开始执行时间
        value6: '', //周任务开始执行时间
        value7: '', //月任务开始执行时间
        value8: '', //月任务开始执行时间
        value9: '', //月任务开始执行时间
        value10: '', //月任务开始执行时间
        value11: '', //季任务开始执行时间
        value12: '', //季任务开始执行时间
        num: '', //循环次数
        check: [
          { checked: false },
          { checked: false },
          { checked: false },
          { checked: false },
          { checked: false },
          { checked: false },
          { checked: false },
          { checked: false }
        ],
        options: [
          {
            value: '0',
            label: '日任务'
          },
          {
            value: '1',
            label: '周任务'
          },
          {
            value: '2',
            label: '月任务'
          },
          {
            value: '3',
            label: '季任务'
          }
        ], //任务类型
        options1: [
          {
            value: '1',
            label: '周一'
          },
          {
            value: '2',
            label: '周二'
          },
          {
            value: '3',
            label: '周三'
          },
          {
            value: '4',
            label: '周四'
          },
          {
            value: '5',
            label: '周五'
          },
          {
            value: '6',
            label: '周六'
          },
          {
            value: '7',
            label: '周日'
          }
        ], //周任务周几
        options2: [
          {
            value: '1',
            label: '周一'
          },
          {
            value: '2',
            label: '周二'
          },
          {
            value: '3',
            label: '周三'
          },
          {
            value: '4',
            label: '周四'
          },
          {
            value: '5',
            label: '周五'
          },
          {
            value: '6',
            label: '周六'
          },
          {
            value: '7',
            label: '周日'
          }
        ], //周任务周几
        options3: [
          {
            value: '01',
            label: '01'
          },
          {
            value: '02',
            label: '02'
          },
          {
            value: '03',
            label: '03'
          },
          {
            value: '04',
            label: '04'
          },
          {
            value: '05',
            label: '05'
          },
          {
            value: '06',
            label: '06'
          },
          {
            value: '07',
            label: '07'
          },
          {
            value: '08',
            label: '08'
          },
          {
            value: '09',
            label: '09'
          },
          {
            value: '10',
            label: '10'
          },
          {
            value: '11',
            label: '11'
          },
          {
            value: '12',
            label: '12'
          },
          {
            value: '13',
            label: '13'
          },
          {
            value: '14',
            label: '14'
          },
          {
            value: '15',
            label: '15'
          },
          {
            value: '16',
            label: '16'
          },
          {
            value: '17',
            label: '17'
          },
          {
            value: '18',
            label: '18'
          },
          {
            value: '19',
            label: '19'
          },
          {
            value: '20',
            label: '20'
          },
          {
            value: '21',
            label: '21'
          },
          {
            value: '22',
            label: '22'
          },
          {
            value: '23',
            label: '23'
          },
          {
            value: '24',
            label: '24'
          },
          {
            value: '25',
            label: '25'
          },
          {
            value: '26',
            label: '26'
          },
          {
            value: '27',
            label: '27'
          },
          {
            value: '28',
            label: '28'
          },
          {
            value: '29',
            label: '29'
          },
          {
            value: '30',
            label: '30'
          },
          {
            value: '31',
            label: '31'
          }
        ], //月任务那一日
        options4: [
          {
            value: '01',
            label: '01'
          },
          {
            value: '02',
            label: '02'
          },
          {
            value: '03',
            label: '03'
          },
          {
            value: '04',
            label: '04'
          },
          {
            value: '05',
            label: '05'
          },
          {
            value: '06',
            label: '06'
          },
          {
            value: '07',
            label: '07'
          },
          {
            value: '08',
            label: '08'
          },
          {
            value: '09',
            label: '09'
          },
          {
            value: '10',
            label: '10'
          },
          {
            value: '11',
            label: '11'
          },
          {
            value: '12',
            label: '12'
          },
          {
            value: '13',
            label: '13'
          },
          {
            value: '14',
            label: '14'
          },
          {
            value: '15',
            label: '15'
          },
          {
            value: '16',
            label: '16'
          },
          {
            value: '17',
            label: '17'
          },
          {
            value: '18',
            label: '18'
          },
          {
            value: '19',
            label: '19'
          },
          {
            value: '20',
            label: '20'
          },
          {
            value: '21',
            label: '21'
          },
          {
            value: '22',
            label: '22'
          },
          {
            value: '23',
            label: '23'
          },
          {
            value: '24',
            label: '24'
          },
          {
            value: '25',
            label: '25'
          },
          {
            value: '26',
            label: '26'
          },
          {
            value: '27',
            label: '27'
          },
          {
            value: '28',
            label: '28'
          },
          {
            value: '29',
            label: '29'
          },
          {
            value: '30',
            label: '30'
          },
          {
            value: '31',
            label: '31'
          }
        ], //月任务那一日
        options5: [
          {
            value: '1',
            label: '第一个月'
          },
          {
            value: '2',
            label: '第二个月'
          },
          {
            value: '3',
            label: '第三个月'
          }
        ],
        options6: [
          {
            value: '1',
            label: '第一个月'
          },
          {
            value: '2',
            label: '第二个月'
          },
          {
            value: '3',
            label: '第三个月'
          }
        ]
      },
      form3: {}
    }
  },
  mounted() {
    this.getList()
    this.newTaskRule.ruleTypeId = this.form.value1
  },
  methods: {
    // 展示List
    async getList() {
      this.listQuery.page = 0
      try {
        const res = await getTaskRulesByParam(this.listQuery)
        this.loading = false
        this.total = res.data.records
        this.tableData = res.data.rows
        this.tableData.forEach(item => {
          if (item.ruleTypeId == 0) {
            this.$set(item, 'ruleType', '日任务')
            this.$set(item, 'timeSlot', item.timeStart + '~' + item.timeEnd)
            this.$set(
              item,
              'time',
              item.validDateStart + '~' + item.validDateEnd
            )
            this.$set(item, 'pattern', '周' + item.repeatCondition)
          } else if (item.ruleTypeId == 1) {
            this.$set(item, 'ruleType', '周任务')
            this.$set(item, 'pattern', '周')
            this.$set(
              item,
              'timeSlot',
              '周' +
                item.dayStart +
                '-' +
                item.timeStart +
                '~' +
                '周' +
                item.dayEnd +
                '-' +
                item.timeEnd
            )
            this.$set(
              item,
              'time',
              item.validDateStart + '~' + item.validDateEnd
            )
          } else if (item.ruleTypeId == 2) {
            this.$set(item, 'ruleType', '月任务')
            this.$set(item, 'pattern', '月')
            this.$set(
              item,
              'timeSlot',
              item.dayStart +
                '号' +
                item.timeStart +
                '~' +
                item.dayEnd +
                '号' +
                item.timeEnd
            )
            this.$set(
              item,
              'time',
              item.validDateStart + '~' + item.validDateEnd
            )
          } else if (item.ruleTypeId == 3) {
            this.$set(item, 'ruleType', '季任务')
            this.$set(item, 'pattern', '季')
            this.$set(
              item,
              'timeSlot',
              '每季度' +
                item.monthNoStart +
                '月' +
                item.dayStart +
                '号' +
                item.timeStart +
                '~' +
                '每季度' +
                item.monthNoEnd +
                '月' +
                item.dayEnd +
                '号' +
                item.timeEnd
            )
            this.$set(
              item,
              'time',
              item.validDateStart + '~' + item.validDateEnd
            )
          }
        })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 新增
    async newAdd(data) {
      try {
        const res = await add(data)
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        history.go(0)
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 删除
    async remove(ruleId) {
      try {
        const res = await removeTaskRule(ruleId)
        console.log(res)
        if (res.code == 20000) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getList()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 编辑
    async bianJi(obj) {
      try {
        const res = await editTaskRule(obj)
        console.log(res)
        if (res.code == 20000) {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.dialogVisible1 = false
          history.go(0)
          this.getList()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 筛选任务类型
    company1(value) {
      console.log(value)
      this.listQuery.ruleTypeId = value
    },
    company(value) {
      console.log(value)
      if (value == 0) {
        this.listQuery.valid = '1'
      } else if (value == 1) {
        this.listQuery.valid = '2'
      }
    },
    // 选择任务类型
    task(val) {
      console.log(val)
      this.newTaskRule.ruleTypeId = val
      this.form3.ruleTypeId = val
      if (val == 0) {
        this.flag = true
        this.flag1 = false
        this.flag2 = false
        this.flag3 = false
      } else if (val == 1) {
        this.flag = false
        this.flag1 = true
        this.flag2 = false
        this.flag3 = false
      } else if (val == 2) {
        this.flag = false
        this.flag1 = false
        this.flag2 = true
        this.flag3 = false
      } else if (val == 3) {
        this.flag = false
        this.flag1 = false
        this.flag2 = false
        this.flag3 = true
      }
    },
    // 周开始时间选择
    task1(val) {
      console.log(val)
      this.newTaskRule.dayStart = val
      this.form3.dayStart = val
    },
    // 周结束时间选择
    task2(val) {
      console.log(val)
      this.newTaskRule.dayEnd = val
      this.form3.dayEnd = val
    },
    // 日任务开始时间
    startTime(val) {
      let start = new Date(val)
      this.newTaskRule.timeStart =
        this.p(start.getHours()) + ':' + this.p(start.getMinutes())
      this.form3.timeStart =
        this.p(start.getHours()) + ':' + this.p(start.getMinutes())
    },
    // 日任务结束时间
    endTime(val) {
      let end = new Date(val)
      this.newTaskRule.timeEnd =
        this.p(end.getHours()) + ':' + this.p(end.getMinutes())

      this.form3.timeEnd =
        this.p(end.getHours()) + ':' + this.p(end.getMinutes())
    },
    // 月结束时间选择
    task3(val) {
      console.log(val)
      this.newTaskRule.dayStart = val
      this.form3.dayStart = val
    },
    // 月结束时间选择
    task4(val) {
      console.log(val)
      this.newTaskRule.dayEnd = val
      this.form3.dayEnd = val
    },
    //季任务每季度的第几个月,开始
    task5(val) {
      console.log(val)
      this.newTaskRule.monthNoStart = val
      this.form3.monthNoStart = val
    },
    //季任务每季度的第几个月,开始
    task6(val) {
      console.log(val)
      this.newTaskRule.monthNoEnd = val
      this.form3.monthNoEnd = val
    },
    // 关闭弹出窗时需要确认
    handleClose(done) {
      this.$confirm('确认关闭？关闭后将刷新。')
        .then(_ => {
          history.go(0)
          this.objInit()
          done()
        })
        .catch(_ => {})
    },
    p(s) {
      return s < 10 ? '0' + s : s
    },
    //时间选择
    time(value) {
      console.log(value[0])
      let start = new Date(value[0])
      this.newTaskRule.validDateStart =
        start.getFullYear() +
        '-' +
        this.p(start.getMonth() + 1) +
        '-' +
        this.p(start.getDate())
      this.form3.validDateStart =
        start.getFullYear() +
        '-' +
        this.p(start.getMonth() + 1) +
        '-' +
        this.p(start.getDate())
      // -------------------------------
      let end = new Date(value[1])
      this.newTaskRule.validDateEnd =
        end.getFullYear() +
        '-' +
        this.p(end.getMonth() + 1) +
        '-' +
        this.p(end.getDate())
      this.form3.validDateEnd =
        end.getFullYear() +
        '-' +
        this.p(end.getMonth() + 1) +
        '-' +
        this.p(end.getDate())
    },
    // 任务开始执行时间
    actionTime(value) {
      let start = new Date(value[0])
      this.newTaskRule.timeStart =
        this.p(start.getHours()) + ':' + this.p(start.getMinutes())

      this.form3.timeStart =
        this.p(start.getHours()) + ':' + this.p(start.getMinutes())
      let end = new Date(value[1])
      this.newTaskRule.timeEnd =
        this.p(end.getHours()) + ':' + this.p(end.getMinutes())
      this.form3.timeEnd =
        this.p(end.getHours()) + ':' + this.p(end.getMinutes())
    },
    // 日任务多线周几
    check(val) {
      console.log(val)
      if (val == true) {
        this.week.push('1')
      } else {
        this.form.checked7 = false
        this.form1.check[7].checked = false
        if (this.week.indexOf('1') !== -1) {
          this.week.splice(this.week.indexOf('1'), 1)
        }
        console.log(this.week)
        console.log(this.week.indexOf('1') !== -1)
      }
    },
    check1(val) {
      console.log(val)
      if (val == true) {
        this.week.push('2')
      } else {
        this.form.checked7 = false
        this.form1.check[7].checked = false
        if (this.week.indexOf('2') !== -1) {
          this.week.splice(this.week.indexOf('2'), 1)
        }
      }
    },
    check2(val) {
      console.log(val)
      if (val == true) {
        this.week.push('3')
      } else {
        this.form.checked7 = false
        this.form1.check[7].checked = false
        if (this.week.indexOf('3') !== -1) {
          this.week.splice(this.week.indexOf('3'), 1)
        }
      }
    },
    check3(val) {
      console.log(val)
      if (val == true) {
        this.week.push('4')
      } else {
        this.form.checked7 = false
        this.form1.check[7].checked = false
        if (this.week.indexOf('4') !== -1) {
          this.week.splice(this.week.indexOf('4'), 1)
        }
      }
    },
    check4(val) {
      console.log(val)
      if (val == true) {
        this.week.push('5')
      } else {
        this.form.checked7 = false
        this.form1.check[7].checked = false
        if (this.week.indexOf('5') !== -1) {
          this.week.splice(this.week.indexOf('5'), 1)
        }
      }
    },
    check5(val) {
      console.log(val)
      if (val == true) {
        this.week.push('6')
      } else {
        this.form.checked7 = false
        this.form1.check[7].checked = false
        if (this.week.indexOf('6') !== -1) {
          this.week.splice(this.week.indexOf('6'), 1)
        }
      }
    },
    check6(val) {
      console.log(val)
      if (val == true) {
        this.week.push('7')
      } else {
        this.form.checked7 = false
        this.form1.check[7].checked = false
        if (this.week.indexOf('7') !== -1) {
          this.week.splice(this.week.indexOf('7'), 1)
        }
      }
    },
    check7(val) {
      if (val == true) {
        this.form.checked = true
        this.form.checked1 = true
        this.form.checked2 = true
        this.form.checked3 = true
        this.form.checked4 = true
        this.form.checked5 = true
        this.form.checked6 = true
        this.form.checked7 = true
        this.form1.check[0].checked = true
        this.form1.check[1].checked = true
        this.form1.check[2].checked = true
        this.form1.check[3].checked = true
        this.form1.check[4].checked = true
        this.form1.check[5].checked = true
        this.form1.check[6].checked = true
        this.form1.check[7].checked = true
        this.week.push('1', '2', '3', '4', '5', '6', '7')
      } else {
        this.form.checked = false
        this.form.checked1 = false
        this.form.checked2 = false
        this.form.checked3 = false
        this.form.checked4 = false
        this.form.checked5 = false
        this.form.checked6 = false
        this.form.checked7 = false
        this.form1.check[0].checked = false
        this.form1.check[1].checked = false
        this.form1.check[2].checked = false
        this.form1.check[3].checked = false
        this.form1.check[4].checked = false
        this.form1.check[5].checked = false
        this.form1.check[6].checked = false
        this.form1.check[7].checked = false
        this.week = []
      }
    },
    checkOrder(scope) {
      console.log(scope)
      this.dialogTableVisible = true
      this.checkTaskOrder(scope.row.id, localStorage.getItem('uid'))
    },
    async checkTaskOrder(id, uid) {
      try {
        const res = await getTaskRuleDetailByRuleId(id, uid)
        this.gridData = res.data
        if (this.gridData[0].ruleType == 0) {
          this.ruleName = this.gridData[0].ruleName
          this.ruleType = '日任务'
          this.ruleTime =
            this.gridData[0].validStart + '~' + this.gridData[0].validEnd
        } else if (this.gridData[0].ruleType == 1) {
          this.ruleName = this.gridData[0].ruleName
          this.ruleType = '周任务'
          this.ruleTime =
            this.gridData[0].validStart + '~' + this.gridData[0].validEnd
        } else if (this.gridData[0].ruleType == 2) {
          this.ruleName = this.gridData[0].ruleName
          this.ruleType = '月任务'
          this.ruleTime =
            this.gridData[0].validStart + '~' + this.gridData[0].validEnd
        } else if (this.gridData[0].ruleType == 3) {
          this.ruleName = this.gridData[0].ruleName
          this.ruleType = '季任务'
          this.ruleTime =
            this.gridData[0].validStart + '~' + this.gridData[0].validEnd
        }
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 重置新增时所填的内容
    objInit() {
      this.form.ruleName = ''
      this.form.value = ''
      this.form.value1 = '0'
      this.form.value2 = ''
      this.form.value3 = ''
      this.form.value4 = ''
      this.form.value5 = ''
      this.form.value6 = ''
      this.form.value7 = ''
      this.form.value8 = ''
      this.form.value9 = ''
      this.form.value10 = ''
      this.form.value11 = ''
      this.form.value12 = ''
      this.form.num = ''
      this.form.checked = false
      this.form.checked1 = false
      this.form.checked2 = false
      this.form.checked3 = false
      this.form.checked4 = false
      this.form.checked5 = false
      this.form.checked6 = false
      this.form.checked7 = false
    },
    // 确定新增
    end() {
      this.week = [...new Set(this.week)]
      if (this.form.ruleName == '') {
        this.$message('请填写规则名称')
      } else if (this.form.value == '') {
        this.$message('请选择有效期')
      } else if (this.form.value1 == 0) {
        if (this.form.value2 == '') {
          this.$message('请选择时间')
        } else if (
          this.form.checked == false &&
          this.form.checked1 == false &&
          this.form.checked2 == false &&
          this.form.checked3 == false &&
          this.form.checked4 == false &&
          this.form.checked5 == false &&
          this.form.checked6 == false
        ) {
          this.$message('请选择日循环条件')
        } else if (this.form.num == '') {
          this.$message('请选择巡检次数')
        } else {
          this.dialogVisible = false
          this.newTaskRule.ruleName = this.form.ruleName
          this.newTaskRule.checkCount = this.form.num
          this.week.sort((a, b) => {
            return a - b
          })
          this.newTaskRule.repeatCondition = this.week.join()
          console.log(this.newTaskRule)
          this.newAdd(this.newTaskRule)
          this.objInit()
        }
      } else if (this.form.value1 == 1) {
        if (this.form.value3 == '') {
          this.$message('请选择周几开始')
        } else if (this.form.value5 == '') {
          this.$message('请选择开始时间')
        } else if (this.form.value4 == '') {
          this.$message('请选择周几结束')
        } else if (this.form.value6 == '') {
          this.$message('请选择结束时间')
        } else if (this.form.num == '') {
          this.$message('请选择巡检次数')
        } else {
          this.dialogVisible = false
          this.newTaskRule.ruleName = this.form.ruleName
          this.newTaskRule.checkCount = this.form.num
          this.newTaskRule.repeatCondition = this.week.join()
          this.newAdd(this.newTaskRule)
          this.objInit()
        }
      } else if (this.form.value1 == 2) {
        if (this.form.value7 == '') {
          this.$message('请选择几号开始')
        } else if (this.form.value8 == '') {
          this.$message('请选择开始时间')
        } else if (this.form.value9 == '') {
          this.$message('请选择几号结束')
        } else if (this.form.value10 == '') {
          this.$message('请选择结束时间')
        } else if (this.form.num == '') {
          this.$message('请选择巡检次数')
        } else {
          this.dialogVisible = false
          this.newTaskRule.ruleName = this.form.ruleName
          this.newTaskRule.checkCount = this.form.num
          this.newTaskRule.repeatCondition = this.week.join()
          this.newAdd(this.newTaskRule)
          this.objInit()
        }
      } else if (this.form.value1 == 3) {
        if (this.form.value11 == '') {
          this.$message('请选择第几个月开始')
        } else if (this.form.value7 == '') {
          this.$message('请选择几号开始')
        } else if (this.form.value8 == '') {
          this.$message('请选择开始时间')
        } else if (this.form.value12 == '') {
          this.$message('请选择第几个月结束')
        } else if (this.form.value9 == '') {
          this.$message('请选择几号结束')
        } else if (this.form.value10 == '') {
          this.$message('请选择结束时间')
        } else if (this.form.num == '') {
          this.$message('请选择巡检次数')
        } else {
          this.dialogVisible = false
          this.newTaskRule.ruleName = this.form.ruleName
          this.newTaskRule.checkCount = this.form.num
          this.newTaskRule.repeatCondition = this.week.join()
          this.newAdd(this.newTaskRule)
          this.objInit()
        }
      }
    },
    end1() {
      this.week = [...new Set(this.week)]
      console.log('编辑确认')
      this.form3.uid = localStorage.getItem('uid')
      this.form3.ruleName = this.form1.ruleName
      this.form3.checkCount = this.form1.num
      this.form3.repeatCondition = this.week.join()
      console.log(this.form3)
      this.bianJi(this.form3)
    },
    // 巡更次数只能写数字
    ipt(val) {
      console.log(val)
    },
    // 编辑
    edit(scope) {
      console.log(scope)
      let obj = scope.row
      this.form3 = scope.row
      this.form3.id = obj.id
      this.week = obj.repeatCondition.split(',')
      console.log(this.week)
      this.dialogVisible1 = true
      this.form1.num = obj.checkCount
      this.form1.ruleName = obj.ruleName
      if (obj.ruleTypeId == 0) {
        this.flag = true
        this.flag1 = false
        this.flag2 = false
        this.flag3 = false
        this.form1.value = obj.time.split('~')
        this.form1.value1 = obj.ruleType
        this.form1.ruleName = obj.ruleName
        this.form1.value2 = [
          obj.validDateStart + ' ' + obj.timeStart,
          obj.validDateEnd + ' ' + obj.timeEnd
        ]

        let checkArr = obj.repeatCondition.split(',')
        if (obj.repeatCondition == '1,2,3,4,5,6,7') {
          checkArr.forEach(item => {
            this.form1.check[item - 1].checked = true
          })
          this.form1.check[7].checked = true
        } else {
          checkArr.forEach(item => {
            this.form1.check[item - 1].checked = true
          })
        }
      } else if (obj.ruleTypeId == 1) {
        this.flag = false
        this.flag1 = true
        this.flag2 = false
        this.flag3 = false
        this.form1.value = obj.time.split('~')
        this.form1.value1 = obj.ruleType
        this.form1.value3 = obj.dayStart
        this.form1.value4 = obj.dayEnd
        this.form1.value5 = obj.validDateStart + ' ' + obj.timeStart
        this.form1.value6 = obj.validDateEnd + ' ' + obj.timeEnd
      } else if (obj.ruleTypeId == 2) {
        this.flag = false
        this.flag1 = false
        this.flag2 = true
        this.flag3 = false
        this.form1.value = obj.time.split('~')
        this.form1.value1 = obj.ruleType
        this.form1.value7 = obj.dayStart
        this.form1.value9 = obj.dayEnd
        this.form1.value8 = obj.validDateStart + ' ' + obj.timeStart
        this.form1.value10 = obj.validDateEnd + ' ' + obj.timeEnd
      } else if (obj.ruleTypeId == 3) {
        this.flag = false
        this.flag1 = false
        this.flag2 = false
        this.flag3 = true
        this.form1.value = obj.time.split('~')
        this.form1.value1 = obj.ruleType
        this.form1.value11 = obj.monthNoStart
        this.form1.value12 = obj.monthNoEnd
        this.form1.value7 = obj.dayStart
        this.form1.value9 = obj.dayEnd
        this.form1.value8 = obj.validDateStart + ' ' + obj.timeStart
        this.form1.value10 = obj.validDateEnd + ' ' + obj.timeEnd
      }
    },
    shanChu(scope) {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // })
          this.remove(scope.row.id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      // console.log(scope)
      // this.remove(scope.row.id)
    },

    // 查询
    query() {
      this.listQuery.ruleName = this.input
      this.getList()
      console.log('查询')
    }
  }
}
</script>
<style lang='less' scoped>
.app-container {
  .zhouTime {
    display: flex;
    /deep/.el-select > .el-input {
      width: 100px;
    }
  }
}
</style>