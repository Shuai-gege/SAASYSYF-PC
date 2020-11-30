<template>
  <div class="app-container">
    <!-- 搜索框所在区域 -->
    <div style="margin-top:20px;margin-bottom: 20px">
      <el-row :gutter="24">
        <el-col :span="3">
          <el-input v-model="listQuery.alertName" placeholder="告警名称"/>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.state" placeholder="禁用/启用">
            <el-option label="禁用" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.statisticSwitch" placeholder="统计开关">
            <el-option label="禁用" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.popSwitch" placeholder="弹窗开关">
            <el-option label="禁用" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.pushSwitch" placeholder="推送开关">
            <el-option label="禁用" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.vanishTime"  type="number" placeholder="未侦测到目标时间(秒)"/>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.heartRateLow" type="number" placeholder="心率告警--低值"/>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.heartRateHigh" type="number" placeholder="心率告警--高值"/>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="14">
        <el-col :span="3">
          <el-input v-model="listQuery.powerLow" type="number" placeholder="低电量告警阈值"/>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.pushTel" placeholder="推送手机号"/>
        </el-col>
        <el-col :span="8">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >查找
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            @click="handleAdd"
          >
            <i class="el-icon-plus"/>新增
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
            <el-table-column width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="alertName" label="告警名称" width="200"/>
            <el-table-column prop="state" label="禁用/启用" width="200">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.state"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleStateChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="statisticSwitch" label="统计开关" width="200">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.statisticSwitch"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleStatisticSwitchChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="popSwitch" label="弹窗开关" width="200">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.popSwitch"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handlePopSwitchChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="pushSwitch" label="推送开关" width="200">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.pushSwitch"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handlePushSwitchChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="vanishTime" label="未侦测到目标时间(秒)" width="200"/>
            <el-table-column prop="heartRateLow" label="心率告警(低值)" width="200"/>
            <el-table-column prop="heartRateHigh" label="心率告警(高值)" width="200"/>
            <el-table-column prop="powerLow" label="低电量告警阈值" width="200"/>
            <el-table-column prop="pushTel" label="推送手机号" width="200"/>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="handleEdit(scope)"
                >编辑
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="handleDelete(scope)"
                >删除
                </el-button>
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
            <el-form-item label="告警名称" label-width="150px" prop="alertName">
              <el-input v-model="entityVO.alertName" placeholder="告警名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="未侦测到目标时间(秒)" label-width="150px" prop="vanishTime">
              <el-input v-model="entityVO.vanishTime"  type="number" placeholder="未侦测到目标时间(秒)"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="心率告警(低值)" label-width="150px" prop="heartRateLow">
              <el-input v-model="entityVO.heartRateLow"  type="number" placeholder="心率告警--低值"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="心率告警(高值)"  label-width="150px" prop="heartRateHigh">
              <el-input v-model="entityVO.heartRateHigh"  type="number" placeholder="心率告警--高值"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="低电量告警阈值" label-width="150px" prop="powerLow">
              <el-input v-model="entityVO.powerLow"  type="number" placeholder="低电量告警阈值"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="推送手机号" label-width="150px" prop="pushTel">
              <el-input v-model="entityVO.pushTel" placeholder="推送手机号"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmTalertconfigEdit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹出框 -->
    <el-dialog :visible.sync="dialogVisibleAdd" title="新增">
      <el-form ref="form" :model="entityVO" label-width="80px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="告警名称" label-width="150px" prop="alertName">
              <el-input v-model="entityVO.alertName" placeholder="告警名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="未侦测到目标时间(秒)" label-width="150px" prop="vanishTime">
              <el-input v-model="entityVO.vanishTime" type="number" placeholder="未侦测到目标时间(秒)"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="心率告警(低值)" label-width="150px" prop="heartRateLow">
              <el-input v-model="entityVO.heartRateLow" type="number" placeholder="心率告警--低值"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="心率告警(高值)" label-width="150px" prop="heartRateHigh">
              <el-input v-model="entityVO.heartRateHigh" type="number" placeholder="心率告警--高值"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="低电量告警阈值" label-width="150px" prop="powerLow">
              <el-input v-model="entityVO.powerLow" type="number" placeholder="低电量告警阈值"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="推送手机号" label-width="150px" prop="pushTel">
              <el-input v-model="entityVO.pushTel" placeholder="推送手机号"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleAdd=false">取消</el-button>
        <el-button type="primary" @click="confirmTalertconfigAdd">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import {getToken} from '@/utils/auth'
    import {
        talertconfiglist, talertconfigedit, talertconfigdelete, talertconfigadd
    } from '@/api/angel/talertconfig/talertconfig'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import {formatTimeToStr} from '@/utils/dateUtil'
    import {deepClone} from '@/utils'

    const token = getToken()
    const entityVO = {
        id: '',
        alertName: '',
        state: '',
        statisticSwitch: '',
        popSwitch: '',
        pushSwitch: '',
        vanishTime: '',
        heartRateLow: '',
        heartRateHigh: '',
        powerLow: '',
        pushTel: '',
    }

    export default {
        name: `talertconfig`,
        components: {Pagination},
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
                    alertName: '',
                    state: '',
                    statisticSwitch: '',
                    popSwitch: '',
                    pushSwitch: '',
                    vanishTime: '',
                    heartRateLow: '',
                    heartRateHigh: '',
                    powerLow: '',
                    pushTel: '',
                },
                headersObj: {'LinkAdmin-Token': token},
                activeName: 'first',
                dialogVisibleEdit: false,
                dialogVisibleAdd: false,
                dialogType: 'new',
                entityVO: Object.assign({}, entityVO),
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
            async getList() {
                this.listLoading = true
                // If the Promise is rejected, the rejected value is thrown.
                try {
                    const res = await talertconfiglist(this.listQuery)
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
            },
            // 点击新增按钮触发
            handleAdd(scope) {
                this.dialogVisibleAdd = true
            },
            // 编辑功能结束，点击确定按钮触发
            async confirmTalertconfigEdit() {
                const res = await talertconfigedit(this.entityVO);
                const result = res.code;
                if (result == 20000) {
                    this.$message({
                        showClose: true,
                        message: '编辑成功',
                        type: 'success'
                    })
                    this.dialogVisibleEdit = false;
                    this.getList();
                }
            },
            // 新增功能结束，点击确定按钮触发
            async confirmTalertconfigAdd() {
                const res = await talertconfigadd(this.entityVO);
                const result = res.code;
                if (result == 20000) {
                    this.$message({
                        showClose: true,
                        message: '新增成功',
                        type: 'success'
                    })
                    this.dialogVisibleAdd = false;
                    this.getList();
                }
            },
            // 点击删除按钮触发 删除生成的表的记录
            async handleDelete(scope) {
                const h = this.$createElement;
                this.entityVO = deepClone(scope.row)
                this.$msgbox({
                    title: '删除消息',
                    message: h('p', null, [
                        h('span', null, '确定要删除 '),
                        h('i', {style: 'color: teal'}, '这条记录吗?')
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: async (action, instance, done) => {
                        if (action === 'confirm') {
                            const res = await talertconfigdelete(this.entityVO);
                            if (res.code == 20000) {
                                done();
                            }
                        } else {
                            done();
                        }
                    }
                }).then(action => {
                    this.$message({
                        showClose: true,
                        type: 'success',
                        message: '删除成功'
                    });
                    this.getList();
                });
            },
            // 用户状态修改
            handleStateChange(row) {
                debugger;
                const text = row.state === 1 ? '启用' : '禁用'
                this.$confirm(
                    '确认要 [' + text + '] [' + row.alertName + '] 用户吗?',
                    '警告',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(async () => {
                    await talertconfigedit({uid: row.uid, state: row.state})
                    this.$message({
                        message: text + '[' + row.alertName + ']成功',
                        type: 'success'
                    })
                }).catch(err => {
                    console.error(err)
                    row.state = row.state === 0 ? 1 : 0
                })
            },
            // 统计开关状态修改
            handleStatisticSwitchChange(row) {
                debugger;
                const text = row.statisticSwitch === 1 ? '启用' : '禁用'
                this.$confirm(
                    '确认要 [' + text + '] [' + row.alertName + '] 的统计功能吗?',
                    '警告',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(async () => {
                    await talertconfigedit({uid: row.uid, statisticSwitch: row.statisticSwitch})
                    this.$message({
                        message: text + '统计功能成功',
                        type: 'success'
                    })
                }).catch(err => {
                    console.error(err)
                    row.statisticSwitch = row.statisticSwitch === 0 ? 1 : 0
                })
            },
            // 弹窗开关状态修改
            handlePopSwitchChange(row) {
                const text = row.popSwitch === 1 ? '启用' : '禁用'
                this.$confirm(
                    '确认要 [' + text + '] [' + row.alertName + '] 的弹窗功能吗?',
                    '警告',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(async () => {
                    await talertconfigedit({uid: row.uid, popSwitch: row.popSwitch})
                    this.$message({
                        message: text + '弹窗功能成功',
                        type: 'success'
                    })
                }).catch(err => {
                    console.error(err)
                    row.popSwitch = row.popSwitch === 0 ? 1 : 0
                })
            },
            // 推送开关状态修改
            handlePushSwitchChange(row) {
                const text = row.pushSwitch === 1 ? '启用' : '禁用'
                this.$confirm(
                    '确认要 [' + text + '] [' + row.alertName + '] 的推送功能吗?',
                    '警告',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(async () => {
                    await talertconfigedit({uid: row.uid, pushSwitch: row.pushSwitch})
                    this.$message({
                        message: text + '推送功能成功',
                        type: 'success'
                    })
                }).catch(err => {
                    console.error(err)
                    row.pushSwitch = row.pushSwitch === 0 ? 1 : 0
                })
            },
        }
    }</script>
