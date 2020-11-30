<template>
  <div class="app-container">
    <el-button type="primary" @click="end">保存</el-button>
    <div class="con">
      <el-tree
        ref="tree"
        :check-strictly="checkStrictly"
        :data="permissions"
        :props="defaultProps"
        default-expand-all
        show-checkbox
        node-key="id"
        class="permission-tree"
        @check="checkPermissionTree"
        :default-checked-keys="treeArr"
      />
    </div>
  </div>
</template>

<script>
import {
  permissions,
  permissionsByRole,
  subPermissions,
  updateVisualizedConfig,
  getVisualizedConfigById
} from '@/api/permission/permission'
export default {
  data() {
    return {
      checkStrictly: true,
      permissions: [],
      permissionsByRole: [],
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      treeArr: []
    }
  },
  mounted() {
    this.getPermissions()
    this.checkList()
  },
  methods: {
    async end() {
      let permIds = this.$refs.tree.getCheckedKeys().join(',')
      try {
        const res = await updateVisualizedConfig(permIds)
        console.log(res)
        this.checkList()
      } catch (err) {
        console.log(err)
      }
    },
    async checkList() {
      try {
        const res = await getVisualizedConfigById()
        console.log(res)
        this.treeArr = res.result.permIds.split(',')
      } catch (err) {
        console.log(err)
      }
    },
    async getPermissions() {
      const res = await subPermissions()
      this.permissions = res.result
    },
    async getPermissionsByRole(roleId) {
      const res = await permissionsByRole(roleId)
      this.permissionsByRole = res.result
    },
    async getDataScopes() {
      const res = await dictInfo('data_scope')
      this.dataScopes = res.result
    },
    async getDepartments() {
      const res = await subDepartments()
      this.departments = res.result
    },
    // 权限树
    checkPermissionTree(currentObj, treeStatus) {
      const currentNode = this.$refs.tree.getNode(currentObj)
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      const selected = treeStatus.checkedKeys.indexOf(currentNode.key) // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentNode)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentNode, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentNode.childNodes) {
          if (currentNode.childNodes.length !== 0) {
            this.uniteChildSame(currentNode, false)
          }
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(currentNode, isSelected) {
      this.$refs.tree.setChecked(currentNode.key, isSelected)
      if (currentNode.childNodes) {
        for (let i = 0; i < currentNode.childNodes.length; i++) {
          this.uniteChildSame(currentNode.childNodes[i], isSelected)
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentNode) {
      console.log(currentNode)
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    }
  }
}
</script>
<style lang='less' scoped>
.app-container {
  .con {
  }
}
</style>