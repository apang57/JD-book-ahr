<template>
  <div>
    <i-search @search="fetch" @reset="reset" :model="formData">
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="formData.customerName"></el-input>
      </el-form-item>
      <el-form-item label="客户账户" prop="customerAcct">
        <el-input v-model="formData.customerAcct"></el-input>
      </el-form-item>
    </i-search>
    <i-table
      :tableData="tableData"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @selection-change="handleSelectionChange"
      :pageInfo="pageInfo"
      :selectionShow="false"
      >
      <el-table-column
        v-for="(item, index) in columnList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center"
        :formatter="columnFormatter">
      </el-table-column>
    </i-table>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import req from '@/api/client-manage.js'
export default {
  name: 'client-manage',
  components: {
    ISearch,
    ITable,
    req
  },
  data () {
    return {
      formData: {
        customerAcct: '',
        customerName: ''
      },
      columnList: [
        {label: '客户账号', prop: 'customerAcct'},
        {label: '姓名', prop: 'customerName'},
        {label: '性别', prop: 'sex', distName: 'sexOpts'},
        {label: '手机', prop: 'tel'},
        {label: '客户邮箱', prop: 'mail'},
        {label: '身份证', prop: 'idcard'}
      ],
      tableData: [
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      sexOpts: [
        {label: '男', value: 1},
        {label: '女', value: 2}
      ]
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
    },
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

      .el-form-item__label{
        width: 80px;
      }
    }
  }
</style>
