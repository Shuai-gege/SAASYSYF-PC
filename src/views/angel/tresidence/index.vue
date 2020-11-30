<template>
  <div class="app-container">
    <!-- 搜索框所在区域 -->
    <div style="margin-top:20px;margin-bottom: 20px">
      <el-row :gutter="24">
        <el-col :span="3">
          <el-select v-model="listQuery.provinceId" @change="getAreaList" placeholder="省">
            <el-option
              v-for="item in listArea"
              :key="item.id"
              :label="item.areaName"
              :value="item.id" >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.cityId" @change="getAreaList" placeholder="市">
            <el-option
              v-for="item in listCity"
              :key="item.id"
              :label="item.areaName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.areaId" placeholder="区/县">
            <el-option
              v-for="item in listVillage"
              :key="item.id"
              :label="item.areaName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.townshipId" placeholder="街道/乡镇"/>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.villageName" placeholder="小区/村庄"/>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.buildingName" placeholder="栋/幢"/>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.unit" placeholder="单元"/>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.houseNo" placeholder="户号"></el-input>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="17">

        <el-col :span="3">
          <el-input v-model="listQuery.description" placeholder="详细说明"/>
        </el-col>
 <!--       <el-col :span="3">
          <el-input v-model="listQuery.gpsX" placeholder="X坐标"/>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.gpsY" placeholder="Y坐标"/>
        </el-col>-->
        <el-col :span="3">
          <el-select v-model="listQuery.gatewayId" placeholder="网关">
            <el-option
              v-for="item in listGateway"
              :key="item.id"
              :label="item.gatewayId"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.status" placeholder="状态">
            <el-option label="启用"  :value="0" ></el-option>
            <el-option label="停用"  :value="1"></el-option>
          </el-select>
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
            <el-table-column prop="provinceName" label="省"  width="100"/>
            <el-table-column prop="cityName" label="市"  width="100"/>
            <el-table-column prop="areaName" label="区/县"  width="100"/>
            <el-table-column prop="townshipId" label="街道/乡镇" width="100"/>
            <el-table-column prop="villageName" label="小区/村庄" width="200"/>
            <el-table-column prop="buildingName" label="栋/幢" width="100"/>
            <el-table-column prop="unit" label="单元" width="100"/>
            <el-table-column prop="houseNo" label="户号" width="50"/>
            <el-table-column prop="description" label="详细说明" width="200"/>
   <!--         <el-table-column prop="gpsX" label="X坐标" width="100"/>
            <el-table-column prop="gpsY" label="Y坐标" width="100"/>-->
            <el-table-column prop="gatewayName" label="网关id" width="150"/>
            <el-table-column prop="status" label="状态" width="50" :formatter="statusChange" />
            <el-table-column label="操作" width="100">
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
            <el-form-item label="省" prop="provinceId">
              <el-select v-model="entityVO.provinceId" @change="getAreaList" placeholder="省">
                <el-option
                  v-for="item in listArea"
                  :key="item.id"
                  :label="item.areaName"
                  :value="item.id" >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="市" prop="cityId">
              <el-select v-model="entityVO.cityId" @change="getAreaList" placeholder="市">
                <el-option
                  v-for="item in listCity"
                  :key="item.id"
                  :label="item.areaName"
                  :value="item.id" >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区/县" prop="areaId">
              <el-select v-model="entityVO.areaId" placeholder="区/县">
                <el-option
                  v-for="item in listVillage"
                  :key="item.id"
                  :label="item.areaName"
                  :value="item.id" >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="街道/乡镇" prop="townshipId">
              <el-input v-model="entityVO.townshipId" placeholder="街道/乡镇"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="小区/村庄" prop="villageName">
              <el-input v-model="entityVO.villageName" placeholder="小区/村庄"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="栋/幢" prop="buildingName">
              <el-input v-model="entityVO.buildingName" placeholder="栋/幢"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单元" prop="unit">
              <el-input v-model="entityVO.unit" placeholder="单元"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="户号" prop="houseNo">
              <el-input v-model="entityVO.houseNo" placeholder="户号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="详细说明" prop="description">
              <el-input v-model="entityVO.description" placeholder="详细说明"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="X坐标" prop="gpsX">
              <el-input v-model="entityVO.gpsX" placeholder="X坐标"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Y坐标" prop="gpsY">
              <el-input v-model="entityVO.gpsY" placeholder="Y坐标"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="网关id" prop="gatewayId">
              <el-select v-model="entityVO.gatewayId" placeholder="网关id">
                <el-option
                  v-for="item in listGateway"
                  :key="item.id"
                  :label="item.gatewayId"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="entityVO.status" placeholder="状态 0:启用 1:停用">
                <el-option label="启用"  :value="0" ></el-option>
                <el-option label="停用"  :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmTresidenceEdit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹出框 -->
    <el-dialog :visible.sync="dialogVisibleAdd" title="新增">
      <el-form ref="form" :model="entityVO" label-width="80px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="省" prop="provinceId">
              <el-select v-model="entityVO.provinceId" @change="getAreaList" placeholder="省">
                <el-option
                  v-for="item in listArea"
                  :key="item.id"
                  :label="item.areaName"
                  :value="item.id" >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="市" prop="cityId">
              <el-select v-model="entityVO.cityId" @change="getAreaList" placeholder="市">
                <el-option
                  v-for="item in listCity"
                  :key="item.id"
                  :label="item.areaName"
                  :value="item.id" >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区/县" prop="areaId">
              <el-select v-model="entityVO.areaId" placeholder="区/县">
                <el-option
                  v-for="item in listVillage"
                  :key="item.id"
                  :label="item.areaName"
                  :value="item.id" >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="街道/乡镇" prop="townshipId">
              <el-input v-model="entityVO.townshipId" placeholder="街道/乡镇"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="小区/村庄" prop="villageName">
              <el-input v-model="entityVO.villageName" placeholder="小区/村庄"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="栋/幢" prop="buildingName">
              <el-input v-model="entityVO.buildingName" placeholder="栋/幢"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单元" prop="unit">
              <el-input v-model="entityVO.unit" placeholder="单元"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="户号" prop="houseNo">
              <el-input v-model="entityVO.houseNo" placeholder="户号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="详细说明" prop="description">
              <el-input v-model="entityVO.description" placeholder="详细说明"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="X坐标" prop="gpsX">
              <el-input v-model="entityVO.gpsX" placeholder="X坐标"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Y坐标" prop="gpsY">
              <el-input v-model="entityVO.gpsY" placeholder="Y坐标"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="网关id" prop="gatewayId">
              <el-select v-model="entityVO.gatewayId" placeholder="网关id">
                <el-option
                  v-for="item in listGateway"
                  :key="item.id"
                  :label="item.gatewayId"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="entityVO.status" placeholder="状态 0:启用 1:停用">
                <el-option label="启用"  :value="0" ></el-option>
                <el-option label="停用"  :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleAdd=false">取消</el-button>
        <el-button type="primary" @click="confirmTresidenceAdd">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import {getToken} from '@/utils/auth'
    import {
        tresidencelist, tresidencelistAll,tresidenceedit, tresidencedelete, tresidenceadd
    } from '@/api/angel/tresidence/tresidence'
    import {
        tgatewaylist
    } from '@/api/angel/tgateway/tgateway'
    import {
        tarealist
    } from '@/api/angel/tarea/tarea'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import {formatTimeToStr} from '@/utils/dateUtil'
    import {deepClone} from '@/utils'

    const token = getToken()
    const entityVO = {
        id: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        townshipId: '',
        villageName: '',
        buildingName: '',
        unit: '',
        houseNo: '',
        description: '',
        gpsX: '',
        gpsY: '',
        gatewayId: '',
        status: '',
    }

    export default {
        name: `tresidence`,
        components: {Pagination},
        data() {
            return {
                list: null,        // 户籍查询结果
                listGateway: null, // 网关查询结果
                listArea: null,    // 省查询结果
                listCity: null,    // 市查询结果
                listVillage: null, // 区查询结果
                total: 0,
                tableKey: 0,
                listLoading: false,
                listQuery: {
                    page: 1,
                    limit: 50,
                    id: '',
                    provinceId: '',
                    cityId: '',
                    areaId: '',
                    townshipId: '',
                    villageName: '',
                    buildingName: '',
                    unit: '',
                    houseNo: '',
                    description: '',
                    gpsX: '',
                    gpsY: '',
                    gatewayId: '',
                    status: '',
                },        // 户籍查询参数
                listGatewayQuery: {
                    id: '',
                    gatewayNo: '',
                    gatewayId: '',
                    modelId: '',
                    residenceId: '',
                    onlineStatus: '',
                }, // 网关查询参数
                listAreaQuery: {
                    id: '',
                    areaName: '',
                    parentId: '',
                },    // 省市区查询参数
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
            this.getList();
            this.getGatewayList();
            this.getAreaList(0);
        },
        methods: {
            async getAreaList(parentId){
                this.listLoading = true
                this.listAreaQuery.parentId = parentId;
                // If the Promise is rejected, the rejected value is thrown.
                try {
                    const res = await tarealist(this.listAreaQuery)
                    this.listLoading = false
                    if(parentId == '0'){
                        this.listArea = res.result.rows
                    }
                    if(parentId.length>1){
                        if(parentId.substring(2,4) == '00'){
                            this.listCity = res.result.rows;
                        }
                        if(parentId.substring(2,4) != '00' && parentId.substring(4,6) == '00'){
                            this.listVillage = res.result.rows;
                        }
                    }


                    // this.total = res.result.records
                } catch (e) {
                    this.listLoading = false
                }
            },
            async getGatewayList() {
                this.listLoading = true
                // If the Promise is rejected, the rejected value is thrown.
                try {
                    const res = await tgatewaylist(this.listGatewayQuery)
                    this.listLoading = false
                    this.listGateway = res.result.rows
                   // this.total = res.result.records
                } catch (e) {
                    this.listLoading = false
                }
            },
            async getList() {
                this.listLoading = true
                // If the Promise is rejected, the rejected value is thrown.
                try {
                    const res = await tresidencelistAll(this.listQuery)
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
            async confirmTresidenceEdit() {
                const res = await tresidenceedit(this.entityVO);
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
            async confirmTresidenceAdd() {
                const res = await tresidenceadd(this.entityVO);
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
                            const res = await tresidencedelete(this.entityVO);
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

            //状态转换
            statusChange(row,column){
                const status = row.status;
                if(status == '0'){
                    return '启用';
                }
                if(status == '1'){
                    return '停用';
                }
            }
        }
    }</script>
