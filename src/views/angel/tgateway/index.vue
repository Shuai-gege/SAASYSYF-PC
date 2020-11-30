<template>
  <div class="app-container">
    <!-- 搜索框所在区域 -->
    <div style="margin-top:20px;margin-bottom: 20px">
      <el-row :gutter="23">
        <el-col :span="3">
          <el-input v-model="listQuery.gatewayNo" placeholder="网关编号"/>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.gatewayId" placeholder="网关ID"/>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.modelId" placeholder="网关型号">
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.modelName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.residenceId" placeholder="户籍">
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.onlineStatus" placeholder="在线状态">
            <el-option label="离线"  :value="0" ></el-option>
            <el-option label="在线"  :value="1"></el-option>
          </el-select>
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
            <!--<el-table-column prop="id" label="数据id" width="200"/>-->
            <el-table-column prop="gatewayNo" label="网关编号" width="200"/>
            <el-table-column prop="gatewayId" label="网关ID" width="200"/>
            <el-table-column prop="modelId" label="绑定状态" :formatter="modelIdFormatter" width="200"/>
            <el-table-column prop="residenceId" label="绑定户籍" :formatter="bindResidence" width="200"/>
            <el-table-column prop="onlineStatus" label="在线状态" :formatter="onlineStatus" width="200"/>
            <el-table-column label="操作">
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
<!--        <el-row>
          <el-col :span="12">
            <el-form-item label="数据id" prop="id">
              <el-input v-model="entityVO.id" placeholder="数据id"/>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="网关编号" prop="gatewayNo">
              <el-input v-model="entityVO.gatewayNo" placeholder="网关编号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="网关ID" prop="gatewayId">
              <el-input v-model="entityVO.gatewayId" placeholder="网关ID"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="网关型号" prop="modelId">
              <el-select v-model="entityVO.modelId" placeholder="网关型号">
                <el-option
                  v-for="item in modelList"
                  :key="item.id"
                  :label="item.modelName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row>
          <el-col :span="12">
            <el-form-item label="户籍" prop="residenceId">
              <el-input v-model="entityVO.residenceId" placeholder="户籍id"/>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="在线状态" prop="onlineStatus">
              <el-input-number v-model="entityVO.onlineStatus" placeholder="在线状态 0:离线 1:在线"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmTgatewayEdit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹出框 -->
    <el-dialog :visible.sync="dialogVisibleAdd" title="新增">
      <el-form ref="form" :model="entityVO" label-width="80px" label-position="right">
<!--        <el-row>
          <el-col :span="12">
            <el-form-item label="数据id" prop="id">
              <el-input v-model="entityVO.id" placeholder="数据id"/>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="网关编号" prop="gatewayNo">
              <el-input v-model="entityVO.gatewayNo" placeholder="网关编号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="网关ID" prop="gatewayId">
              <el-input v-model="entityVO.gatewayId" placeholder="网关ID"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="网关型号" prop="modelId">
              <el-select v-model="entityVO.modelId" placeholder="网关型号">
                <el-option
                  v-for="item in modelList"
                  :key="item.id"
                  :label="item.modelName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      <!--  <el-row>
          <el-col :span="12">
            <el-form-item label="户籍" prop="residenceId">
              <el-input v-model="entityVO.residenceId" placeholder="户籍id"/>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="在线状态" prop="onlineStatus">
              <el-select v-model="entityVO.onlineStatus" placeholder="在线状态 0:离线 1:在线">
                <el-option label="离线"  :value="0" ></el-option>
                <el-option label="在线"  :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleAdd=false">取消</el-button>
        <el-button type="primary" @click="confirmTgatewayAdd">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import {getToken} from '@/utils/auth'
    import {
        tgatewaylist, tgatewayedit, tgatewaydelete, tgatewayadd
    } from '@/api/angel/tgateway/tgateway'
    import {
        tgatewaymodellist
    } from '@/api/angel/tgatewaymodel/tgatewaymodel'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import {formatTimeToStr} from '@/utils/dateUtil'
    import {deepClone} from '@/utils'

    const token = getToken()
    const entityVO = {
        id: '',
        gatewayNo: '',
        gatewayId: '',
        modelId: '',
        residenceId: '',
        onlineStatus: '',
    }

    export default {
        name: `tgateway`,
        components: {Pagination},
        data() {
            return {
                list: null,
                modelList: null,
                total: 0,
                tableKey: 0,
                listLoading: false,
                listQuery: {
                    page: 1,
                    limit: 50,
                    id: '',
                    gatewayNo: '',
                    gatewayId: '',
                    modelId: '',
                    residenceId: '',
                    onlineStatus: '',
                },
                listModelQuery: {
                    id: '',
                    typeName: '',
                    brandName: '',
                    modelName: '',
                    description: '',
                    createTime: '',
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
            this.getList(); // 获取网关设备列表
            this.getGateWayModelList(); // 获取网关型号列表
        },
        methods: {
            async getList() {
                this.listLoading = true
                // If the Promise is rejected, the rejected value is thrown.
                try {
                    const res = await tgatewaylist(this.listQuery)
                    this.listLoading = false
                    this.list = res.result.rows
                    this.total = res.result.records
                } catch (e) {
                    this.listLoading = false
                }
            },
            // 网关型号列表
            async getGateWayModelList(){
                this.listLoading = true
                // If the Promise is rejected, the rejected value is thrown.
                try {
                    const res = await tgatewaymodellist(this.listModelQuery);
                    this.listLoading = false
                    this.modelList = res.result.rows
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
            async confirmTgatewayEdit() {
                const res = await tgatewayedit(this.entityVO);
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
            async confirmTgatewayAdd() {
                const res = await tgatewayadd(this.entityVO);
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
                            const res = await tgatewaydelete(this.entityVO);
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
            // 绑定状态转换
            modelIdFormatter(row,column){
                const modelId = row.modelId;
                if(modelId == '' || modelId == null || modelId == undefined){
                    return '未绑定';
                }else{
                    return '已绑定';
                }
            },
            // 户籍绑定状态转换
            bindResidence(row,column){
                const bb = row.residenceId;
                if(bb == ''){
                    return '未绑定';
                }else{
                    return '查看';
                }

            },

            // 离线状态
            onlineStatus(row,column){
                const online = row.onlineStatus;
                if(online == '0'){
                    return '离线';
                }
                if(online == '1'){
                    return '在线';
                }
            }
        }
    }</script>
