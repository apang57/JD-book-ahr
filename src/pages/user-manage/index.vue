<template>
  <div>
    <i-search @search="fetch" @reset="reset" :model="formData">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="用户账户" prop="userAcct">
        <el-input v-model="formData.userAcct"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select name="" id="" v-model="formData.role">
          <el-option
          v-for="item in roleOpts_select"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled">
        </el-option>
        </el-select>
      </el-form-item>
    </i-search>
    <i-table
      :toolbar="toolbar"
      :tableData="tableData"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @selection-change="handleSelectionChange"
      :pageInfo="pageInfo"
      :selectionShow="true"
      >
      <el-table-column
        v-for="(item, index) in columnList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center"
        :formatter="columnFormatter"
        :width="item.width"
        :show-overflow-tooltip="true">
      </el-table-column>
    </i-table>
    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-Submit="dialogSubmit"
      @dialog-Cancel="dialogCancel"
      @before-Dialog-Close="beforeDialogClose"
      >
      <el-form
        :inline="true"
        label-width="100px"
        :model="dialogFormData"
        ref="form"
        :rules="formRules"
        >
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户账号" prop="userAcct">
              <el-input v-model="dialogFormData.userAcct"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="dialogFormData.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别" prop="sex" style="width: 100%">
              <el-select name="sex" id="sex" v-model="dialogFormData.sex">
                    <el-option
                    v-for="item in sexOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="tel">
              <el-input v-model.number="dialogFormData.tel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户邮箱" prop="mail">
              <el-input v-model="dialogFormData.mail"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证" prop="idcard">
              <el-input v-model="dialogFormData.idcard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户密码" prop="userPassword">
              <el-input v-model="dialogFormData.userPassword" type="password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户角色" prop="role" style="width: 100%">
              <el-select name="" id="" v-model="dialogFormData.role">
                  <el-option
                  v-for="item in roleOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="height: 60px;">
            <el-form-item label="用户头像" prop="userPictureUrl">
              <i-file v-model="dialogFormData.userPictureUrl"></i-file>
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
      <span v-if="dialogTitle === '修改用户'">请选择一条需修改的数据</span>
      <span v-else>请至少选择一条数据删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogWarnVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/user-manage.js'
import IFile from '@/components/common/i-file.vue'
export default {
  name: 'user-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    req,
    IFile
  },
  data () {
    var validateTel = (rule, value, callback) => {
      let reg = /^[1][3-9][0-9]{9}$/
      if (value === '' || value === undefined || value == null) {
        callback()
      } else {
        if ((!reg.test(value)) && value !== '') {
          callback(new Error('请输入正确的电话号码'))
        } else {
          callback()
        }
      }
    }
    var validateIdCard = (rule, value, callback) => {
      let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

      console.log(reg.test(value))

      if (!reg.test(value)) {
        callback(new Error('请输入正确的身份证号'))
      } else {
        callback()
      }
    }
    var validateMail = (rule, value, callback) => {
      // eslint-disable-next-line no-useless-escape
      let reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/
      if (value === '' || value === undefined || value == null) {
        callback()
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
    }
    return {
      formData: {
        userName: '',
        userAcct: '',
        role: 0
      },
      selectOpt: 0,
      dialogVisible: false,
      dialogTitle: '',
      dialogWarnVisible: false,
      rows: '',
      userCodeList: '',
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            console.log('新增')
            this.dialogTitle = '新增用户'
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.selectOpt !== 1) {
              console.log('修改时row', this.selectOpt)
              this.dialogWarnVisible = true
            } else {
              this.dialogTitle = '修改用户'
              this.dialogVisible = true
              this.selectUserData()
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              console.log('修改时row', this.selectOpt)
              this.dialogWarnVisible = true
            } else {
              console.log('删除')
              this.$confirm('此操作将永久删除此项,是否继续?').then(() => {
                for (let i = 0; i < this.rows.length; i++) {
                  if (i === this.rows.length - 1) {
                    this.userCodeList += this.rows[i].userCode
                  } else {
                    this.userCodeList += this.rows[i].userCode + ','
                  }
                }
                console.log('userCodeList', this.userCodeList)
                this.deleteTableData()
              })
            }
          }
        }
      ],
      roleOpts_select: [
        {label: '全部', value: 0},
        {label: '管理员', value: 1},
        {label: '店长', value: 2},
        {label: '司机', value: 3}
      ],
      roleOpts: [
        {label: '管理员', value: 1},
        {label: '店长', value: 2},
        {label: '司机', value: 3}
      ],
      sexOpts: [
        {label: '男', value: 1},
        {label: '女', value: 2}
      ],
      columnList: [
        {label: '编号', prop: 'userCode', width: 200},
        {label: '账号', prop: 'userAcct'},
        {label: '姓名', prop: 'userName'},
        {label: '角色', prop: 'role', distName: 'roleOpts', width: 80},
        {label: '性别', prop: 'sex', distName: 'sexOpts', width: 60},
        {label: '手机', prop: 'tel', width: 150},
        {label: '邮箱', prop: 'mail', width: 180},
        {label: '身份证', prop: 'idcard'}
      ],
      tableData: [
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      dialogFormData: {
        userCode: '',
        userAcct: '',
        userName: '',
        sex: '',
        tel: '',
        mail: '',
        idcard: '',
        userPassword: '',
        role: '',
        userPictureUrl: ''
        // version: ''
      },
      formRules: {
        userAcct: [
          { required: true, message: '请输入账号', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请输入性别', trigger: 'change' }
        ],
        tel: [
          { required: true, message: '请输入电话', trigger: 'change' },
          { validator: validateTel, trigger: 'change' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ],
        // userPictureUrl: [
        //   { required: true, message: '请选择用户头像', trigger: 'change' }
        // ],
        idcard: [
          { required: true, message: '请输入身份证号', trigger: 'change' },
          { validator: validateIdCard, trigger: 'change' }
        ],
        mail: [
          { required: true, message: '请输入身份证号', trigger: 'change' },
          { validator: validateMail, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.getTableData()
    },
    reset () {
      console.log('reset')
    },

    handleSizeChange (value) {
      console.log('每页显示', value)
      this.pageInfo.pageSize = value
      this.getTableData()
    },

    handleCurrentChange (value) {
      console.log('当前页数', value)
      this.pageInfo.pageNum = value
      this.getTableData()
    },

    handleSelectionChange (rows) {
      console.log(rows)
      this.rows = rows
      if (rows.length !== 0) {
        this.dialogFormData.userCode = rows[0].userCode
      }
      this.selectOpt = rows.length
    },
    dialogSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增用户') {
            this.addTableData()
          } else if (this.dialogTitle === '修改用户') {
            this.editTableData()
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

    //   // let size = file.size / 1024 / 1024 / 2
    //   // if (size > 2) {
    //   //   this.$notify.warning({
    //   //     title: '警告',
    //   //     message: '图片大小必须小于2M'
    //   //   })
    //   // }
    // },

    // 查询
    getTableData () {
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    // 查询详细信息
    selectUserData () {
      req('selectUser', {
        userCode: this.dialogFormData.userCode
      }).then(data => {
        // console.log(data)
        this.dialogFormData = Object.assign({}, data.data)
        this.dialogFormData.tel = Number(this.dialogFormData.tel)
      })
    },
    // 新增
    addTableData () {
      req('addTableData', {
        ...this.dialogFormData
      }).then(data => {
        console.log('data', data.msg)
        if (data.code === 0) {
          this.$refs.form.resetFields()
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: data.msg
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
    editTableData () {
      req('editTableData', {
        ...this.dialogFormData
      }).then(data => {
        console.log('data', data.msg)
        if (data.code === 0) {
          this.$refs.form.resetFields()
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.fetch()
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
        userCodeList: this.userCodeList
      }).then(data => {
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.fetch()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
      this.userCodeList = ''
    },
    // 数字转换
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        return this[distName].filter(item => {
          // console.log(item.value)
          // console.log(row[column.property])
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .i-search {
    margin-bottom: 10px;
    /deep/ .el-form-item {
      margin-bottom: 0;
      .el-form {
        .el-form-item {
          .el-form-item__label{
            width: 70px;
          }
        }
      }
    }
  }
</style>
