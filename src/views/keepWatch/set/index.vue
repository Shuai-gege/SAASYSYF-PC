<template>
  <!-- 巡更点设置 -->
  <div class="app-container">
    <!-- 查询模块 -->
    <el-row :gutter="24">
      <!-- 选择企业 -->
      <el-col :span="3">
        <el-select v-model="value1" placeholder="企业" @change="company">
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
        <el-select v-model="value2" placeholder="建筑" @change="jianZhu">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 楼层 -->
      <el-col :span="2">
        <el-select v-model="value3" placeholder="楼层" @change="floorId">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- POI -->
      <el-col :span="2">
        <el-select v-model="value4" placeholder="POI" @change="poiId">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 巡更点名称、编号 -->
      <el-col :span="3">
        <el-input v-model="input" placeholder="巡更点名称"></el-input>
      </el-col>
      <el-col :span="3">
        <el-input v-model="input1" placeholder="编号"></el-input>
      </el-col>
      <!-- 状态 -->
      <el-col :span="3">
        <el-select v-model="value5" placeholder="状态" @change="stop">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
    <div>
      <el-row>
        <el-col :span="23">
          <el-table :data="tableData" style="width: 100%;" height="600" border v-loading="loading">
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+listQuery.page * listQuery.pageSize + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="buildingName" label="建筑名称" />
            <el-table-column prop="floorName" label="楼层" />
            <el-table-column prop="patrolPointCode" label="巡更点编号" />
            <el-table-column prop="patrolName" label="巡更点名称" />
            <el-table-column prop="stop" label="状态" />
            <el-table-column prop="zip" label="禁用/启用">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.useStop"
                  :active-value="0"
                  :inactive-value="1"
                  @change="handleStateChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="zip" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
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
    <!-- 新增 -->
    <div>
      <el-dialog title="新增" :visible.sync="dialogVisible" width="35%" :before-close="handleClose">
        <el-form :label-position="labelPosition" label-width="90px" :model="formList">
          <!-- 选择选项 -->
          <!-- 企业 -->
          <el-form-item label="企业">
            <el-select v-model="formList.value1" placeholder="企业" @change="company1">
              <el-option
                v-for="item in formList.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 建筑 -->
          <el-form-item label="建筑">
            <el-select v-model="formList.value2" placeholder="建筑" @change="jianZhu1">
              <el-option
                v-for="item in formList.options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 楼层 -->
          <el-form-item label="楼层">
            <el-select v-model="formList.value3" placeholder="楼层" @change="floorId1">
              <el-option
                v-for="item in formList.options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 手写选项 -->
          <el-form-item label="巡更点名称">
            <el-input v-model="addXunGeng.patrolName"></el-input>
          </el-form-item>
          <el-form-item label="UUID">
            <el-input v-model="addXunGeng.patrolUuid1"></el-input>/
            <el-input v-model="addXunGeng.patrolUuid2"></el-input>
          </el-form-item>
          <el-form-item label="Major">
            <el-input v-model="addXunGeng.patrolMajor1"></el-input>/
            <el-input v-model="addXunGeng.patrolMajor2"></el-input>
          </el-form-item>
          <el-form-item label="Minor">
            <el-input v-model="addXunGeng.patrolMinor1"></el-input>/
            <el-input v-model="addXunGeng.patrolMinor2"></el-input>
          </el-form-item>
          <el-form-item label="Mac">
            <el-input v-model="addXunGeng.patrolMac1"></el-input>/
            <el-input v-model="addXunGeng.patrolMac2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="end">确 定</el-button>
          <el-button type="primary" @click="next">下一个</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 编辑 -->
    <div>
      <el-dialog title="编辑" :visible.sync="dialogVisible1" width="35%" :before-close="handleClose">
        <el-form :label-position="labelPosition" label-width="90px" :model="formList1">
          <!-- 选择选项 -->
          <!-- 企业 -->
          <el-form-item label="企业">
            <el-select v-model="formList1.value" placeholder="企业" @change="company1">
              <el-option
                v-for="item in formList1.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 建筑 -->
          <el-form-item label="建筑">
            <el-select v-model="formList1.buildingName" placeholder="建筑" @change="jianZhu1">
              <el-option
                v-for="item in formList1.options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 楼层 -->
          <el-form-item label="楼层">
            <el-select v-model="formList1.floorName" placeholder="楼层" @change="floorId1">
              <el-option
                v-for="item in formList1.options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 手写选项 -->
          <el-form-item label="巡更点名称">
            <el-input v-model="editXunGeng.patrolName"></el-input>
          </el-form-item>
          <el-form-item label="UUID">
            <el-input v-model="editXunGeng.patrolUuid1"></el-input>/
            <el-input v-model="editXunGeng.patrolUuid2"></el-input>
          </el-form-item>
          <el-form-item label="Major">
            <el-input v-model="editXunGeng.patrolMajor1"></el-input>/
            <el-input v-model="editXunGeng.patrolMajor2"></el-input>
          </el-form-item>
          <el-form-item label="Minor">
            <el-input v-model="editXunGeng.patrolMinor1"></el-input>/
            <el-input v-model="editXunGeng.patrolMinor2"></el-input>
          </el-form-item>
          <el-form-item label="Mac">
            <el-input v-model="editXunGeng.patrolMac1"></el-input>/
            <el-input v-model="editXunGeng.patrolMac2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="end1">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getCompanyByUid,
  getCompanyDeptByCompanyId,
  getBuildingLocationFloor,
  getPatrolPointList,
  add,
  stopOrStart,
  remove,
  modify,
  patrolPointRepeat,
  getPatrolPointDefault
} from '@/api/iguard/keepWatch'
import Pagination from '@/components/Pagination' // Secondary
import { deepClone } from '@/utils'
const entityVO = {
  uid: localStorage.getItem('uid'),
  page: 0,
  pageSize: 50
}
export default {
  data() {
    return {
      value: '', //选择时间
      value1: '', //选择企业
      value2: '', //选择建筑
      value3: '', //选择楼层
      value4: '', //选择POI
      value5: '', //选择状态
      value6: '', //选择禁用/启用
      options: [], //企业选择
      options1: [], //企业建筑
      options2: [], //企业楼层
      options3: [], //企业POI
      options4: [
        {
          value: '0',
          label: '启用'
        },
        {
          value: '1',
          label: '禁用'
        }
      ], //状态
      startTime: '', //开始时间
      endTime: '', //结束时间
      company_id: '', //公司ID
      input: '', //巡更点名称，编号
      input1: '', //巡更点名称，编号
      tableData: [],
      total: 0, //数据总条数
      loading: true,
      dialogVisible: false, //新增弹出框
      dialogVisible1: false, //编辑弹出框
      labelPosition: 'right',
      listQuery: Object.assign({}, entityVO),
      check: '',
      checkEdit: false,
      formList: {
        options: [],
        options1: [],
        options2: [],
        value1: '',
        value1: '',
        value2: ''
      },
      formList1: {
        options: [],
        options1: [],
        options2: [],
        value1: '',
        value1: '',
        value2: ''
      },
      addXunGeng: {
        uid: localStorage.getItem('uid'),
        patrolName: '', //巡更点设置
        patrolUuid1: '', //第一个UUID
        patrolUuid2: '', //第二个UUID
        patrolMajor1: '', //第一个Major
        patrolMajor2: '', //第二个Major
        patrolMinor1: '', //第一个Minor
        patrolMinor2: '', //第二个Minor
        patrolMac1: '', //第一个Mac
        patrolMac2: '', //第二个Mac
        belongCompanyId: '', //选择企业
        buildingId: '', //选择建筑
        floorId: '' //选择楼层
      },
      editXunGeng: {
        uid: localStorage.getItem('uid'),
        patrolName: '', //巡更点设置
        patrolUuid1: '', //第一个UUID
        patrolUuid2: '', //第二个UUID
        patrolMajor1: '', //第一个Major
        patrolMajor2: '', //第二个Major
        patrolMinor1: '', //第一个Minor
        patrolMinor2: '', //第二个Minor
        patrolMac1: '', //第一个Mac
        patrolMac2: '', //第二个Mac
        belongCompanyId: '', //选择企业
        buildingId: '', //选择建筑
        floorId: '' //选择楼层
      }
    }
  },
  components: { Pagination },
  mounted() {
    this.getCompany()
    this.getList(this.listQuery)
    this.checkGeneral()
  },
  methods: {
    // 查询默认巡更点信息
    async checkGeneral() {
      try {
        const res = await getPatrolPointDefault(localStorage.getItem('deptid'))
        console.log(res)
        this.addXunGeng.patrolUuid1 = res.data.defaultUuid
        // this.addXunGeng.patrolUuid2 = res.data.defaultUuid
        this.addXunGeng.patrolMajor1 = res.data.defaultMajor
        this.addXunGeng.patrolMinor1 = res.data.defaultMinor
        this.addXunGeng.patrolMac1 = res.data.defaultMac
      } catch (err) {
        console.log(err)
      }
    },
    // 巡更点设置List
    async getList(listQuery) {
      this.loading = true
      this.listQuery.page = 0
      try {
        const res = await getPatrolPointList(listQuery)
        console.log(res)
        this.total = res.data.records
        this.tableData = res.data.rows
        this.loading = false
        this.tableData.forEach(item => {
          if (item.useStop == 0) {
            this.$set(item, 'stop', '启用')
          } else if (item.useStop == 1) {
            this.$set(item, 'stop', '禁用')
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 选择公司
    async getCompany() {
      try {
        const res = await getCompanyByUid(localStorage.getItem('uid'))
        console.log(res)
        this.options.push(res.result)
        this.options.forEach(item => {
          this.$set(item, 'label', item.name)
          this.$set(item, 'value', item.id)
        })
        this.formList.options.push(res.result)
        this.formList.options.forEach(item => {
          this.$set(item, 'label', item.name)
          this.$set(item, 'value', item.id)
        })
        this.formList1.options.push(res.result)
        this.formList1.options.forEach(item => {
          this.$set(item, 'label', item.name)
          this.$set(item, 'value', item.id)
        })
        this.value = res.result.id
      } catch (e) {
        console.log(e)
      }
    },
    // 点击选择公司获取id
    company(value) {
      console.log(value)
      this.company_id = value
      console.log(this.company_id)
      this.companyDept(this.company_id)
      this.listQuery.belongCompanyId = value
    },
    company1(value) {
      console.log(this.formList1)
      console.log(value)
      this.company_id = value
      this.addXunGeng.belongCompanyId = value
      this.editXunGeng.belongCompanyId = value
      this.companyDept(this.company_id)
    },
    // 获取建筑的信息
    jianZhu(value) {
      console.log(value)
      // let parentId = value.join()
      // console.log(parentId)
      this.listQuery.buildingId = value
      this.getFloor(value)
    },
    // 获取建筑的信息
    jianZhu1(value) {
      console.log(value)
      this.addXunGeng.buildingId = value
      this.editXunGeng.buildingId = value
      this.getFloor1(value)
    },
    floorId(value) {
      this.listQuery.floorId = value
      this.getFloor1(value)
    },
    floorId1(value) {
      this.addXunGeng.floorId = value
      this.editXunGeng.floorId = value
      this.getFloor1(value)
    },
    poiId(value) {},
    // 获取公司下面的建筑
    async companyDept(company_id) {
      try {
        const res = await getCompanyDeptByCompanyId(company_id)
        this.options1 = res.result
        this.options1.forEach(item => {
          this.$set(item, 'label', item.locationName)
          this.$set(item, 'value', item.id)
        })
        this.formList.options1 = res.result
        this.formList.options1.forEach(item => {
          this.$set(item, 'label', item.locationName)
          this.$set(item, 'value', item.id)
        })
        this.formList1.options1 = res.result
        this.formList1.options1.forEach(item => {
          this.$set(item, 'label', item.locationName)
          this.$set(item, 'value', item.id)
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 查询建筑下楼层&房间
    async getFloor(parentId) {
      try {
        const res = await getBuildingLocationFloor(parentId)
        this.formList.options2 = res.result
        this.formList.options2.forEach(item => {
          this.$set(item, 'label', item.locationName)
          this.$set(item, 'value', item.id)
        })
        console.log(this.formList.options2)
        this.options2 = res.result
        this.options2.forEach(item => {
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
        // res.result.forEach(item => {
        //   this.options3.push(item)
        //   this.$set(item, 'label', item.locationName)
        //   this.$set(item, 'value', item.id)
        // })
        this.formList.options2 = res.result
        this.formList.options2.forEach(item => {
          this.$set(item, 'label', item.locationName)
          this.$set(item, 'value', item.id)
        })
        this.formList1.options2 = res.result
        this.formList1.options2.forEach(item => {
          this.$set(item, 'label', item.locationName)
          this.$set(item, 'value', item.id)
        })
        console.log(this.formList1)
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭前确认
    handleClose(done) {
      this.$confirm('确认关闭？关闭后将刷新页面')
        .then(_ => {
          // 关闭后置空
          this.formList.UUid = ''
          this.formList.UUid1 = ''
          this.formList.Major = ''
          this.formList.Major1 = ''
          this.formList.Minor = ''
          this.formList.Minor1 = ''
          this.formList.Mac = ''
          this.formList.Mac1 = ''
          this.formList.value1 = ''
          this.formList.value2 = ''
          this.formList.value3 = ''
          this.formList.options = []
          this.formList.options1 = []
          this.formList.options2 = []
          history.go(0)
          this.getCompany()
          done()
        })
        .catch(_ => {})
    },
    // 新增巡更点
    async newAdd() {
      try {
        const res = await add(this.addXunGeng)
        this.getList(this.listQuery)
      } catch (e) {
        console.log(e)
      }
    },
    // 查看新增&编辑的巡更点有没有重复
    async repeat(obj) {
      console.log(this.addXunGeng)
      try {
        const res = await patrolPointRepeat(obj)
        console.log(res)
        this.check = res.code
        if (this.check == '20000') {
          if (this.checkEdit == true && this.check == '20000') {
            if (
              this.editXunGeng.patrolUuid1 +
                this.editXunGeng.patrolMajor1 +
                this.editXunGeng.patrolMinor1 +
                this.editXunGeng.patrolMac1 !=
              this.editXunGeng.patrolUuid2 +
                this.editXunGeng.patrolMajor2 +
                this.editXunGeng.patrolMinor2 +
                this.editXunGeng.patrolMac2
            ) {
              this.dialogVisible1 = false
              this.loading = true
              this.bianJi(this.editXunGeng)
              setInterval(() => {
                history.go(0)
              }, 300)
            } else {
              this.$message('UUID或者Major或者Mac重复，请检查')
            }
          } else {
            if (
              this.addXunGeng.patrolUuid1 +
                this.addXunGeng.patrolMajor1 +
                this.addXunGeng.patrolMinor1 +
                this.addXunGeng.patrolMac1 !=
              this.addXunGeng.patrolUuid2 +
                this.addXunGeng.patrolMajor2 +
                this.addXunGeng.patrolMinor2 +
                this.addXunGeng.patrolMac2
            ) {
              this.dialogVisible = false
              this.newAdd()
              setInterval(() => {
                history.go(0)
              }, 300)
            } else {
              this.$message('UUID或者Major或者Mac重复，请检查')
            }
          }
          this.addXunGeng = {
            uid: localStorage.getItem('uid'),
            patrolName: '', //巡更点设置
            patrolUuid1: '', //第一个UUID
            patrolUuid2: '', //第二个UUID
            patrolMajor1: '', //第一个Major
            patrolMajor2: '', //第二个Major
            patrolMinor1: '', //第一个Minor
            patrolMinor2: '', //第二个Minor
            patrolMac1: '', //第一个Mac
            patrolMac2: '', //第二个Mac
            belongCompanyId: '', //选择企业
            buildingId: '', //选择建筑
            floorId: '' //选择楼层
          }
          this.formList = {
            options: [],
            options1: [],
            options2: [],
            value: '',
            value1: '',
            value2: ''
          }
          this.getCompany()
        } else {
          this.$message(res.msg)
          setInterval(() => {
            history.go(0)
          }, 300)
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 新增确定
    end() {
      // this.dialogVisible = false
      if (this.addXunGeng.patrolName == '') {
        this.$message('请填写巡更点名字')
      } else if (this.addXunGeng.patrolUuid1 == '') {
        this.$message('请填写UUID')
      } else if (this.addXunGeng.patrolMajor1 == '') {
        this.$message('请填写Major')
      } else if (this.addXunGeng.patrolMinor1 == '') {
        this.$message('请填写Minor')
      } else if (this.addXunGeng.buildingId == '') {
        this.$message('请填写建筑')
      } else if (this.addXunGeng.patrolUuid2 == '') {
        this.repeat(this.addXunGeng)
      } else if (this.addXunGeng.patrolUuid2 != '') {
        if (this.addXunGeng.patrolMajor2 == '') {
          this.$message('请填写第二列Major')
        } else if (this.addXunGeng.patrolMinor2 == '') {
          this.$message('请填写第二列Minor')
        } else if (this.addXunGeng.patrolMac2 == '') {
          this.$message('请填写第二列Mac')
        } else {
          this.repeat(this.addXunGeng)
        }
      }

      // {
      //   this.repeat(this.addXunGeng)
      // }
    },

    // 新增下一个
    next() {
      // if (this.addXunGeng.patrolName == '') {
      //   this.$message('请填写巡更点名字')
      // } else if (this.addXunGeng.patrolUuid1 == '') {
      //   this.$message('请填写UUID')
      // } else if (this.addXunGeng.patrolMajor1 == '') {
      //   this.$message('请填写Major')
      // } else if (this.addXunGeng.patrolMinor1 == '') {
      //   this.$message('请填写Minor')
      // } else if (this.addXunGeng.buildingId == '') {
      //   this.$message('请填写建筑')
      // } else {
      //   this.repeat(this.addXunGeng)
      // }
      if (this.addXunGeng.patrolName == '') {
        this.$message('请填写巡更点名字')
      } else if (this.addXunGeng.patrolUuid1 == '') {
        this.$message('请填写UUID')
      } else if (this.addXunGeng.patrolMajor1 == '') {
        this.$message('请填写Major')
      } else if (this.addXunGeng.patrolMinor1 == '') {
        this.$message('请填写Minor')
      } else if (this.addXunGeng.buildingId == '') {
        this.$message('请填写建筑')
      } else if (this.addXunGeng.patrolUuid2 == '') {
        this.repeat(this.addXunGeng)
      } else if (this.addXunGeng.patrolUuid2 != '') {
        if (this.addXunGeng.patrolMajor2 == '') {
          this.$message('请填写第二列Major')
        } else if (this.addXunGeng.patrolMinor2 == '') {
          this.$message('请填写第二列Minor')
        } else if (this.addXunGeng.patrolMac2 == '') {
          this.$message('请填写第二列Mac')
        } else {
          this.repeat(this.addXunGeng)
        }
      }
    },
    async stopStart(id, uid) {
      try {
        const res = await stopOrStart(id, uid)
        this.$message('操作成功')
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    async shan(id, uid) {
      try {
        const res = await remove(id, uid)
        this.$message('删除成功')
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 禁用
    handleStateChange(scope) {
      console.log(scope)
      this.loading = true
      this.stopStart(scope.id, localStorage.getItem('uid'))
      setTimeout(() => {
        this.getList(this.listQuery)
      }, 500)
    },
    // 删除巡更点
    shanChu(scope) {
      console.log(scope)
      this.loading = true
      this.shan(scope.row.id, localStorage.getItem('uid'))
      setTimeout(() => {
        this.getList(this.listQuery)
      }, 500)
    },
    // 编辑
    edit(scope) {
      console.log(scope)
      this.checkEdit = true
      this.dialogVisible1 = true
      this.editXunGeng = deepClone(scope.row)
      this.formList1 = deepClone(scope.row)
      this.formList1.options = []
      this.formList1.options1 = []
      this.formList1.options2 = []
      this.formList1.value = scope.row.companyName
      this.formList1.value1 = ''
      this.formList1.value2 = ''
      this.getCompany()
      this.companyDept(scope.row.companyId)
      this.getFloor1(scope.row.buildingId)
      console.log(this.formList1)
    },
    async bianJi(data) {
      try {
        const res = await modify(data)
        this.$message('修改成功')
      } catch (e) {
        console.log(e)
      }
    },
    // 编辑确定
    end1() {
      this.getCompany()
      // this.dialogVisible1 = false
      // this.loading = true
      this.editXunGeng.uid = localStorage.getItem('uid')

      // if (this.editXunGeng.patrolName == '') {
      //   this.$message('请填写巡更点名字')
      // } else if (this.editXunGeng.patrolUuid1 == '') {
      //   this.$message('请填写UUID')
      // } else if (this.editXunGeng.patrolMajor1 == '') {
      //   this.$message('请填写Major')
      // } else if (this.editXunGeng.patrolMinor1 == '') {
      //   this.$message('请填写Minor')
      // } else if (this.editXunGeng.buildingId == '') {
      //   this.$message('请填写建筑')
      // } else {
      //   this.repeat(this.editXunGeng)
      // }
      if (this.editXunGeng.patrolName == '') {
        this.$message('请填写巡更点名字')
      } else if (this.editXunGeng.patrolUuid1 == '') {
        this.$message('请填写UUID')
      } else if (this.editXunGeng.patrolMajor1 == '') {
        this.$message('请填写Major')
      } else if (this.editXunGeng.patrolMinor1 == '') {
        this.$message('请填写Minor')
      } else if (this.editXunGeng.buildingId == '') {
        this.$message('请填写建筑')
      } else if (this.editXunGeng.patrolUuid2 == '') {
        this.repeat(this.editXunGeng)
      } else if (this.editXunGeng.patrolUuid2 != '') {
        if (this.editXunGeng.patrolMajor2 == '') {
          this.$message('请填写第二列Major')
        } else if (this.editXunGeng.patrolMinor2 == '') {
          this.$message('请填写第二列Minor')
        } else if (this.editXunGeng.patrolMac2 == '') {
          this.$message('请填写第二列Mac')
        } else {
          this.repeat(this.editXunGeng)
        }
      }
      // this.bianJi(this.editXunGeng)
    },
    // 启用禁用
    stop(value) {
      console.log(value)
      this.listQuery.useStop = value
    },
    // 筛选查询
    query() {
      this.listQuery.patrolName = this.input
      this.listQuery.patrolPointCode = this.input1
      console.log(this.listQuery)
      this.getList(this.listQuery)
      console.log('查询')
    }
  }
}
</script>
<style lang='less' scoped>
.app-container {
  // .line {
  //   text-align: center;
  // }
  /deep/.el-form-item__content {
    display: flex;
  }
}
</style>