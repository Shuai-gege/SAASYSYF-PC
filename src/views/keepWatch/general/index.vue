<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="180px">
      <span>巡更点故障设置</span>
      <!-- 故障点分配人 -->
      <el-form-item label="巡更点故障分配人">
        <el-select v-model="form.value" filterable placeholder="请选择" @change="fenPei">
          <el-option
            v-for="item in form.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 巡更点故障执行人 -->
      <el-form-item label="巡更点故障执行人">
        <el-select v-model="form.value1" filterable multiple placeholder="请选择" @change="zhiXing">
          <el-option
            v-for="item in form.options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 巡更点故障无效任务审核人 -->
      <el-form-item label="巡更点故障无效任务审核人">
        <el-select v-model="form.value2" filterable placeholder="请选择" @change="shenHe">
          <el-option
            v-for="item in form.options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 巡更任务转发权限人 -->
      <!-- <span>转发权限设置</span>
      <el-form-item label="转发权限设置">
        <el-select v-model="form.value3" filterable multiple placeholder="请选择" @change="zhuanFa">
          <el-option
            v-for="item in form.options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <!-- 巡更点默认参数设置 -->
      <span>巡更点默认参数设置</span>
      <el-form-item label="巡更点默认UUID">
        <el-input v-model="form.input" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="巡更点默认Major">
        <el-input v-model="form.input1" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="巡更点默认Minor">
        <el-input v-model="form.input2" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="巡更点默认MAC">
        <el-input v-model="form.input3" placeholder="请输入内容"></el-input>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCompanyAllUser } from '@/api/iguard/taskGuanLi'
import { saveOrModify, getPatrolPointDefault } from '@/api/iguard/keepWatch'
export default {
  data() {
    return {
      form: {
        options: [],
        value: '', //巡更点故障分配人
        options1: [],
        value1: [], //巡更点故障执行人
        options2: [],
        value2: '', //巡更点故障无效任务审核人
        options3: [],
        value3: [], //转发权限设置
        input: '', //巡更点默认UUID
        input1: '', //巡更点默认Major
        input2: '', //巡更点默认Minor
        input3: '', //巡更点默认MAC
        id: '' //详情数据Id
      },
      generalObj: {
        uid: localStorage.getItem('uid')
      } //巡更系统通用设置保存参数
    }
  },
  mounted() {
    this.tbEventTypeConfig()
    this.checkGeneral()
  },
  methods: {
    // 查询巡更点默认配置
    async checkGeneral() {
      try {
        const res = await getPatrolPointDefault(localStorage.getItem('deptid'))
        console.log(res)
        this.form.value = res.data.allocationUserId

        if (res.data.executerUserId == '') {
          this.form.value1 = ''
        } else {
          this.form.value1 = res.data.executerUserId.split(',')
        }
        this.form.value2 = res.data.invalidUserId
        if (res.data.deliverUserId == '') {
          this.form.value3 = ''
        } else {
          this.form.value3 = res.data.deliverUserId.split(',')
        }
        // this.form.value3 = res.data.deliverUserId.split(',')
        this.form.input = res.data.defaultUuid
        this.form.input1 = res.data.defaultMajor
        this.form.input2 = res.data.defaultMinor
        this.form.input3 = res.data.defaultMac
        this.form.id = res.data.id
      } catch (err) {
        console.log(err)
      }
    },
    // 查询公司所有人
    async tbEventTypeConfig() {
      try {
        const res = await getCompanyAllUser(localStorage.getItem('uid'))
        this.form.options = res.result
        this.form.options.forEach(item => {
          this.$set(item, 'value', item.uid)
          this.$set(item, 'label', item.vserName)
        })
        this.form.options1 = res.result
        this.form.options1.forEach(item => {
          this.$set(item, 'value', item.uid)
          this.$set(item, 'label', item.vserName)
        })
        this.form.options2 = res.result
        this.form.options2.forEach(item => {
          this.$set(item, 'value', item.uid)
          this.$set(item, 'label', item.vserName)
        })
        this.form.options3 = res.result
        this.form.options3.forEach(item => {
          this.$set(item, 'value', item.uid)
          this.$set(item, 'label', item.vserName)
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 分配人
    fenPei(val) {
      console.log(val)
      this.generalObj.allocationUserId = val
    },
    // 执行人
    zhiXing(val) {
      console.log(val)
      let arrVal = val.join(',')
      this.generalObj.executerUserId = arrVal
    },
    // 审核人
    shenHe(val) {
      console.log(val)
      this.generalObj.invalidUserId = val
    },
    // 转发权限
    zhuanFa(val) {
      console.log(val)
      let arrVal = val.join(',')
      this.generalObj.deliverUserId = arrVal
    },
    // 保存
    async save(obj) {
      try {
        const res = await saveOrModify(obj)
        console.log(res)
        if (res.code == 20000) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    onSubmit() {
      this.generalObj.defaultUuid = this.form.input
      this.generalObj.defaultMajor = this.form.input1
      this.generalObj.defaultMinor = this.form.input2
      this.generalObj.defaultMac = this.form.input3
      this.generalObj.id = this.form.id
      this.save(this.generalObj)
      setTimeout(() => {
        history.go(0)
      }, 300)
    }
  }
}
</script>
<style lang='less' scoped>
.app-container {
  /deep/.el-select > .el-input {
    width: 1000px;
  }
  .el-input {
    width: 1000px;
  }
  span {
    font-size: 20px;
    font-weight: 700;
  }
}
</style>