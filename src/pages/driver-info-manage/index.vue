<template>
  <div>
    <i-search @search="fetch" @reset="reset" :model="formData">
      <el-form-item label="司机编号" prop="driverCode">
        <el-input v-model="formData.driverCode"></el-input>
      </el-form-item>
      <el-form-item label="司机名称" prop="driverName">
        <el-input v-model="formData.driverName"></el-input>
      </el-form-item>
      <el-form-item label="所在省份" prop="provinceName">
        <el-select
        name="province"
        id="province"
        v-model="formData.provinceName"
        @change="levelOneChange"
        >
          <el-option
            v-for="item in provinceOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
       label="所在城市"
       prop="downtownName"
       >
       <!-- v-show="downtownVisible" -->
        <el-select
          name="downtown"
          id="downtown"
          v-model="formData.downtownName"
          @change="levelTwoChange"
        >
          <el-option
            v-for="item in downtownOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在区" prop="areaName">
        <el-select
        name="area"
        id="area"
        v-model="formData.areaName"
        @change="levelThreeChange">
          <el-option
            v-for="item in areaOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
    </i-search>
    <i-table
      v-loading="tableLoading"
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
            <el-form-item label="司机姓名" prop="driverName">
              <el-input v-model="dialogFormData.driverName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model="dialogFormData.tel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="司机账号" prop="driverAcct">
              <el-input v-model="dialogFormData.driverAcct"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="driverPassword">
              <el-input v-model="dialogFormData.driverPassword" type="password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
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
            <el-form-item label="身份证号" prop="idcard">
              <el-input v-model="dialogFormData.idcard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="mail">
              <el-input v-model="dialogFormData.mail"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在省份" prop="provinceName" >
              <el-select
              name="dialogProvince"
              id="dialogProvince"
              v-model="dialogFormData.provinceName"
              @change="levelOneChange">
                <el-option
                  v-for="item in provinceOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在城市" prop="downtownName">
              <el-select
              name="dialogDowntown"
              id="dialogDowntown"
              v-model="dialogFormData.downtownName"
              @change="levelTwoChange">
                <el-option
                  v-for="item in downtownOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在区" prop="areaName">
              <el-select
              name="dialogArea"
              id="dialogArea"
              v-model="dialogFormData.areaName"
              @change="levelThreeChange">
                <el-option
                  v-for="item in areaOpts"
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
    <!-- 详情dialog -->
    <i-detail
      v-model="detailVisible"
      :title="detailTitle"
      @before-Detail-Close="beforeDetailClose"
      @Detail-Close="detailClose"
      >
      <i-table
        v-loading="tableDetailLoading"
        :tableData="tableDetailData"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :pageInfo="pageInfo"
        :selectionShow="false"
        :pageShow="false"
        >
        <el-table-column
          v-for="(item, index) in columnDetailList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="center">
        </el-table-column>
      </i-table>
    </i-detail>
    <!-- 提示修改数据条数 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogWarnVisible"
      width="30%"
    >
      <span v-if="dialogTitle === '修改司机'">请选择一个需修改的司机</span>
      <span v-else-if="detailTitle === '司机详情'">一次只能查看1~5个司机详情</span>
      <span v-else>至少选中一个司机删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="warnBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import IDetail from '@/components/common/i-detail.vue'
import IFile from '@/components/common/i-file.vue'
import req from '@/api/driver-info-manage.js'
export default {
  name: 'driver-info-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IDetail,
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
      tableDetailLoading: false,
      tableLoading: false,
      formData: {
        provinceName: '',
        downtownName: '',
        areaName: '',
        driverCode: '',
        driverName: ''
      },
      // downtownVisible: true,
      dialogVisible: false,
      dialogTitle: '',
      detailVisible: false,
      detailTitle: '',
      dialogWarnVisible: false,
      rows: '',
      selectOpt: 0,
      parentCode: '0',
      driverCodeList: '',
      provinceOpts: [
      ],
      downtownOpts: [
      ],
      areaOpts: [
      ],
      sexOpts: [
        {label: '男', value: 1},
        {label: '女', value: 2}
      ],
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            this.detailTitle = '司机详情'
            console.log('this.selectOpt', this.selectOpt)
            if (this.selectOpt > 6 || this.selectOpt < 1) {
              console.log('detail时row', this.selectOpt)
              console.log('1---5条')
              this.dialogWarnVisible = true
            } else {
              console.log('详情')
              this.detailVisible = true
              console.log('length', this.rows.length)
              for (let i = 0; i < this.rows.length; i++) {
                if (i === this.rows.length - 1) {
                  this.driverCodeList += this.rows[i].driverCode
                } else {
                  this.driverCodeList += this.rows[i].driverCode + ','
                }
              }
              console.log('driverCodeList', this.driverCodeList)
              this.selectDriver()
            }
          }
        },
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            console.log('新增')
            this.dialogTitle = '新增司机'
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            this.dialogTitle = '修改司机'
            if (this.selectOpt !== 1) {
              console.log('修改时row', this.selectOpt)
              this.dialogWarnVisible = true
            } else {
              console.log('修改')
              this.dialogVisible = true
              this.dialogFormData.driverCode = this.rows[0].driverCode
              this.selectDriver()
              setTimeout(() => {
                this.getlevelTwo(this.dialogFormData.provinceCode)
                this.getlevelThree(this.dialogFormData.downtownCode)
              }, 1000)
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              console.log('delete时row', this.selectOpt)
              this.dialogWarnVisible = true
            } else {
              console.log('删除')
              this.$confirm('此操作将永久删除此项,是否继续?').then(() => {
                console.log('length', this.rows.length)
                for (let i = 0; i < this.rows.length; i++) {
                  if (i === this.rows.length - 1) {
                    this.driverCodeList += this.rows[i].driverCode
                  } else {
                    this.driverCodeList += this.rows[i].driverCode + ','
                  }
                }
                console.log('driverCodeList', this.driverCodeList)
                this.deleteTableData()
              })
            }
          }
        }
      ],
      columnList: [
        {label: '司机编号', prop: 'driverCode'},
        {label: '姓名', prop: 'driverName'},
        {label: '性别', prop: 'sex', distName: 'sexOpts'},
        {label: '手机', prop: 'tel'},
        {label: '身份证号', prop: 'idcard'},
        {label: '账号', prop: 'driverAcct'}
      ],
      columnDetailList: [
        {label: '司机编号', prop: 'driverCode'},
        {label: '姓名', prop: 'driverName'},
        {label: '性别', prop: 'sex'},
        {label: '手机', prop: 'tel'},
        {label: '邮箱', prop: 'mail'},
        {label: '身份证号', prop: 'idcard'},
        {label: '账号', prop: 'driverAcct'},
        {label: '密码', prop: 'driverPassword'}
      ],
      tableData: [
      ],
      tableDetailData: [
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      dialogFormData: {
        driverName: '',
        tel: '',
        driverAcct: '',
        idcard: '',
        driverPassword: '',
        userPictureUrl: '',
        sex: '',
        provinceCode: '',
        provinceName: '',
        downtownCode: '',
        downtownName: '',
        areaCode: '',
        areaName: ''

      },
      formRules: {
        driverName: [
          { required: true, message: '请输入司机姓名', trigger: 'change' }
        ],
        tel: [
          { required: true, message: '请输入联系电话', trigger: 'change' },
          { validator: validateTel, trigger: 'change' }
        ],
        driverAcct: [
          { required: true, message: '司机账号', trigger: 'change' }
        ],
        driverPassword: [
          { required: true, message: '司机密码', trigger: 'change' }
        ],
        idcard: [
          { required: true, message: '请输入身份证号', trigger: 'change' },
          { validator: validateIdCard, trigger: 'change' }
        ],
        // userPictureUrl: [
        //   { required: true, message: '请选择头像', trigger: 'change' }
        // ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { validator: validateMail, trigger: 'change' }
        ],
        provinceName: [
          { required: true, message: '请选择省份', trigger: 'change' }
        ],
        downtownName: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        areaName: [
          { required: true, message: '请选择区', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getTableData()
    this.listArea(0)
  },
  methods: {
    // click () {
    //   this.listArea(0)
    // },
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.getTableData()
    },
    reset () {
      console.log('reset')
      Object.keys(this.formData).forEach(key => (this.formData[key] = ''))
      this.downtownOpts = []
      this.areaOpts = []
    },
    warnBtn () {
      this.dialogWarnVisible = false
      this.detailTitle = ''
      this.dialogTitle = ''
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
      // this.dialogFormData.goodCode = rows[0].goodCode
      this.rows = rows
      this.selectOpt = rows.length
    },
    getlevelTwo (parentCode) {
      this.parentCode = parentCode
      this.listArea(1)
    },
    getlevelThree (parentCode) {
      this.parentCode = parentCode
      this.listArea(2)
    },
    // 一级select改变
    levelOneChange (value) {
      console.log('levelOneCode:', value)
      let obj = {}
      obj = this.provinceOpts.find((item) => {
        return item.value === value
      })
      console.log(obj.label)
      this.parentCode = value
      if (this.dialogTitle !== '新增司机' && this.dialogTitle !== '修改司机') {
        this.formData.areaName = ''
        this.formData.provinceCode = value
      } else {
        this.dialogFormData.provinceCode = value
        this.dialogFormData.provinceName = obj.label
        this.dialogFormData.downtownName = ''
        this.dialogFormData.areaName = ''
      }
      this.areaOpts = []
      this.listArea(1)
    },
    // 二级select改变
    levelTwoChange (value) {
      console.log('levelTwoCode:', value)
      let obj = {}
      obj = this.downtownOpts.find((item) => {
        return item.value === value
      })
      this.parentCode = value
      if (this.dialogTitle !== '新增司机' && this.dialogTitle !== '修改司机') {
        this.formData.downtownCode = value
      } else {
        this.dialogFormData.downtownCode = value
        this.dialogFormData.downtownName = obj.label
        this.dialogFormData.areaName = ''
      }
      this.listArea(2)
    },
    // 三级select改变
    levelThreeChange (value) {
      console.log('levelThreeCode:', value)
      let obj = {}
      obj = this.areaOpts.find((item) => {
        return item.value === value
      })
      console.log(obj.label)
      this.parentCode = value
      if (this.dialogTitle !== '新增司机' && this.dialogTitle !== '修改司机') {
        this.formData.areaCode = value
      } else {
        this.dialogFormData.areaCode = value
        this.dialogFormData.areaName = obj.label
      }
      this.listArea(3)
    },
    dialogSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增司机') {
            this.addTableData()
          } else if (this.dialogTitle === '修改司机') {
            this.editTableData()
          }
          Object.keys(this.formData).forEach(key => (this.formData[key] = ''))
          // this.provinceOpts = []
          this.downtownOpts = []
          this.areaOpts = []
          this.dialogTitle = ''
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
      this.dialogTitle = ''
      // this.provinceOpts = []
      this.downtownOpts = []
      this.areaOpts = []
    },
    beforeDialogClose () {
      console.log('beforeDialogClose')
      this.$refs.form.resetFields()
      this.dialogTitle = ''
      console.log('dialogFormData:', this.dialogFormData)
      // this.provinceOpts = []
      this.downtownOpts = []
      this.areaOpts = []
    },
    detailClose () {
      console.log('DetailClose')
      this.detailTitle = ''
    },
    beforeDetailClose () {
      console.log('beforeDetailClose')
      this.detailTitle = ''
    },
    // 查询
    getTableData () {
      console.log('this.detailTitle', this.detailTitle)
      if (this.detailTitle === '司机详情') {
        this.tableDetailLoading = true
        req('getTableData', {
        }).then(data => {
          console.log('司机详情', data)
          this.tableDetailLoading = false
        })
      } else {
        this.tableLoading = true
        req('getTableData', {
          ...this.formData,
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum
        }).then(data => {
          this.tableData = data.data.list
          this.pageInfo.pageNum = data.data.pageNum
          this.pageInfo.pageSize = data.data.pageSize
          this.pageInfo.total = data.data.total
          this.tableLoading = false
        })
      }
    },
    // 查询详细信息
    selectDriver () {
      if (this.dialogTitle === '修改司机') {
        req('selectDriver', {
          driverCodeList: this.dialogFormData.driverCode
        }).then(data => {
          console.log('data:', data)
          this.dialogFormData = Object.assign({}, data.data.list[0])
          console.log('selectDriver', this.dialogFormData)
        })
      } else {
        req('selectDriver', {
          driverCodeList: this.driverCodeList
        }).then(data => {
          console.log('data:', data)
          this.tableDetailData = data.data.list
          console.log('selectDriver', this.tableDetailData)
          this.getTableData()
        })
        this.driverCodeList = ''
      }
    },
    // 查询省市区信息
    listArea (state) {
      req('listArea', {
        parentCode: this.parentCode
      }).then(data => {
        if (state === 0) {
          // 省
          console.log('data', data.data.list)
          console.log('this', this.provinceOpts)
          this.provinceOpts.splice(0)
          this.formData.provinceName = ''

          for (let i = 0; i < data.data.list.length; i++) {
            this.provinceOpts.push({label: data.data.list[i].areaName, value: data.data.list[i].areaCode})
          }
          console.log('provinceOpts', this.provinceOpts)
        } else if (state === 1) {
          // 市
          console.log('data', data.data.list)
          console.log('this', this.downtownOpts)
          this.downtownOpts.splice(0)
          this.formData.downtownName = ''
          if (data.data.list.length === 1) {
            console.log('11111111111111111')
            this.downtownVisible = false
            this.parentCode = data.data.list[0].areaCode
            this.listArea(2)
          } else {
            this.downtownVisible = true
          }
          for (let i = 0; i < data.data.list.length; i++) {
            this.downtownOpts.push({label: data.data.list[i].areaName, value: data.data.list[i].areaCode})
          }
          console.log('downtownOpts', this.downtownOpts)
        } else if (state === 2) {
          // 区
          console.log('data', data.data.list)
          console.log('this', this.areaOpts)
          this.areaOpts.splice(0)
          this.formData.areaName = ''
          for (let i = 0; i < data.data.list.length; i++) {
            this.areaOpts.push({label: data.data.list[i].areaName, value: data.data.list[i].areaCode})
          }
          console.log('areaOpts', this.areaOpts)
        }
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
      this.detailTitle = ''
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
        driverCodeList: this.driverCodeList
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
      this.driverCodeList = ''
    },
    // 数字转换
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        return this[distName].filter(item => {
          // console.log('value', item.value)
          // console.log('row', row[column.property])
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

      .el-form-item__label{
        width: 80px;
      }
    }
  }
</style>
