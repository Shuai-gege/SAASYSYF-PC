<template>
  <div class="app-container" style>
    <div style="margin-top:20px;max-width:600px;margin-left: 80px;">
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
        </el-col>

        <el-col :span="30">
          <!--          <el-button v-permission="['/rest/department/topCompanyAdd']" class="filter-item" type="primary" @click="topCompanyCreate()">-->
          <!--            <i class="el-icon-plus" /> 添加一级企业-->
          <!--          </el-button>-->
          <el-button
            v-permission="['/rest/department/companyAdd']"
            class="filter-item"
            type="primary"
            @click="handleCreate()"
          >
            <i class="el-icon-plus" /> 添加企业/部门
          </el-button>
        </el-col>

        <!--        <el-col :span="8">-->
        <!--         -->
        <!--        </el-col>-->
      </el-row>
      <el-row style="padding-top:20px">
        <el-col>
          <el-tree
            ref="tree"
            :data="departments"
            :props="defaultProps"
            node-key="id"
            class="permission-tree"
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  v-permission="['/rest/department/add']"
                  type="text"
                  size="mini"
                  @click="() => handleCreate(data)"
                >添加子项</el-button>
                <el-button
                  v-permission="['/rest/department/update']"
                  type="text"
                  size="mini"
                  @click="() => handleEdit(node,data)"
                >编辑</el-button>
                <el-button
                  v-permission="['/rest/department/delete']"
                  type="text"
                  size="mini"
                  @click="() => handleDelete(data)"
                >删除</el-button>
              </span>
            </span>
          </el-tree>
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'">
      <el-form ref="form" :model="company" :rules="rules" label-width="90px" label-position="right">
        <el-form-item label="类型" prop="department.deptCompany" style="width:100%">
          <el-select
            v-model="company.department.deptCompany"
            placeholder="请选择"
            @change="getDeptCompany"
          >
            <el-option label="部门" :value="1"></el-option>
            <el-option label="企业" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="isCompany?'企业名称':'部门名称'" prop="department.name">
          <el-input v-model="company.department.name" :placeholder="isCompany?'企业名称':'部门名称'" />
        </el-form-item>
        <!-- <el-form-item label="级别">
          <el-select v-model="department.levels" style="width: 140px" class="filter-item">
            <el-option
              v-for="item in levelsOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>-->

        <el-form-item label="上级部门" prop="department.parentId" v-if="isDepartment">
          <!-- <span>{{department.parentName}}</span> -->
          <treeselect
            v-model="company.department.parentId"
            :options="companySubDepartments"
            :normalizer="normalizer"
            placeholder="选择上级部门"
          />
        </el-form-item>

        <el-form-item label="管理账号" prop="user.name" v-if="isCompany">
          <el-input v-model="company.user.name" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="密码" prop="user.password" v-if="isCompany">
          <el-input v-model="company.user.password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="真实姓名" prop="user.vserName" v-if="isCompany">
          <el-input v-model="company.user.vserName" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="角色" v-if="isCompany" prop="user.roleIds">
          <el-select v-model="company.user.roleIds" multiple placeholder="请选择" style="width:100%">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期截止" v-if="flag">
          <el-date-picker
            v-model="company.department.validDate"
            type="date"
            placeholder="选择日期"
            @change="time"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用版本" v-if="flag">
          <el-select v-model="company.department.vipStatus" placeholder="请选择" @change="vip">
            <el-option
              v-for="item in company.department.vipStatusArr"
              :key="item.id"
              :label="item.level_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="company.department.sorts" placeholder="排序" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDepartment">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleEdit" title="编辑">
      <el-form ref="form" :model="company" :rules="rules" label-width="90px" label-position="right">
        <el-form-item label="类型" prop="department.deptCompany" style="width:100%">
          <el-select
            v-model="company.department.deptCompany"
            placeholder="请选择"
            @change="getDeptCompany"
          >
            <el-option label="部门" :value="1"></el-option>
            <el-option label="企业" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="isCompany?'企业名称':'部门名称'" prop="department.name">
          <el-input v-model="company.department.name" :placeholder="isCompany?'企业名称':'部门名称'" />
        </el-form-item>

        <el-form-item label="上级部门" prop="department.parentId" v-if="isDepartment">
          <treeselect
            v-model="company.department.parentId"
            :options="companySubDepartments"
            :normalizer="normalizer"
            placeholder="选择上级部门"
          />
        </el-form-item>
        <!-- <el-form-item label="管理账号" prop="user.name" v-if="isCompany">
          <el-input v-model="company.user.name" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="密码" prop="user.password" v-if="isCompany">
          <el-input v-model="company.user.password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="真实姓名" prop="user.vserName" v-if="isCompany">
          <el-input v-model="company.user.vserName" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="角色" v-if="isCompany" prop="user.roleIds">
          <el-select v-model="company.user.roleIds" multiple placeholder="请选择" style="width:100%">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>-->
        <el-form-item label="排序">
          <el-input v-model="company.department.sorts" placeholder="排序" />
        </el-form-item>
        <!-- 一下只有超级管理员可见 -->
        <el-form-item label="有效期截止" v-if="flag">
          <el-date-picker
            v-model="company.department.validDate"
            type="date"
            placeholder="选择日期"
            @change="time"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用版本" v-if="flag">
          <el-select v-model="company.department.vipStatus" placeholder="请选择" @change="vip">
            <el-option
              v-for="item in company.department.vipStatusArr"
              :key="item.id"
              :label="item.level_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmDepartment">确定</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="dialogTopCompanyAdd" title="新增">
      <el-form ref="form" :model="company" :rules="rules" label-width="80px" label-position="right">
        <el-form-item label="企业名称" prop="department.name">
          <el-input v-model="company.department.name" placeholder="企业名称" />
        </el-form-item>

        <el-form-item label="管理账号" prop="user.name">
          <el-input v-model="company.user.name" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="密码" prop="user.password">
          <el-input v-model="company.user.password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="真实姓名" prop="user.vserName">
          <el-input v-model="company.user.vserName" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="角色" prop="user.roleIds">
          <el-select v-model="company.user.roleIds" multiple placeholder="请选择" style="width:100%">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="排序">
          <el-input v-model="company.department.sorts" placeholder="排序" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogTopCompanyAdd=false">取消</el-button>
        <el-button type="primary" @click="confirmDepartment">确定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>
<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import permission from '@/directive/permission/index.js' // 权限判断指令
import {
  departments,
  subDepartments,
  addDpartment,
  updateDpartment,
  deleteDpartment,
  addCompany,
  addTopCompany,
  companySubDeptList,
  deptSubDept
} from '@/api/permission/department'
import { roles } from '@/api/permission/role'
import { deepClone } from '@/utils'
import { getList } from '../../api/iguard/saas'
const defaultDepartment = {
  id: undefined,
  name: '',
  parentId: undefined,
  parentName: '',
  levels: undefined,
  deleted: 0,
  deptCompany: 1
}

const defaultUser = {
  name: '',
  password: '',
  vserName: '',
  roleIds: []
}

const defaultCompany = {
  department: {
    id: undefined,
    name: '',
    parentId: undefined,
    parentName: '',
    levels: undefined,
    deleted: 0,
    companyId: localStorage.getItem('companyId'),
    deptCompany: 1,
    vipStatus: '',
    sorts: '',
    vipStatusArr: [],
    validDate: ''
  },
  user: {
    name: '',
    password: '',
    vserName: '',
    roleIds: []
  }
}

export default {
  name: 'Department',
  components: { Treeselect },
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
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      flag: false,

      department: Object.assign({}, defaultDepartment),
      user: Object.assign({}, defaultUser),
      departments: [],
      companySubDepartments: [],
      roles: [],
      dialogVisible: false,
      dialogType: 'new',
      dialogTopCompanyAdd: false,
      dialogVisibleEdit: false,
      isCompany: false,
      isDepartment: true,
      company: Object.assign({}, defaultCompany),
      levelsOptions: [
        { label: '集团', key: 0 },
        { label: '分公司', key: 1 },
        { label: '部门', key: 2 }
      ],
      filterText: '',
      rules: {
        ['department.deptCompany']: [
          { required: true, message: '请选择部门类型', trigger: 'change' }
        ],
        ['department.name']: [
          { required: true, message: '请输入部门名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        ['department.parentId']: [
          { required: true, message: '请选择上级部门', trigger: 'change' }
        ],
        ['user.name']: [
          { required: true, message: '请输入正确的账号', trigger: 'blur' },
          { validator: checkPhoneNo, trigger: 'blur' }
        ],
        // ['user.password']: [
        //   { required: true, message: '请输入密码', trigger: 'blur' },
        //   // { min: 6, max: 20, message: '请输入正确的密码', trigger: 'blur' }
        // ],
        ['user.vserName']: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        ['user.roleIds']: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },

  created() {
    // this.getDepartments();
    this.getRoles()
    this.checkBuMen()
    this.getCheckList1()
    this.getCompanySubDepartments()
    if (localStorage.getItem('uid') == 1) {
      this.flag = true
      this.company.department.deptCompany = 2
    } else {
      this.flag = false
    }
  },
  methods: {
    async getCheckList1() {
      try {
        const res = await getList()
        console.log(res)
        if (res.code == 20000) {
          this.company.department.vipStatusArr = res.result
          this.company.department.deptCompany = data.dept_company
          this.company.department.parentId = data.parent_id
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getCheckList(data) {
      try {
        const res = await getList()
        console.log(res)
        if (res.code == 20000) {
          this.company.department = deepClone(data)
          this.company.department.vipStatusArr = res.result
          this.company.department.deptCompany = data.dept_company
          this.company.department.parentId = data.parent_id
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 查询部门
    async checkBuMen() {
      try {
        const res = await deptSubDept()
        const result = res.result
        this.diGuiTree(result)
        // this.departments = [{ id: 0, name: '部门树', childrens: result }]
        this.departments = result
      } catch (err) {
        console.log(err)
      }
    },
    vip(val) {
      console.log(val)
      this.company.department.vipStatus = val
    },
    time(val) {
      let startTime = new Date(val)
      let YY = startTime.getFullYear()
      let MM = this.p(startTime.getMonth() + 1)
      let DD = this.p(startTime.getDate())
      this.company.department.validDate = YY + '-' + MM + '-' + DD
    },
    // 时间不够两位数补零
    p(s) {
      return s < 10 ? '0' + s : s
    },
    async getSubDepartments() {
      try {
        const res = await subDepartments()
        console.log(res)
        const result = res.result
        this.diGuiTree(result)
        // this.departments = [{ id: 0, name: '部门树', childrens: result }]
        this.departments = result
      } catch (err) {
        console.log(err)
      }
    },

    async getCompanySubDepartments() {
      const res = await companySubDeptList()
      const result = res.result
      this.diGuiTree(result)
      // this.departments = [{ id: 0, name: '部门树', childrens: result }]
      this.companySubDepartments = result
    },

    async getRoles() {
      const res = await roles()
      this.roles = res.result
      this.roles.splice(0, 1)
    },

    getDeptCompany() {
      if (localStorage.getItem('uid') != 1) {
        this.$message('普通管理员只能添加部门')
        this.company.department.deptCompany = 1
        if (this.company.department.deptCompany === 2) {
          this.isCompany = true
          this.isDepartment = false
          this.dialogType = 'topCompanyAdd'
        } else {
          this.dialogType = 'new'
          this.isCompany = false
          this.isDepartment = true
        }
      } else {
        this.$message('超级管理员只能添加企业')
        this.company.department.deptCompany = 2
      }
    },

    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
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

    topCompanyCreate(data) {
      this.dialogTopCompanyAdd = true
      this.dialogType = 'topCompanyAdd'
      this.company = Object.assign({}, defaultCompany)
      this.user = Object.assign({}, defaultUser)
      // this.department.deptCompany = 2;
      // if (data != null) {
      //   this.department.parentName = data.name
      // }
    },

    handleCreate(data) {
      if (localStorage.getItem('uid') == '1') {
        this.dialogType = 'topCompanyAdd'
      } else {
        this.dialogType = 'new'
      }
      this.dialogVisible = true
      this.company.department = Object.assign({}, defaultCompany.department)
      console.log(defaultCompany.department)
      this.company.user = Object.assign({}, defaultCompany.user)
      // if (data != null) {
      //   this.department.parentId = data.id
      //   this.department.parentName = data.name
      // }

      if (2 === this.company.department.deptCompany) {
        this.isCompany = true
        this.isDepartment = false
      } else {
        this.isCompany = false
        this.isDepartment = true
      }
    },

    async handleEdit(node, data) {
      if (localStorage.getItem('uid') == '1') {
        this.dialogType = 'edit'
        this.dialogVisibleEdit = true
        // this.company.department = deepClone(data)
        // this.company.department.deptCompany = data.dept_company
        // this.company.department.parentId = data.parent_id
        // this.company.department.name = data.name
        // this.company.department.validDate = data.validDate
        // this.company.department.vipStatus = data.vipStatus
        this.getCheckList(data)
        // const parent = node.parent.data
        // this.department.parentId = parent.id
        // this.department.parentName = parent.name

        if (2 === this.company.department.deptCompany) {
          this.isCompany = true
          this.isDepartment = false
        } else {
          this.isCompany = false
          this.isDepartment = true
        }
      } else {
        if (data.parent_id == '0') {
          this.$message({
            showClose: true,
            message: '公司禁止编辑',
            type: 'warning'
          })
        } else {
          this.dialogType = 'edit'
          this.dialogVisibleEdit = true
          // this.company.department = deepClone(data)
          // this.company.department.deptCompany = data.dept_company
          // this.company.department.parentId = data.parent_id
          // this.company.department.name = data.name
          // this.company.department.validDate = data.validDate
          // this.company.department.vipStatus = data.vipStatus
          this.getCheckList(data)
          // const parent = node.parent.data
          // this.department.parentId = parent.id
          // this.department.parentName = parent.name

          if (2 === this.company.department.deptCompany) {
            this.isCompany = true
            this.isDepartment = false
          } else {
            this.isCompany = false
            this.isDepartment = true
          }
        }
      }
    },
    async confirmDepartment() {
      const isEdit = this.dialogType === 'edit'
      // 编辑
      if (this.dialogType === 'edit') {
        this.dialogVisibleEdit = false
        await updateDpartment(this.company.department)
        this.$message({
          showClose: true,
          message: '编辑成功',
          type: 'success'
        })
      } else if (this.dialogType === 'new') {
        // 新增部门
        if (this.company.user.password.length < 1) {
          this.company.user.password = this.company.user.name
        }
        if (this.company.department.name == '') {
          this.$message({
            message: '请填写部门名称。',
            type: 'warning'
          })
        } else if (this.company.department.parentId == undefined) {
          this.$message({
            message: '请选择上级部门。',
            type: 'warning'
          })
        } else if (
          this.company.department.sorts == '' ||
          this.company.department.sorts < '1'
        ) {
          this.$message({
            message: '请填写排序,并且不能小于0',
            type: 'warning'
          })
        } else {
          await addCompany(this.company)
          this.dialogVisible = false
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
        }
      } else if (this.dialogType === 'topCompanyAdd') {
        // 新增企业
        console.log('我是新增企业')
        await addTopCompany(this.company)
        this.dialogVisible = false
      }

      this.dialogTopCompanyAdd = false

      this.checkBuMen()
    },
    handleDelete(data) {
      if (localStorage.getItem('uid') == '1') {
        this.$confirm('确认删除?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await deleteDpartment(data.id)
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.checkBuMen()
          })
          .catch(err => {
            console.error(err)
          })
      } else {
        if (data.parent_id == '0') {
          this.$message({
            showClose: true,
            message: '您没权限删除公司，请联系平台客服。',
            type: 'warning'
          })
        } else {
          this.$confirm('确认删除?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              await deleteDpartment(data.id)
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
              this.checkBuMen()
            })
            .catch(err => {
              console.error(err)
            })
        }
      }
    }
  }
}
</script>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
