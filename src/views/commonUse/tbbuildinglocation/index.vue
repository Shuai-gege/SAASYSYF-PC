<template>
  <div class="app-container">
    <!-- 搜索框所在区域 -->
    <div style="margin-top:20px;margin-bottom: 20px">
      <!-- 新增按钮 -->
      <el-row :gutter="12">
        <el-col :span="18">
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            @click="handleAdd"
          >
            <i class="el-icon-plus" />新增建筑
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            @click="handleAdd1"
          >
            <i class="el-icon-plus" />新增楼层
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            @click="handleAdd2"
          >
            <i class="el-icon-plus" />新增房间
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 展示区域 -->
    <div>
      <!-- 带删除按钮的树形图 -->
      <div class="block">
        <el-tree
          :data="data1"
          :props="defaultProps1"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                icon="el-icon-delete"
                size="mini"
                @click="() => remove(node, data)"
              ></el-button>
              <el-button
                type="text"
                icon="el-icon-edit-outline"
                size="mini"
                @click="() => edit(node, data)"
              ></el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <!-- 新增建筑弹出框 -->
    <el-dialog :visible.sync="dialogVisibleAdd" title="新增" @close="end" :before-close="handleClose">
      <!-- 批量添加 -->
      <el-row>
        <el-col :span="18">
          <el-form
            :model="entityVO"
            ref="dynamicValidateForm"
            label-width="80px"
            class="demo-dynamic"
          >
            <el-form-item prop="jianZhu" label="公司名称">
              <el-input :placeholder="jianZhu" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item
              v-for="(domain, index) in entityVO.vos"
              :label="'建筑' + (index+1)"
              :key="domain.key"
              :prop="'vos.' + index + '.locationName'"
              :rules="{
      required: true, message: '建筑不能为空', trigger: 'blur'
    }"
            >
              <el-input v-model="domain.locationName"></el-input>
              <!-- <el-button @click.prevent="removeDomain(domain)">删除</el-button> -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click.prevent="removeDomain(domain)"
              ></el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
              <el-button @click="addDomain">新增建筑</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 新增楼层弹出框 -->
    <el-dialog
      :visible.sync="dialogVisibleAdd1"
      title="新增"
      @close="end1"
      :before-close="handleClose"
    >
      <!-- 批量添加 -->
      <el-row>
        <el-col :span="18">
          <el-form
            :model="entityVO1"
            ref="dynamicValidateForm"
            label-width="80px"
            class="demo-dynamic"
          >
            <el-form-item prop="jianZhu" label="公司名称">
              <el-input :placeholder="jianZhu" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item prop label="建筑名称">
              <el-col :span="12">
                <el-autocomplete
                  class="inline-input"
                  v-model="state1"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  @select="handleSelect"
                  :disabled="jinXuan"
                  style="width:380px;"
                ></el-autocomplete>
              </el-col>
            </el-form-item>
            <el-form-item
              v-for="(domain, index) in entityVO1.vos"
              :label="'楼层' + (index+1)"
              :key="domain.key"
              :prop="'vos.' + index + '.locationName'"
              :rules="{
      required: true, message: '楼层不能为空', trigger: 'blur'
    }"
            >
              <el-input v-model="domain.locationName"></el-input>
              <!-- <el-button @click.prevent="removeDomain(domain)">删除</el-button> -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click.prevent="removeDomain1(domain)"
              ></el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm1('dynamicValidateForm')">提交</el-button>
              <el-button @click="addDomain1">新增楼层</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 新增房间弹出框 -->
    <el-dialog
      :visible.sync="dialogVisibleAdd2"
      title="新增"
      @close="end2"
      :before-close="handleClose"
    >
      <!-- 批量添加 -->
      <el-row>
        <el-col :span="18">
          <el-form
            :model="entityVO2"
            ref="dynamicValidateForm"
            label-width="80px"
            class="demo-dynamic"
          >
            <el-form-item prop="jianZhu" label="公司名称">
              <el-input :placeholder="jianZhu" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item prop label="建筑名称">
              <el-col :span="12">
                <el-autocomplete
                  class="inline-input"
                  v-model="state2"
                  :fetch-suggestions="querySearch1"
                  placeholder="请输入内容"
                  @select="handleSelect1"
                  :disabled="jinXuan1"
                  style="width:380px;"
                ></el-autocomplete>
              </el-col>
            </el-form-item>

            <el-form-item prop label="楼层名称">
              <el-col :span="12">
                <el-autocomplete
                  class="inline-input"
                  v-model="state3"
                  :fetch-suggestions="querySearch2"
                  placeholder="请输入内容"
                  @select="handleSelect2"
                  :disabled="jinXuan2"
                  style="width:380px;"
                ></el-autocomplete>
              </el-col>
            </el-form-item>
            <el-form-item
              v-for="(domain, index) in entityVO2.vos"
              :label="'房间' + (index+1)"
              :key="domain.key"
              :prop="'vos.' + index + '.locationName'"
              :rules="{
      required: true, message: '房间不能为空', trigger: 'blur'
    }"
            >
              <el-input v-model="domain.locationName"></el-input>
              <!-- <el-button @click.prevent="removeDomain(domain)">删除</el-button> -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click.prevent="removeDomain2(domain)"
              ></el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm2('dynamicValidateForm')">提交</el-button>
              <el-button @click="addDomain2">新增房间</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-form ref="form" label-width="80px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="更新前：" prop="id">
              <el-input v-model="input1" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="更新为：" prop="id">
              <el-input size="medium" v-model="input2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endEdit">取 消</el-button>
        <el-button type="primary" @click="isEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {
  tbbuildinglocationlist,
  tbbuildinglocationedit,
  tbbuildinglocationdelete,
  tbbuildinglocationadd,
  getCompanyDept //查询此账号下所属公司所有建筑
} from '@/api/iguard/tbbuildinglocation/tbbuildinglocation'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { formatTimeToStr } from '@/utils/dateUtil'
import { deepClone } from '@/utils'
const token = getToken()
// 新增建筑
const entityVO = {
  vos: [
    {
      uid: '',
      locationName: '',
      parentId: ''
    }
  ]
}
// 新增楼层
const entityVO1 = {
  vos: []
}
// 新增房间
const entityVO2 = {
  vos: []
}

export default {
  name: `tbbuildinglocation`,
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      tableKey: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 50,
        id: '',
        locationName: '',
        parentId: ''
      },
      headersObj: { 'LinkAdmin-Token': token },
      activeName: 'first',
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      dialogVisibleAdd1: false,
      dialogVisibleAdd2: false,
      dialogVisible: false, //编辑弹窗
      input1: '', //编辑前的内容
      input2: '', //编辑为什么
      editObj: {
        //编辑提交的信息
        id: '',
        locationName: '',
        parent_id: ''
      },
      editObj1: {}, //接受点击传来当前节点的对象
      dialogType: 'new',
      entityVO: Object.assign({}, entityVO), //新增建筑
      entityVO1: Object.assign({}, entityVO1), //新增楼层
      entityVO2: Object.assign({}, entityVO2), //新增房间
      radio: '', //单选框
      radio1: '', //根据当前单选框选中的东西做判断
      uid: localStorage.getItem('uid'), //查询当前登录人所属公司所有建筑
      flag: false, //控制楼层和空间是否显示
      flag1: false, //控制树形控件显示隐藏
      defaultProps: {
        children: 'childrens',
        label: 'locationName'
      },
      defaultProps1: {
        //展示公司架构
        children: 'childrens',
        label: 'locationName'
      },
      data1: [], //树形控件List
      state1: '', //新增建筑
      state2: '', //新增楼层是要选的建筑
      state3: '', //新增房间是要选的楼层
      restaurants: [], //新增建筑List
      restaurants1: [], //新增楼层是要选的建筑List
      restaurants2: [], //新增房间是要选的楼层List
      parentId: '', //新建楼层时必传的
      jinXuan: false, //新增楼层选定建筑后不换
      jinXuan1: false, //新增楼层选定建筑后不换
      jinXuan2: false, //新增楼层选定建筑后不换
      jianZhu: localStorage.getItem('deptName')
    }
  },
  watch: {
    searchDeptName(val) {
      this.$refs.serchDeptTree.filter(val)
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getCompanyDeptList()
  },
  methods: {
    // 展示List，不过没用上，也就不删除了，怕有其他地方有用到。
    async getList() {
      this.listLoading = true
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await tbbuildinglocationlist(this.listQuery)
        this.listLoading = false
        this.list = res.result.rows
        this.total = res.result.records
        console.log(this.list)
      } catch (e) {
        this.listLoading = false
      }
    },
    // 获取当前登录人所属公司所有建筑&楼层&空间
    async getCompanyDeptList() {
      try {
        const res = await getCompanyDept(this.uid)
        this.data = res.result
        this.data1 = res.result
      } catch (e) {
        console.log(e)
      }
    },
    // 公司建筑树形图
    filterNode(value, data) {
      if (!value) return true
      return data.locationName.indexOf(value) !== -1
    },
    // 选中的那个
    xuan(obj) {
      console.log(obj)
      this.filterText = obj.locationName
      this.flag1 = false
      this.entityVO.vos[0].parentId = obj.id
    },
    // 展示树形控件
    handleNodeClick(data) {
      console.log(data)
    },
    // 查询
    handleSearch() {
      this.getList()
    },
    // 点击编辑按钮触发
    handleEdit(scope) {
      this.dialogVisibleEdit = true
      this.entityVO.vos[0] = deepClone(scope.row)
    },
    // 点击新增建筑按钮触发
    handleAdd(scope) {
      this.dialogVisibleAdd = true
      this.state1 = ''
      this.state2 = ''
      this.state3 = ''
      this.entityVO.vos = []
    },
    // 点击新增楼层按钮触发
    handleAdd1(scope) {
      this.dialogVisibleAdd1 = true
      this.state1 = ''
      this.state2 = ''
      this.state3 = ''
      this.entityVO1.vos = []
    },
    //关系新增建筑弹出框
    end() {
      this.state2 = ''
      this.state3 = ''
    },
    //关闭新增楼层弹窗
    end1() {
      this.state2 = ''
      this.state3 = ''
      this.jinXuan = false
    },
    //关闭新增房间弹窗
    end2() {
      this.state2 = ''
      this.state3 = ''
      this.jinXuan1 = false
      this.jinXuan2 = false
    },
    // 点击新增房间按钮触发
    handleAdd2(scope) {
      this.dialogVisibleAdd2 = true
      this.state1 = ''
      this.state2 = ''
      this.state3 = ''
      this.entityVO2.vos = []
    },
    // 编辑功能结束，点击确定按钮触发
    async confirmTbbuildinglocationEdit() {
      const res = await tbbuildinglocationedit(this.entityVO)
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
    async confirmTbbuildinglocationAdd(data) {
      this.entityVO.vos[0].uid = localStorage.getItem('uid')
      const res = await tbbuildinglocationadd(data)
      const result = res.code
      if (result == 20000) {
        this.$message({
          showClose: true,
          message: '新增成功',
          type: 'success'
        })
        this.dialogVisibleAdd = false
        this.getCompanyDeptList()
      }
    },
    // 点击删除按钮触发 删除生成的表的记录
    async handleDelete(id) {
      const h = this.$createElement
      var dataId = { id: id } //删除所传当前数据ID
      // this.entityVO.vos[0] = deepClone(scope.row);
      this.$msgbox({
        title: '删除消息',
        message: h('p', null, [
          h('span', null, '确定要删除 '),
          h('i', { style: 'color: teal' }, '这条记录吗?'),
          h('i', { style: 'color:#fc4c4c' }, '它下面可能会有其他数据')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: async (action, instance, done) => {
          console.log(action, instance)
          if (action === 'confirm') {
            const res = await tbbuildinglocationdelete(dataId)
            if (res.code == 20000) {
              done()
            }
          } else {
            done()
            this.getCompanyDeptList()
          }
        }
      }).then(action => {
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功'
        })
        this.getCompanyDeptList()
      })
    },
    //批量添加建筑
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.confirmTbbuildinglocationAdd(this.entityVO)
          this.entityVO.vos.locationName = ''
          console.log(this.entityVO)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除建筑输入框
    removeDomain(item) {
      var index = this.entityVO.vos.indexOf(item)
      if (index !== -1) {
        this.entityVO.vos.splice(index, 1)
      }
    },
    // 新增建筑输入框
    addDomain() {
      this.entityVO.vos.push({
        uid: localStorage.getItem('uid'),
        locationName: '',
        parentId: ''
      })
      console.log(this.entityVO)
    },
    // 添加楼层
    async querySearch(queryString, cb) {
      try {
        const res = await getCompanyDept(this.uid)
        this.restaurants = res.result
        for (var i = 0; i < res.result.length; i++) {
          this.$set(
            this.restaurants[i],
            'value',
            this.restaurants[i].locationName
          )
        }
        var restaurants1 = queryString
          ? this.restaurants.filter(this.createFilter(queryString))
          : this.restaurants
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      // 调用 callback 返回建议列表的数据
      cb(restaurants1)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    handleSelect(item) {
      console.log(item)
      localStorage.setItem('id', item.id)
      this.parentId = item.id
      this.jinXuan = true
    },
    //批量添加楼层
    submitForm1(formName) {
      if (this.state1 == '') {
        this.$message({
          message: '请选择建筑'
        })
      } else {
        this.$refs[formName].validate(valid => {
          console.log('valid', valid)
          if (valid) {
            this.confirmTbbuildinglocationAdd(this.entityVO1)
            console.log(this.entityVO1)
            this.dialogVisibleAdd1 = false
            this.jinXuan = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    // 删除建筑输入框
    removeDomain1(item) {
      console.log(item)
      var index = this.entityVO1.vos.indexOf(item)
      if (index !== -1) {
        this.entityVO1.vos.splice(index, 1)
      }
    },
    // 新增楼层输入框
    addDomain1() {
      if (this.state1 == '') {
        this.$message({
          message: '请选择要添加的建筑'
        })
      } else {
        this.entityVO1.vos.push({
          uid: localStorage.getItem('uid'),
          locationName: '',
          parentId: this.parentId
        })
      }
    },

    //批量添加房间下面的是查询建筑
    async querySearch1(queryString, cb) {
      try {
        const res = await getCompanyDept(this.uid)
        this.restaurants1 = res.result
        for (var i = 0; i < res.result.length; i++) {
          this.$set(
            this.restaurants1[i],
            'value',
            this.restaurants1[i].locationName
          )
        }
        var restaurants2 = queryString
          ? this.restaurants1.filter(this.createFilter1(queryString))
          : this.restaurants1
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      // 调用 callback 返回建议列表的数据
      cb(restaurants2)
    },
    createFilter1(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    handleSelect1(item) {
      console.log(item)
      this.restaurants2 = item.childrens
      this.jinXuan1 = true
    },
    //批量添加房间下面的是查询楼层
    querySearch2(queryString, cb) {
      console.log(this.restaurants2)
      for (var i = 0; i < this.restaurants2.length; i++) {
        this.$set(
          this.restaurants2[i],
          'value',
          this.restaurants2[i].locationName
        )
      }
      var restaurants3 = queryString
        ? this.restaurants2.filter(this.createFilter2(queryString))
        : this.restaurants2
      // 调用 callback 返回建议列表的数据
      cb(restaurants3)
    },
    createFilter2(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    handleSelect2(item) {
      console.log(item)
      localStorage.setItem('floorId', item.id)
      this.jinXuan2 = true
    },
    //批量添加房间
    submitForm2(formName) {
      if (this.state2 == '' || this.state3 == '') {
        this.$message({
          message: '请选择建筑和楼层'
        })
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            console.log('valid', valid)
            this.confirmTbbuildinglocationAdd(this.entityVO2)
            console.log(this.entityVO2)
            this.dialogVisibleAdd2 = false
            this.jinXuan = false
            this.jinXuan1 = false
            this.jinXuan2 = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    // 删除房间输入框
    removeDomain2(item) {
      console.log(item)
      var index = this.entityVO2.vos.indexOf(item)
      if (index !== -1) {
        this.entityVO2.vos.splice(index, 1)
      }
    },
    // 新增房间输入框
    addDomain2() {
      if (this.state2 == '' || this.state3 == '') {
        this.$message({
          message: '请选择建筑和楼层'
        })
      } else {
        this.entityVO2.vos.push({
          uid: localStorage.getItem('uid'),
          locationName: '',
          parentId: localStorage.getItem('floorId')
        })
      }
      console.log(this.entityVO2)
    },

    // 树形随意删除某一个
    async remove(node, data) {
      console.log(node, data)
      this.handleDelete(data.id)
      const parent = node.parent
      const children = parent.data.childrens || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    // 树形随意编辑某一个
    async edit(node, data) {
      this.dialogVisible = true
      console.log('node', node)
      this.input1 = data.locationName
      console.log('data', data)
      this.editObj1 = data
    },
    // 退出编辑
    endEdit() {
      this.input2 = ''
      this.dialogVisible = false
    },
    // 提交修改后的信息
    async isEdit() {
      console.log(this.editObj1)
      this.editObj.id = this.editObj1.id
      this.editObj.parent_id = this.editObj1.parentId
      this.editObj.locationName = this.input2
      const res = await tbbuildinglocationedit(this.editObj)
      const result = res.code
      if (result == 20000) {
        this.$message({
          showClose: true,
          message: '编辑成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.input2 = ''
        this.getCompanyDeptList()
      }
    },
    // 编辑弹窗
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
<style lang="less" scoped>
.app-container {
  /deep/.el-form-item__content {
    display: flex;
  }
}
</style>
