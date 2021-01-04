<template>
  <div class="app-container">
    <div style="margin-top:20px;margin-bottom: 20px">
      <el-row :gutter="20">
        <el-col :span="4">
          <!--          类型/品牌/型号/-->
          <el-input v-model="listQuery.deviceName" placeholder="名称" />
        </el-col>

        <el-col :span="4">
          <el-select v-model="listQuery.buildingId" placeholder="建筑" clearable @change="getFloors">
            <el-option
              v-for="item in buildings"
              :key="item.id"
              :label="item.locationName"
              :value="item.id"
            />
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-select v-model="listQuery.floorId" placeholder="楼层" clearable>
            <el-option
              v-for="item in floors"
              :key="item.id"
              :label="item.locationName"
              :value="item.id"
            />
          </el-select>
        </el-col>

        <el-col :span="8">
          <el-button
            v-permission="['/rest/deviceInfo/list']"
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >查找</el-button>
          <el-button
            v-permission="['/rest/deviceInfo/add']"
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            @click="handleCreate"
          >
            <i class="el-icon-plus" />新增设备
          </el-button>

          <el-button
            v-permission="['/rest/deviceInfo/exportQR']"
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            @click="handleExportQR"
          >导出二维码</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <div
          class="pour"
          v-if="num.check_device_count !=null"
        >注：此功能支持免费使用，{{num.level_name}}仅支持录入{{num.check_device_count}}个设备！请联系客服159-5174-1967购买服务，提高授权数量</div>
      </el-row>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%;"
      height="600"
    >
      <el-table-column width="50" label="序号">
        <template slot-scope="scope">
          <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="deviceName" label="设备名称" />

      <el-table-column prop="typeName" label="类型" :formatter="formatType" />

      <el-table-column prop="brandName" label="品牌" :formatter="formatBrand" />

      <el-table-column prop="deviceModel" label="型号" :formatter="formatModel" />

      <el-table-column prop="address" label="地址" :formatter="formatAddress" />

      <el-table-column prop="useTime" label="投放日期" :formatter="time" />

      <el-table-column prop="description" label="备注" />

      <el-table-column prop="rqUrl" label="二维码">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.qrUrl"
            :preview-src-list="[scope.row.qrUrl]"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column prop="deviceImg" label="图片">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.deviceImg"
            :preview-src-list="[scope.row.deviceImg]"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-permission="['/rest/deviceInfo/update']"
            type="text"
            size="small"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button type="text" size="mini" style="color: #C03639" @click="check(scope)">检查项</el-button>
          <el-button
            v-permission="['/rest/deviceInfo/delete']"
            type="text"
            size="small"
            @click="handleDelete(scope)"
          >删除</el-button>
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'">
      <el-form
        ref="form"
        :model="deviceInfo"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="deviceInfo.deviceName" placeholder="设备名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <!--          <el-select v-model="deviceInfo.type" filterable style="width:100%">-->
          <!--            <el-option-->
          <!--              v-for="item in deviceTypes"-->
          <!--              :key="item.data_key"-->
          <!--              :label="item.data_value"-->
          <!--              :value="item.data_key">-->

          <!--              <span style="float: left; color: #C03639; font-size: 27px">{{ item.data_value }}</span>-->
          <!--              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>-->
          <!--            </el-option>-->
          <!--          </el-select>-->

          <el-popover placement="bottom" trigger="click" :hide="popoverHide" style="width: 100%">
            <div style="text-align: left; margin: 0">
              <el-button type="primary" size="mini" @click="addDictInfo('device_type')">新建条目</el-button>
            </div>

            <el-table :data="deviceTypes" style="width: 100%;" height="200">
              <el-table-column width="400px" property="data_value" label>
                <template slot="header" slot-scope="scope">
                  <el-input v-model="searchDeviceType" size="medium" placeholder="输入关键字搜索" />
                </template>
                <template slot-scope="scope">
                  <el-button
                    style="width: 100%; text-align: left"
                    size="mini"
                    type="text"
                    @click="selectDict(scope)"
                  >{{scope.row.dataValue}}</el-button>
                </template>
              </el-table-column>

              <el-table-column label width="150px">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    style="color: #C03639"
                    @click="editDictInfo(scope)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    style="color: #8c939d"
                    @click="dictInfoDelete(scope)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-button
              slot="reference"
              ref="deviceTypeSelect"
              style="width: 100%; text-align: left; color: #8c939d"
              v-cloak
            >{{deviceTypeTitle}}</el-button>
          </el-popover>
        </el-form-item>

        <el-form-item label="品牌" prop="brand">
          <!--          <el-select v-model="deviceInfo.brand" filterable style="width:100%">-->
          <!--            <el-option-->
          <!--              v-for="item in deviceBrands"-->
          <!--              :key="item.data_key"-->
          <!--              :label="item.data_value"-->
          <!--              :value="item.data_key"-->
          <!--            />-->
          <!--          </el-select>-->

          <el-popover placement="bottom" trigger="click" :hide="popoverHide" style="width: 100%">
            <div style="text-align: left; margin: 0">
              <el-button type="primary" size="mini" @click="addDictInfo('device_brand')">新建条目</el-button>
            </div>

            <el-table :data="deviceBrands" style="width: 100%;" height="200">
              <el-table-column width="400px" property="data_value" label>
                <template slot="header" slot-scope="scope">
                  <el-input v-model="searchDeviceBrand" size="medium" placeholder="输入关键字搜索" />
                </template>
                <template slot-scope="scope">
                  <el-button
                    style="width: 100%; text-align: left"
                    size="mini"
                    type="text"
                    @click="selectDict(scope)"
                  >{{scope.row.dataValue}}</el-button>
                </template>
              </el-table-column>

              <el-table-column label width="150px">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    style="color: #C03639"
                    @click="editDictInfo(scope)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    style="color: #8c939d"
                    @click="dictInfoDelete(scope)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-button
              slot="reference"
              ref="deviceBrandSelect"
              style="width: 100%; text-align: left; color: #8c939d"
              v-cloak
            >{{deviceBrandTitle}}</el-button>
          </el-popover>
        </el-form-item>

        <el-form-item label="型号" prop="model">
          <!--          <el-select v-model="deviceInfo.model" filterable style="width:100%">-->
          <!--            <el-option-->
          <!--              v-for="item in deviceModels"-->
          <!--              :key="item.data_key"-->
          <!--              :label="item.data_value"-->
          <!--              :value="item.data_key"-->
          <!--            />-->
          <!--          </el-select>-->

          <el-popover placement="bottom" trigger="click" :hide="popoverHide" style="width: 100%">
            <div style="text-align: left; margin: 0">
              <el-button type="primary" size="mini" @click="addDictInfo('device_model')">新建条目</el-button>
            </div>

            <el-table :data="deviceModels" style="width: 100%;" height="200">
              <el-table-column width="400px" property="data_value" label>
                <template slot="header" slot-scope="scope">
                  <el-input v-model="searchDeviceMode" size="medium" placeholder="输入关键字搜索" />
                </template>
                <template slot-scope="scope">
                  <el-button
                    style="width: 100%; text-align: left"
                    size="mini"
                    type="text"
                    @click="selectDict(scope)"
                  >{{scope.row.dataValue}}</el-button>
                </template>
              </el-table-column>

              <el-table-column label width="150px">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    style="color: #C03639"
                    @click="editDictInfo(scope)"
                  >编辑</el-button>

                  <el-button
                    type="text"
                    size="mini"
                    style="color: #8c939d"
                    @click="dictInfoDelete(scope)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-button
              slot="reference"
              ref="deviceModelSelect"
              style="width: 100%; text-align: left; color: #8c939d"
              v-cloak
            >{{deviceModelTitle}}</el-button>
          </el-popover>
        </el-form-item>

        <el-form-item label="位置" prop="model">
          <el-select
            v-model="deviceInfo.buildingId"
            placeholder="建筑"
            clearable
            @change="getEditFloors"
          >
            <el-option
              v-for="item in buildings"
              :key="item.id"
              :label="item.locationName"
              :value="item.id"
            />
          </el-select>

          <el-select v-model="deviceInfo.floorId" placeholder="楼层" clearable @change="louCeng">
            <el-option
              v-for="item in editViewFloors"
              :key="item.id"
              :label="item.locationName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="投用时间" prop="putTime">
          <el-date-picker
            v-model="deviceInfo.useTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="shiJian"
          ></el-date-picker>
        </el-form-item>
        <!-- 绑定蓝牙设备 -->
        <el-form-item label="绑定蓝牙设备" prop="putTime">
          <el-select
            v-model="deviceInfo.patrolPointId"
            placeholder="请选择"
            clearable
            @change="lanYa"
            filterable
          >
            <el-option
              v-for="item in lanYaSheBei"
              :key="item.id"
              :label="item.patrolName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- ----------------- -->
        <el-form-item label="备注描述" prop="description">
          <el-input type="textarea" placeholder="请输入内容" v-model="deviceInfo.description"></el-input>
        </el-form-item>

        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            :action="uploadPath"
            :show-file-list="false"
            :file-list="imgList"
            :on-success="handlePictureSuccess"
          >
            <img v-if="deviceInfo.deviceImg" :src="deviceInfo.deviceImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDeviceInfo">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dictDialogVisible" :title="dictDialogType==='edit'?'编辑':'新增'">
      <el-form ref="form" :model="dict" :rules="rules" label-width="80px" label-position="right">
        <!--        <el-form-item label="标示" prop="data_key">-->
        <!--          <el-input v-model="dict.data_key" placeholder="请输入标示（为数字）" />-->
        <!--        </el-form-item>-->
        <el-form-item label="名称" prop="data_value">
          <el-input v-model="dict.dataValue" placeholder="请输入名称" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dictDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDict">确定</el-button>
      </div>
    </el-dialog>
    <!-- 检查项 -->
    <el-dialog :visible.sync="dictDialogVisible1" title="检查项" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="设备名称:">
          <div>{{form.name}}</div>
        </el-form-item>
        <!-- ----------------- -->
        <el-form-item label="类型:">
          <div>{{form.typeName}}</div>
        </el-form-item>
        <!-- ----------------- -->
        <el-form-item label="品牌:">
          <div>{{form.brandName}}</div>
        </el-form-item>
        <!-- ----------------- -->
        <el-form-item label="型号:">
          <div>{{form.modelName}}</div>
        </el-form-item>
      </el-form>
      <!-- 自定义检查项数量 -->
      <el-form
        :model="dynamicValidateForm"
        ref="dynamicValidateForm"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          label="检查项"
          :key="domain.key"
          :rules="{
      required: true, message: '检查项不能为空', trigger: 'blur'
    }"
        >
          <el-select
            v-model="dynamicValidateForm['val'+index]"
            placeholder="请选择"
            @change="checkThree"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button @click.prevent="removeDomain(domain)" type="text" icon="el-icon-delete"></el-button>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button> -->
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="addDomain">新增检查项</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import {
  deviceList,
  checkAddDevice, //新增点检设备前校验是否还可以新增设备
  addDevice,
  updateDevice,
  deleteDevice,
  exportQR,
  addInspectionItemsByDeviceId,
  getInspectionItemsByDeviceId
} from '@/api/iguard/device/device'

import {
  getCompanyBuildingLocation,
  getBuildingLocationFloor
} from '@/api/iguard/tbbuildinglocation/tbbuildinglocation'

import {
  dictList,
  addDeviceDic,
  updateDeviceDic,
  deleteDict,
  dictInfo,
  companyDictListByType
} from '@/api/permission/dict'
import { getPatrolPointList } from '@/api/iguard/keepWatch'
import { list } from '@/api/iguard/device/check'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { deepClone } from '@/utils'
const defaultDeviceInfo = {
  companyId: localStorage.getItem('deptid'),
  uid: localStorage.getItem('uid'),
  id: undefined,
  deviceName: '',
  typeId: undefined,
  brandId: undefined,
  modelId: undefined,
  buildingId: undefined,
  floorId: undefined,
  useTime: undefined,
  description: '',
  deviceImg: '',
  patrolPointId: ''
}
const defaultDict = {
  companyId: localStorage.getItem('deptid'),
  uid: localStorage.getItem('uid'),
  id: undefined,
  dataType: '',
  dataKey: '',
  dataValue: '',
  sorts: undefined,
  description: ''
}

export default {
  name: 'DeviceInfo',
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        uid: localStorage.getItem('uid'),
        companyId: localStorage.getItem('deptid'),
        page: 0,
        limit: 50,
        deviceName: '',
        buildingId: undefined,
        floorId: undefined
      },
      deviceInfo: Object.assign({}, defaultDeviceInfo),
      lanYaSheBei: [],
      dialogVisible: false,
      dialogType: 'new',
      num: {},
      searchDeviceType: '',
      searchDeviceBrand: '',
      searchDeviceMode: '',

      orangeDeviceTypes: null,
      orangeDeviceBrands: null,
      orangeDeviceModels: null,

      deviceTypes: null,
      deviceBrands: null,
      deviceModels: null,

      buildings: null,
      floors: null,
      editViewFloors: null,
      dialogImageUrl: '',
      dialogImageVisible: false,
      deviceInfoFloorClearable: true,
      imgList: [],
      uploadPath: process.env.VUE_APP_BASE_API_URL3 + '/public/rest/img/upload',
      baseUrl: process.env.VUE_APP_BASE_API_URL,
      dictDialogVisible: false,
      dictDialogVisible1: false,
      dictDialogType: 'new',
      dict: Object.assign({}, defaultDict),

      deviceTypeTitle: '请选择',
      deviceModelTitle: '请选择',
      deviceBrandTitle: '请选择',
      rules: {
        deviceName: [
          { required: true, message: '请输入岗位名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        state: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      form: {
        name: '',
        typeName: '',
        brandName: '',
        modelName: '',
        value: '',
        options: {},
        value1: '',
        options1: {},
        value2: '',
        options2: {}
      },
      list1: {
        uid: localStorage.getItem('uid'),
        limit: 10000,
        page: 1
      },
      objCheck: {
        uid: localStorage.getItem('uid'),
        check: []
      },
      xunGengList: {
        uid: localStorage.getItem('uid'),
        page: 0
      },
      dynamicValidateForm: {
        domains: []
      },
      options: []
    }
  },
  watch: {
    searchDeviceType: function(val, oldVal) {
      this.deviceTypes = this.orangeDeviceTypes.filter(
        item => ~item.dataValue.indexOf(val)
      )
    },
    searchDeviceBrand: function(val, oldVal) {
      this.deviceBrands = this.orangeDeviceBrands.filter(
        item => ~item.dataValue.indexOf(val)
      )
    },
    searchDeviceMode: function(val, oldVal) {
      this.deviceModels = this.orangeDeviceModels.filter(
        item => ~item.dataValue.indexOf(val)
      )
    }
  },
  async created() {
    await this.getList()
    await this.getDeviceTypes()
    await this.getDeviceBrands()
    await this.getDeviceModels()
    await this.getBuildings()
    this.checkList()
    JSON.parse(localStorage.getItem('vip')).forEach(item => {
      if (localStorage.getItem('vipStatus') == item.id) {
        this.num = item
      }
    })
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          setTimeout(() => {
            history.go(0)
          }, 200)
          done()
        })
        .catch(_ => {})
    },
    // 自定义检查项数量
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log(this.dynamicValidateForm)
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      })
    },
    // 巡更点list
    async getXunGengList(listQuery) {
      try {
        const res = await getPatrolPointList(listQuery)
        this.lanYaSheBei = res.data.rows
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    async getList() {
      this.listLoading = true
      try {
        const res = await deviceList(this.listQuery)
        this.listLoading = false
        console.log(res)
        this.list = res.data
        this.total = res.count
      } catch (e) {
        this.listLoading = false
      }
    },
    //查询添加过的检查项
    async addCheckList(deviceId) {
      try {
        const res = await getInspectionItemsByDeviceId(deviceId)
        if (res.data == null) {
          this.dynamicValidateForm.domains = []
        } else {
          if (res.data != undefined || res.data != null) {
            res.data.forEach((item, i) => {
              this.dynamicValidateForm.domains.push({
                value: item.id,
                label: item.checkDescription
              })
              this.$set(this.dynamicValidateForm, 'val' + i, item.id)
              this.objCheck.check.push(item.id)
            })
          }
        }
        console.log(this.dynamicValidateForm)
      } catch (err) {
        console.log(err)
      }
    },
    // 检查项List
    async checkList() {
      try {
        const res = await list(this.list1)
        console.log(res)

        this.options = res.data
        this.options.forEach(item => {
          this.$set(item, 'value', item.id)
          this.$set(item, 'label', item.checkDescription)
          this.$set(item, 'key', item.checkDescription)
        })
      } catch (err) {
        console.log(err)
      }
    },

    // 检查项选择
    checkThree(val) {
      this.objCheck.check.push(val)
      console.log(val)
      console.log(this.objCheck)
      this.dynamicValidateForm.domains.forEach(item => {
        if (this.objCheck.check == item.value) {
          this.$message({
            message: '检查项重复，请重选',
            type: 'warning'
          })
        }
      })
    },
    popoverHide() {
      this.searchDeviceType = ''
      this.searchDeviceBrand = ''
      this.searchDeviceMode = ''
    },
    addDictInfo(type) {
      this.dict = Object.assign({}, defaultDict)
      this.dict.dataType = type
      this.dictDialogType = 'new'
      this.dictDialogVisible = true
    },
    editDictInfo(scope) {
      this.dictDialogType = 'edit'
      this.dictDialogVisible = true
      this.dict = deepClone(scope.row)
    },
    selectDict(scope) {
      this.searchDeviceType = ''
      this.searchDeviceBrand = ''
      this.searchDeviceMode = ''

      const dict = deepClone(scope.row)
      console.log(dict)
      if ('device_type' === dict.dataType) {
        this.deviceInfo.typeId = dict.dataKey
        this.deviceTypeTitle = dict.dataValue
        this.$refs.deviceTypeSelect.$el.click()
      } else if ('device_model' === dict.dataType) {
        this.deviceInfo.modelId = dict.dataKey
        this.deviceModelTitle = dict.dataValue
        this.$refs.deviceModelSelect.$el.click()
      } else if ('device_brand' === dict.dataType) {
        this.deviceInfo.brandId = dict.dataKey
        this.deviceBrandTitle = dict.dataValue
        this.$refs.deviceBrandSelect.$el.click()
      }
    },
    //
    // addDictInfo() {
    //   this.dict = Object.assign({}, defaultDict)
    //   this.dialogType = 'new'
    //   this.dialogVisible = true
    // },
    // async editDictInfo(scope) {
    //   this.dialogType = 'edit'
    //   this.dialogVisible = true
    //   this.dict = deepClone(scope.row)
    // },
    async confirmDict() {
      const isEdit = this.dictDialogType === 'edit'

      // this.dict.data_key = "" + this.deviceModels
      if (isEdit) {
        await updateDeviceDic(this.dict)
      } else {
        await addDeviceDic(this.dict)
      }
      this.dictDialogVisible = false
      this.$message({
        showClose: true,
        message: '保存成功',
        type: 'success'
      })
      this.getDeviceTypes()
      this.getDeviceBrands()
      this.getDeviceModels()
    },
    dictInfoDelete({ row }) {
      this.$confirm('确认删除吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteDict(row.id)
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getDeviceTypes()
          this.getDeviceBrands()
          this.getDeviceModels()
        })
        .catch(err => {
          console.error(err)
        })
    },
    async getDeviceTypes() {
      this.listLoading = true
      try {
        const res = await companyDictListByType(
          'device_type',
          localStorage.getItem('deptid')
        )
        console.log(res)
        this.listLoading = false
        this.deviceTypes = res.data
        this.orangeDeviceTypes = res.data
      } catch (e) {
        this.listLoading = false
      }
    },
    async getDeviceBrands() {
      const res = await companyDictListByType(
        'device_brand',
        localStorage.getItem('deptid')
      )
      const result = res.data
      this.deviceBrands = result
      this.orangeDeviceBrands = res.result
    },
    async getDeviceModels() {
      this.listLoading = true
      try {
        const res = await companyDictListByType(
          'device_model',
          localStorage.getItem('deptid')
        )
        this.listLoading = false
        this.deviceModels = res.data
        this.orangeDeviceModels = res.data
      } catch (e) {
        this.listLoading = false
      }
    },
    async getBuildings() {
      this.listLoading = true
      try {
        const res = await getCompanyBuildingLocation()
        console.log('下面是位置')
        console.log(res)
        this.listLoading = false
        this.buildings = res.result
      } catch (e) {
        this.listLoading = false
      }
    },

    async getFloors(vId) {
      this.listLoading = true
      try {
        this.listQuery.floor = undefined
        const res = await getBuildingLocationFloor(vId)
        this.listLoading = false
        this.floors = res.result
      } catch (e) {
        this.listLoading = false
      }
    },

    async getEditFloors(vId) {
      console.log(vId)
      this.listLoading = true
      try {
        this.deviceInfo.floorId = undefined
        const res = await getBuildingLocationFloor(vId)
        this.listLoading = false
        this.editViewFloors = res.result
        this.xunGengList.buildingId = vId
        this.getXunGengList(this.xunGengList)
      } catch (e) {
        this.listLoading = false
      }
    },
    louCeng(val) {
      console.log(val)
      this.xunGengList.floorId = val
      this.getXunGengList(this.xunGengList)
    },
    handleSearch() {
      this.getList()
    },

    handlePictureSuccess(response, file, fileList) {
      this.deviceInfo.deviceImg =
        this.baseUrl + '/public/rest/img/' + response.data.result
      console.log(this.deviceInfo.deviceImg)
    },

    handlePictureRemove(file, fileList) {
      console.log(file, fileList)
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisibleVisible = true
    },

    formatType(row, column) {
      return row.typeName
    },
    formatBrand(row, column) {
      return row.brandName
    },

    formatModel(row, column) {
      return row.modelName
    },

    formatAddress(row, column) {
      return row.buildingName + '-' + row.floorName
    },
    time(row, column) {
      if (row.useTime != null) {
        return row.useTime.slice(0, 10)
      } else if (row.useTime == null) {
        return '--'
      }
    },

    handleCreate() {
      this.deviceInfo = Object.assign({}, defaultDeviceInfo)
      this.deviceTypeTitle = '请选择'
      this.deviceModelTitle = '请选择'
      this.deviceBrandTitle = '请选择'
      this.imgList = []
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async handleEdit(scope) {
      this.xunGengList.buildingId = scope.row.buildingId
      this.xunGengList.floorId = scope.row.floorId
      this.getXunGengList(this.xunGengList)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.deviceInfo = deepClone(scope.row)
      this.imgList = [{ name: 'food.jpeg', url: this.deviceInfo.deviceImg }]
      this.deviceInfo.modelId = String(this.deviceInfo.modelId)
      this.deviceInfo.brandId = String(this.deviceInfo.brandId)
      this.deviceInfo.typeId = String(this.deviceInfo.typeId)
      this.deviceInfo.uid = localStorage.getItem('uid')
      this.deviceTypeTitle = (
        this.deviceTypes.filter(item => {
          return item.dataKey == this.deviceInfo.typeId
        })[0] || {}
      ).dataValue
      this.deviceModelTitle = (
        this.deviceModels.filter(item => {
          return item.dataKey == this.deviceInfo.modelId
        })[0] || {}
      ).dataValue
      this.deviceBrandTitle = (
        this.deviceBrands.filter(item => {
          return item.dataKey == this.deviceInfo.brandId
        })[0] || {}
      ).dataValue
      // this.getEditFloors(this.deviceInfo.building);
      const res = await getBuildingLocationFloor(this.deviceInfo.buildingId)
      this.editViewFloors = res.result
    },

    async handleExportQR() {
      const res = await exportQR(this.listQuery)
      window.location.href = this.baseUrl + '/public/rest/qrZip/' + res.result
      console.log(res)
    },
    shiJian(val) {
      console.log(val)
      this.deviceInfo.useTime = val + ' 00:00:00'
    },
    async confirmDeviceInfo() {
      const isEdit = this.dialogType === 'edit'
      //新增点检设备前校验是否还可以新增设备
      try {
        const res = await checkAddDevice(localStorage.getItem('deptid'))
        console.log(res)
        if (res.code == 20000) {
          if (res.data == true) {
            if (
              null == this.deviceInfo.deviceName ||
              '' === this.deviceInfo.deviceName
            ) {
              this.$message({
                showClose: true,
                message: '设备名称不能为空',
                type: 'warning'
              })
              return
            }
            console.log(this.deviceInfo.deviceName.length)
            if (
              this.deviceInfo.deviceName.length < 2 ||
              this.deviceInfo.deviceName.length > 15
            ) {
              this.$message({
                showClose: true,
                message: '设备名称长度在 2 到 15 个字符',
                type: 'warning'
              })
              return
            }
            if (undefined === this.deviceInfo.typeId) {
              this.$message({
                showClose: true,
                message: '类型不能为空',
                type: 'warning'
              })
              return
            }
            if (undefined === this.deviceInfo.brandId) {
              this.$message({
                showClose: true,
                message: '品牌不能为空',
                type: 'warning'
              })
              return
            }
            if (undefined === this.deviceInfo.modelId) {
              this.$message({
                showClose: true,
                message: '型号不能为空',
                type: 'warning'
              })
              return
            }
            if (undefined === this.deviceInfo.buildingId) {
              this.$message({
                showClose: true,
                message: '位置不能为空',
                type: 'warning'
              })
              return
            }
            if (isEdit) {
              await updateDevice(this.deviceInfo)
            } else {
              console.log(this.deviceInfo)
              await addDevice(this.deviceInfo)
            }
            this.dialogVisible = false
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$confirm(
              '此功能支持免费使用，免费版仅支持录入10个设备！请联系客服159-5174-1967购买服务，提高授权数量',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            )
              .then(() => {})
              .catch(() => {})
          }
        } else {
          this.$message(res.msg)
        }
      } catch (err) {
        console.log(err)
      }
    },

    handleDelete({ row }) {
      this.$confirm('确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteDevice(row.id)
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
        .catch(err => {
          console.error(err)
        })
    },
    lanYa(val) {
      console.log(this.dict)
      console.log(this.deviceInfo)
      console.log(val)
      this.deviceInfo.patrolPointId = val
    },
    async jianCha(obj) {
      try {
        const res = await addInspectionItemsByDeviceId(obj)
        if (res.code == 20000) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          setTimeout(() => {
            history.go(0)
          }, 200)
          this.dictDialogVisible1 = false
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 检查项
    check(scope) {
      console.log(scope)
      this.dictDialogVisible1 = true
      let obj = scope.row
      this.form.name = obj.deviceName
      this.form.typeName = obj.typeName
      this.form.brandName = obj.brandName
      this.form.modelName = obj.modelName
      this.objCheck.deviceId = obj.id
      console.log(this.form)
      this.addCheckList(obj.id)
    },
    // 确定检查项
    onSubmit() {
      this.objCheck.check.forEach((item, i) => {})
      this.objCheck.itemIds = this.objCheck.check
      this.jianCha(this.objCheck)
      console.log(this.objCheck)
    }
  }
}
</script>
<style lang="less" scoped>
.app-container {
  .pour {
    color: #44b3ff;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
