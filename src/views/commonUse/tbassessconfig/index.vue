<template>
  <div class="app-container">
    <!-- 搜索框所在区域 -->
    <div style="margin-top:20px;margin-bottom: 20px">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            @click="handleAdd"
            v-if="flag"
          >
            <i class="el-icon-plus" />新增
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            @click="handleEdit"
          >
            <i class="el-icon-edit-outline" />编辑
          </el-button>
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
            <el-table-column label="序号" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="评论ID" />
            <el-table-column prop="assessType" label="评价类型" />
            <el-table-column prop="proportion" label="占比" />
            <!-- <el-table-column
              prop="createTime"
              label="创建时间"
              width="200"
              :formatter="formatDateTime"
            />-->
            <el-table-column prop="companyId" label="公司" />
            <!-- <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleEdit(scope)">编辑</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope)">删除</el-button>
              </template>
            </el-table-column>-->
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
      <!--<el-form ref="form" :model="entityVO" label-width="80px" label-position="right">
         <el-row>
          <el-col :span="12">
            <el-form-item label="评价类型" prop="assessType">
              <el-input v-model="entityVO.assessType" placeholder="评价类型" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="占比" prop="proportion">
              <el-input v-model="entityVO.proportion" placeholder="占比" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmTbassessconfigEdit">确定</el-button>
      </span>-->
      <el-row>
        <el-col :span="18">
          <el-form
            :model="entityVO01"
            ref="dynamicValidateForm"
            label-width="80px"
            class="demo-dynamic"
          >
            <el-form-item
              v-for="(domain, index) in entityVO01.vos"
              :key="domain.key"
              :prop="'vos.' + index + '.assessType'"
              :rules="{
      required: true, message: '评价不能为空', trigger: 'blur'
    }"
            >
              <div class="box">
                <div class="minBox">
                  <p class="duan">评价</p>
                  <el-input v-model="domain.assessType"></el-input>
                </div>
                <div class="minBox">
                  <p class="duan">占比</p>
                  <el-input v-model="domain.proportion" color="#f00"></el-input>
                </div>
                <!-- <el-button @click.prevent="removeDomain(domain)" type="text" icon="el-icon-delete"></el-button> -->
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm1('dynamicValidateForm')">提交</el-button>
              <!-- <el-button @click="addDomain">新增评价</el-button> -->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 新增弹出框 -->
    <el-dialog :visible.sync="dialogVisibleAdd" title="新增">
      <el-row>
        <el-col :span="18">
          <el-form :label-position="labelPosition" label-width="80px" :model="form">
            <div class="flex">
              <el-form-item label="评价">
                <el-input v-model="form.newVal" placeholder="评价"></el-input>
              </el-form-item>
              <el-form-item label="占比">
                <el-input v-model="form.newVal1" placeholder="占比"></el-input>
              </el-form-item>
            </div>
            <!--  -->
            <div class="flex">
              <el-form-item label="评价">
                <el-input v-model="form.newVal2" placeholder="评价"></el-input>
              </el-form-item>
              <el-form-item label="占比">
                <el-input v-model="form.newVal3" placeholder="占比"></el-input>
              </el-form-item>
            </div>
            <!--  -->
            <div class="flex">
              <el-form-item label="评价">
                <el-input v-model="form.newVal4" placeholder="评价"></el-input>
              </el-form-item>
              <el-form-item label="占比">
                <el-input v-model="form.newVal5" placeholder="占比"></el-input>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="primary" @click="end">确定</el-button>
              <el-button @click="dialogVisibleAdd = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {
  tbassessconfiglist,
  tbassessconfigedit,
  tbassessconfigdelete,
  tbassessconfigadd
} from '@/api/iguard/tbassessconfig/tbassessconfig'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { formatTimeToStr } from '@/utils/dateUtil'
import { deepClone } from '@/utils'
const token = getToken()
const entityVO = {
  vos: [
    {
      uid: localStorage.getItem('uid'),
      assessType: '',
      proportion: '0'
    }
  ]
}

export default {
  name: `tbassessconfig`,
  components: { Pagination },
  data() {
    return {
      list: null,
      listNum: [], //评价占比
      total: 0,
      tableKey: 0,
      listLoading: false,
      listQuery: {
        uid: '',
        page: 1,
        limit: 50,
        id: '',
        assessType: '',
        proportion: '',
        createTime: '',
        companyId: localStorage.getItem('deptid')
      },
      headersObj: { 'LinkAdmin-Token': token },
      activeName: 'first',
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      dialogType: 'new',
      entityVO: Object.assign({}, entityVO),
      entityVO01: { vos: [] }, //评论List
      entityVO02: { vos: [] }, //新增
      labelPosition: 'right',
      form: {
        newVal: '', //评论名字
        newVal1: '', //评论数值
        newVal2: '', //评论名字
        newVal3: '', //评论数值
        newVal4: '', //评论名字
        newVal5: '' //评论数值
      },
      flag: true
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
  mounted() {},
  methods: {
    async getList() {
      this.listLoading = true
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await tbassessconfiglist(this.listQuery)
        this.listLoading = false
        this.list = res.result.rows
        this.entityVO01.vos = res.result.rows
        console.log(this.entityVO01)
        this.total = res.result.records
        if (res.result.rows.length == 3) {
          this.flag = false
        } else {
          this.flag = true
        }
        for (var i = 0; i < res.result.rows.length; i++) {
          this.listNum.push(res.result.rows[i].proportion)
        }
      } catch (e) {
        this.listLoading = false
      }
    },
    // 时间格式化
    formatDateTime(row, column) {
      return formatTimeToStr(row.createTime, 'yyyy-MM-dd hh:mm:ss')
    },
    // 查询
    handleSearch() {
      this.getList()
    },
    // 点击编辑按钮触发
    handleEdit(scope) {
      this.dialogVisibleEdit = true
      this.entityVO = deepClone(scope.row)
    },
    // 点击新增按钮触发
    handleAdd(scope) {
      this.entityVO.assessType = ''
      this.entityVO.proportion = ''
      this.dialogVisibleAdd = true
    },
    //判断评价占比是否超过100
    judgeNum(arr) {
      return eval(arr.join('+'))
    },

    // 编辑功能结束，点击确定按钮触发
    async confirmTbassessconfigEdit(obj) {
      console.log(obj)
      const res = await tbassessconfigedit(obj)
      const result = res.code
      if (result == 20000) {
        this.$message({
          showClose: true,
          message: '编辑成功',
          type: 'success'
        })
        this.dialogVisibleEdit = false
        this.listNum = []
        this.getList()
      }
    },
    // 新增功能结束，点击确定按钮触发
    async confirmTbassessconfigAdd(obj) {
      const res = await tbassessconfigadd(obj)
      const result = res.code
      if (result == 20000) {
        this.$message({
          showClose: true,
          message: '新增成功',
          type: 'success'
        })
        this.dialogVisibleAdd = false
        this.getList()
      }
    },
    // 点击删除按钮触发 删除生成的表的记录
    async handleDelete(scope) {
      const h = this.$createElement
      this.entityVO = deepClone(scope.row)
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
            const res = await tbassessconfigdelete(this.entityVO)
            if (res.code == 20000) {
              done()
            }
          } else {
            done()
          }
        }
      }).then(action => {
        this.getList()
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功'
        })
      })
    },
    //批量添加
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.confirmTbassessconfigAdd(this.entityVO);
          var arrNum = []
          this.entityVO.vos.forEach(function(i) {
            arrNum.push(i.proportion)
          })
          if (this.judgeNum(arrNum) > 100) {
            this.$message({
              message: '总占比超过100，请修改。',
              type: 'warning'
            })
          } else if (this.judgeNum(arrNum) < 100) {
            this.$message({
              message: '总占比不足100，请修改。',
              type: 'warning'
            })
          } else if (this.judgeNum(arrNum) == 100) {
            this.confirmTbassessconfigAdd(this.entityVO)
            setInterval(() => {
              this.$router.go(0)
            }, 2000)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑
    submitForm1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var arrNum = []
          this.entityVO01.vos.forEach(function(i) {
            arrNum.push(i.proportion)
          })
          console.log(arrNum)
          if (this.judgeNum(arrNum) > 100) {
            this.$message({
              message: '总占比超过100，请修改。',
              type: 'warning'
            })
          } else if (this.judgeNum(arrNum) < 100) {
            this.$message({
              message: '总占比不足100，请修改。',
              type: 'warning'
            })
          } else if (this.judgeNum(arrNum) == 100) {
            this.confirmTbassessconfigEdit(this.entityVO01)
            setInterval(() => {
              this.$router.go(0)
            }, 2000)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    removeDomain(item) {
      var index = this.entityVO01.vos.indexOf(item)
      if (index !== -1) {
        this.entityVO01.vos.splice(index, 1)
      }
    },
    addDomain() {
      this.entityVO01.vos.push({
        uid: localStorage.getItem('uid'),
        assessType: '',
        proportion: '0'
      })
    },
    async add(obj) {
      try {
        const res = await tbassessconfigadd(obj)
        this.dialogVisibleAdd = false
        this.getList()
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 新增评论
    end(formName) {
      this.entityVO02.vos = [
        {
          companyId: localStorage.getItem('deptid'), //公司
          assessType: this.form.newVal, //名字
          proportion: this.form.newVal1, //分数
          uid: localStorage.getItem('uid')
        },
        {
          companyId: localStorage.getItem('deptid'), //公司
          assessType: this.form.newVal2, //名字
          proportion: this.form.newVal3, //分数
          uid: localStorage.getItem('uid')
        },
        {
          companyId: localStorage.getItem('deptid'), //公司
          assessType: this.form.newVal4, //名字
          proportion: this.form.newVal5, //分数
          uid: localStorage.getItem('uid')
        }
      ]
      var arrNum1 = []
      this.entityVO02.vos.forEach(function(item) {
        console.log(item.proportion)
        arrNum1.push(item.proportion)
      })
      console.log(arrNum1)
      if (
        this.entityVO02.vos[0].assessType == '' ||
        this.entityVO02.vos[1].assessType == '' ||
        this.entityVO02.vos[2].assessType == ''
      ) {
        this.$message({
          message: '请输入名字',
          type: 'warning'
        })
      } else if (this.judgeNum(arrNum1) > 100) {
        this.$message({
          message: '总占比超过100，请修改。',
          type: 'warning'
        })
      } else if (this.judgeNum(arrNum1) < 100) {
        this.$message({
          message: '总占比不足100，请修改。',
          type: 'warning'
        })
      } else {
        this.add(this.entityVO02)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.app-container {
  .box {
    display: flex;
    .minBox {
      display: flex;
      .chang {
        width: 100px;
      }
      .duan {
        width: 35px;
        line-height: 15px;
      }
    }
  }
  .flex {
    display: flex;
  }
}
</style>