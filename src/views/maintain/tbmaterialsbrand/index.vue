<template>
  <!-- 物料/设配品牌管理 -->
  <div class="app-container">
    <!-- 搜索框所在区域 -->
    <div style="margin-top:20px;margin-bottom: 20px">
      <!-- <el-row :gutter="12">
        <el-col :span="3">
          <el-input-number v-model="listQuery.id" placeholder></el-input-number>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.brandName" placeholder="品牌名称" />
        </el-col>
        <el-col :span="3">
          <el-date-picker v-model="listQuery.createTime" type="datetime" placeholder="创建时间"></el-date-picker>
        </el-col>
      </el-row>
      <el-divider></el-divider>-->
      <el-row :gutter="12">
        <el-col :span="9" style="display:flex">
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
          <!-- <el-button icon="el-icon-search" circle @click="check"></el-button>
          <el-input placeholder="请输要查找的物料/设备名" v-model="input" clearable></el-input>-->
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
          >
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="ID" width="200" />
            <el-table-column prop="brandName" label="品牌名称" width="200" />
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="200"
              :formatter="formatDateTime"
            />
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
            <el-form-item label="品牌名称" prop="brandName">
              <el-input v-model="entityVO.brandName" placeholder="品牌名称" />
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
        <el-button type="primary" @click="confirmTbmaterialsbrandEdit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹出框 -->
    <el-dialog :visible.sync="dialogVisibleAdd" title="新增">
      <el-form ref="form" :model="entityVO" label-width="80px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="品牌名称" prop="brandName">
              <el-input v-model="entityVO.brandName" placeholder="品牌名称" />
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
        <el-button type="danger" @click="esc">取消</el-button>
        <el-button type="primary" @click="confirmTbmaterialsbrandAdd">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {
  tbmaterialsbrandlist,
  tbmaterialsbrandedit,
  tbmaterialsbranddelete,
  tbmaterialsbrandadd
} from '@/api/iguard/tbmaterialsbrand/tbmaterialsbrand'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { formatTimeToStr } from '@/utils/dateUtil'
import { deepClone } from '@/utils'
const token = getToken()
const entityVO = {
  uid: localStorage.getItem('uid'),
  id: '',
  brandName: '',
  createTime: ''
}

export default {
  name: `tbmaterialsbrand`,
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
        brandName: '',
        createTime: ''
      },
      headersObj: { 'LinkAdmin-Token': token },
      activeName: 'first',
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      dialogType: 'new',
      entityVO: Object.assign({}, entityVO)
      // 搜索指定物料&设备
      // listQuery01: {
      //   page: "",
      //   limit: "",
      //   id: "",
      //   brandName: "",
      //   createTime: ""
      // },
      // input: "" //查找指定物料/设备输入框
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
    // 物料/设备品牌list
    async getList() {
      this.listLoading = true
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await tbmaterialsbrandlist(this.listQuery)
        this.listLoading = false
        this.list = res.result.rows
        this.total = res.result.records
      } catch (e) {
        this.listLoading = false
      }
    },
    // 查找指定物料/设备品牌
    // async check() {
    //   if (this.input == "") {
    //     this.$message({
    //       showClose: true,
    //       message: "请输入您要查找的物料&设备名"
    //     });
    //   } else {
    //     this.listQuery01.brandName = this.input;
    //   }
    //   try {
    //     const res = await tbmaterialsbrandlist(this.listQuery01);
    //     console.log(res);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // },
    // 时间格式化
    formatDateTime(row, column) {
      return formatTimeToStr(row.createTime, 'yyyy-MM-dd hh:mm:ss')
    },
    // 查询
    // handleSearch() {
    //   this.getList();
    // },
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
    async confirmTbmaterialsbrandEdit() {
      const res = await tbmaterialsbrandedit(this.entityVO)
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
    // 新增时的返回清空输入框
    esc() {
      this.dialogVisibleAdd = false
      this.entityVO.createTime = ''
      this.entityVO.brandName = ''
    },
    // 新增功能结束，点击确定按钮触发
    async confirmTbmaterialsbrandAdd() {
      const res = await tbmaterialsbrandadd(this.entityVO)
      const result = res.code
      if (result == 20000) {
        this.$message({
          showClose: true,
          message: '新增成功',
          type: 'success'
        })
        this.dialogVisibleAdd = false
        this.entityVO.brandName = ''
        this.entityVO.createTime = ''
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
            const res = await tbmaterialsbranddelete(this.entityVO)
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
<style lang="less" scope>
.app-container {
  .el-input--suffix .el-input__inner {
    margin-left: 5px;
  }
  .el-button.is-circle {
    margin-left: 55px;
  }
}
</style>