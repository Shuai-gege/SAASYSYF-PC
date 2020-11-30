<template>
  <!-- 报事类型管理 -->
  <div class="app-container">
    <!-- 搜索框所在区域 -->
    <div style="margin-top:20px;margin-bottom: 20px">
      <!-- 分割线 -->
      <el-row :gutter="12">
        <!-- <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>-->
        <el-col :span="8">
          <!-- <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >查找</el-button>-->
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            @click="handleAdd"
          >
            <i class="el-icon-plus" />新增
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 展示区域 -->
    <div>
      <el-row>
        <el-col :span="23">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            style="width: 100%;"
            height="550"
            border
            :stripe="true"
            :highlight-current-row="true"
          >
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="id" label="数据id" width="200" /> -->
            <el-table-column prop="eventType" label="事件类型名称" />
            <el-table-column prop="executeUserName" label="执行人" />
            <el-table-column prop="departmentName" label="部门id" />
            <el-table-column prop="userIdAName" label="响应人A" />
            <el-table-column prop="userIdBName" label="响应人B" />
            <el-table-column prop="invalidUserName" label="无效任务审核人" />
            <!-- <el-table-column
              prop="createTime"
              label="创建时间"
              width="200"
              :formatter="formatDateTime"
            />-->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleEdit(scope)">编辑</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope)">删除</el-button>
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
    <!-- 编辑弹出框 -->
    <el-dialog :visible.sync="dialogVisibleEdit" title="编辑" :before-close="handleClose">
      <el-form ref="form" :model="entityVO" label-width="80px" label-position="right">
        <el-form-item label="事件类型">
          <el-input v-model="entityVO.eventType" placeholder="报事类型"></el-input>
        </el-form-item>
        <el-form-item label="执行人">
          <el-select
            v-model="entityVO.executeName"
            filterable
            multiple
            placeholder="请选择"
            @change="execute"
          >
            <el-option
              v-for="item in options2"
              :key="item.uid"
              :label="item.vserName"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="响应人A">
          <el-row class="demo-autocomplete">
            <el-col :span="12">
              <el-select
                v-model="entityVO.userIdAName"
                filterable
                placeholder="请选择"
                @change="duoXuanA"
              >
                <el-option
                  v-for="item in options"
                  :key="item.uid"
                  :label="item.vserName"
                  :value="item.uid"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="响应人B">
          <el-row class="demo-autocomplete">
            <el-col :span="12">
              <el-select
                v-model="entityVO.userBName"
                filterable
                multiple
                placeholder="请选择"
                @change="duoXuanB"
              >
                <el-option
                  v-for="item in options3"
                  :key="item.uid"
                  :label="item.vserName"
                  :value="item.uid"
                  v-if="item.uid != uidA"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="无效任务审核人" label-width="120px">
          <el-row class="demo-autocomplete">
            <el-col :span="12">
              <el-autocomplete
                class="inline-input"
                v-model="entityVO.invalidUserName"
                :fetch-suggestions="querySearch"
                placeholder="请选择无效任务审核人"
                @select="handleSelect2"
              ></el-autocomplete>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="shuaXin">取消</el-button>
        <el-button type="primary" @click="confirmTbeventtypeconfigEdit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹出框 -->
    <el-dialog :visible.sync="dialogVisibleAdd" title="新增" :before-close="handleClose">
      <el-form ref="form" :model="entityVO" label-width="80px" label-position="right">
        <el-form-item label="事件类型">
          <el-input v-model="entityVO.eventType" placeholder="报事类型"></el-input>
        </el-form-item>
        <el-form-item label="执行人">
          <el-select v-model="value2" filterable multiple placeholder="请选择" @change="execute">
            <el-option
              v-for="item in options2"
              :key="item.uid"
              :label="item.vserName"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="响应人A">
          <el-row class="demo-autocomplete">
            <el-col :span="12">
              <el-select v-model="value" filterable placeholder="请选择" @change="duoXuan2">
                <el-option
                  v-for="item in options"
                  :key="item.uid"
                  :label="item.vserName"
                  :value="item.uid"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="响应人B">
          <el-row class="demo-autocomplete">
            <el-col :span="12">
              <el-select
                v-model="value1"
                filterable
                multiple
                placeholder="请选择"
                @change="duoXuan1"
                @focus="focus"
              >
                <el-option
                  v-for="item in options1"
                  :key="item.uid"
                  :label="item.vserName"
                  :value="item.uid"
                  v-if="item.uid != uidA"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="无效任务审核人" label-width="120px">
          <el-row class="demo-autocomplete">
            <el-col :span="12">
              <el-autocomplete
                class="inline-input"
                v-model="state3"
                :fetch-suggestions="querySearch"
                placeholder="请选择无效任务审核人"
                @select="handleSelect2"
              ></el-autocomplete>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- <el-form-item label="创建时间">
          <el-date-picker v-model="entityVO.createTime" type="datetime" placeholder="创建时间"></el-date-picker>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="shuXin1">取消</el-button>
        <el-button type="primary" @click="confirmTbeventtypeconfigAdd">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import {
  tbeventtypeconfiglist,
  tbeventtypeconfigedit,
  tbeventtypeconfigdelete,
  tbeventtypeconfigadd,
  getcompanydept,
  getcompanyalluser,
  getuserlist,
  tbEventTypeConfig // 选择相应人A&B
} from '@/api/iguard/tbeventtypeconfig/tbeventtypeconfig'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { deepClone } from '@/utils'
import { formatTimeToStr } from '@/utils/dateUtil' //处理后台传来的时间
const token = getToken()
const entityVO = {
  uid: localStorage.getItem('uid'),
  id: '',
  eventType: '',
  departmentId: localStorage.getItem('deptid'),
  userIdA: '',
  userIdB: '',
  invalidUserId: '',
  createTime: '',
  executeUserId: ''
}

export default {
  name: `tbeventtypeconfig`,
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      tableKey: 0,
      listLoading: false,
      listQuery: {
        uid: localStorage.getItem('uid'),
        page: 1,
        limit: 50,
        id: '',
        eventType: '',
        departmentId: '',
        userIdA: '',
        userIdB: '',
        invalidUserId: '',
        createTime: ''
      },
      userList: {
        uid: '', // 人员id
        name: '', // 人员登录名
        vsername: '', // 人员名称
        mobile: '', // 手机号码
        state: '', // 用户状态，1：正常  0：禁用
        deptid: '', // 部门id
        jobid: '', // 岗位id
        email: '' // 邮箱
      },
      headersObj: { 'LinkAdmin-Token': token },
      activeName: 'first',
      num: {},
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      dialogType: 'new',
      entityVO: Object.assign({}, entityVO),
      entityVO1: Object.assign({}, entityVO),
      value1: '',
      falg: false, //隐藏显示部门树形图
      filterText: '', //模糊查询所有部门
      data: [], //所属公司所有部门
      departmentId: '', //公司Id
      defaultProps: {
        //所属公司所有部门
        children: 'childrens',
        label: 'name'
      },

      restaurants: [], //响应人list
      restaurants1: [], //响应人A
      state1: '', //响应人A
      state2: '', //响应人B
      restaurants2: [], //响应人B
      state3: '', //无效任务审批人
      restaurants3: [], //无效任务审批人
      options: [], //执行人多选
      value: '', //执行人多选
      value1: '', //多选分配人B
      value2: '', //执行人
      options1: [], //分配人B多选
      options2: [], //执行人
      options3: [], //编辑执行人B
      value: '', //执行人
      uidA: '' //判断A和B不能是同一人
    }
  },
  watch: {
    searchDeptName(val) {
      this.$refs.serchDeptTree.filter(val)
    },
    //部门模糊查询
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getList()
    this.a()
  },
  mounted() {
    // this.getcompanydeptlist()
    this.zhiXingRen()

    // this.b()
  },
  methods: {
    //弹出窗点击关闭询问
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          window.location.reload()
        })
        .catch(_ => {})
    },
    shuaXin() {
      window.location.reload()
      this.dialogVisibleEdit = false
    },
    shuXin1() {
      window.location.reload()
      this.dialogVisibleAdd = false
    },
    //树形图函数
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    //事件类型list
    async getList() {
      this.listLoading = true
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await tbeventtypeconfiglist(this.listQuery)
        this.listLoading = false
        this.list = res.result.rows
        this.total = res.result.records
        console.log(this.list)
      } catch (e) {
        this.listLoading = false
      }
    },
    //获取登录人的所属公司list
    // async getcompanydeptlist() {
    //   try {
    //     const res = await getcompanydept(localStorage.getItem('uid'))
    //     this.data = res.result
    //     console.log(res)
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },
    // 新建选中树形图的操作
    xuan(val) {
      console.log(val)
      this.filterText = val.name
      this.entityVO.departmentId = val.id
      this.userList.deptid = val.id
    },
    // 编辑选中树形图的操作
    xuan1(val) {
      console.log(val)
      this.entityVO.departmentName = val.name
      this.entityVO.departmentId = val.id
      this.userList.deptid = val.id
    },
    // 查询
    // handleSearch() {
    //   this.getList();
    // },
    // 点击编辑按钮触发
    handleEdit(scope) {
      this.b()
      console.log(scope)
      this.dialogVisibleEdit = true
      this.entityVO = deepClone(scope.row)
      this.entityVO1 = deepClone(scope.row)
      let userBName = this.entityVO.userIdB
      let executeName = this.entityVO.executeUserId
      this.$set(this.entityVO, 'userBName', userBName.split(','))
      this.$set(this.entityVO, 'executeName', executeName.split(','))
      console.log(this.entityVO)
    },
    // 点击新增按钮触发
    handleAdd(scope) {
      this.dialogVisibleAdd = true
    },
    // 编辑功能结束，点击确定按钮触发
    async confirmTbeventtypeconfigEdit() {
      console.log(this.entityVO)
      const res = await tbeventtypeconfigedit(this.entityVO)
      const result = res.code
      if (result == 20000) {
        this.$message({
          showClose: true,
          message: '编辑成功',
          type: 'success'
        })
        this.dialogVisibleEdit = false
        this.getList()
      }
    },
    // 新增功能结束，点击确定按钮触发
    async confirmTbeventtypeconfigAdd() {
      if (this.entityVO.eventType == '') {
        this.$message({ message: '请填写事件类型', type: 'warning' })
      } else if (this.entityVO.executeUserId == '') {
        this.$message({ message: '请选择执行人', type: 'warning' })
      } else if (this.entityVO.userIdA == '') {
        this.$message({ message: '请选择响应人A', type: 'warning' })
      } else if (this.entityVO.invalidUserId == '') {
        this.$message({ message: '请选择无效任务审批人', type: 'warning' })
      } else {
        const res = await tbeventtypeconfigadd(this.entityVO)
        const result = res.code
        if (result == 20000) {
          this.$message({
            showClose: true,
            message: '新增成功',
            type: 'success'
          })
          this.dialogVisibleAdd = false
          // this.$router.go(0)
          this.getList()
        }
      }
    },
    // 点击删除按钮触发 删除生成的表的记录
    async handleDelete(scope) {
      const h = this.$createElement
      this.entityVO = deepClone(scope.row)
      this.$msgbox({
        title: '删除消息',
        message: h('p', null, [
          h('span', null, '确定要删除 '),
          h('i', { style: 'color: teal' }, '这条记录吗?')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            const res = await tbeventtypeconfigdelete(this.entityVO)
            if (res.code == 20000) {
              done()
            }
          } else {
            done()
          }
        }
      }).then(action => {
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功'
        })
        this.getList()
      })
    },
    // 时间格式化
    formatDateTime(row, column) {
      return formatTimeToStr(row.createTime, 'yyyy-MM-dd hh:mm:ss')
    },
    //响应人A & 响应人B & 无效任务处理人
    async zhiXingRen() {
      try {
        // const res = await getcompanyalluser(localStorage.getItem("uid"));
        const res = await getuserlist(this.userList)
        this.restaurants1 = res.result.rows
        this.options2 = res.result.rows
      } catch (e) {
        console.log(e)
      }
    },
    // //响应人A & 响应人B & 无效任务处理人
    async querySearch(queryString, cb) {
      try {
        // const res = await getcompanyalluser(localStorage.getItem("uid"));
        const res = await getuserlist(this.userList)
        this.restaurants1 = res.result.rows
        for (var i = 0; i < res.result.rows.length; i++) {
          this.$set(
            this.restaurants1[i],
            'value',
            this.restaurants1[i].vserName
          )
        }
        this.options2 = res.result.rows
        console.log(res.result.rows)
        var restaurants2 = queryString
          ? this.restaurants1.filter(this.createFilter(queryString))
          : this.restaurants1
      } catch (e) {
        console.log(e)
      }
      cb(restaurants2)
    },
    // 响应人A
    async a() {
      try {
        // const res = await getcompanyalluser(localStorage.getItem("uid"));
        const res = await tbEventTypeConfig(localStorage.getItem('uid'), 'A')
        this.options = res.result
      } catch (e) {
        console.log('到底怎么回事')
        console.log(e)
      }
    },
    // 响应人B
    async b() {
      try {
        // const res = await getcompanyalluser(localStorage.getItem("uid"));
        const res = await tbEventTypeConfig(localStorage.getItem('uid'), 'B')
        this.restaurants1 = res.result
        // for (var i = 0; i < res.result.rows.length; i++) {
        //   this.$set(
        //     this.restaurants1[i],
        //     'value',
        //     this.restaurants1[i].vserName
        //   )
        // }
        this.options1 = res.result
        this.options3 = res.result
      } catch (e) {
        console.log(e)
      }
    },
    //筛选
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    // 分配人A
    handleSelect(item) {
      this.entityVO.userIdA = item.uid
    },
    // 分配人B
    handleSelect1(item) {
      this.entityVO.userIdB = item.uid
    },
    // 执行人多选
    duoXuan(value) {
      this.entityVO.executeUserId = value.join(',')
    },
    focus() {
      if (this.value == '') {
        this.$message({ message: '请选择响应人A', type: 'warning' })
        this.options1 = []
      } else {
        this.b()
      }
    },
    // 分配人B多选
    duoXuan1(value) {
      this.entityVO.userIdB = value.join(',')
    },
    // 分配人A多选
    duoXuan2(value) {
      this.entityVO.userIdA = value
      this.uidA = value
    },
    // 编辑分配人B多选
    duoXuanB(value) {
      console.log(value)
      this.entityVO.userIdB = value.join(',')
    },
    // 编辑分配人A多选
    duoXuanA(value) {
      console.log(value)
      this.entityVO.userIdA = value
      this.uidA = value
    },
    // 执行人
    execute(value) {
      console.log(value)
      this.entityVO.executeUserId = value.join(',')
    },
    // 无效任务审批人
    handleSelect2(item) {
      this.entityVO.invalidUserId = item.uid
    }
  }
}
</script>
<style lang="less" scoped>
.app-container {
  .pour {
    color: #44b3ff;
  }
}
</style>