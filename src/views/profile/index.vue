<template>
  <div class="app-container">
    <div v-if="userinfo">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <el-card style="margin-bottom:20px;">
            <div slot="header" class="clearfix">
              <span>个人中心</span>
            </div>

            <div class="user-profile">
              <div class="box-center">
                <pan-thumb
                  :image="userinfo.avatar"
                  :height="'100px'"
                  :width="'100px'"
                  :hoverable="false"
                >
                  <div>Hello</div>
                  {{ userinfo.vserName }}
                </pan-thumb>
              </div>
              <div class="box-center">
                <div class="user-name text-center">{{ userinfo.vserName }}</div>
                <div
                  class="user-role text-center text-muted"
                >{{ roles.join(" | ") | uppercaseFirst }}</div>
              </div>
            </div>

            <div class="user-bio">
              <div class="user-skills user-bio-section">
                <div class="user-bio-section-header">
                  <svg-icon icon-class="skill" />
                  <span>基本信息</span>
                  <el-button type="text" @click="dialogVisible = true">权限转交</el-button>
                </div>
                <div class="user-bio-section-body">
                  <div class="progress-item">
                    <span>姓名</span>
                    <span>{{ userinfo.vserName }}</span>
                  </div>
                  <div class="progress-item">
                    <span>账号</span>
                    <span>{{ userinfo.name }}</span>
                  </div>
                  <div class="progress-item">
                    <span>部门</span>
                    <span>{{ userinfo.deptName }}</span>
                  </div>
                  <div class="progress-item">
                    <span>邮箱</span>
                    <span>{{ userinfo.email }}</span>
                  </div>
                  <div class="progress-item">
                    <span>手机</span>
                    <span>{{ userinfo.mobile }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <!--<el-tab-pane label="账号" name="账号">
                <el-form>
                  <el-form-item label="登录名">
                    <el-input v-model.trim="userinfo.name" />
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model.trim="userinfo.email" />
                  </el-form-item>
                  <el-form-item label="手机">
                    <el-input v-model.trim="userinfo.mobile" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submit">修改</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>-->
              <!--<el-tab-pane label="个人页" name="个人页">
                <activity/>
              </el-tab-pane>-->
              <el-tab-pane label="修改密码" name="修改密码">
                <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
                  <el-form-item label="原密码" prop="oldPassword">
                    <el-input name="oldPassword" v-model="passwordForm.oldPassword" />
                  </el-form-item>
                  <el-form-item label="新密码" prop="newPassword">
                    <el-input name="newPassword" v-model="passwordForm.newPassword" />
                  </el-form-item>
                  <el-form-item label="确认密码" prop="confirmNewPassword">
                    <el-input name="confirmNewPassword" v-model="passwordForm.confirmNewPassword" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitPassword">修改</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 权限转交弹窗 -->
    <div>
      <el-dialog title="权限转交" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <el-select v-model="value" filterable placeholder="请选择" @change="userId">
          <el-option
            v-for="item in options"
            :key="item.uid"
            :label="item.vserName"
            :value="item.uid"
          ></el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="basic">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { MessageBox, Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { modifyPwd } from '@/api/permission/user'
import PanThumb from '@/components/PanThumb'
import Activity from './components/Activity'
import { userList, adminTransfer } from '@/api/permission/user'
export default {
  name: 'Profile',
  components: { PanThumb, Activity },
  data() {
    const validatePassord = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于6'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      listQuery: { deptid: localStorage.getItem('deptid') },
      value: '',
      options: [],
      activeTab: '修改密码',
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, trigger: 'blur', validator: validatePassord }
        ],
        newPassword: [
          { required: true, trigger: 'blur', validator: validatePassord }
        ],
        confirmNewPassword: [
          { required: true, trigger: 'blur', validator: validatePassord }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userinfo', 'roles'])
  },
  created() {
    this.getList()
  },
  methods: {
    submitPassword() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          this.loading = true
          modifyPwd(this.passwordForm).then(response => {
            this.loading = false
            MessageBox.confirm('密码修改成功, 为确保安全,请重新登录', '提示', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 根据公司id查询下面人员
    async getList() {
      try {
        const res = await userList(this.listQuery)
        console.log(res)
        this.options = res.result.rows
      } catch (e) {
        this.listLoading = false
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    userId(val) {
      console.log(val)
    },
    async transfer(uid, toUserId, openId) {
      try {
        const res = await adminTransfer(uid, toUserId, openId)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    // 权限转交
    basic() {
      this.transfer(localStorage.getItem('uid'), this.value, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;
  .progress-item {
    padding-top: 15px;
  }
  span {
    padding-left: 10px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
      :nth-child(3) {
        padding-left: 200px;
        color: blue;
      }
    }
  }
}
</style>
