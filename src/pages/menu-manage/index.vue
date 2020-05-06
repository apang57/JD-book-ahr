<template>
  <div class="container">
    <table cellspacing="0" >
      <tr style="height: 50px;">
        <td>
          <el-button type="primary" @click="add">新增</el-button>
          <el-button type="primary" @click="edit">修改</el-button>
          <el-button type="primary" @click="delet">删除</el-button>
          <el-button type="primary" @click="fresh">刷新</el-button>
        </td>
        <td style="font-size: 20px; font-weight: blod">分类详情</td>
      </tr>
      <tr style="height: 450px; vertical-align: top; width: 40%">
        <td>
          <el-menu @select="handlerSelect" v-loading="listLoading">
            <el-menu-item v-for="(item, index) in menuList" :index="item.code" :key="index">
              <span>{{item.title}}</span>
            </el-menu-item>
          </el-menu>
        </td>
        <td>
          <el-form :inline="true"  label-width="80px">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="clickData.menuName" readonly></el-input>
            </el-form-item>
            <el-form-item label="菜单路径" prop="route">
              <el-input v-model="clickData.route" readonly></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="comment">
              <el-input v-model="clickData.comment" readonly></el-input>
            </el-form-item>
          </el-form>
        </td>
      </tr>
    </table>
    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @before-Dialog-Close="beforeDialogClose"
      @dialog-Cancel="dialogCancel"
      @dialog-Submit="dialogSubmit"
      >
      <el-form
        :inline="true"
        label-width="100px"
        :model="dialogFormData"
        ref="form"
        :rules="formRules"
      >
      <el-row>
          <el-col :span="24">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="dialogFormData.menuName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单路径" prop="route">
              <el-input v-model="dialogFormData.route"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="comment">
              <el-input v-model="dialogFormData.comment"></el-input>
            </el-form-item>
          </el-col>
      </el-row>
      </el-form>
    </i-dialog>
    <!-- 提示修改数据条数 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogWarnVisible"
      width="30%"
    >
      <span v-if="dialogTitle === '修改菜单'">请选择一个需修改的菜单</span>
      <span v-else>请选择一个菜单删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogWarnVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/menu-manage.js'
export default {
  name: 'comm-classify-manage',
  components: {
    IDialog
  },
  data () {
    return {
      listLoading: false,
      menuList: [
      ],
      clickData: {
        menuName: '',
        route: '',
        comment: ''
      },
      dialogVisible: false,
      dialogTitle: '',
      dialogWarnVisible: false,
      dialogFormData: {},
      formRules: {
        menuName: [
          {required: true, message: '请输入菜单名称', trigger: 'change'}
        ]
        // route: [
        //   {required: true, message: '请输入菜单路径', trigger: 'change'}
        // ]
      }
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    // handleNodeClick (data) {
    //   console.log(data)
    // },
    handlerSelect (key) {
      console.log(key)
      this.clickData.menuCode = key
      this.selectMenu()
    },
    add () {
      console.log('add')
      this.dialogTitle = '新增菜单'
      this.dialogVisible = true
    },
    edit () {
      console.log('edit')
      this.dialogTitle = '修改菜单'
      console.log('this.clickData.menuCode:', this.clickData.menuCode)
      if (!this.clickData.menuCode) {
        this.dialogWarnVisible = true
      } else {
        this.selectMenu()
        this.dialogVisible = true
      }
    },
    delet () {
      console.log('delet')
      if (!this.clickData.menuCode) {
        this.dialogWarnVisible = true
      } else {
        this.$confirm('此操作将永久删除此菜单,是否继续?').then(() => {
          this.deleteTableData()
          console.log('确定')
        }).catch(() => {
          console.log('取消')
        })
      }
    },
    fresh () {
      this.$router.go(0)
      console.log('fresh')
    },
    dialogSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增菜单') {
            this.addTableData()
          } else {
            this.updateMenu()
          }
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    dialogCancel () {
      console.log('dialogCancel')
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    beforeDialogClose () {
      console.log('beforeDialogClose')
      this.$refs.form.resetFields()
    },
    // 查询
    getTableData () {
      this.listLoading = true
      req('getTableData', {}).then(data => {
        console.log('data:', data.data.list)
        this.menuList.splice(0)
        for (let i = 0; i < data.data.list.length; i++) {
          this.menuList.push({title: data.data.list[i].menuName, code: data.data.list[i].menuCode})
        }
        this.listLoading = false
        console.log(this.menuList)
      })
    },
    // 查询详细信息
    selectMenu () {
      req('selectMenu', {
        menuCode: this.clickData.menuCode
      }).then(data => {
        console.log('data:', data.data)
        this.clickData = Object.assign({}, data.data)
        if (this.dialogTitle === '修改菜单') {
          this.dialogFormData = Object.assign({}, data.data)
          console.log('selectMenu', this.dialogFormData)
        }
        console.log('selectMenu', this.clickData)
      })
    },
    // 新增
    addTableData () {
      req('addTableData', {
        menuName: this.dialogFormData.menuName,
        route: this.dialogFormData.route,
        comment: this.dialogFormData.comment
      }).then(data => {
        console.log('data', data.msg)
        if (data.code === 0) {
          this.$refs.form.resetFields()
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: data.msg + '，重新登陆后生效！'
          })
          // this.fetch()
          this.getTableData()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 修改
    updateMenu () {
      req('updateMenu', {
        ...this.dialogFormData
      }).then(data => {
        console.log('data', data.msg)
        if (data.code === 0) {
          this.$refs.form.resetFields()
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: data.msg + '，重新登陆后生效！'
          })
          this.getTableData()
          console.log('clickData', this.clickData.menuCode)
          this.selectMenu()
          this.$refs.form.resetFields()
          this.dialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 删除
    deleteTableData () {
      req('deleteTableData', {
        menuCode: this.clickData.menuCode
      }).then(data => {
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg + '，重新登陆后生效！'
          })
          this.getTableData()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
      this.clickData.menuCode = ''
      this.selectMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-main {
    .container {
      width: 100%;
      display: flex;
      table {
        width: 100%;
        td {
          border: 1px solid #ddd;
          padding: 20px;
          width: 50%;
          .el-menu {
            border-right:0;
            .el-menu-item {
              width: 150px;
              height: 25px;
              line-height: 25px;
            }
          }
          /deep/ .el-form {
            .el-form-item {
              .el-form-item__label{
                width: 70px;
              }
            }
          }
        }
      }
    }
  }
</style>
