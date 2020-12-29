<template>
  <div class="app-container">
    <div style="margin-top:20px;margin-bottom: 20px">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input
            v-model="searchDeptName"
            prefix-icon="el-icon-search"
            placeholder="请输入部门名称"
            clearable
            @clear="clearSearchDept"
          />
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.name" placeholder="账号" />
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.vserName" placeholder="真实姓名" />
        </el-col>

        <el-col :span="4">
          <el-select v-model="listQuery.state" placeholder="用户状态" clearable>
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-button
            v-permission="['/rest/user/list']"
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >查看在职人员</el-button>
          <el-button
            v-permission="['/rest/user/add']"
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            @click="handleCreate"
          >
            <i class="el-icon-plus" />新增
          </el-button>
          <el-button type="primary" icon="el-icon-search" @click="checkLiZhi">查看离职人员</el-button>
        </el-col>
      </el-row>
    </div>

    <div>
      <el-row>
        <el-col :span="4">
          <el-tree
            ref="serchDeptTree"
            :data="departments"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            class="objectTree"
            @node-click="handleSearchDeptNode"
          />
        </el-col>

        <el-col :span="20">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            style="width: 100%;"
            height="650"
            border
          >
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="账号" />
            <el-table-column prop="vserName" label="真实姓名" />
            <el-table-column prop="mobile" label="手机" />
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="deptName" label="公司部门" :formatter="formatDept" />
            <el-table-column prop="roleName" label="角色" :formatter="formatRole" />
            <el-table-column label="照片">
              <template slot-scope="scope">
                <div class="demo-image__preview">
                  <el-image
                    style="width: 60px; height: 60px"
                    :src="scope.row.face_img"
                    :preview-src-list="[scope.row.face_img]"
                  ></el-image>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="禁用/启用" v-if="flag">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.state"
                  :active-value="1"
                  :inactive-value="0"
                  :disabled="scope.row.isEqualAdmin"
                  @change="handleStateChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" v-if="flag">
              <template slot-scope="scope">
                <el-button
                  v-permission="['/rest/user/update']"
                  type="text"
                  size="small"
                  @click="handleEdit(scope)"
                >编辑</el-button>
                <el-button type="text" size="small" @click="dimission(scope)">离职</el-button>
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
      <!-- 离职弹窗 -->
      <!-- 离职弹窗 -->
      <div>
        <el-dialog title="选择工作转交对象" :visible.sync="liZhi" width="30%">
          <el-select
            v-model="value11"
            filterable
            placeholder="请选工作转交人员"
            style="width:100%;"
            @change="personDimission"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="liZhi = false">取 消</el-button>
            <el-button type="primary" @click="transfer">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'">
      <el-form ref="form" :model="user" :rules="rules" label-width="80px" label-position="right">
        <el-form-item label="账号" prop="name">
          <el-input v-model="user.name" placeholder="请输入手机号" @blur="userId" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" placeholder="密码" show-password />
        </el-form-item>

        <el-form-item label="真实姓名" prop="vserName">
          <el-input v-model="user.vserName" placeholder="真实姓名" />
        </el-form-item>

        <el-form-item label="角色" v-if="!user.isEqualAdmin">
          <el-select
            v-model="user.roleIds"
            multiple
            placeholder="请选择"
            style="width:100%"
            @change="jueSe"
          >
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <!--        <el-form-item label="企业" prop="company">-->
        <!--          <treeselect-->
        <!--            v-model="user.companyId"-->
        <!--            :options="companies"-->
        <!--            :normalizer="normalizer"-->
        <!--            placeholder="选择企业"-->
        <!--            @change="getCompanyDept"-->
        <!--          />-->
        <!--        </el-form-item>-->

        <el-form-item label="部门" prop="deptid">
          <treeselect
            v-model="user.deptid"
            :options="departments"
            :normalizer="normalizer"
            placeholder="选择部门"
          />
        </el-form-item>

        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="user.state">
            <el-radio
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="user.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="头像">
          <!-- <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :limit="1"
            :file-list="imgList"
            :on-success="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>-->
          <!--  -->
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :file-list="imgList"
            :on-success="handlePictureCardPreview"
          >
            <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import permission from '@/directive/permission/index.js' // 权限判断指令
import {
  userList,
  addUser,
  getUserByPhone,
  updateUser,
  updateState,
  personTransfer
} from '@/api/permission/user'
import { getCompanyAllUser } from '@/api/iguard/taskGuanLi'
import {
  subDepartments,
  subDeptByDeptId,
  subCompanyList,
  deptSubDept
  // companySubDeptList
} from '@/api/permission/department'
import { jobs } from '@/api/permission/job'
import { roles } from '@/api/permission/role'
import { deepClone } from '@/utils'
import Pagination from '@/components/Pagination'
import { getCompanyDept } from '../../api/iguard/tbbuildinglocation/tbbuildinglocation' // Secondary package based on el-pagination
const defaultUser = {
  uid: localStorage.getItem('uid'),
  name: '',
  password: '',
  vserName: '',
  mobile: '',
  state: 1,
  email: '',
  deptid: undefined,
  jobid: undefined,
  jobName: '',
  deptName: '',
  roleIds: [],
  companyId: undefined,
  isEqualAdmin: false
}

export default {
  name: 'User',
  components: { Pagination, Treeselect },
  directives: { permission },
  data() {
    const checkPhoneNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入正确的账号'))
      }
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
        return callback(new Error('请输入正确的账号'))
      }
    }
    return {
      dialogImageUrl: '',
      uploadUrl: process.env.VUE_APP_BASE_API_URL2 + '/rest/user/img/upload',
      baseUrl: process.env.VUE_APP_BASE_API_URL2,
      imgList: [],
      face_img: '', //人脸图片，以上都是人脸识别图片变量
      tableKey: 0,
      options: [],
      value11: '',
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 50,
        vserName: '',
        name: '',
        mobile: '',
        deptid: undefined,
        state: 1
      },
      searchDeptName: '',
      stateOptions: [
        { label: '禁用', value: 0 },
        { label: '启用', value: 1 }
      ],
      user: Object.assign({}, defaultUser),
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      departments: [],
      // companies:[],
      // companyDepts:[],
      roles: [],
      activeName: 'first',
      dialogVisible: false,
      liZhi: false,
      dialogType: 'new',
      flag: true,
      rules: {
        name: [
          { required: true, message: '请输入正确的账号', trigger: 'blur' },
          { validator: checkPhoneNo, trigger: 'blur' }
        ],
        // password: [
        //   { required: true, message: '请输入密码', trigger: 'blur' },
        //   { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        // ],
        vserName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        deptid: [{ required: true, message: '请选择部门', trigger: 'change' }],
        state: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      person: {
        fromUid: '',
        toUid: ''
      }
    }
  },
  watch: {
    searchDeptName(val) {
      this.$refs.serchDeptTree.filter(val)
    }
  },
  created() {},
  mounted() {
    this.getList()
    // this.getSubDepartments()
    this.getBuMen()
    // this.getSubCompanies()
    this.getJobs()
    this.getRoles()
    this.getAllUser()
  },
  methods: {
    // 离职
    async transfer() {
      try {
        const res = await personTransfer(this.person.fromUid, this.person.toUid)
        console.log(res)
        if (res.code == 20000) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.liZhi = false
          this.value11 = ''
          this.getList()
        } else {
          this.$message.error('系统错误')
        }
      } catch (err) {
        console.log(err)
      }
    },
    personDimission(val) {
      console.log(val)
      this.person.toUid = val
    },
    userId(e) {
      console.log(this.user.name)
      this.repettionTel(this.user.name)
    },
    async repettionTel(tel) {
      try {
        const res = await getUserByPhone(tel)
        console.log(res)
        if (res.result.length != 0) {
          this.$message({
            message: '账号重复，请重新填写。',
            type: 'warning'
          })
          this.user.name = ''
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 删除上传头像
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    async getAllUser() {
      try {
        const res = await getCompanyAllUser(localStorage.getItem('uid'))
        res.result.forEach(item => {
          if (
            item.leaveWork == '0' &&
            item.uid == localStorage.getItem('uid')
          ) {
            this.options.push(item)
          }
        })
        this.options.forEach(item => {
          this.$set(item, 'value', item.uid)
          this.$set(item, 'label', item.vserName)
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 上传头像
    handlePictureCardPreview(response, file, fileList) {
      this.user.face_img = this.baseUrl + '/rest/user/img/' + response.result
      this.dialogImageUrl = this.user.face_img
      console.log(this.dialogImageUrl)
    },
    // ----------------------------------------------
    async getList() {
      this.listLoading = true
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await userList(this.listQuery)
        this.listLoading = false
        this.list = res.result.rows
        this.total = res.result.records
      } catch (e) {
        this.listLoading = false
      }
    },
    handleSearch() {
      this.listQuery.leaveWork = ''
      this.getList()
      this.flag = true
    },
    // 查看离职人员
    checkLiZhi() {
      this.listQuery.leaveWork = '1'
      this.flag = false
      this.getList()
    },
    formatDept(row, column) {
      return row.deptName
    },
    formatRole(row, column) {
      console.log(row)
      console.log(column)
      var roleNames = []
      row.roles.forEach(role => {
        roleNames.push(role.name)
      })
      return roleNames.join(' , ')
    },
    // 用户状态修改
    handleStateChange(row) {
      const text = row.state === 1 ? '启用' : '禁用'
      this.$confirm(
        '确认要 [' + text + '] [' + row.name + '] 用户吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          await updateState({ uid: row.uid, state: row.state })
          this.$message({
            message: text + '成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.error(err)
          row.state = row.state === 0 ? 1 : 0
        })
    },

    async getSubDepartments() {
      const res = await subDepartments()
      const result = res.result
      this.diGuiTree(result)
      this.departments = result
    },
    async getBuMen() {
      const res = await deptSubDept()
      const result = res.result
      this.diGuiTree(result)
      this.departments = result
    },
    async getSubCompanies() {
      const res = await subCompanyList()
      const result = res.result
      this.diGuiTree(result)
      this.companies = result
    },

    async getCompanyDept(data) {
      console.log('======  ==== ' + data.id)
      const res = await subDeptByDeptId(data.id)
      const result = res.result
      this.diGuiTree(result)
      this.companyDepts = result
    },

    // async getDepartments(deptId){
    //   const res = await subDeptByDeptId(deptId);
    //   const result = res.result;
    //   this.diGuiTree(result);
    //   this.companies = result;
    // },

    async getJobs() {
      const res = await jobs()
      this.jobs = res.result
    },
    async getRoles() {
      const res = await roles()
      this.roles = res.result
    },
    clearSearchDept() {
      this.listQuery.deptid = undefined
    },
    diGuiTree(item) {
      // 递归便利树结构
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
    queryJobSearch(queryString, cb) {
      var jobs = this.jobs
      var results = queryString
        ? jobs.filter(this.createJobFilter(queryString))
        : jobs
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createJobFilter(queryString) {
      return jobs => {
        return jobs.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleJobSelect(item) {
      this.user.jobid = item.id
      this.user.jobName = item.name
    },
    handleCreate() {
      this.dialogType = 'new'
      this.activeName = 'first'
      this.dialogVisible = true
      this.user = Object.assign({}, defaultUser)
      this.dialogImageUrl = ''
      console.log(this.user)
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.activeName = 'first'
      this.dialogVisible = true
      scope.row.roleIds = []
      this.user = deepClone(scope.row)
      // --------------------------------
      this.imgList = [{ name: 'food.jpeg', url: this.user.face_img }]
      this.dialogImageUrl = this.user.face_img
      this.user.password = ''
      if (this.user.roles) {
        const roleIds = this.user.roleIds
        this.user.roles.forEach(role => {
          roleIds.push(role.id)
        })
      }
    },
    // 离职操作
    dimission(scope) {
      console.log(scope)
      if (scope.row.is_admin == 1) {
        this.$message({
          message: '当前人员为管理员，请到个人中心转交权限后离职。',
          type: 'warning'
        })
      } else {
        this.person.fromUid = scope.row.uid
        this.liZhi = true
        this.value11 = ''
      }
    },
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        console.log(this.user)
        await updateUser(this.user)
      } else {
        if (this.user.password.length < 1) {
          this.user.password = this.user.name
        }
        await addUser(this.user)
      }
      this.dialogVisible = false
      this.$message({
        showClose: true,
        message: '保存成功',
        type: 'success'
      })
      this.getList()
    },
    // 节点单击事件
    handleSearchDeptNode(data) {
      if (data.id == data.company_id) {
        this.isShowSelect = false
        this.listQuery.deptid = ''
      } else {
        this.isShowSelect = false
        this.listQuery.deptid = data.id
      }
      this.getList()
    },

    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    jueSe(value) {
      console.log(value)
    }
  }
}
</script>
<style lang="less" scoped>
.app-container {
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
