<template>
  <div class="app-container">
    <!-- 搜索框所在区域 -->
    <div style="margin-top:20px;margin-bottom: 20px">
      <el-row :gutter="21">
        <el-col :span="3">
          <el-input v-model="listQuery.tableName" placeholder="表名"/>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.fontBackstage" placeholder="前/后端">
            <el-option label="全部" value=""></el-option>
            <el-option label="后端" value="0"></el-option>
            <el-option label="前端" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >查找
          </el-button>
          <!--          <el-button
                      v-permission="['/rest/user/add']"
                      class="filter-item"
                      style="margin-left: 10px;"
                      type="primary"
                      @click="handleCreate"
                    >
                      <i class="el-icon-plus" />新增
                    </el-button>-->
        </el-col>
        <el-col :span="3">
          <el-input v-model="table_name" placeholder="表名"/>
        </el-col>
        <el-col :span="3">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-monitor"
            @click="createBackstageCode"
          >生成后端代码
          </el-button>
        </el-col>
        <el-col :span="3">
          <el-input v-model="file_path" placeholder="前端代码存放路径"/>
        </el-col>
        <el-col :span="3">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-mobile"
            @click="createFontCode"
          >生成前端代码
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
            <el-table-column prop="id" label="数据id" width="300"/>
            <el-table-column prop="tableName" label="表名" width="150"/>
            <el-table-column prop="fontBackstage" label="前/后端" width="170" :formatter="onlineStatus"/>
            <el-table-column prop="createTime" label="创建时间" width="170" :formatter="formatDateTimeCreate"/>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
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
    <!-- <el-dialog :visible.sync="dialogVisible" title="编辑">
       <el-form ref="form" :model="taskVO" :rules="rules" label-width="80px" label-position="right">
         <el-row>
           <el-col :span="12">
             <el-form-item label="任务名称" prop="title">
               <el-input v-model="taskVO.title" placeholder="任务名称"/>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="发布人" prop="nickName">
               <el-input v-model="taskVO.nickName" placeholder="发布人"/>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="24">
             <el-form-item label="任务描述" prop="taskContent">
               <el-input type="textarea" v-model="taskVO.taskContent" label="任务描述"></el-input>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item label="开始时间" prop="startTime">
               <el-input v-model="taskVO.startTime" placeholder="开始时间"/>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="结束时间" prop="deadLine">
               <el-input v-model="taskVO.deadLine" placeholder="结束时间"/>
             </el-form-item>
           </el-col>
         </el-row>

         <el-row>
           <el-col :span="8">
             <el-form-item label="任务价值/人" prop="taskPrice">
               <el-input v-model="taskVO.taskPrice" placeholder="任务价值/人"/>
             </el-form-item>
           </el-col>
           <el-col :span="8">
             <el-form-item label="所需人数" prop="peopleNum">
               <el-input v-model="taskVO.peopleNum" placeholder="所需人数"/>
             </el-form-item>
           </el-col>
           <el-col :span="8">
             <el-form-item label="任务状态" prop="status">
               <el-select v-model="taskVO.status" placeholder="任务状态">
                 <el-option label="已发布" :value="0"></el-option>
                 <el-option label="已关闭" :value="1"></el-option>
               </el-select>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="8">
             <el-form-item label="审核" prop="examStatus">
               <el-select v-model="taskVO.examStatus" placeholder="审核标记">
                 <el-option label="未审核" :value="0"></el-option>
                 <el-option label="已审核" :value="1"></el-option>
                 <el-option label="审核未通过" :value="2"></el-option>
               </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="8">
             <el-form-item label="审核时间" prop="examTime">
               <el-input v-model="taskVO.examTime" placeholder="审核时间"/>
             </el-form-item>
           </el-col>
           <el-col :span="8">
             <el-form-item label="备注" prop="remark">
               <el-input type="textarea" v-model="taskVO.remark" label="备注"></el-input>
             </el-form-item>
           </el-col>
         </el-row>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button type="danger" @click="dialogVisible=false">取消</el-button>
         <el-button type="primary" @click="confirmTask">确定</el-button>
       </span>
     </el-dialog>-->
  </div>

</template>

<script>
    import {getToken} from '@/utils/auth'
    import {
        onlineList, deleteOnline, addOnline
    } from '@/api/online/twebonline'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import {formatTimeToStr} from '@/utils/dateUtil'


    const token = getToken()
    const onlineVO = {
        id: '',
        tableName: '',  // 表名
        fontBackstage: '',  // 前端还是后台
        createTime: '',  // 创建时间
        fontFilePath: '', // 前端生成的文件路径
    }

    export default {
        name: `Online`,
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
                    tableName: '',  // 表名
                    fontBackstage: '',  // 前端还是后台
                    createTime: ''  // 创建时间

                },
                table_name: '', // 生成前端后端代码表名
                file_path: '' , // 前端生成的文件路径
                headersObj: {'LinkAdmin-Token': token},
                activeName: 'first',
                dialogVisible: false,
                dialogType: 'new',
                onlineVO: Object.assign({}, onlineVO),
                rules: {
                    examineStatus: [{required: true, message: '请选择审核状态', trigger: 'change'}],
                }
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
                    const res = await onlineList(this.listQuery)
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
            // 点击删除按钮触发 删除生成的表的记录
            async handleDelete(scope) {
                const h = this.$createElement;
                const tt = scope.row;
                const id = tt.id;
                this.onlineVO.id = id;
                this.onlineVO.tableName = tt.tableName;
                this.onlineVO.fontBackstage = tt.fontBackstage;

                this.$msgbox({
                    title: '删除消息',
                    message: h('p', null, [
                        h('span', null, '确定要删除 '),
                        h('i', {style: 'color: teal'}, tt.tableName + ' 的历史记录吗?')
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: async (action, instance, done) => {
                        if (action === 'confirm') {
                            const res = await deleteOnline(this.onlineVO);
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
            // 审核时间
            formatDateTimeCreate(row, column) {
                return formatTimeToStr(row.createTime, 'yyyy-MM-dd hh:mm:ss')
            },

            // 前后台显示转换
            onlineStatus(row, column) {
                const tt = row.fontBackstage;
                if (tt == '0') {
                    return '后端';
                }
                if (tt == '1') {
                    return '前端';
                }
            },

            // 生成后端代码方法
            async createBackstageCode() {
                this.onlineVO.tableName = this.table_name.toLowerCase();
                this.onlineVO.fontBackstage = 0;
                const res = await addOnline(this.onlineVO);
                const code = res.code;
                if (code == 20000) {
                    this.getList();
                }
            },
            // 生成前端代码方法
            async createFontCode() {
                this.onlineVO.tableName = this.table_name.toLowerCase();
                this.onlineVO.fontBackstage = 1;
                if(this.file_path == '' || this.file_path == null || this.file_path.trim() == '' || this.file_path.trim() == null || this.file_path.trim() == undefined ){
                    this.$message.error('生成前端代码必须得有路径哦~');
                    return ;
                }
                this.onlineVO.fontFilePath = this.file_path;
                const res = await addOnline(this.onlineVO);
                debugger;
                const code = res.code;
                if (code == 20000) {
                    this.getList();
                }


            },

        /*    createFontCode(_result) {
               // this.createViewFolderAndFile();
                for (let i = 0; i < _result.length; i++) {
                    const _field = _result._field;     // 字段 名称
                    const _type = _result._type;      // 字段类型
                    const _collation = _result._collation; // 编码格式
                    const _null = _result._null;    // 是否为空
                    const _key = _result._key;     // 主键，外键类型
                    const _default = _result._default;   // 默认值
                    const _extra = _result._extra;     // 主键模式，自增等。。。
                    const _privileges = _result._privileges; // 字段权限
                    const _comment = _result._comment; // 字段注释

                }
            },*/
            // 在views文件夹下创建文件夹和文件，文件夹名称根据表名来定义
            createViewFolderAndFile() {
                alert("====" + this.table_name);
                // 需要创建的文件夹的名字
                const folder_name = this.tableNameConvert(this.table_name);
                // 获取当前文件所在路径
                const _file_path = document.location.toString();


            },
            // 将表名中的下划线去掉，并将大写转换为小写
            tableNameConvert(table_name) {
                table_name = table_name.replace("_", "");
                table_name = table_name.toLowerCase();
                return table_name;
            },
            getPathRootJump() {
                var pathName = window.location.pathname.substring(1);
                var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
                var path_root = window.location.protocol + '//' + window.location.host + '/' + webName + '/';
                return path_root;
            },
            // 点击编辑按钮触发
            /*handleEdit(scope) {
                debugger;
                this.dialogVisible = true
                this.onlineVO = deepClone(scope.row)
                const tt = this.onlineVO.createTime;
                this.onlineVO.createTime = this.formatDateTimeTemp(tt);
            },*/
            // 编辑功能结束，点击确定按钮触发
            /*async confirmTask() {
                this.onlineVO.createTime = this.formatDateTimeTemp(this.onlineVO.createTime);
                const res = await editTask(this.onlineVO);
                const result = res.result;
                if (result) {
                    this.$message({
                        showClose: true,
                        message: '编辑成功',
                        type: 'success'
                    })
                    this.dialogVisible = false;
                    this.getList();
                }
            }*/
        }
    }
</script>

<style scoped>

</style>
