<template>
  <div class="rights">
     <!-- 面包屑 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>用户管理</el-breadcrumb-item>
       <el-breadcrumb-item>用户列表</el-breadcrumb-item>
     </el-breadcrumb>
     <!-- 主体表格 -->

       <el-table  :data="rightList">
         <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="层级">
          <template v-slot:default="{ row }">
          <p v-if="row.level === '0'">一级</p>
          <p v-if="row.level === '1'">二级</p>
          <p v-if="row.level === '2'">三级</p>

          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('rights/list')
    // console.log(res)
    if (meta.status === 200) {
      this.rightList = data
      console.log(this.rightList)
    } else {
      this.$message.error(meta.msg)
    }
  }

}
</script>

<style>

</style>
