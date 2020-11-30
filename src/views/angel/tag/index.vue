<template>
  <div class="app-container">
    <!-- 搜索框所在区域 -->
    <div style="margin-top:20px;margin-bottom: 20px">
      <el-row :gutter="24">
        <el-col :span="3">
          <el-input v-model="listQuery.tagNo" placeholder="标签编号"/>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.tagConfId" placeholder="标签型号">
            <el-option
              v-for="item in listTagConf"
              :key="item.tagConfId"
              :label="item.tagModel"
              :value="item.tagConfId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.tagModel" placeholder="型号"/>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.tagBrand" placeholder="品牌"/>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.tagBindStatus" placeholder="绑定状态">
            <el-option label="未绑定"  :value="0" ></el-option>
            <el-option label="帮定中"  :value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.tagBindPersonId" placeholder="绑定人员编号"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.tagTypeName" placeholder="类型名称"/>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.tagMac" placeholder="mac"/>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="12">
        <el-col :span="3">
          <el-select v-model="listQuery.tagPositioning" placeholder="侦测状态">
            <el-option label="未被侦测"  :value="0" ></el-option>
            <el-option label="侦测中"  :value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.tagBindPersonName" placeholder="绑定人员名称"/>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.tagBatteryStatus" placeholder="电量状态状态">
            <el-option label="电量高"  :value="0" ></el-option>
            <el-option label="电量中"  :value="1"></el-option>
            <el-option label="低电量"  :value="2" ></el-option>
            <el-option label="不支持电量显示"  :value="3"></el-option>
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
           <!-- <el-table-column prop="tagId" label="" width="200"/>-->
            <el-table-column prop="TenantId" label="企业ID" width="100"/>
            <el-table-column prop="tagNo" label="标签编号" width="150"/>
           <!-- <el-table-column prop="tagConfId" label="标签型号id" width="100"/>-->
            <el-table-column prop="tagModel" label="型号" width="200"/>
            <el-table-column prop="tagBrand" label="品牌" width="200"/>
            <el-table-column prop="tagTypeName" label="类型名称" width="200"/>
            <el-table-column prop="tagMac" label="mac" width="200"/>
            <el-table-column prop="tagBindStatus" label="绑定状态" :formatter="bindStatus" width="100"/>
            <el-table-column prop="tagBindPersonId" label="绑定人员编号" width="150"/>
            <el-table-column prop="tagBindPersonName" label="绑定人员名称" width="150"/>
            <el-table-column prop="tagBatteryStatus" label="电量状态状态" :formatter="powerStatus" width="150"/>
            <el-table-column prop="tagPositioning" label="侦测状态" :formatter="testStatus" width="200"/>
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
<!--        <el-row>
          <el-col :span="12">
            <el-form-item label="" prop="tagId">
              <el-input-number v-model="entityVO.tagId" placeholder=""></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业ID"  label-width="100px"  prop="TenantId">
              <el-input v-model="entityVO.TenantId" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签编号"  label-width="100px"  prop="tagNo">
              <el-input v-model="entityVO.tagNo" placeholder="标签编号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签型号"  label-width="100px"  prop="tagConfId">
              <el-select v-model="entityVO.tagConfId" placeholder="标签型号">
                <el-option
                  v-for="item in listTagConf"
                  :key="item.tagConfId"
                  :label="item.tagModel"
                  :value="item.tagConfId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="型号"  label-width="100px"  prop="tagModel">
              <el-input v-model="entityVO.tagModel" placeholder="型号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="品牌"  label-width="100px"  prop="tagBrand">
              <el-input v-model="entityVO.tagBrand" placeholder="品牌"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型名称"  label-width="100px"  prop="tagTypeName">
              <el-input v-model="entityVO.tagTypeName" placeholder="类型名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="mac"  label-width="100px"  prop="tagMac">
              <el-input v-model="entityVO.tagMac" placeholder="mac"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="绑定状态"  label-width="100px"  prop="tagBindStatus">
              <el-select v-model="entityVO.tagBindStatus" placeholder="绑定状态">
                <el-option label="未绑定"  :value="0" ></el-option>
                <el-option label="绑定中"  :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="绑定人员编号"  label-width="100px"  prop="tagBindPersonId">
              <el-input v-model="entityVO.tagBindPersonId" placeholder="绑定人员编号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="绑定人员名称"  label-width="100px"  prop="tagBindPersonName">
              <el-input v-model="entityVO.tagBindPersonName" placeholder="绑定人员名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电量状态状态"  label-width="100px"  prop="tagBatteryStatus">
              <el-select v-model="entityVO.tagBatteryStatus" placeholder="电量状态状态">
                <el-option label="电量高"  :value="0" ></el-option>
                <el-option label="电量中"  :value="1"></el-option>
                <el-option label="低电量"  :value="2" ></el-option>
                <el-option label="不支持电量显示"  :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="侦测状态"  label-width="100px"  prop="tagPositioning">
              <el-select v-model="entityVO.tagPositioning" placeholder="侦测状态">
                <el-option label="未被侦测"  :value="0" ></el-option>
                <el-option label="侦测中"  :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmTagEdit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹出框 -->
    <el-dialog :visible.sync="dialogVisibleAdd" title="新增">
      <el-form ref="form" :model="entityVO" label-width="80px" label-position="right">
<!--        <el-row>
          <el-col :span="12">
            <el-form-item label="" prop="tagId">
              <el-input-number v-model="entityVO.tagId" placeholder=""></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业ID"  label-width="100px"  prop="TenantId">
              <el-input v-model="entityVO.TenantId" placeholder="企业ID"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签编号"  label-width="100px"  prop="tagNo">
              <el-input v-model="entityVO.tagNo" placeholder="标签编号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签型号"  label-width="100px"  prop="tagConfId">
              <el-select v-model="entityVO.tagConfId" placeholder="标签型号">
                <el-option
                  v-for="item in listTagConf"
                  :key="item.tagConfId"
                  :label="item.tagModel"
                  :value="item.tagConfId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="型号"  label-width="100px"  prop="tagModel">
              <el-input v-model="entityVO.tagModel" placeholder="型号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="品牌"  label-width="100px"  prop="tagBrand">
              <el-input v-model="entityVO.tagBrand" placeholder="品牌"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型名称"  label-width="100px"  prop="tagTypeName">
              <el-input v-model="entityVO.tagTypeName" placeholder="类型名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="mac"  label-width="100px"  prop="tagMac">
              <el-input v-model="entityVO.tagMac" placeholder="mac"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="绑定状态"  label-width="100px"  prop="tagBindStatus">
              <el-select v-model="entityVO.tagBindStatus" placeholder="绑定状态">
                <el-option label="未绑定"  :value="0" ></el-option>
                <el-option label="绑定中"  :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="绑定人员编号" label-width="100px"  prop="tagBindPersonId">
              <el-input v-model="entityVO.tagBindPersonId" placeholder="绑定人员编号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="绑定人员名称"  label-width="100px"  prop="tagBindPersonName">
              <el-input v-model="entityVO.tagBindPersonName" placeholder="绑定人员名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电量状态状态"  label-width="100px"  prop="tagBatteryStatus">
              <el-select v-model="entityVO.tagBatteryStatus" placeholder="电量状态状态">
                <el-option label="电量高"  :value="0" ></el-option>
                <el-option label="电量中"  :value="1"></el-option>
                <el-option label="低电量"  :value="2" ></el-option>
                <el-option label="不支持电量显示"  :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="侦测状态" label-width="100px" prop="tagPositioning">
              <el-select v-model="entityVO.tagPositioning" placeholder="侦测状态">
                <el-option label="未被侦测"  :value="0" ></el-option>
                <el-option label="侦测中"  :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleAdd=false">取消</el-button>
        <el-button type="primary" @click="confirmTagAdd">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import {getToken} from '@/utils/auth'
    import {
        taglist, tagedit, tagdelete, tagadd
    } from '@/api/angel/tag/tag'
    import {
        tagconflist
    } from '@/api/angel/tagconf/tagconf'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import {formatTimeToStr} from '@/utils/dateUtil'
    import {deepClone} from '@/utils'

    const token = getToken()
    const entityVO = {
        tagId: null,
        TenantId: '',
        tagNo: '',
        tagConfId: null,
        tagModel: '',
        tagBrand: '',
        tagTypeName: '',
        tagMac: '',
        tagBindStatus: '',
        tagBindPersonId: null,
        tagBindPersonName: '',
        tagBatteryStatus: '',
        tagPositioning: '',
    }

    export default {
        name: `tag`,
        components: {Pagination},
        data() {
            return {
                list: null,
                listTagConf: null,
                total: 0,
                tableKey: 0,
                listLoading: false,
                listQuery: {
                    page: 1,
                    limit: 50,
                    tagId: null,
                    TenantId: '',
                    tagNo: '',
                    tagConfId: null,
                    tagModel: '',
                    tagBrand: '',
                    tagTypeName: '',
                    tagMac: '',
                    tagBindStatus: '',
                    tagBindPersonId: null,
                    tagBindPersonName: '',
                    tagBatteryStatus: '',
                    tagPositioning: '',
                },
                listTagConfQuery: {
                    tagConfId: null,
                    tagModel: '',
                    tagBrand: '',
                    tagTypeId: null,
                    tagRemark: '',
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
            this.getTagConfList()
        },
        methods: {
            async getTagConfList() {
                this.listLoading = true
                // If the Promise is rejected, the rejected value is thrown.
                try {
                    const res = await tagconflist(this.listTagConfQuery)
                    this.listLoading = false
                    this.listTagConf = res.result.rows
                   // this.total = res.result.records
                } catch (e) {
                    this.listLoading = false
                }
            },
            async getList() {
                this.listLoading = true
                // If the Promise is rejected, the rejected value is thrown.
                try {
                    const res = await taglist(this.listQuery)
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
            async confirmTagEdit() {
                const res = await tagedit(this.entityVO);
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
            async confirmTagAdd() {
                const res = await tagadd(this.entityVO);
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
                            const res = await tagdelete(this.entityVO);
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
            bindStatus(row,column){
                const tagBindStatus = row.tagBindStatus;
                if(tagBindStatus == '0'){
                    return '未绑定';
                }
                if(tagBindStatus == '1'){
                    return '帮定中';
                }
            },
            // 电量状态   0--电量高，1--电量中，2--低电量，3--不支持电量显示
            powerStatus(row,column){
                const tagBatteryStatus = row.tagBatteryStatus;
                if(tagBatteryStatus == '0'){
                    return '电量高';
                }
                if(tagBatteryStatus == '1'){
                    return '电量中';
                }
                if(tagBatteryStatus == '2'){
                    return '低电量';
                }
                if(tagBatteryStatus == '3'){
                    return '不支持电量显示';
                }
            },
            // 侦测状态 0-未被侦测，1-侦测中
            testStatus(row,column){
                const tagPositioning = row.tagPositioning;
                if(tagPositioning == '0'){
                    return '未被侦测';
                }
                if(tagPositioning == '1'){
                    return '侦测中';
                }
            }
        }
    }</script>
