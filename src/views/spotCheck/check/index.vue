<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!-- 检查类型 -->
      <el-col :span="4">
        <el-select v-model="value" placeholder="检查类型" @change="type">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 检查项描述 -->
      <el-col :span="6">
        <el-input v-model="input" placeholder="检查项描述"></el-input>
      </el-col>
      <!-- 按钮 -->
      <!-- 按钮 -->
      <el-col :span="5">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="newAdd">新增</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <!-- 数据展示List -->
    <div>
      <el-row>
        <el-col :span="23">
          <el-table :data="tableData" style="width: 100%;" height="600" border v-loading="loading">
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+(checkList.page - 1) * checkList.limit + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="检查类型" />
            <el-table-column prop="checkDescription" label="检查项描述" />
            <el-table-column prop="inputTips" label="输入提示" />
            <el-table-column prop="zip" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
                <el-button type="text" size="small" @click="del(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="list"
          />
        </el-col>
      </el-row>
    </div>
    <!-- 新增 -->
    <el-dialog title="新增检查项" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="auto">
        <!-- 检查类型 -->
        <el-form-item label="检查类型">
          <el-select v-model="form.value" placeholder="检查类型" @change="type1">
            <el-option
              v-for="item in form.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 检查项描述 -->
        <el-form-item label="检查项描述">
          <el-input
            type="text"
            v-model="form.input"
            placeholder="检查项描述"
            show-word-limit
            maxlength="12"
            style="width:250px;"
          ></el-input>
        </el-form-item>
        <!-- 输入提示 -->
        <el-form-item label="输入提示">
          <el-input
            type="text"
            v-model="form.input1"
            placeholder="输入提示"
            show-word-limit
            maxlength="12"
            style="width:250px;"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑检查项" :visible.sync="dialogVisible1" width="40%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="auto">
        <!-- 检查类型 -->
        <el-form-item label="检查类型">
          <el-select v-model="form.value" placeholder="检查类型" @change="type1">
            <el-option
              v-for="item in form.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 检查项描述 -->
        <el-form-item label="检查项描述">
          <el-input
            type="text"
            v-model="form.input"
            placeholder="检查项描述"
            show-word-limit
            maxlength="12"
            style="width:250px;"
          ></el-input>
        </el-form-item>
        <!-- 输入提示 -->
        <el-form-item label="输入提示">
          <el-input
            type="text"
            v-model="form.input1"
            placeholder="输入提示"
            show-word-limit
            maxlength="12"
            style="width:250px;"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="editEnd">确认</el-button>
          <el-button @click="dialogVisible1 = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  addInspectionItem,
  list,
  editInspectionItem
} from '@/api/iguard/device/check'
export default {
  components: { Pagination },
  data() {
    return {
      value: '', //检查类型
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '数值类'
        },
        {
          value: '1',
          label: '文本类'
        },
        {
          value: '2',
          label: '正常/异常类'
        }
      ], //检查类型
      input: '', //检查项描述
      dialogVisible: false, //新增
      dialogVisible1: false, //编辑
      form: {
        value: '', //检查类型
        options: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '数值类'
          },
          {
            value: '1',
            label: '文本类'
          },
          {
            value: '2',
            label: '正常/异常类'
          }
        ], //检查类型
        input: '', //新增检查项描述
        input1: '' //新增输入提示
      },
      listQuery: {
        uid: localStorage.getItem('uid')
      },
      checkList: {
        page: 1,
        limit: 50,
        uid: localStorage.getItem('uid')
      },
      total: 0,
      tableData: [],
      objEdit: {
        uid: localStorage.getItem('uid')
      },
      loading: true
    }
  },
  mounted() {
    this.list()
  },
  methods: {
    // 检查项list
    async list() {
      try {
        const res = await list(this.checkList)
        console.log(res)
        if (res.code == 20000) {
          this.loading = false
          this.tableData = res.data
          this.tableData.forEach(item => {
            if (item.checkType == '0') {
              this.$set(item, 'type', '数值型')
            } else if (item.checkType == '1') {
              this.$set(item, 'type', '文本类')
            } else if (item.checkType == '2') {
              this.$set(item, 'type', '正常/异常类')
            }
          })
          console.log(this.tableData)
          this.total = res.count
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 新增检查项
    async add() {
      try {
        const res = await addInspectionItem(this.listQuery)
        if (res.code == 20000) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.list()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 编辑
    async bianJi() {
      try {
        const res = await editInspectionItem(this.objEdit)
        console.log(res)
        if (res.code == 20000) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.list()
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 新增
    newAdd() {
      this.dialogVisible = true
      this.form.input = ''
      this.form.input1 = ''
      this.form.value = ''
    },
    // 确认新增检查项
    onSubmit() {
      this.listQuery.inputTips = this.form.input1
      this.listQuery.checkDescription = this.form.input
      this.add()
    },
    // 编辑检查项
    edit(scope) {
      console.log(scope)
      this.dialogVisible1 = true
      let obj = scope.row
      this.typeNum = obj.type
      this.form.value = obj.type
      this.form.input = obj.checkDescription
      this.form.input1 = obj.inputTips
      this.objEdit.checkType = obj.checkType
      this.objEdit.id = obj.id
    },
    // 确认编辑
    editEnd() {
      this.dialogVisible1 = false
      this.objEdit.checkDescription = this.form.input
      this.objEdit.inputTips = this.form.input1
      this.bianJi()
    },
    // 查询检查类型
    type(val) {
      console.log(val)
    },
    // 新增检查类型
    type1(val) {
      console.log(val)
      this.listQuery.checkType = val
      this.objEdit.checkType = val
    },
    // 查询
    query() {
      console.log('woshichaxun')
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
}
</style>