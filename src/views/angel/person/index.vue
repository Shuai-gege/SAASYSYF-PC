<template>
  <div class="app-container">
    <!-- 搜索框所在区域 -->
    <div style="margin-top:20px;margin-bottom: 20px">
      <el-row :gutter="24">
        <el-col :span="3">
          <el-input v-model="listQuery.personNo" placeholder="人员编号" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.personName" placeholder="人员名称" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.tagMac" placeholder="标签mac" />
        </el-col>
        <!-- <el-col :span="3">
          <el-select v-model="listQuery.departmentId" multiple collapse-tags placeholder="部门" >
            <el-option :value="0" style="height: auto">
              <el-tree
                :data="departments"
                :props="defaultProps"
                node-key="id"
                highlight-current
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                class="objectTree"
              />
            </el-option>
          </el-select>
        </el-col>-->
        <el-col :span="3">
          <el-select v-model="listQuery.personSex" placeholder="性别">
            <el-option label="男性" :value="M"></el-option>
            <el-option label="女性" :value="F"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.personPhone" placeholder="手机号" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.personIdentityno" placeholder="身份证号码" />
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.personRole" placeholder="角色">
            <el-option
              v-for="item in listRole"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-select v-model="listQuery.personApp" placeholder="访客/巡更">
            <el-option label="访客" :value="visitor"></el-option>
            <el-option label="巡更" :value="patrol"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.locationBuildingid" placeholder="人员归属的poi建筑物"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.locationFloor" placeholder="人员归属的poi楼层" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.locationPoiid" placeholder="人员归属的poiid" />
        </el-col>
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
            <el-table-column prop="personNo" label="人员编号" width="200" />
            <el-table-column prop="personName" label="人员名称" width="200" />
            <el-table-column prop="TenantId" label="企业ID" width="200" />
            <el-table-column prop="departmentName" label="部门名称" width="200" />
            <el-table-column prop="tagMac" label="标签mac" width="200" />
            <el-table-column prop="personSex" label="性别" :formatter="sexStatus" width="200" />
            <el-table-column prop="personPhone" label="手机号" width="200" />
            <el-table-column prop="personIdentityno" label="身份证号码" width="200" />
            <el-table-column prop="personRole" label="角色" :formatter="roleStatus" width="200" />
            <el-table-column
              prop="personApp"
              label="访客/巡更"
              :formatter="personAppStatus"
              width="200"
            />
            <el-table-column prop="locationBuildingid" label="人员归属的poi建筑物" width="200" />
            <el-table-column prop="locationFloor" label="人员归属的poi楼层" width="200" />
            <el-table-column prop="locationPoiid" label="人员归属的poiid" width="200" />
            <el-table-column label="操作" width="200">
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
    <el-dialog :visible.sync="dialogVisibleEdit" title="编辑" width="30%">
      <el-form ref="form" :model="entityVO" label-width="80px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="人员编号" label-width="100px" prop="personNo">
              <el-input v-model="entityVO.personNo" placeholder="人员编号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="人员名称" label-width="100px" prop="personName">
              <el-input v-model="entityVO.personName" placeholder="人员名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业ID" label-width="100px" prop="TenantId">
              <el-input v-model="entityVO.TenantId" placeholder="企业ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-row>
          <el-col :span="12">
            <el-form-item label="部门" label-width="100px" prop="departmentId">
              <el-cascader
                v-model="departments.id"
                :options="departments.childrens"
                placeholder="部门"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签mac" label-width="100px" prop="tagMac">
              <el-input v-model="entityVO.tagMac" placeholder="标签mac" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" label-width="100px" prop="personSex">
              <el-select v-model="entityVO.personSex" placeholder="性别">
                <el-option label="男性" :value="1"></el-option>
                <el-option label="女性" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" label-width="100px" prop="personPhone">
              <el-input v-model="entityVO.personPhone" placeholder="手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号码" label-width="100px" prop="personIdentityno">
              <el-input v-model="entityVO.personIdentityno" placeholder="身份证号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色" label-width="100px" prop="personRole">
              <el-select v-model="entityVO.personRole" placeholder="角色">
                <el-option
                  v-for="item in listRole"
                  :key="item.id"
                  :label="item.description"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="访客/巡更" label-width="100px" prop="personApp">
              <el-select v-model="entityVO.personApp" placeholder="访客/巡更">
                <el-option label="访客" :value="1"></el-option>
                <el-option label="巡更" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属poi建筑" label-width="100px" prop="locationBuildingid">
              <el-input v-model="entityVO.locationBuildingid" placeholder="人员归属的poi建筑物"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属poi楼层" label-width="100px" prop="locationFloor">
              <el-input v-model="entityVO.locationFloor" placeholder="人员归属的poi楼层" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属poiid" label-width="100px" prop="locationPoiid">
              <el-input v-model="entityVO.locationPoiid" placeholder="人员归属的poiid" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务级别" label-width="100px" prop="personRole">
              <el-select v-model="entityVO.serve" placeholder="服务级别">
                <el-option
                  v-for="item in entityVO.serveArr"
                  :key="item.id"
                  :label="item.level_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="12">
          <el-form-item label="有效期截止">
            <el-date-picker v-model="entityVO.time" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmPersonEdit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹出框 -->
    <el-dialog :visible.sync="dialogVisibleAdd" title="新增" width="30%">
      <el-form ref="form" :model="entityVO" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="人员编号" label-width="100px" prop="personNo">
              <el-input v-model="entityVO.personNo" placeholder="人员编号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="人员名称" label-width="100px" prop="personName">
              <el-input v-model="entityVO.personName" placeholder="人员名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业ID" label-width="100px" prop="TenantId">
              <el-input v-model="entityVO.TenantId" placeholder="企业ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row>
          <el-col :span="12">
            <el-form-item label="部门" label-width="100px" prop="departmentId">
              <el-cascader
                v-model="departments.id"
                :options="departments.childrens"
                placeholder="部门"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签mac" label-width="100px" prop="tagMac">
              <el-input v-model="entityVO.tagMac" placeholder="标签mac" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" label-width="100px" prop="personSex">
              <el-select v-model="entityVO.personSex" placeholder="性别">
                <el-option label="男性" :value="'M'"></el-option>
                <el-option label="女性" :value="'F'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" label-width="100px" prop="personPhone">
              <el-input v-model="entityVO.personPhone" placeholder="手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号码" label-width="100px" prop="personIdentityno">
              <el-input v-model="entityVO.personIdentityno" placeholder="身份证号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色" label-width="100px" prop="personRole">
              <el-select v-model="entityVO.personRole" placeholder="角色">
                <el-option
                  v-for="item in listRole"
                  :key="item.id"
                  :label="item.description"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="访客/巡更" label-width="100px" prop="personApp">
              <el-select v-model="entityVO.personApp" placeholder="访客/巡更">
                <el-option label="访客" :value="'visitor'"></el-option>
                <el-option label="巡更" :value="'patrol'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属poi建筑" label-width="100px" prop="locationBuildingid">
              <el-input v-model="entityVO.locationBuildingid" placeholder="人员归属的poi建筑物"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属poi楼层" label-width="100px" prop="locationFloor">
              <el-input v-model="entityVO.locationFloor" placeholder="人员归属的poi楼层" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属poiid" label-width="100px" prop="locationPoiid">
              <el-input v-model="entityVO.locationPoiid" placeholder="人员归属的poiid" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务级别" label-width="100px" prop="personRole">
              <el-select v-model="entityVO.serve" placeholder="服务级别">
                <el-option
                  v-for="item in entityVO.serveArr"
                  :key="item.id"
                  :label="item.level_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="12">
          <el-form-item label="有效期截止">
            <el-date-picker v-model="entityVO.time" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisibleAdd=false">取消</el-button>
        <el-button type="primary" @click="confirmPersonAdd">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import Treeselect from '@riophae/vue-treeselect'
import {
  personlist,
  personedit,
  persondelete,
  personadd
} from '@/api/angel/person/person'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { departments, diGuiTree } from '@/api/permission/department'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { formatTimeToStr } from '@/utils/dateUtil'
import { deepClone } from '@/utils'
import { roles } from '@/api/permission/role'
import { getList } from '../../../api/iguard/saas'
const token = getToken()
const entityVO = {
  personId: '',
  personNo: '',
  TenantId: '',
  departmentId: '',
  personName: '',
  tagId: '',
  tagMac: '',
  personSex: '',
  personPhone: '',
  personIdentityno: '',
  personRole: '',
  personApp: '',
  locationBuildingid: '',
  locationFloor: '',
  locationPoiid: '',
  serve: '',
  time: '',
  serveArr: []
}

export default {
  name: `person`,
  components: { Pagination, Treeselect },
  directives: { permission },
  data() {
    return {
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      list: null,
      listRole: null,
      total: 0,
      tableKey: 0,
      listLoading: false,
      M: '', //男
      F: '', //女
      visitor: '', //访客
      patrol: '', //巡更
      // departments: [], // 部门列表
      listQuery: {
        page: 1,
        limit: 50,
        personId: '',
        personNo: '',
        TenantId: '',
        departmentId: '',
        personName: '',
        tagId: '',
        tagMac: '',
        personSex: '',
        personPhone: '',
        personIdentityno: '',
        personRole: '',
        personApp: '',
        locationBuildingid: '',
        locationFloor: '',
        locationPoiid: ''
      },
      headersObj: { 'LinkAdmin-Token': token },
      activeName: 'first',
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      dialogType: 'new',
      entityVO: Object.assign({}, entityVO)
    }
  },
  watch: {
    searchDeptName(val) {
      this.$refs.serchDeptTree.filter(val)
    }
  },
  created() {
    this.getList()
    // this.getDepartments();
    this.getRoleList()
  },
  methods: {
    async getCheckList() {
      try {
        const res = await getList()
        console.log(res)
        if (res.code == 20000) {
          this.entityVO.serveArr = res.result
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getList() {
      this.listLoading = true
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await personlist(this.listQuery)
        this.listLoading = false
        this.list = res.result.rows
        this.total = res.result.records
      } catch (e) {
        this.listLoading = false
      }
    },
    async getRoleList() {
      this.listLoading = true
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await roles()
        this.listLoading = false
        this.listRole = res.result
        //  this.total = res.result.records
      } catch (e) {
        this.listLoading = false
      }
    },
    // 查询部门列表
    // async getDepartments() {
    //   const res = await departments();
    //   const result = res.result;
    //   this.diGuiTree(result);
    //   this.departments = [{ id: 0, name: "部门树", childrens: result }];
    // },
    diGuiTree(item) {
      // 递归便利树结构
      item.forEach(item => {
        item.childrens === '' ||
        item.childrens === undefined ||
        item.childrens === null
          ? delete item.childrens
          : this.diGuiTree(item.childrens)
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
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
      this.getCheckList()
    },
    // 编辑功能结束，点击确定按钮触发
    async confirmPersonEdit() {
      const res = await personedit(this.entityVO)
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
    // 新增功能结束，点击确定按钮触发
    async confirmPersonAdd() {
      const res = await personadd(this.entityVO)
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
            const res = await persondelete(this.entityVO)
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
    },
    // 性别转换 性别 F--女性，M--男性
    sexStatus(row, column) {
      const sex = row.personSex
      if (sex == 'F' || sex == '2') {
        return '女'
      }
      if (sex == 'M' || sex == '1') {
        return '男'
      }
    },
    // 角色转换  角色  1-普通，2-前台，3-主管
    roleStatus(row, column) {
      const role = row.personRole
      if (role == '1') {
        return '普通'
      }
      if (role == '2') {
        return '前台'
      }
      if (role == '3') {
        return '主管'
      }
    },
    // visitor-访客，patrol-巡更
    personAppStatus(row, column) {
      const person_app = row.personApp
      console.log(person_app)
      console.log(row)
      console.log(column)
      if (person_app == 'visitor' || person_app == '1') {
        return '访客'
      }
      if (person_app == 'patrol' || person_app == '2') {
        return '巡更'
      }
    }
    //select框值改变时候触发的事件
    /*selectChange(e){
                var arrNew = [];
                var dataLength = this.departments.length;
                var eleng = e.length;
                for(let i = 0; i< dataLength ;i++){
                    for(let j = 0; j < eleng; j++){
                        if(e[j] === this.departments[i].name){
                            arrNew.push(this.departments[i])
                        }
                    }
                }
                this.$refs.tree.setCheckedNodes(arrNew);//设置勾选的值
            },
            handleCheckChange() {
                let res = this.$refs.tree.getCheckedNodes(true, true); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
                let arrLabel = [];
                let arr = [];
                res.forEach(item => {
                    arrLabel.push(item.name);
                    arr.push(item);
                });
                this.departments = arr;
                this.listQuery.departmentId = arrLabel;
            }*/
  }
}
</script>
<style lang="less" scoped>
.app-container {
}
</style>
