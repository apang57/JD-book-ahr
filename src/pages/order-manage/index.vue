<template>
  <div>
    <i-search @search="fetch" @reset="reset" :model="formData">
      <el-form-item label="下单人" prop="buyerName">
        <el-input v-model="formData.buyerName"></el-input>
      </el-form-item>
      <el-form-item label="订单编码" prop="orderCode">
        <el-input v-model="formData.orderCode"></el-input>
      </el-form-item>
      <el-form-item label="付款时间" prop="dateList">
        <div class="block">
          <el-date-picker
            v-model="dateList"
            type="daterange"
            range-separator="至"
            start-placeholder="年/月/日"
            end-placeholder="年/月/日"
            unlink-panels
          >
          </el-date-picker>
      </div>
      </el-form-item>
      <el-form-item label="手机号" prop="buyerTel">
        <el-input v-model="formData.buyerTel"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderState">
        <el-select
          name="orderState"
          id="orderState"
          v-model="formData.orderState">
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
        :formatter="columnFormatter"
        align="center">
      </el-table-column>
    </i-table>
    <!-- 详情dialog -->
    <i-detail
      v-model="detailVisible"
      :title="detailTitle"
      @before-Detail-Close="beforeDetailClose"
      @Detail-Close="detailClose">
      <i-table
        :tableData="tableDetailData"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :pageInfo="pageDetailInfo"
        :selectionShow="false"
        >
        <!-- @selection-change="handleSelectionChange" -->
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
      <span v-if="detailTitle === '订单详情'">请选择一个需查看的订单</span>
      <span v-else-if="warnTitle === '订单取消'">请至少选择一个订单取消</span>
      <span v-else-if="warnTitle === '订单到货'">请至少选择一个订单到货</span>
      <span v-else-if="warnTitle === '取消到货'">请至少选择一个订单取消到货</span>
      <span v-else-if="warnTitle === '订单已取货'">请至少选择一个订单已取货</span>
      <span v-else-if="warnTitle === '取消已取货'">请至少选择一个订单取消已取货</span>
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
import IDetail from '@/components/common/i-detail.vue'
import moment from 'moment'
import req from '@/api/order-manage.js'
export default {
  name: 'order-manage',
  components: {
    ISearch,
    ITable,
    IDetail,
    moment,
    req
  },
  data () {
    return {
      formData: {
        orderCode: '',
        buyerName: '',
        buyerTel: '',
        payStart: '',
        payStop: '',
        orderState: 0
      },
      detailVisible: false,
      detailTitle: '',
      dialogWarnVisible: false,
      warnTitle: '',
      rows: '',
      selectOpt: 0,
      versionList: '',
      orderCodeList: '',
      //       1.订单取消,
      // 2.取消到货(未到货), 3.订单到货(默认)
      // 4.取消已取货(未取货), 5.订单已取货
      // 6.确认取货 7.待评价 8.已评价

      stateOpts: [
        {label: '全部', value: 0},
        {label: '订单取消', value: 1},
        {label: '未到货', value: 2},
        {label: '订单到货', value: 3},
        {label: '未取货', value: 4},
        {label: '已取货', value: 5},
        // {label: '确认取货', value: 6},
        {label: '待评价', value: 7},
        {label: '已评价', value: 8}
      ],
      payOpts: [
        {label: '未支付', value: 1},
        {label: '已支付', value: 2}
      ],
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            console.log('详情')
            this.detailTitle = '订单详情'
            if (this.selectOpt !== 1) {
              console.log('详情时row', this.selectOpt)
              this.dialogWarnVisible = true
            } else {
              this.formDetailData.orderCode = this.rows[0].orderCode
              this.getTableDetailData()
              this.detailVisible = true
            }
          }
        },
        {
          btnName: '订单取消',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              this.dialogWarnVisible = true
              this.warnTitle = '订单取消'
            } else {
              console.log('订单取消')
              this.$confirm('此操作将永久取消此订单,是否继续?').then(() => {
                this.updatetateOrder(1)
                console.log('确定')
              })
            }
          }
        },
        {
          btnName: '订单到货',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              this.dialogWarnVisible = true
              this.warnTitle = '订单到货'
            } else {
              this.updatetateOrder(3)
              console.log('订单到货')
            }
          }
        },
        {
          btnName: '取消到货',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              this.dialogWarnVisible = true
              this.warnTitle = '取消到货'
            } else {
              this.updatetateOrder(2)
              console.log('取消到货')
            }
          }
        },
        {
          btnName: '订单已取货',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              this.dialogWarnVisible = true
              this.warnTitle = '订单已取货'
            } else {
              this.updatetateOrder(5)
              console.log('订单已取货')
            }
          }
        },
        {
          btnName: '取消已取货',
          type: 'primary',
          func: () => {
            if (this.selectOpt === 0) {
              this.dialogWarnVisible = true
              this.warnTitle = '取消已取货'
            } else {
              this.updatetateOrder(4)
              console.log('取消已取货')
            }
          }
        }
      ],
      columnList: [
        {label: '订单编码', prop: 'orderCode'},
        {label: '订单总价', prop: 'allPrice'},
        {label: '订单状态', prop: 'orderState', distName: 'stateOpts'},
        {label: '支付状态', prop: 'isPay', distName: 'payOpts'},
        {label: '门店编码', prop: 'storeCode'},
        {label: '下单人姓名', prop: 'buyerName'},
        {label: '下单人手机号', prop: 'buyerTel'},
        {label: '确认付款时间', prop: 'payTime'}
      ],
      columnDetailList: [
        {label: '用户编码', prop: 'userCode'},
        {label: '订单编码', prop: 'orderCode'},
        {label: '商品编码', prop: 'goodCode'},
        {label: '商品名称', prop: 'goodName'},
        {label: '购买数量', prop: 'totalNumber'},
        {label: '总金额', prop: 'totalPrice'},
        {label: '售价', prop: 'sellPrice'}
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
      pageDetailInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      dateList: [],
      formDetailData: {
        orderCode: ''
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
      console.log('dateList:', this.dateList)

      // 判断是否为空
      this.formData.payStart = this.dateList[0] ? moment(this.dateList[0]).format('YYYY-MM-DD') : ''
      this.formData.payStop = this.dateList[1] ? moment(this.dateList[1]).format('YYYY-MM-DD') : ''
      // this.dateList.splice(0)
      console.log(this.formData.payStart + '---' + this.formData.payStop)
      this.getTableData()
    },
    reset () {
      console.log('reset')
      this.dateList.splice(0)
      console.log('this.dateList', this.dateList)
    },

    handleSizeChange (value) {
      if (this.detailTitle === '订单详情') {
        console.log('每页显示', value)
        this.pageDetailInfo.pageSize = value
      } else {
        console.log('每页显示', value)
        this.pageInfo.pageSize = value
      }
      this.getTableData()
    },

    handleCurrentChange (value) {
      if (this.detailTitle === '订单详情') {
        console.log('每页显示', value)
        this.pageDetailInfo.pageNum = value
      } else {
        console.log('每页显示', value)
        this.pageInfo.pageNum = value
      }
      this.getTableData()
    },

    handleSelectionChange (rows) {
      this.rows = rows
      console.log('rows:', rows)
      this.selectOpt = rows.length
    },
    beforeDetailClose () {
      if (this.detailTitle === '订单详情') {
        console.log('beforedetailClose')
        this.detailTitle = ''
      } else {
        console.log('beforeDialogClose')
        this.$refs.form.resetFields()
      }
    },
    dialogSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.addTableData()
          this.$refs.form.resetFields()
          this.dialogVisible = false
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    detailClose () {
      console.log('dialogClose')
      this.detailTitle = ''
      this.dialogVisible = false
    },
    // 查询
    getTableData () {
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
    },
    // 查询详细信息
    getTableDetailData () {
      // 查询商品
      req('getTableDetailData', {
        orderCode: this.formDetailData.orderCode,
        pageSize: this.pageDetailInfo.pageSize,
        pageNum: this.pageDetailInfo.pageNum
      }).then(data => {
        this.tableDetailData = data.data.list
        this.pageDetailInfo.pageNum = data.data.pageNum
        this.pageDetailInfo.pageSize = data.data.pageSize
        this.pageDetailInfo.total = data.data.total
      })
    },
    // 修改订单状态
    updatetateOrder (state) {
      // 取List
      this.orderCodeList = ''
      this.versionList = ''
      for (let i = 0; i < this.rows.length; i++) {
        if (i === this.rows.length - 1) {
          this.orderCodeList += this.rows[i].orderCode
          this.versionList += this.rows[i].version
        } else {
          this.orderCodeList += this.rows[i].orderCode + ','
          this.versionList += this.rows[i].version + ','
        }
      }
      console.log('orderCodeList', this.orderCodeList)
      console.log('versionList', this.versionList)
      // 调接口
      req('updatetateOrder', {
        orderCodeList: this.orderCodeList,
        versionList: this.versionList,
        orderState: state
      }).then(data => {
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.getTableData()
          sessionStorage.setItem('deleteInfo', JSON.stringify(data.data))
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
