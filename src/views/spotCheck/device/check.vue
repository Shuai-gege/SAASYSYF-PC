<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="4">
        <el-select v-model="value" placeholder="检查类型" @change="company">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input v-model="input" placeholder="检查项描述"></el-input>
      </el-col>
      <!-- 按钮 -->
      <el-col :span="5">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-col>
    </el-row>
    <!-- 展示模块 -->
    <el-divider></el-divider>
    <!-- 展示面板 -->
    <!-- <div>
      <el-row>
        <el-col :span="23">
          <el-table :data="tableData" style="width: 100%;" height="600" border v-loading="loading">
            <el-table-column width="50" label="序号">
              <template slot-scope="scope">
                <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="eventCode" label="建筑名称" />
            <el-table-column prop="reporter_name" label="楼层" />
            <el-table-column prop="event_type_name" label="巡更点编号" />
            <el-table-column prop="report_time" label="巡更点民初" />
            <el-table-column prop="finish_time" label="状态"  />
            <el-table-column prop="zip" label="禁用/启用">
              <template slot-scope="scope">
                <el-switch
                  v-model="value6"
                  >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="zip" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
                <el-button type="text" size="small" @click="remove(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="orderList"
          />
        </el-col>
      </el-row>
    </div>-->
    <!-- 新增 -->
    <div>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="35%" :before-close="handleClose">
        <el-form :label-position="labelPosition" label-width="90px" :model="formList">
          <!-- 选择选项 -->
          <!-- 企业 -->
          <el-form-item label="检查类型">
            <el-select v-model="formList.value" placeholder="检查类型" @change="company">
              <el-option
                v-for="item in formList.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 手写选项 -->
          <el-form-item label="检查项描述">
            <el-input v-model="formList.input1"></el-input>
          </el-form-item>
          <el-form-item label="输入提示">
            <el-input v-model="formList.message"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="end">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: 'right',
      dialogVisible: false, //新增弹出框
      value: '', //检查类型
      options: [], //检查类型
      input: '', //检查项描述
      formList: {
        value: '',
        options: [],
        input1: '',
        message: ''
      }
    }
  },
  mounted() {},
  methods: {
    company(val) {
      console.log(val)
    },
    // 新增确定
    end() {
      console.log('end')
    },
    // 关闭前确认
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 查询
    query() {
      console.log('查询')
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