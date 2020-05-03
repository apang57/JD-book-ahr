<template>
  <div>
    <i-search @search="fetch" @reset="reset" :model="formData">
      <el-form-item label="商品名称" prop="goodName">
        <el-input v-model="formData.goodName"></el-input>
      </el-form-item>
      <el-form-item label="商品编号" prop="goodCode">
        <el-input v-model="formData.goodCode"></el-input>
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
          <el-col :span="24">
            <el-form-item label="商品" prop="goodCode">
              <el-input v-model="dialogFormData.goodCode" readonly></el-input>
              <el-button type="primary" @click="chooseBtn">选择</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="热门位排序" prop="hotSort">
                <el-input v-model.number="dialogFormData.hotSort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
    <!-- 嵌套dialog -->
    <i-dialog-child
      v-model="dialogChildVisible"
      :title="dialogChildTitle"
      @dialog-Child-Submit="dialogSubmit"
      @dialog-Child-Cancel="dialogCancel"
      @before-Dialog-Child-Close="beforeDialogClose"
      >
      <!-- 嵌套搜索 -->
        <i-search @search="fetch" @reset="reset" :model="formChildData">
          <el-form-item label="商品名称" prop="goodName">
            <el-input v-model="formChildData.goodName"></el-input>
          </el-form-item>
          <el-form-item label="商品编号" prop="goodCode">
            <el-input v-model="formChildData.goodCode"></el-input>
          </el-form-item>
        </i-search>
        <el-form
          :inline="true"
          label-width="100px"
          ref="formChild">
          <!-- :model="dialogChildFormData" -->
          <!-- :rules="formChildRules" -->
          <el-row>
            <!-- 嵌套表格 -->
            <i-table
              :tableData="tableChildData"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              @selection-change="handleSelectionChange"
              :pageInfo="pageChildInfo"
              :selectionShow="true"
              >
              <el-table-column
                v-for="(item, index) in columnChildList"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                align="center"
                :width="item.width"
                :show-overflow-tooltip="true"
                :formatter="columnFormatter">
              </el-table-column>
            </i-table>
          </el-row>
        </el-form>
    </i-dialog-child>
    <!-- 查询展示数据 -->
    <el-dialog
      title="热门商品展示数量"
      :visible="dialogNumberVisible"
      width="60%"
      @close="dialogNumberVisible = false"
    >
      <el-form
        :inline="true"
        label-width="100px"
        :model="dialogNumFormData"
        ref="formNum"
        :rules="formRules"
        >
        <el-row>
          <el-col :span="24">
            <el-form-item label="数量"
            prop="showNumber"
            >
              <el-input v-model.number="dialogNumFormData.showNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogNumberVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogNumberSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 提示修改数据条数 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogWarnVisible"
      width="30%"
    >
      <span v-if="dialogTitle ==='修改热门商品'">请选择一条需修改的数据</span>
      <span v-else-if="dialogChildTitle === '热门位商品选择'">请选择一个商品</span>
      <span v-else>请至少选择一个热门商品删除</span>
      <!-- <span v-show="this.selectOpt < 1">请选择一条需修改的数据</span> -->
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
import IDialogChild from '@/components/common/i-dialog-child.vue'
import req from '@/api/hot-comm-manage.js'
export default {
  name: 'hot-comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IDialogChild,
    req
  },
  data () {
    return {
      formData: {
        goodName: '',
        goodCode: ''
      },
      dialogNumFormData: {
        showNumber: 0,
        version: ''
      },
      formChildData: {
      },
      dialogVisible: false,
      dialogChildVisible: false,
      dialogTitle: '新增热门位商品',
      dialogChildTitle: '',
      dialogNumberVisible: false,
      dialogWarnVisible: false,
      rows: '',
      selectOpt: 0,
      hotGoodCodeList: '',
      goodStateOpts: [
        {label: '在售', value: 1},
        {label: '已下架', value: 2},
        {label: '未发布', value: 3}
      ],
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            console.log('新增')
            this.dialogTitle = '新增热门商品'
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            this.dialogTitle = '修改热门商品'
            if (this.selectOpt !== 1) {
              console.log('修改时row', this.selectOpt)
              this.dialogWarnVisible = true
            } else {
              console.log('修改')
              this.dialogVisible = true
              this.selectHotGood()
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            this.dialogTitle = '删除'
            if (this.selectOpt === 0) {
              console.log('delete时row', this.selectOpt)
              this.dialogWarnVisible = true
            } else {
              console.log('删除')
              this.$confirm('此操作将永久删除此热门商品,是否继续?').then(() => {
                console.log('length', this.rows.length)
                for (let i = 0; i < this.rows.length; i++) {
                  if (i === this.rows.length - 1) {
                    this.hotGoodCodeList += this.rows[i].hotGoodCode
                  } else {
                    this.hotGoodCodeList += this.rows[i].hotGoodCode + ','
                  }
                }
                console.log('hotGoodCodeList', this.hotGoodCodeList)
                this.deleteTableData()
              })
            }
          }
        },
        {
          btnName: '展示数量设置',
          type: 'primary',
          func: () => {
            console.log('展示数量设置')
            this.dialogNumberVisible = true
            console.log('dialogNumberVisible', this.dialogNumberVisible)
            this.getHotGood()
          }
        }
      ],
      columnList: [
        {label: '排序', prop: 'hotSort', width: 50},
        {label: '商品编号', prop: 'goodCode'},
        {label: '商品名称', prop: 'goodName'},
        {label: '商品价格', prop: 'sellPrice'},
        {label: '商品介绍', prop: 'goodIntroduce', width: 500}
      ],
      columnChildList: [
        {label: '商品编号', prop: 'goodCode', width: 200},
        {label: '商品名称', prop: 'goodName'},
        {label: '商品状态', prop: 'goodState', distName: 'goodStateOpts'},
        {label: '一级分类', prop: 'levelOneName'},
        {label: '二级分类', prop: 'levelTwoName'}
      ],
      tableData: [
      ],
      tableChildData: [
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      pageChildInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      dialogFormData: {
        goodCode: '',
        hotSort: '',
        hotGoodCode: ''
      },
      formRules: {
        goodCode: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ],
        hotSort: [
          { required: true, message: '请输入热门位排序', trigger: 'change' },
          { type: 'number', message: '热门位排序必须为数字' }
        ],
        showNumber: [
          { required: true, message: '请输入展示数量', trigger: 'change' },
          { type: 'number', message: '必须为数字' }
        ]
      }
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    fetch () {
      if (this.dialogChildTitle === '热门位商品选择') {
        this.pageChildInfo.pageSize = 5
        this.pageChildInfo.pageNum = 1
      } else {
        this.pageInfo.pageSize = 5
        this.pageInfo.pageNum = 1
      }
      this.getTableData()
    },
    reset () {
      console.log('reset')
    },

    handleSizeChange (value) {
      if (this.dialogChildTitle === '热门位商品选择') {
        console.log('每页显示', value)
        this.pageChildInfo.pageSize = value
      } else {
        console.log('每页显示', value)
        this.pageInfo.pageSize = value
      }
      this.getTableData()
    },

    handleCurrentChange (value) {
      if (this.dialogChildTitle === '热门位商品选择') {
        console.log('每页显示', value)
        this.pageChildInfo.pageNum = value
      } else {
        console.log('每页显示', value)
        this.pageInfo.pageNum = value
      }
      this.getTableData()
    },

    handleSelectionChange (rows) {
      this.rows = rows
      console.log('rows:', rows)
      if (rows.length !== 0) {
        if (this.dialogChildTitle === '热门位商品选择') {
          this.dialogFormData.goodCode = rows[0].goodCode
        } else {
          this.dialogFormData.hotGoodCode = rows[0].hotGoodCode
        }
      }
      this.selectOpt = rows.length
    },
    dialogSubmit () {
      console.log()
      if (this.dialogChildTitle === '热门位商品选择') {
        // this.$refs.formChild.resetFields()
        if (this.selectOpt !== 1) {
          console.log('热门位商品选择时row', this.selectOpt)
          this.dialogWarnVisible = true
        } else {
          this.dialogChildVisible = false
          this.dialogChildTitle = ''
        }
      } else if (this.dialogTitle === '修改热门商品') {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.editTableData()
            console.log('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.addTableData()
            console.log('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    dialogNumberSubmit () {
      this.$refs.formNum.validate((valid) => {
        if (valid) {
          this.setHotGood()
          this.dialogNumberVisible = false
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    dialogCancel () {
      if (this.dialogChildTitle === '热门位商品选择') {
        console.log('dialogChildCancel')
        // this.$refs.formChild.resetFields()
        this.dialogChildVisible = false
        this.dialogChildTitle = ''
      } else {
        console.log('dialogCancel')
        this.$refs.form.resetFields()
        this.dialogVisible = false
      }
    },
    beforeDialogClose () {
      if (this.dialogChildTitle === '热门位商品选择') {
        console.log('beforeDialogChildClose')
        // this.$refs.formChild.resetFields()
        this.dialogChildTitle = ''
      } else {
        console.log('beforeDialogClose')
        this.$refs.form.resetFields()
      }
    },
    chooseBtn () {
      console.log('选择商品')
      this.dialogChildTitle = '热门位商品选择'
      this.formChildData.goodName = ''
      this.formChildData.goodCode = ''
      this.getTableData()
      this.dialogChildVisible = true
    },
    // 查询
    getTableData () {
      if (this.dialogChildTitle === '热门位商品选择') {
        // 查询商品
        req('getTableChildData', {
          ...this.formChildData,
          pageSize: this.pageChildInfo.pageSize,
          pageNum: this.pageChildInfo.pageNum
        }).then(data => {
          this.tableChildData = data.data.list
          this.pageChildInfo.pageNum = data.data.pageNum
          this.pageChildInfo.pageSize = data.data.pageSize
          this.pageChildInfo.total = data.data.total
        })
      } else {
        req('getTableData', {
          ...this.formData,
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum
        }).then(data => {
          console.log('data:', data)
          this.tableData = data.data.list
          this.pageInfo.pageNum = data.data.pageNum
          this.pageInfo.pageSize = data.data.pageSize
          this.pageInfo.total = data.data.total
        })
      }
    },
    // 查询详细信息
    selectHotGood () {
      req('selectHotGood', {
        hotGoodCode: this.dialogFormData.hotGoodCode
      }).then(data => {
        console.log(data)
        this.dialogFormData = Object.assign({}, data.data)
        this.dialogFormData.hotSort = Number(this.dialogFormData.hotSort)
        console.log('selectHotGood', this.dialogFormData)
      })
    },
    // 新增
    addTableData () {
      console.log(this.dateStart + '---' + this.dateStop)
      req('addTableData', {
        ...this.dialogFormData,
        dateStart: this.dateStart,
        dateStop: this.dateStop
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
    // 删除
    deleteTableData () {
      req('deleteTableData', {
        hotGoodCodeList: this.hotGoodCodeList
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
      this.hotGoodCodeList = ''
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
    // 查询热门数量
    getHotGood () {
      req('getHotGood', {
      }).then(data => {
        this.dialogNumFormData.showNumber = data.data.showNumber
        this.dialogNumFormData.version = data.data.version
        // console.log(this.dialogNumFormData.showNumber)
      })
    },
    // 修改热门数量
    setHotGood () {
      req('setHotGood', {
        showNumber: this.dialogNumFormData.showNumber,
        version: this.dialogNumFormData.version
      }).then(data => {
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.dialogNumberVisible = false
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 数字转换
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnChildList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        return this[distName].filter(item => {
          console.log('value', item.value)
          console.log('row', row[column.property])
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
