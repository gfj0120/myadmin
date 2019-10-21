<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>用户管理</el-breadcrumb-item>
       <el-breadcrumb-item>用户列表</el-breadcrumb-item>

     </el-breadcrumb>
      <el-button plain type="success" @click="addRoles">添加角色</el-button>
      <!-- 主体部分 -->
      <el-table :data="rolesList">
          <el-table-column type="expand">
            <template v-slot:default="{row}">
             <p v-if="row.children.length === 0">没有权限</p>
              <el-row v-for="l1 in row.children" :key="l1.id" class="rowList">
                <el-col :span="4"><el-tag type="success" @close="delChildren(row, l1.id )" closable>{{ l1.authName }}</el-tag><i class="el-icon-arrow-right"></i></el-col>
                <el-col :span="20">
                  <el-row  :span="12" v-for="l2 in l1.children" :key="l2.id" class="l2">
                    <el-col :span="4"><el-tag type="warning" @close="delChildren(row, l2.id )" closable>{{ l2.authName }}</el-tag><i class="el-icon-arrow-right"></i></el-col>
                    <el-col :span="20"><el-tag  class="l3" v-for="l3 in l2.children" :key="l3.id" type="warning" @close="delChildren(row, l3.id )" closable >{{ l3.authName }}</el-tag></el-col>
                  </el-row>
                </el-col>
              </el-row>
          </template>
          </el-table-column>
         <el-table-column type="index"></el-table-column>
         <el-table-column prop="roleName" label="角色名称"></el-table-column>
         <el-table-column prop="roleDesc" label="描述"></el-table-column>
         <el-table-column label="操作">
            <template v-slot:default="{ row }">
              <el-button @click="changeRoles(row)" plain size="small" type="primary" icon="el-icon-edit" ></el-button>
              <el-button @click="delRole(row.id)" plain size="small" type="danger" icon="el-icon-delete" ></el-button>
              <el-button @click="showJuris(row)" plain size="small" type="success" icon="el-icon-check" >分配权限</el-button>
           </template>
         </el-table-column>

      </el-table>
      <!-- 添加和修改复用的模态框 -->
      <el-dialog
         @close="closeDialog"
         :title="dialogTile"
         :visible.sync="dialogVisible"
         width="30%">
        <!-- 表单内容 -->
        <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
           <el-input v-model="form.roleDesc"  placeholder="请输入角色描述"></el-input>
        </el-form-item>
        </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="addChange">确 定</el-button>
         </span>
       </el-dialog>

       <!-- 分配角色对话框 -->
       <el-dialog

         title="分配权限"
         :visible.sync="jurisVisible"
         width="30%">

          <el-tree
          ref="tree"
          node-key="id"
          show-checkbox
          default-expand-all
          :data="data"
          :props="defaultProps"></el-tree>

          <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="assignRoles">分配</el-button>
         </span>
       </el-dialog>
     </div>
 </template>
<script>
export default {
  data () {
    return {
      rolesList: [],
      dialogTile: '添加角色',
      dialogVisible: false,
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['change', 'blur'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['change', 'blur'] }
        ]
      },
      jurisVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async  getRolesList () {
      const { data, meta } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.rolesList = data
        // console.log(this.rolesList)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除权限
    async delChildren (row, rightId) {
      const { data, meta } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      // console.log(roleId, rightId)
      // console.log(res)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除角色
    async  delRole (id) {
      try {
        await this.$confirm('确认要删除吗', '温馨提示', {
          type: 'warning'
        })
        // console.log('发送请求')
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRolesList()
        }
      } catch (e) {
        console.log(e)
        this.$message('取消删除')
      }
    },
    // 添加角色
    addRoles () {
      this.dialogVisible = true
      this.dialogTile = '添加角色'
    },
    // 修改角色
    changeRoles (row) {
      this.dialogVisible = true
      this.dialogTile = '修改角色'
      // element的重置并不是从重置为空,而是重置到初始状态
      this.$nextTick(() => {
        this.form.id = row.id
        this.form.roleName = row.roleName
        this.form.roleDesc = row.roleDesc
      })
    },
    closeDialog () {
      this.$refs.form.resetFields()
    },
    // 添加修改提交
    async  addChange () {
      const { id, roleName, roleDesc } = this.form
      await this.$refs.form.validate()
      console.log('校验成功')
      // 判断模态框是不是添加
      const isAdd = this.dialogTile === '添加角色'
      const url = isAdd ? 'roles' : `roles/${id}`
      const method = isAdd ? 'post' : 'put'
      const { meta } = await this.$axios[method](url, { roleName, roleDesc })
      // console.log(res)
      if (meta.status === 200 || meta.status === 201) {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.getRolesList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 分配权限模态框出现
    async showJuris (row) {
      this.roleId = row.id
      this.jurisVisible = true
      // 一打开这个模态框应该是渲染数据,是全部的权限数据
      const { meta, data } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        this.data = data
        // console.log(data)
        // console.log(row)
        // 如果设置一级id,会一次性选中二级三级,应该拿到所有的三级id,进行设置,一级二级会自动勾上
        // 在当前用户已有权限的进行设置,
        // 在分配的同时把row传来,进行设置
        // 获取到所有的三级id
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        // console.log(ids)
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRoles () {
      // 分配权限, 点击确认要先拿到所有层级的id才可以, ,全选半选的id都要,还有角色id
      // console.log(this.$refs.tree.getCheckedKeys()) // 全选  返回的是数组
      // console.log(this.$refs.tree.getHalfCheckedKeys()) // 半选
      const ids = this.$refs.tree.getCheckedKeys()
      const halfs = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfs].join(',')
      // console.log(rids)
      // 拿到了id,发送请求,还需要角色的id  roleId 抽取出来,存起来,在data中赞暂存个
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.jurisVisible = false
        this.getRolesList()
      } else {
        this.$message.error(meta.msg)
      }
    }

  }
}
</script>

<style lang='scss' scoped>
  .roles {
    .rowList {
      padding-bottom: 5px;
      margin-bottom: 5px;
      border-bottom: 1px solid slategrey;
      .l2 {
        margin-bottom: 5px;
      }
      .l3 {
        margin-bottom: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
