<template>
  <div class="i-table">
    <div class="btn-list" v-show="toolbar.length">
      <!-- 按钮列表 -->
      <el-button
        v-for="(item, index) in toolbar"
        :key="index"
        :type="item.type"
        @click="item.func"
        >
        {{item.btnName}}
      </el-button>
    </div>
    <div class="table-container">
      <el-table
        border
        :data="tableData"
        @selection-change="handleSelectionChange"
        :row-style="{height:'60px'}"
        :cell-style="{padding:'2px'}"
        max-height="450px"
        >
        <el-table-column
          fixed
          v-if="selectionShow"
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <slot></slot>
      </el-table>
    </div>
    <div class="table-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
        v-show="pageInfo.total"
        v-if="pageShow"
        >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'i-table',
  props: {
    toolbar: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageInfo: {
      type: Object,
      default: () => {
        return {
          currentPage: 1,
          pageSize: 5,
          total: 0
        }
      }
    },
    selectionShow: {
      type: Boolean,
      default: false
    },
    pageShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currentPage: 1
    }
  },
  methods: {
    // 每页条数
    handleSizeChange (value) {
      this.$emit('handleSizeChange', value)
    },
    // 当前页数
    handleCurrentChange (value) {
      this.$emit('handleCurrentChange', value)
    },
    // 选择框
    handleSelectionChange (rows) {
      this.$emit('selection-change', rows)
    }

  }
}
</script>

<style lang="scss" scoped>
  .i-table {
    .btn-list {
      margin-bottom: 10px;
    }
    .table-pagination {
      .el-pagination {
        margin-top: 10px;
        text-align: right;
      }
    }
  }
</style>
