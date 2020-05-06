<template>
  <div>
    <i-search @search="fetch" @reset="reset" :model="formData">
      <el-form-item label="商品名称" prop="goodName">
        <el-input v-model="formData.goodName"></el-input>
      </el-form-item>
      <el-form-item label="商品状态" prop="goodState">
        <el-select v-model="formData.goodState">
          <el-option
            v-for="item in stateOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告词" prop="ad">
        <el-input v-model="formData.ad"></el-input>
      </el-form-item>
      <el-form-item label="出版社" prop="publish">
        <el-input v-model="formData.publish"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="formData.author"></el-input>
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
        :width="item.width"
        :show-overflow-tooltip="true"
        :formatter="columnFormatter">
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
            <el-form-item label="商品名称" prop="goodName">
              <el-input v-model="dialogFormData.goodName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="书号" prop="isbn">
              <el-input v-model="dialogFormData.isbn"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="dialogFormData.author"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版社" prop="publish">
              <el-input v-model="dialogFormData.publish"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一级分类" prop="levelOneName">
              <el-select name="levelOneName" id="levelOneName"
                v-model="dialogFormData.levelOneName"
                @change="levelOneChange">
                <el-option
                  v-for="item in LevelOneOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级分类" prop="levelTwoName">
              <el-select name="levelTwoName" id="levelTwoName" v-model="dialogFormData.levelTwoName" @change="levelTwoChange">
                <el-option
                  v-for="item in LevelTwoOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="广告词" prop="ad">
              <el-input v-model="dialogFormData.ad" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品介绍" prop="goodIntroduce">
              <el-input v-model="dialogFormData.goodIntroduce" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商家名称" prop="businessName">
              <el-input v-model="dialogFormData.businessName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input v-model="dialogFormData.stock"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="在售价" prop="sellPrice">
              <el-input v-model="dialogFormData.sellPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 60px;">
            <el-form-item label="商品图片" prop="pictureUrl">
              <i-file v-model="dialogFormData.pictureUrl"></i-file>
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
      <span v-if="warnTitle === 'edit'">请选择一个需修改的商品</span>
      <span v-if="warnTitle === 'delet'">请至少选择一个商品删除</span>
      <span v-if="warnTitle === 'up'">请至少选择一个商品上架</span>
      <span v-if="warnTitle === 'down'">请至少选择一个商品下架</span>
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
import req from '@/api/comm-manage.js'
import IFile from '@/components/common/i-file.vue'
export default {
  name: 'comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    req,
    IFile
  },
  data () {
    var validatePrice = (rule, value, callback) => {
      let reg = /(^[1-9]([0-9]{1,4})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的价格'))
      } else {
        callback()
      }
    }
    var validateNumber = (rule, value, callback) => {
      const reg = /^[1-9][0-9]*$/
      if (!reg.test(value)) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    return {
      tableLoading: false,
      formData: {
        goodName: '',
        ad: '',
        publish: '',
        author: '',
        goodState: 0
      },
      dialogVisible: false,
      dialogTitle: '',
      warnTitle: '',
      dialogWarnVisible: false,
      rows: '',
      selectOpt: 0,
      goodCodeList: '',
      versionList: '',
      parentCode: '0',
      stateOpts: [
        {label: '全部', value: 0},
        {label: '在售', value: 1},
        {label: '已下架', value: 2},
        {label: '未发布', value: 3}
      ],
      LevelOneOpts: [],
      LevelTwoOpts: [],
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            console.log('新增')
            this.dialogTitle = '新增商品'
            this.dialogVisible = true
            this.selectLevel()
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.selectOpt !== 1) {
              console.log('修改时row', this.selectOpt)
              this.warnTitle = 'edit'
              this.dialogWarnVisible = true
            } else {
              this.dialogFormData.goodCode = this.rows[0].goodCode
              this.dialogTitle = '修改商品'
              this.dialogVisible = true
              this.selectGood()
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              console.log('delete时row', this.selectOpt)
              this.warnTitle = 'delet'
              this.dialogWarnVisible = true
            } else {
              console.log('删除')
              this.$confirm('此操作将永久删除此项,是否继续?').then(() => {
                this.goodCodeList = this.rows.map(item => {
                  return item.goodCode
                }).toString()
                console.log('goodCodeList', this.goodCodeList)
                this.deleteTableData()
              })
            }
          }
        },
        {
          btnName: '上架',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              console.log('上架时row', this.selectOpt)
              this.warnTitle = 'up'
              this.dialogWarnVisible = true
            } else {
              this.updateGoodState(1)
              console.log('上架')
            }
          }
        },
        {
          btnName: '下架',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              console.log('下架时row', this.selectOpt)
              this.warnTitle = 'down'
              this.dialogWarnVisible = true
            } else {
              this.updateGoodState(2)
              console.log('下架')
            }
          }
        }
      ],
      columnList: [
        {label: '商品名称', prop: 'goodName', width: 150},
        {label: '作者', prop: 'author', width: 150},
        {label: '出版社', prop: 'publish', width: 150},
        {label: '售价', prop: 'sellPrice'},
        {label: '销售量', prop: 'sellVolume'},
        {label: '一级分类', prop: 'levelOneName'},
        {label: '二级分类', prop: 'levelTwoName'},
        {label: '广告词', prop: 'ad', width: 250},
        {label: '商品介绍', prop: 'goodIntroduce', width: 250},
        {label: '商品状态', prop: 'goodState', distName: 'stateOpts'},
        {label: '上架时间', prop: 'getGoodDate', width: 200},
        {label: '浏览量', prop: 'browseVolume'},
        {label: '商家名称', prop: 'businessName', width: 150},
        {label: '库存', prop: 'stock'},
        {label: 'isbn书号', prop: 'isbn', width: 200}
      ],
      tableData: [
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      dialogFormData: {
        goodCode: '',
        goodName: '',
        author: '',
        publish: '',
        sellPrice: '',
        sellVolume: '',
        levelOneCode: '',
        levelOneName: '',
        levelTwoCode: '',
        levelTwoName: '',
        ad: '',
        goodIntroduce: '',
        getGoodDate: '',
        browseVolume: '',
        businessName: '',
        stock: '',
        isbn: '',
        pictureUrl: ''
      },
      formRules: {
        goodName: [
          { required: true, message: '请输入商品名称', trigger: 'change' }
        ],
        isbn: [
          { required: true, message: '请输入书号', trigger: 'change' }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'change' }
        ],
        publish: [
          { required: true, message: '请输入出版社', trigger: 'change' }
        ],
        levelOneName: [
          { required: true, message: '请选择一级分类', trigger: 'change' }
        ],
        levelTwoName: [
          { required: true, message: '请选择二级分类', trigger: 'change' }
        ],
        // ad: [
        //   { required: true, message: '请输入广告词', trigger: 'change' }
        // ],
        // goodIntroduce: [
        //   { required: true, message: '请输入商品介绍', trigger: 'change' }
        // ],
        pictureUrl: [
          { required: true, message: '请选择商品图片', trigger: 'change' }
        ],
        businessName: [
          { required: true, message: '请选择商家名称', trigger: 'change' }
        ],
        stock: [
          { required: true, message: '请输入商品库存', trigger: 'change' },
          { validator: validateNumber, trigger: 'change' }
        ],
        sellPrice: [
          { required: true, message: '请输入商品销售价', trigger: 'change' },
          { validator: validatePrice, trigger: 'change' }
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
      console.log('rows:', rows)
      this.rows = rows
      this.selectOpt = rows.length
    },
    // 一级select改变
    levelOneChange (value) {
      console.log('levelOneCode:', value)
      // table显示name
      let obj = {}
      obj = this.LevelOneOpts.find((item) => {
        return item.value === value
      })
      console.log(obj.label)
      this.dialogFormData.levelOneName = obj.label
      this.dialogFormData.levelOneCode = value
      this.dialogFormData.levelTwoName = ''
      this.parentCode = value
      this.selectLevel()
    },
    // 二级select改变
    levelTwoChange (value) {
      console.log('levelTwoCode:', value)
      let obj = {}
      obj = this.LevelTwoOpts.find((item) => {
        return item.value === value
      })
      console.log(obj.label)
      this.dialogFormData.levelTwoName = obj.label
      this.dialogFormData.levelTwoCode = value
      // this.parentCode = value
      // this.selectLevel()
    },

    dialogSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增商品') {
            this.addTableData()
          } else if (this.dialogTitle === '修改商品') {
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
    // 查询
    getTableData () {
      this.tableLoading = true
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        this.tableData = data.data.list
        // this.dialogFormData.version = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        this.tableLoading = false
      })
    },
    // 查询详细信息
    selectGood () {
      req('selectGood', {
        goodCode: this.dialogFormData.goodCode
      }).then(data => {
        this.parentCode = '0'
        this.selectLevel()
        this.dialogFormData = Object.assign({}, data.data)
        setTimeout(() => {
          this.parentCode = data.data.levelOneCode
          this.selectLevel()
          console.log('selectGood', this.dialogFormData)
        }, 1000)
      })
    },
    // 查询菜单信息
    selectLevel () {
      req('selectLevel', {
        parentCode: this.parentCode
      }).then(data => {
        if (this.parentCode === '0') {
          console.log('data', data.data.list)
          console.log('this', this.LevelOneOpts)
          this.LevelOneOpts.splice(0)
          for (let i = 0; i < data.data.list.length; i++) {
            this.LevelOneOpts.push({label: data.data.list[i].typeName, value: data.data.list[i].typeCode})
          }
          console.log(this.LevelOneOpts)
        } else {
          console.log('data', data.data.list)
          console.log('this', this.LevelTwoOpts)
          this.LevelTwoOpts.splice(0)
          for (let i = 0; i < data.data.list.length; i++) {
            this.LevelTwoOpts.push({label: data.data.list[i].typeName, value: data.data.list[i].typeCode})
          }
          console.log(this.LevelTwoOpts)
        }
      })
    },
    // 新增
    addTableData () {
      console.log('add:this.dialogFormData', this.dialogFormData)
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
      console.log('dialogFormData:', this.dialogFormData)
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
          this.getTableData()
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
        goodCodeList: this.goodCodeList
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
      this.goodCodeList = ''
    },
    // 修改上下架
    updateGoodState (state) {
      // 取List
      this.goodCodeList = ''
      this.versionList = ''
      this.goodCodeList = this.rows.map(item => {
        return item.goodCode
      }).toString()
      this.versionList = this.rows.map(item => {
        return item.version
      }).toString()
      console.log('goodCodeList', this.goodCodeList)
      console.log('versionList', this.versionList)
      // 调接口
      req('updateGoodState', {
        goodCodeList: this.goodCodeList,
        versionList: this.versionList,
        goodState: state
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
