<template>
  <div class="app-container">
    <el-button type="primary" @click="newAdd">新增</el-button>
    <el-divider></el-divider>
    <!-- 展示表格 -->
    <el-table v-loading="listLoading" :data="list" border style="width: 100%;" height="450">
      <el-table-column prop="level_name" label="名称" />
      <el-table-column prop="level_desp" label="描述" />
      <el-table-column prop="register_level" label="当前自主注册默认级别" :formatter="rank" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑内容 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑':'新增'"
      :before-close="handleClose"
      top="3vh"
    >
      <el-form ref="roleForm" :model="saas" label-position="left" label-width="150px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="saas.name" placeholder="角色名" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="saas.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
        <el-form-item label="权限许可">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="permissions"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
            @check="checkPermissionTree"
            :default-checked-keys="treeArr"
          />
        </el-form-item>
        <!--  -->
        <el-form-item label="进行中的报事数限制">
          <el-radio-group v-model="saas.radio" @change="postNum">
            <el-radio :label="1">不限</el-radio>
            <el-radio :label="2">
              <el-input v-model="saas.input" placeholder="自定义" style="width:100px;"></el-input>
            </el-radio>
          </el-radio-group>
          <el-checkbox v-model="saas.checked" @change="reg">设置为自主注册默认级别</el-checkbox>
        </el-form-item>
        <!--  -->
        <el-form-item label="点检任务数限制">
          <el-radio-group v-model="saas.radio1" @change="postNum1">
            <el-radio :label="1">不限</el-radio>
            <el-radio :label="2">
              <el-input v-model="saas.input1" placeholder="自定义" style="width:100px;"></el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!--  -->
        <el-form-item label="点检设备创建数限制">
          <el-radio-group v-model="saas.radio2" @change="postNum2">
            <el-radio :label="1">不限</el-radio>
            <el-radio :label="2">
              <el-input v-model="saas.input2" placeholder="自定义" style="width:100px;"></el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!--  -->
        <el-form-item label="点检/巡更组创建权限">
          <el-checkbox v-model="saas.checked1" @change="fu">巡更组</el-checkbox>
          <el-checkbox v-model="saas.checked2" @change="fu1">点检组</el-checkbox>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  permissions,
  permissionsByRole,
  subPermissions
} from '@/api/permission/permission'
import { getList, getAdd, defaultLevel, modify } from '../../api/iguard/saas'
import { deepClone } from '@/utils'
export default {
  data() {
    return {
      list: [],
      listLoading: true,
      dialogVisible: false,
      checkStrictly: true, //树形图复选是否关联
      permissions: [], //树形数据
      permissionsByRole: [],
      treeArr: [], //已勾选的权限
      arr: [], //巡更还是点检还是巡更加点检
      dialogType: '',
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      listQuery: {
        check_device_count: '', //点检设备数
        check_task_count: '', //点检任务数
        id: '',
        level_desp: '', //描述
        level_name: '', //名字
        level_permission: '', //权限id
        oldId: '', //
        patrol_check: '', //巡更点检组，1巡更，2点检
        register_level: '', //设置为自主注册默认级别。
        report_count: '' //进行中的额报事数
      },
      saas: {
        name: '',
        description: '',
        type: [],
        radio: '',
        radio1: '',
        radio2: '',
        checked: false,
        checked1: false,
        checked2: false,
        input: '',
        input1: '',
        input2: ''
      }
    }
  },
  mounted() {
    this.getPermissions()
    this.getCheckList()
  },
  methods: {
    rank(row, column) {
      if (row.register_level == 1) {
        return '√'
      } else {
        return ''
      }
    },
    handleClose(done) {
      this.$confirm('关闭后页面将刷新')
        .then(_ => {
          history.go(0)
          done()
        })
        .catch(_ => {})
    },
    async getCheckList() {
      try {
        const res = await getList()
        console.log(res)
        if (res.code == 20000) {
          this.list = res.result
          this.listLoading = false
        }
      } catch (err) {
        console.log(err)
      }
    },
    async level(id) {
      try {
        const res = await defaultLevel(id)
        console.log(res)
        if (res.result != true) {
          this.$confirm('当前已设置其他默认级别，请确认是否需要更改', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.saas.checked = true
              this.listQuery.oldId = res.result.id.toString()
              this.$message({
                type: 'success',
                message: '更改!'
              })
            })
            .catch(() => {
              this.saas.checked = false
              this.$message({
                type: 'info',
                message: '不更改'
              })
            })
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 编辑
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      let obj = scope.row
      this.listQuery = deepClone(scope.row)
      this.saas.name = obj.level_name
      this.saas.description = obj.level_desp
      this.arr = obj.patrol_check.split(',')
      if (obj.register_level == 1) {
        this.saas.checked = true
      } else {
        this.saas.checked = false
      }
      // 点检设备数
      if (obj.check_device_count != '0' && obj.check_device_count != null) {
        console.log('走这里了？')
        this.saas.radio2 = 2
        this.saas.input2 = obj.check_device_count
      } else {
        this.saas.radio2 = 1
      }
      // 点检任务数
      if (obj.check_task_count != '0' && obj.check_task_count != null) {
        this.saas.radio1 = 2
        this.saas.input1 = obj.check_task_count
      } else {
        this.saas.radio1 = 1
      }
      // 进行中的额报事数
      if (obj.report_count != '0' && obj.report_count != null) {
        this.saas.radio = 2
        this.saas.input = obj.report_count
      } else {
        this.saas.radio = 1
      }

      // 巡更点检组，1巡更，2点检
      if (obj.patrol_check == '1') {
        this.saas.checked1 = true
        this.saas.checked2 = false
      } else if (obj.patrol_check == '2') {
        this.saas.checked1 = false
        this.saas.checked2 = true
      } else if (obj.patrol_check == '1,2' || obj.patrol_check == '2,1') {
        this.saas.checked1 = true
        this.saas.checked2 = true
      } else {
        this.saas.checked1 = false
        this.saas.checked2 = false
      }
      this.saas.id = obj.id
      this.treeArr = obj.level_permission.split(',')
    },
    // 树形数据
    async getPermissions() {
      const res = await subPermissions()
      console.log(res)
      this.permissions = res.result
    },
    // 权限树
    checkPermissionTree(currentObj, treeStatus) {
      const currentNode = this.$refs.tree.getNode(currentObj)
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      const selected = treeStatus.checkedKeys.indexOf(currentNode.key) // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentNode)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentNode, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentNode.childNodes) {
          if (currentNode.childNodes.length !== 0) {
            this.uniteChildSame(currentNode, false)
          }
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(currentNode, isSelected) {
      this.$refs.tree.setChecked(currentNode.key, isSelected)
      if (currentNode.childNodes) {
        for (let i = 0; i < currentNode.childNodes.length; i++) {
          this.uniteChildSame(currentNode.childNodes[i], isSelected)
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentNode) {
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    },
    // 新增
    newAdd() {
      this.dialogType = 'newAdd'
      this.dialogVisible = true
    },
    // 新增
    async add(obj) {
      try {
        const res = await getAdd(obj)
        history.go(0)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    // 进行中的报事数限制
    postNum(val) {
      console.log(val)
      if (val == 1) {
        this.listQuery.report_count = '0'
        this.saas.input = ''
      } else {
        if (this.saas.input != '') {
          this.listQuery.report_count = this.saas.input
        } else {
          this.saas.radio = '0'
          this.$message('请先填写数量')
        }
      }
    },
    // 点检任务数限制
    postNum1(val) {
      console.log(val)
      if (val == 1) {
        this.listQuery.check_task_count = '0'
        this.saas.input1 = ''
      } else {
        if (this.saas.input1 != '') {
          this.listQuery.check_task_count = this.saas.input1
        } else {
          this.saas.radio1 = '0'
          this.$message('请先填写数量')
        }
      }
    },
    // 点检设备创建数限制
    postNum2(val) {
      console.log(val)
      if (val == 1) {
        this.listQuery.check_device_count = '0'
        this.saas.input2 = ''
      } else {
        if (this.saas.input2 != '') {
          this.listQuery.check_device_count = this.saas.input2
        } else {
          this.saas.radio2 = '0'
          this.$message('请先填写数量')
        }
      }
    },
    fu(val) {
      if (val == true) {
        this.arr.push('1')
      } else {
        if (this.arr.indexOf('1') != -1) {
          this.arr.splice(this.arr.indexOf('1'), 1)
        }
      }
      let newArr = []
      this.arr.map(val => {
        if (val != '' && val != null && val != undefined) {
          newArr.push(val)
        }
      })
      this.listQuery.patrol_check = newArr.join(',')
      console.log(this.listQuery.patrol_check)
    },
    fu1(val) {
      if (val == true) {
        this.arr.push('2')
      } else {
        if (this.arr.indexOf('2') != -1) {
          this.arr.splice(this.arr.indexOf('2'), 1)
        }
      }
      let newArr = []
      this.arr.map(val => {
        if (val != '' && val != null && val != undefined) {
          newArr.push(val)
        }
      })
      this.listQuery.patrol_check = newArr.join(',')
      console.log(this.listQuery.patrol_check)
    },
    reg(val) {
      if (val == false) {
        this.listQuery.register_level = '0'
        this.level(this.listQuery.id)
      } else {
        this.listQuery.register_level = '1'
        this.level(this.listQuery.id)
      }
    },
    // 编辑
    async edit(obj) {
      try {
        const res = await modify(obj)
        history.go(0)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    // 确定
    confirmRole() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        // 编辑
        this.listQuery.level_desp = this.saas.description
        this.listQuery.level_name = this.saas.name
        this.listQuery.level_permission = this.$refs.tree
          .getCheckedKeys()
          .join(',') //若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
        if (this.listQuery.check_device_count != 1) {
          this.listQuery.check_device_count = this.saas.input
        } else {
          this.listQuery.check_device_count = 0
        }
        if (this.listQuery.check_device_count != 1) {
          this.listQuery.check_task_count = this.saas.input1
        } else {
          this.listQuery.check_task_count = 0
        }
        if (this.listQuery.report_count != 1) {
          this.listQuery.report_count = this.saas.input2
        } else {
          this.listQuery.report_count = 0
        }
        console.log(this.listQuery)
        this.edit(this.listQuery)
      } else {
        // 新增
        this.listQuery.level_desp = this.saas.description
        this.listQuery.level_name = this.saas.name
        this.listQuery.level_permission = this.$refs.tree
          .getCheckedKeys()
          .join(',') //若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组

        if (this.listQuery.level_name == '') {
          this.$message({
            message: '请填写名字',
            type: 'warning'
          })
        } else if (this.listQuery.level_desp == '') {
          this.$message({
            message: '请填写描述',
            type: 'warning'
          })
        } else if (this.listQuery.level_permission == '') {
          this.$message({
            message: '请选择权限',
            type: 'warning'
          })
        } else if (this.listQuery.patrol_check == '') {
          this.$message({
            message: '请选择巡更还是点检组',
            type: 'warning'
          })
        } else if (this.listQuery.check_device_count == '') {
          this.$message({
            message: '请选择点检设备数',
            type: 'warning'
          })
        } else if (this.listQuery.check_task_count == '') {
          this.$message({
            message: '请选择点检任务数',
            type: 'warning'
          })
        } else if (this.listQuery.report_count == '') {
          this.$message({
            message: '请选择进行中的额报事数',
            type: 'warning'
          })
        } else {
          console.log(this.listQuery)
          this.add(this.listQuery)
        }
      }
      console.log(this.listQuery)
    }
  }
}
</script>
<style lang='less' scoped>
.box {
  .con {
  }
}
</style>