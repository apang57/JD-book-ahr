<template>
  <div>
    <i-search @search="fetch" @reset="reset" :model="formData">
      <el-form-item label="状态" prop="slideshowState">
        <el-select
          name="slideshowState"
          id="slideshowState"
          v-model="formData.slideshowState">
          <el-option
            v-for="item in stateOpts"
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
        :width="item.width"
        :show-overflow-tooltip="true"
        :formatter="columnFormatter">
        <template slot-scope="scope">
          <img
          v-if="item.prop === 'watch'"
          :src="scope.row.slideshowRoute"
          style="width: 50px; height: 50px; cursor: pointer;"
          @click="onPreview(scope.row.slideshowRoute)"/>
          <el-image-viewer
            v-if="showViewer"
            :on-close="closeViewer"
            :url-list="[imgSrc]"
          />
          <span v-else>{{filterDist(scope.row[item.prop],item)}}</span>
        </template>
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
          <el-col :span="12" style="height: 60px;">
            <el-form-item label="轮播图片" prop="slideshowRoute">
              <i-file v-model="dialogFormData.slideshowRoute"></i-file>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="slideshowSort">
              <el-input v-model.number="dialogFormData.slideshowSort"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期起" prop="dateStart">
                <el-date-picker
                  v-model="dialogFormData.dateStart"
                  :picker-options="dateStartPickerOptions"
                >
                </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期止" prop="dateStop">
              <el-date-picker
                  v-model="dialogFormData.dateStop"
                  :picker-options="dateStopPickerOptions"
                >
                </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="display: flex">
            <el-form-item label="商品" prop="slideshowGoodCode">
              <el-input v-model="dialogFormData.slideshowGoodCode" readonly></el-input>
              <el-button type="primary" @click="chooseBtn">选择</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
    <!-- 嵌套dialog -->
    <i-dialog-child
      v-model="dialogChildVisible"
      :title="dialoChildTitle"
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
    <!-- 提示修改数据条数 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogWarnVisible"
      width="30%"
    >
      <span v-if="warnTitle === '轮播商品选择'">请选择一个轮播商品</span>
      <span v-else-if="warnTitle === 'delete'">请至少选择一个轮播图删除</span>
      <span v-else-if="warnTitle === 'start'">请至少选择一个轮播图启用</span>
      <span v-else-if="warnTitle === 'stop'">请至少选择一个轮播图禁用</span>
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
import req from '@/api/home-pic-manage.js'
import IFile from '@/components/common/i-file.vue'
import moment from 'moment'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'home-pic-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IDialogChild,
    req,
    IFile,
    moment,
    ElImageViewer
  },
  data () {
    return {
      formData: {
        slideshowState: '0'
      },
      formChildData: {
        goodName: '',
        goodCode: ''
      },
      date: '',
      dialogVisible: false,
      dialogChildVisible: false,
      dialogTitle: '新增轮播图',
      dialoChildTitle: '',
      warnTitle: '',
      dialogWarnVisible: false,
      rows: '',
      selectOpt: 0,
      slideshowCodeList: '',
      versionList: '',
      watch: '',
      imgSrc: '',
      showViewer: false, // 显示查看器
      stateOpts: [
        {label: '全部', value: '0'},
        {label: '启用', value: '1'},
        {label: '禁用', value: '2'}
      ],
      goodStateOpts: [
        {label: '在售', value: 1},
        {label: '已下架', value: 2},
        {label: '未发布', value: 3}
      ],
      // 时间前后
      dateStartPickerOptions: {
        disabledDate: (value) => {
          if (this.dialogFormData.dateStop === '') {
            return false
          } else {
            // console.log('dateStartPickerOptions:', value)
            // console.log('this.dialogFormData.dateStop', this.dialogFormData.dateStop)
            // console.log('boolean: ', this.dialogFormData.dateStop < value)
            return this.dialogFormData.dateStop < value
          }
        }
      },
      dateStopPickerOptions: {
        disabledDate: (value) => {
          // console.log('this.dialogFormData.dateStart:', this.dialogFormData.dateStart)
          // console.log('dateStopPickerOptions:', value)
          return this.dialogFormData.dateStart > value
        }
      },
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            console.log('新增')
            this.dialogVisible = true
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              console.log('delete时row', this.selectOpt)
              this.warnTitle = 'delete'
              this.dialogWarnVisible = true
            } else {
              console.log('删除')
              this.$confirm('此操作将永久删除此项,是否继续?').then(() => {
                console.log('length', this.rows.length)
                for (let i = 0; i < this.rows.length; i++) {
                  if (i === this.rows.length - 1) {
                    this.slideshowCodeList += this.rows[i].slideshowCode
                  } else {
                    this.slideshowCodeList += this.rows[i].slideshowCode + ','
                  }
                }
                console.log('slideshowCodeList', this.slideshowCodeList)
                this.deleteTableData()
              })
            }
          }
        },
        {
          btnName: '启动',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              console.log('启动时row', this.selectOpt)
              this.warnTitle = 'start'
              this.dialogWarnVisible = true
            } else {
              this.updateSlideshowState(1)
              console.log('启动')
            }
          }
        },
        {
          btnName: '禁用',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              console.log('禁用时row', this.selectOpt)
              this.warnTitle = 'stop'
              this.dialogWarnVisible = true
            } else {
              this.updateSlideshowState(2)
              console.log('禁用')
            }
          }
        }
      ],
      columnList: [
        {label: '排序', prop: 'slideshowSort'},
        {label: '图片路径', prop: 'slideshowRoute'},
        {label: '状态', prop: 'slideshowState', distName: 'stateOpts'},
        {label: '预览', prop: 'watch'},
        {label: '有效期起', prop: 'dateStart'},
        {label: '有效期止', prop: 'dateStop'}
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
        slideshowRoute: '',
        slideshowSort: '',
        dateStart: '',
        dateStop: '',
        slideshowGoodCode: '',
        slideshowCode: ''
      },
      formRules: {
        slideshowRoute: [
          { required: true, message: '请选择轮播图片', trigger: 'change' }
        ],
        slideshowSort: [
          { required: true, message: '请输入排序', trigger: 'change' },
          { type: 'number', message: '排序必须为数字' }
        ],
        dateStart: [
          { required: true, message: '请选择有效期起', trigger: 'change' }
        ],
        dateStop: [
          { required: true, message: '请输入有效期至', trigger: 'change' }
        ],
        slideshowGoodCode: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    fetch () {
      if (this.dialoChildTitle === '轮播商品选择') {
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
    onPreview (imgRoute) {
      console.log('imgRoute', imgRoute)
      this.imgSrc = imgRoute
      this.showViewer = true
    },
    // 关闭查看器
    closeViewer () {
      this.showViewer = false
    },
    filterDist (value, item) {
      if (item.distName) {
        return this[item.distName].filter(distItem => {
          return distItem.value === value
        })[0].label
      } else {
        return value
      }
    },
    handleSizeChange (value) {
      if (this.dialoChildTitle === '轮播商品选择') {
        console.log('每页显示', value)
        this.pageChildInfo.pageSize = value
      } else {
        console.log('每页显示', value)
        this.pageInfo.pageSize = value
      }
      this.getTableData()
    },

    handleCurrentChange (value) {
      if (this.dialoChildTitle === '轮播商品选择') {
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
        if (this.dialoChildTitle === '轮播商品选择') {
          this.dialogFormData.slideshowGoodCode = rows[0].goodCode
        }
      }
      this.selectOpt = rows.length
    },
    dialogSubmit () {
      if (this.dialoChildTitle === '轮播商品选择') {
        // this.$refs.formChild.resetFields()
        if (this.selectOpt !== 1) {
          console.log('修改时row', this.selectOpt)
          this.warnTitle = '轮播商品选择'
          this.dialogWarnVisible = true
        } else {
          this.dialogChildVisible = false
          this.dialoChildTitle = ''
        }
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.dialogFormData.dateStart = moment(this.dialogFormData.dateStart).format('YYYY-MM-DD')
            this.dialogFormData.dateStop = moment(this.dialogFormData.dateStop).format('YYYY-MM-DD')
            console.log(this.dialogFormData.dateStart + '---' + this.dialogFormData.dateStop)
            this.addTableData()
            console.log('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    dialogCancel () {
      if (this.dialoChildTitle === '轮播商品选择') {
        console.log('dialogChildCancel')
        // this.$refs.formChild.resetFields()
        this.dialogChildVisible = false
        this.dialoChildTitle = ''
      } else {
        console.log('dialogCancel')
        this.$refs.form.resetFields()
        this.dialogVisible = false
      }
    },
    beforeDialogClose () {
      if (this.dialoChildTitle === '轮播商品选择') {
        console.log('beforeDialogChildClose')
        // this.$refs.formChild.resetFields()
        this.dialoChildTitle = ''
      } else {
        console.log('beforeDialogClose')
        this.$refs.form.resetFields()
      }
    },
    chooseBtn () {
      console.log('选择商品')
      this.dialoChildTitle = '轮播商品选择'
      this.formChildData.goodName = ''
      this.formChildData.goodCode = ''
      this.getTableData()
      this.dialogChildVisible = true
    },
    // 查询
    getTableData () {
      if (this.dialoChildTitle === '轮播商品选择') {
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
    selectSlidehow () {
      req('selectSlidehow', {
        slideshowCode: this.dialogFormData.slideshowCode
      }).then(data => {
        console.log(data)
        this.dialogFormData = Object.assign({}, data.data)
        console.log('selectGood', this.dialogFormData)
      })
    },
    // 新增
    addTableData () {
      console.log(this.dialogFormData.dateStart + '---' + this.dialogFormData.dateStop)
      req('addTableData', {
        ...this.dialogFormData
        // dateStart: this.dialogFormData.dateStart,
        // dateStop: this.dialogFormData.dateStop
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
        slideshowCodeList: this.slideshowCodeList
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
      this.slideshowCodeList = ''
    },
    // 修改启禁用
    updateSlideshowState (state) {
      // 取List
      this.slideshowCodeList = ''
      this.versionList = ''
      for (let i = 0; i < this.rows.length; i++) {
        if (i === this.rows.length - 1) {
          this.slideshowCodeList += this.rows[i].slideshowCode
          this.versionList += this.rows[i].version
        } else {
          this.slideshowCodeList += this.rows[i].slideshowCode + ','
          this.versionList += this.rows[i].version + ','
        }
      }
      console.log('slideshowCodeList', this.slideshowCodeList)
      console.log('versionList', this.versionList)
      // 调接口
      req('updateSlideshowState', {
        slideshowCodeList: this.slideshowCodeList,
        versionList: this.versionList,
        slideshowState: state
      }).then(data => {
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.getTableData()
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
      let distName
      if (this.dialoChildTitle === '轮播商品选择') {
        distName = this.columnChildList.filter(item => {
          return item.prop === column.property
        })[0].distName
      } else if (this.dialoTitle === '') {
        console.log('11111111111111111111111111111111111')
        distName = this.columnList.filter(item => {
          return item.prop === column.property
        })[0].distName
      }

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
