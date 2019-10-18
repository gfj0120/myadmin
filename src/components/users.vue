<template>
  <div class="users">
    <!-- 面包屑 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>用户管理</el-breadcrumb-item>
       <el-breadcrumb-item>用户列表</el-breadcrumb-item>

     </el-breadcrumb>
     <!-- 输入框 -->
       <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
         <el-button @click="serchUser" slot="append" icon="el-icon-search"></el-button>
       </el-input>
       <el-button @click="showDialog" plain type="success" class="addUser">添加用户</el-button>
    <!-- 表格展示数据 -->
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column

        label="用户状态">
        <template v-slot:default="obj">

         <el-switch
         @change="changeState(obj.row)"
           v-model="obj.row.mg_state "
           active-color="#13ce66"
           inactive-color="#ff4949">
         </el-switch>
       </template>
      </el-table-column>
      <el-table-column

        label="操作">
        <template v-slot:default="obj">
           <el-button @click="showChange(obj.row)" plain size="small" type="primary" icon="el-icon-edit" ></el-button>
           <el-button @click="delUser(obj.row.id)" plain size="small" type="danger" icon="el-icon-delete" ></el-button>
           <el-button plain size="small" type="success" icon="el-icon-check" >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <!-- @size-change 每页条数的变化 -->
     <!-- @current-change 当前页变化时触发  -->
     <!-- :current-page 当前页 -->
    <!-- :page-sizes 可选择的每页条数 -->
    <!-- :page-size 当前每页多少条 -->
    <!-- layout可变化的控件列表 不要的可以去除  与当前页面的顺序对应-->
    <!-- :total 总条数 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 点击添加用户出来的模态框 -->
      <!-- :visible.sync="dialogVisible" 布尔值用于模态框的展示 -->
      <!-- :before-close="handleClose"  不需要 -->
    <el-dialog
    @closed="closeDialog"
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%">
     <!-- 表单内容 -->

     <el-form :model="form" :rules="rules" ref="form" label-width="80px">
       <el-form-item label="用户名" prop="username">
         <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
       </el-form-item>
       <el-form-item label="密码" prop="password">
         <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
       </el-form-item>
       <el-form-item  label="邮箱" prop="email">
         <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
       </el-form-item>
       <el-form-item label="手机号" prop="mobile">
         <el-input v-model="form.mobile" placeholder="手机号"></el-input>
       </el-form-item>

     </el-form>
      <!-- 底部的内容 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- 确定的操作自己写代码 -->
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
   </el-dialog>

   <!-- 点击修改出来的模态框 -->
   <el-dialog
     title="修改用户"
     :visible.sync="dialoChange"
     width="40%">
     <!-- 表单内容 -->
    <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="80px">
       <el-form-item  label="用户名" prop="email">
       <p>{{ changeForm.username}}</p>
      </el-form-item>

      <el-form-item  label="邮箱" prop="email">
         <el-input v-model="changeForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
         <el-input v-model="changeForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
   </el-form>
     <!-- 底部的内容 -->
     <span slot="footer" class="dialog-footer">
       <el-button @click="dialogVisible = false">取 消</el-button>
       <el-button  @click="changeUser" type="primary">确 定</el-button>
     </span>
   </el-dialog>
  </div>
</template>

<script>

export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userList: [],
      total: 0,
      dialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]

      },
      dialoChange: false,
      // 这里的数据由接口文档据诶定
      changeForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }

    }
  },
  methods: {
    async  getUserList () {
      try {
        const { data, meta } = await this.$axios.get('users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        if (meta.status === 200) {
          this.userList = data.users
          this.total = data.total
          // console.log(this.total)
          // console.log(this.userList)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
      // this.$axios.get('users', {
      //   params: {
      //     query: this.query,
      //     pagenum: this.pagenum,
      //     pagesize: this.pagesize
      //   }
      // }).then(res => {
      //   console.log(res.data)
      //   const { data, meta } = res
      //   if (meta.status === 200) {
      //     this.userList = data.users
      //     this.total = data.total
      //     // console.log(this.total)
      //     // console.log(this.userList)
      //   } else {
      //     this.$message.error(meta.msg)
      //   }
      // })
    },
    // 当每页条数变化时
    handleSizeChange (val) {
      // console.log(val)
      // val值就是每页的条数
      this.pagesize = val
      // 如果val传的8,就是每页8条数据,在请求前如果停留在第5页,
      // 发送ajax请求的当前页就会是5,但是如果数据只有8条,实际只有一页的展示效果,
      // 但是请求的当前页是5,会造成返回的是空白数据,请求前把当前页返回到1,
      this.pagenum = 1
      // 需要重新渲染数据
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    async delUser (id) {
      try {
        await this.$confirm('亲,确定要删除吗', '提示', {
          type: 'warning'
        })
        console.log('成功')
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
      // await this.$confirm('亲,确定要删除吗', '提示', {
      //   type: 'warning'
      // }).then(() => {
      //   // console.log('删除成功')
      //   this.axios.delete(`users/${id}`).then(res => {
      //     console.log(res.data)
      //     const { meta } = res
      //     if (meta.status === 200) {
      //       this.$message.success('删除成功')
      //       if (this.userList.length === 1 && this.pagenum > 1) {
      //         this.pagenum--
      //       }
      //       this.getUserList()
      //     } else {
      //       this.$message.error(meta.msg)
      //     }
      //   })
      // }).catch(() => {
      //   console.log('已取消')
      //   this.$message('已取消')
      // })
    },
    // 搜索框中的值一改,query的值也变了,直接发送请求
    serchUser () {
      // 点击搜索时需要将当期页改为第一页,如果不改是从第三页出发的话,
      // 那就是请第三页fade请求,找搜索目标,肯定是找不到的
      this.pagenum = 1
      this.getUserList()
    },
    async changeState (row) {
      try {
        const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
        if (meta.status === 200) {
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
      // this.$axios.put(`users/${row.id}/state/${row.mg_state}`).then(res => {
      //   console.log(res)
      //   const { meta } = res
      //   if (meta.status === 200) {
      //     this.getUserList()
      //   } else {
      //     this.$message.error(meta.msg)
      //   }
      // })
    },
    // 点击出现添加模态框
    showDialog () {
      this.dialogVisible = true
    },
    // 添加的事件
    async  addUser () {
      try {
        await this.$refs.form.validate()
        console.log('校验成功了')
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          // 关闭页面,重置数据
          this.dialogVisible = false

          // 新加的数据显示在最后一页,让页面跳转到最后一页,

          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)

          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
        // console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭天机模态框后的重置
    closeDialog () {
      // console.log('关闭了')
      this.$refs.form.resetFields()
    },
    // 点击修改时出现修改的模态框  完成数据回显
    showChange (row) {
      this.dialoChange = true
      this.changeForm.username = row.username
      this.changeForm.email = row.email
      this.changeForm.mobile = row.mobile
      this.changeForm.id = row.id
    },
    // 点击模态框中的确认,先校验,成功提交请求
    async changeUser () {
      try {
        await this.$refs.changeForm.validate()
        // console.log('校验好了')
        const { id, email, mobile } = this.changeForm
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getUserList()
          this.dialoChange = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .users {
    .el-breadcrumb {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid slategray;
      margin-bottom: 10px;
    }
    .el-table {
      margin-top: 10px;
    }
    .input-with-select {
      width: 300px;
    }
    .addUser {
      margin-left: 20px;
    }
  }
</style>
