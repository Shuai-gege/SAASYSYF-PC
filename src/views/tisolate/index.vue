<template>
  <div class="app-container">
    <!-- 搜索框所在区域 -->
    <div style="margin-top:20px;margin-bottom: 20px">
      <el-row :gutter="12">
        <el-col :span="3">
              <el-input v-model="listQuery.id" placeholder="协议版本号" />
        </el-col>
        <el-col :span="3">
              <el-input v-model="listQuery.macPd" placeholder="" />
        </el-col>
        <el-col :span="3">
              <el-input v-model="listQuery.macType" placeholder="消息类型" />
        </el-col>
        <el-col :span="3">
              <el-input v-model="listQuery.macLength" placeholder="指消息地段以下部分的长度" />
        </el-col>
      </el-row>
 <el-divider></el-divider>
      <el-row :gutter="12">
        <el-col :span="3">
              <el-input v-model="listQuery.macTemperature" placeholder="温度" />
        </el-col>
        <el-col :span="3">
              <el-input v-model="listQuery.macHumidity" placeholder="湿度" />
        </el-col>
        <el-col :span="3">
              <el-input v-model="listQuery.macApMacAddress" placeholder="网关蓝牙地址" />
        </el-col>
        <el-col :span="3">
          <el-input-number v-model="listQuery.macMuNumber"   placeholder="终端个数" ></el-input-number>
        </el-col>
      </el-row>
 <el-divider></el-divider>
      <el-row :gutter="12">
        <el-col :span="3">
              <el-input v-model="listQuery.macMuMac" placeholder="终端设备地址" />
        </el-col>
        <el-col :span="3">
              <el-input v-model="listQuery.macMuRssi" placeholder="终端强度" />
        </el-col>
        <el-col :span="3">
              <el-input v-model="listQuery.macHeart" placeholder="心率" />
        </el-col>
        <el-col :span="3">
              <el-input v-model="listQuery.macSos" placeholder="SOS" />
        </el-col>
      </el-row>
 <el-divider></el-divider>
      <el-row :gutter="12">
        <el-col :span="3">
              <el-input v-model="listQuery.macCut" placeholder="剪断" />
        </el-col>
        <el-col :span="3">
              <el-input v-model="listQuery.macEnergy" placeholder="电量" />
        </el-col>
        <el-col :span="3">
              <el-date-picker v-model="listQuery.createTime" type='datetime' placeholder="创建时间" ></el-date-picker>
        </el-col>
      </el-row>
 <el-divider></el-divider>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >查找</el-button>
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
<el-table-column prop="id" label="协议版本号" width="200"/>
<el-table-column prop="macPd" label="" width="200"/>
<el-table-column prop="macType" label="消息类型" width="200"/>
<el-table-column prop="macLength" label="指消息地段以下部分的长度" width="200"/>
<el-table-column prop="macTemperature" label="温度" width="200"/>
<el-table-column prop="macHumidity" label="湿度" width="200"/>
<el-table-column prop="macApMacAddress" label="网关蓝牙地址" width="200"/>
<el-table-column prop="macMuNumber" label="终端个数" width="200"/>
<el-table-column prop="macMuMac" label="终端设备地址" width="200"/>
<el-table-column prop="macMuRssi" label="终端强度" width="200"/>
<el-table-column prop="macHeart" label="心率" width="200"/>
<el-table-column prop="macSos" label="SOS" width="200"/>
<el-table-column prop="macCut" label="剪断" width="200"/>
<el-table-column prop="macEnergy" label="电量" width="200"/>
<el-table-column prop="createTime" label="创建时间" width="200"/>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="handleEdit(scope)"
                >编辑</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="handleDelete(scope)"
                >删除</el-button>              </template>
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
      <el-form ref="form" :model="entityVO"  label-width="80px" label-position="right"> 
        <el-row>
          <el-col :span="12">
            <el-form-item label="协议版本号" prop="id">
              <el-input v-model="entityVO.id" placeholder="协议版本号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="" prop="macPd">
              <el-input v-model="entityVO.macPd" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="消息类型" prop="macType">
              <el-input v-model="entityVO.macType" placeholder="消息类型" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="指消息地段以下部分的长度" prop="macLength">
              <el-input v-model="entityVO.macLength" placeholder="指消息地段以下部分的长度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="温度" prop="macTemperature">
              <el-input v-model="entityVO.macTemperature" placeholder="温度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="湿度" prop="macHumidity">
              <el-input v-model="entityVO.macHumidity" placeholder="湿度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="网关蓝牙地址" prop="macApMacAddress">
              <el-input v-model="entityVO.macApMacAddress" placeholder="网关蓝牙地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="终端个数" prop="macMuNumber">
              <el-input-number v-model="entityVO.macMuNumber" placeholder="终端个数" ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="终端设备地址" prop="macMuMac">
              <el-input v-model="entityVO.macMuMac" placeholder="终端设备地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="终端强度" prop="macMuRssi">
              <el-input v-model="entityVO.macMuRssi" placeholder="终端强度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="心率" prop="macHeart">
              <el-input v-model="entityVO.macHeart" placeholder="心率" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="SOS" prop="macSos">
              <el-input v-model="entityVO.macSos" placeholder="SOS" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="剪断" prop="macCut">
              <el-input v-model="entityVO.macCut" placeholder="剪断" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电量" prop="macEnergy">
              <el-input v-model="entityVO.macEnergy" placeholder="电量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker v-model="entityVO.createTime" type='datetime' placeholder="创建时间" ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmTisolateEdit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹出框 -->
    <el-dialog :visible.sync="dialogVisibleAdd" title="新增">
      <el-form ref="form" :model="entityVO"  label-width="80px" label-position="right"> 
        <el-row>
          <el-col :span="12">
            <el-form-item label="协议版本号" prop="id">
              <el-input v-model="entityVO.id" placeholder="协议版本号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="" prop="macPd">
              <el-input v-model="entityVO.macPd" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="消息类型" prop="macType">
              <el-input v-model="entityVO.macType" placeholder="消息类型" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="指消息地段以下部分的长度" prop="macLength">
              <el-input v-model="entityVO.macLength" placeholder="指消息地段以下部分的长度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="温度" prop="macTemperature">
              <el-input v-model="entityVO.macTemperature" placeholder="温度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="湿度" prop="macHumidity">
              <el-input v-model="entityVO.macHumidity" placeholder="湿度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="网关蓝牙地址" prop="macApMacAddress">
              <el-input v-model="entityVO.macApMacAddress" placeholder="网关蓝牙地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="终端个数" prop="macMuNumber">
              <el-input-number v-model="entityVO.macMuNumber" placeholder="终端个数" ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="终端设备地址" prop="macMuMac">
              <el-input v-model="entityVO.macMuMac" placeholder="终端设备地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="终端强度" prop="macMuRssi">
              <el-input v-model="entityVO.macMuRssi" placeholder="终端强度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="心率" prop="macHeart">
              <el-input v-model="entityVO.macHeart" placeholder="心率" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="SOS" prop="macSos">
              <el-input v-model="entityVO.macSos" placeholder="SOS" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="剪断" prop="macCut">
              <el-input v-model="entityVO.macCut" placeholder="剪断" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电量" prop="macEnergy">
              <el-input v-model="entityVO.macEnergy" placeholder="电量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker v-model="entityVO.createTime" type='datetime' placeholder="创建时间" ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleAdd=false">取消</el-button>
        <el-button type="primary" @click="confirmTisolateAdd">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getToken } from '@/utils/auth'
  import {
    tisolatelist,tisolateedit,tisolatedelete,tisolateadd
  } from '@/api/tisolate/tisolate'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import {formatTimeToStr} from '@/utils/dateUtil'
  import { deepClone } from '@/utils'
  const token = getToken()
  const entityVO = {
    id: '',
    macPd: '',
    macType: '',
    macLength: '',
    macTemperature: '',
    macHumidity: '',
    macApMacAddress: '',
    macMuNumber: '',
    macMuMac: '',
    macMuRssi: '',
    macHeart: '',
    macSos: '',
    macCut: '',
    macEnergy: '',
    createTime: '',
}

  export default {
    name: `tisolate`,
    components: { Pagination},
    data(){
      return{
        list: null,
        total: 0,
        tableKey: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 50,
    id: '',
    macPd: '',
    macType: '',
    macLength: '',
    macTemperature: '',
    macHumidity: '',
    macApMacAddress: '',
    macMuNumber: '',
    macMuMac: '',
    macMuRssi: '',
    macHeart: '',
    macSos: '',
    macCut: '',
    macEnergy: '',
    createTime: '',
        },
        headersObj: { 'LinkAdmin-Token': token },
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
    methods:{
      async getList() {
        this.listLoading = true
        // If the Promise is rejected, the rejected value is thrown.
        try {
          const res = await tisolatelist(this.listQuery)
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
      async confirmTisolateEdit() {
        const res = await tisolateedit(this.entityVO);
        const result = res.result;
        if(result){
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
      async confirmTisolateAdd() {
        const res = await tisolateadd(this.entityVO);
        const result = res.result;
        if(result){
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
                const tt = scope.row;
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
                            const res = await tisolatedelete(this.entityVO);
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
    }
  }</script>