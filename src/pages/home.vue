<template>
  <div>
    <el-container>
      <el-header height="70px">
        <router-link to="">行走书店管理系统</router-link>
        <el-popover
          placement="top"
          trigger="hover"
          width="100"
          >
          <el-button @click="loginOut">退出登陆</el-button>
          <!-- <el-button slot="reference">hover 激活</el-button> -->
          <div class="user-info" slot="reference">
            <el-avatar :size="50" :src="role.userPictureUrl" v-show="role.userPictureUrl"></el-avatar>
            <el-avatar :size="50" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" v-show="!role.userPictureUrl"></el-avatar>
            {{role.userName}}
          </div>
        </el-popover>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu @select="handlerSelect">
            <el-menu-item v-for="(item, index) in menuList" :index="item.route" :key="index">
              <span>{{item.menuName}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view ></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import req from '@/api/user-manage.js'
export default {
  name: 'home',
  components: {
    req
  },
  data () {
    return {
      menuList: [
      ]
    }
  },
  mounted () {
    this.getMenuHome()
  },
  computed: {
    role () {
      return JSON.parse(sessionStorage.getItem('roleInfo'))
    }
  },
  methods: {
    handlerSelect (key, path) {
      if (key !== this.$route.path) {
        this.$router.replace({path: key})
        console.log(key)
      }
    },
    loginOut () {
      console.log('loginOut')
      this.$router.push({path: '/login'})
      sessionStorage.clear('userInfo')
      sessionStorage.clear('roleInfo')
    },
    // 查询侧边栏列表
    getMenuHome () {
      req('getMenuHome', {
      }).then(data => {
        console.log(data)
        this.menuList = data.data.list
        console.log('menuList', this.menuList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-header {
    background: rgb(242, 242, 242);
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .router-link-active {
      text-decoration: none;
      font-size: 25px;
      color: rgb(86,163,254);
    }
    .user-info {
      display: flex;
      height: 60px;
      align-items: center;
      .el-avatar {
        margin-right: 10px;
      }
    }
  }
</style>
