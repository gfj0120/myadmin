<template>

    <el-container  class="index">
      <el-header>
        <div class="left">
          <img src="../assets/logo.png" alt="">
        </div>
        <div class="main"><h1>电商后台管理</h1></div>
        <div class="right">
          <strong>欢迎光临~~</strong>
          <a href="javascript:;" @click="logout">退出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
           <!-- default-active="2"配置默认高亮的导航 -->
          <el-menu
             router
             unique-opened
             class="el-menu-vertical-demo"

             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b">
             <el-submenu index="1">
               <!-- 配置导航的标题 -->
               <template v-slot:title>
                 <i class="el-icon-location"></i>
                 <span>用户管理</span>
               </template>
               <!-- 配置展开的内容  配置的路径当成绝对路径  等于/users-->
              <el-menu-item index="users">
                <i class="el-icon-menu"></i>
                <span slot="title">用户列表</span>
              </el-menu-item>
             </el-submenu>

             <!-- 第二部分 -->
              <el-submenu index="2">
               <!-- 配置导航的标题 -->
               <template v-slot:title>
                 <i class="el-icon-location"></i>
                 <span>权限管理</span>
               </template>
               <!-- 配置展开的内容 -->
              <el-menu-item index="roles">
                <i class="el-icon-menu"></i>
                <span slot="title">角色列表</span>
              </el-menu-item>
               <el-menu-item index="rights">
                <i class="el-icon-menu"></i>
                <span slot="title">权限列表</span>
              </el-menu-item>
             </el-submenu>

    </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
          </el-main>
      </el-container>
    </el-container>

</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('亲,确定要退出吗', '温馨提示', {

        type: 'warning'
      }).then(() => {
        this.$message.success('退出成功')
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

     .el-container {
      width: 100%;
     height: 100%;

    .el-header {
      background-color: #d8d8d8;
      display: flex;
      .left {
        width: 210px;
        padding: 10px;
          img {
            width: 180;
            height: 40px;

          }
      }
       .right {
         width: 210px;
         text-align: right;
         line-height: 60px;
         a {
           color: orange;
           font-weight: 700;
         }
       }
      .main {
      flex: 1;
      text-align: center;
      line-height: 60px;
      }
    }
    .el-aside {
      background-color: #545c64;
      .el-menu {
        border-right: 0;
      }
    }
    .main {
      background-position-x: #ecf0f1;
    }
  }
</style>
