<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="5">
        <el-button type="primary" @click="dialogVisible= true">新增</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <!-- 分权List -->
    <div>
      <el-row>
        <el-col :span="23">
          <el-table :data="tableData" style="width: 100%;" height="600" border>
            <el-table-column prop="difficultyName" label="权值名称" />
            <el-table-column prop="difficultyWeight" label="权值数值" />
            <el-table-column label="删除">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="del(scope)">删除</el-button>
                <el-button type="text" size="small" @click="deit(scope)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="orderList"
          />-->
        </el-col>
      </el-row>
    </div>
    <!-- 新增 -->
    <div>
      <el-dialog title="新增" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="权值名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="权值系数">
            <el-input v-model="form.score"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="end">立即创建</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 编辑 -->
    <div>
      <el-dialog title="新增" :visible.sync="dialogVisible1" width="30%" :before-close="handleClose">
        <el-form ref="form" :model="form1" label-width="80px">
          <el-form-item label="权值名称">
            <el-input v-model="form1.difficultyName"></el-input>
          </el-form-item>
          <el-form-item label="权值系数">
            <el-input v-model="form1.difficultyWeight"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="end1">确定</el-button>
            <el-button @click="dialogVisible1 = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { add, getList, shan, update } from '@/api/iguard/difficulty'
import Pagination from '@/components/Pagination' // Secondary
export default {
  components: { Pagination },
  data() {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      tableData: [],
      form: {
        name: '',
        score: ''
      },
      form1: {
        difficultyName: '',
        difficultyWeight: ''
      },
      listQuery: {
        companyId: localStorage.getItem('deptid'),
        difficultyName: '',
        difficultyWeight: ''
      },
      listQuery1: {
        companyId: localStorage.getItem('deptid'),
        difficultyName: '',
        difficultyWeight: ''
      }
    }
  },
  mounted() {
    this.checkList()
  },
  methods: {
    // 新增权值
    async xinZen() {
      try {
        const res = await add(this.listQuery)
        console.log(res)
        if (res.code == 20000) {
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.dialogVisible = false
          this.checkList()
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 查询list
    async checkList() {
      try {
        const res = await getList(this.listQuery1)
        console.log(res)
        this.tableData = res.result
      } catch (err) {
        console.log(err)
      }
    },
    async remove(id) {
      try {
        const res = await shan(id)
        console.log(res)
        if (res.code == 20000) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.checkList()
        }
      } catch (err) {
        console.log(err)
      }
    },
    async bianJi(obj) {
      try {
        const res = await update(obj)
        if (res.code == 20000) {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.dialogVisible1 = false
          this.checkList()
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 删除
    del(scope) {
      console.log(scope)
      this.remove({ id: scope.row.id })
    },
    // 编辑
    deit(scope) {
      this.dialogVisible1 = true
      this.form1.difficultyWeight = scope.row.difficultyWeight
      this.form1.difficultyName = scope.row.difficultyName
      this.form1.companyId = localStorage.getItem('deptid')
      this.form1.id = scope.row.id
    },
    end1() {
      this.bianJi(this.form1)
    },
    end() {
      this.listQuery.difficultyName = this.form.name
      this.listQuery.difficultyWeight = this.form.score
      this.xinZen()
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