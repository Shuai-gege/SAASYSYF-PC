<template>
  <!-- 物料/设备管理 -->
  <div class="app-container">
    <!-- 搜索框所在区域 -->
    <div style="margin-top:20px;margin-bottom: 20px">
      <!-- <el-row :gutter="12">
        <el-col :span="3">
          <el-input-number v-model="listQuery.id" placeholder></el-input-number>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.typeName" placeholder="分类名称" />
        </el-col>
        <el-col :span="3">
          <el-date-picker v-model="listQuery.createTime" type="datetime" placeholder="创建时间"></el-date-picker>
        </el-col>
      </el-row>-->
      <!-- <el-divider></el-divider> -->
      <el-row :gutter="12">
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
        <!-- 表格展示内容 -->
        <el-col :span="23">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            style="width: 100%;"
            height="550"
            border
          >
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="物料ID" />
            <el-table-column prop="typeName" label="分类名称" />
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
    <el-dialog :visible.sync="dialogVisibleEdit" title="编辑">
      <el-form ref="form" :model="entityVO" label-width="80px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="物料ID" prop="id">
              <el-input v-model="entityVO.id" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="物料/设备" prop="typeName">
              <el-input v-model="entityVO.typeName" placeholder="物料/设备名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker v-model="entityVO.createTime" type="datetime" placeholder="创建时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmTbmaterialstypeEdit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹出框 -->
    <el-dialog :visible.sync="dialogVisibleAdd" title="新增">
      <el-form ref="form" :model="entityVO" label-width="80px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="物料/设备" prop="typeName">
              <el-input v-model="entityVO.typeName" placeholder="物料/设备名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker v-model="entityVO.createTime" type="datetime" placeholder="创建时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleAdd=false">取消</el-button>
        <el-button type="primary" @click="confirmTbmaterialstypeAdd">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {
  tbmaterialstypelist,
  tbmaterialstypeedit,
  tbmaterialstypedelete,
  tbmaterialstypeadd
} from '@/api/iguard/tbmaterialstype/tbmaterialstype'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { formatTimeToStr } from '@/utils/dateUtil' //处理后台传来的时间
import { deepClone } from '@/utils'
const token = getToken()

const entityVO = {
  uid: localStorage.getItem('uid'),
  id: '',
  typeName: '',
  createTime: ''
}

export default {
  name: `tbmaterialstype`,
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
        typeName: '',
        createTime: ''
      },
      headersObj: { 'LinkAdmin-Token': token },
      activeName: 'first',
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      dialogType: 'new',
      entityVO: Object.assign({}, entityVO)
    }
  },
  watch: {
    searchDeptName(val) {
      this.$refs.serchDeptTree.filter(val)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 时间格式化
    formatDateTime(row, column) {
      return formatTimeToStr(row.createTime, 'yyyy-MM-dd hh:mm:ss')
    },
    async getList() {
      this.listLoading = true
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await tbmaterialstypelist(this.listQuery)
        this.listLoading = false
        this.list = res.result.rows
        this.total = res.result.records
      } catch (e) {
        this.listLoading = false
      }
    },
    // 查询
    handleSearch() {
      this.getList()
    },
    // 点击编辑按钮触发
    handleEdit(scope) {
      this.dialogVisibleEdit = true
      this.entityVO = deepClone(scope.row)
      this.entityVO.uid = localStorage.getItem('uid')
    },
    // 点击新增按钮触发
    handleAdd(scope) {
      this.dialogVisibleAdd = true
    },
    // 编辑功能结束，点击确定按钮触发
    async confirmTbmaterialstypeEdit() {
      const res = await tbmaterialstypeedit(this.entityVO)
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
    async confirmTbmaterialstypeAdd() {
      const res = await tbmaterialstypeadd(this.entityVO)
      const result = res.code
      if (result == 20000) {
        this.$message({
          showClose: true,
          message: '新增成功',
          type: 'success'
        })
        this.entityVO.typeName = ''
        this.entityVO.createTime = ''
        this.dialogVisibleAdd = false
        this.getList()
      }
    },
    // 点击删除按钮触发 删除生成的表的记录
    async handleDelete(scope) {
      const h = this.$createElement
      this.entityVO = deepClone(scope.row)
      this.entityVO.uid = localStorage.getItem('uid')
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
            const res = await tbmaterialstypedelete(this.entityVO)
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
    }
  }
}
</script>