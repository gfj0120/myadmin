<template>
  <div class="categories">
    <el-button @click="showDialogVisible" plain type="success">添加用户</el-button>
    <el-table
       v-loading="isShow"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      row-key="cat_id" :data="cateList" style="width: 100%">
      <el-table-column prop="cat_name" label="分类名称" ></el-table-column>
      <el-table-column label="是否有效">
     <template v-slot:default="{row}">
     {{ row.caret_deleted ? '否' : '是'}}
     </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级" ></el-table-column>
      <el-table-column  label="操作" width="180">
       <el-button plain size="small" type="primary" icon="el-icon-edit"></el-button>
       <el-button plain size="small" type="danger" icon="el-icon-delete"></el-button>
      </el-table-column>

    </el-table>
  <!-- 分页 -->
  <el-pagination

      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page= pagenum
      :page-sizes="[2, 4, 6, 8]"
      :page-size= pagesize
      layout="total, sizes, prev, pager, next, jumper"
      :total= total>
    </el-pagination>
    <!-- 添加对话框 -->

     <el-dialog
     @close="closeAdd"
       title="添加分类"
       :visible.sync="dialogVisible"
       width="40%">
       <el-form :model="form" :rules="rules" ref="form" label-width="100px" >
         <el-form-item label="分类名称" prop="cat_name">
           <el-input placeholder="请输入分类名称" v-model="form.cat_name"></el-input>
         </el-form-item>
          <el-form-item label="父级名称">
             <el-cascader
             clearable
               :props="props"
                v-model="form.cat_rid"
                :options="options"
               ></el-cascader>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="dialogVisible = false">取 消</el-button>
         <el-button @click="addCate" type="primary">确 定</el-button>
       </span>
     </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      pagenum: 1,
      pagesize: 4,
      total: 0,
      dialogVisible: false,
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['change', 'blur'] }
        ]
      },
      form: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      isShow: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      this.isShow = true
      const { data, meta } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(res)
      if (meta.status === 200) {
        this.cateList = data.result
        this.total = data.total
        // console.log(this.total)
        // console.log(this.cateList)
      } else {
        this.$message.error(meta.msg)
      }
      this.isShow = false
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCateList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getCateList()
    },
    // 展现添加分类的模态框
    async showDialogVisible () {
      this.dialogVisible = true
      // 发送axaj请求拿到二级菜单
      const { meta, data } = await this.$axios.get('categories?type=2')
      // console.log(res)
      if (meta.status === 200) {
        this.options = data
        console.log(this.options)
      }
    },
    // 添加分类
    async addCate () {
      // 先进行表单校验
      try {
        await this.$refs.form.validate()
        // console.log('校验成功')

        const { meta } = await this.$axios.post('categories', {
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0,
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_pid.length
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.getCateList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeAdd () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style>

</style>
