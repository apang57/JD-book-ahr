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
          <el-tree
            :data="treeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
            @node-collapse="handleNodeClose"
            style="width: 150px">
            <!-- @node-expand="handleNodeOpen" -->
          </el-tree>
        </td>
        <td>
          <el-form
            :inline="true"
            label-width="80px"
          >
            <el-form-item label="分类名称">
              <el-input v-model="clickData.typeName"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="clickData.remark"></el-input>
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
            <el-form-item label="分类名称" prop="typeName">
              <el-input v-model="dialogFormData.typeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dialogFormData.remark"></el-input>
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
      <span v-if="warnTitle === 'edit'">请选择一个分类修改</span>
      <span v-else-if="warnTitle === 'delete'">请选择一个分类删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogWarnVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/comm-classify-manage.js'
export default {
  name: 'comm-classify-manage',
  components: {
    IDialog,
    req
  },
  data () {
    return {
      treeData: [
      ],
      defaultProps: {
        children: 'typeList',
        label: 'typeName'
      },
      clickData: {
        typeCode: '0',
        typeName: '',
        remark: ''
      },
      typeName: '',
      remark: '',
      // typeCode: ,
      dialogVisible: false,
      dialogTitle: '',
      dialogWarnVisible: false,
      warnTitle: '',
      dialogFormData: {
        typeName: '',
        remark: ''
      },
      formRules: {
        typeName: [
          {required: true, message: '请输入分类', trigger: 'change'}
        ]
      }
    }
  },
  mounted () {
    this.selectLevel()
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
      this.clickData.typeCode = data.typeCode
      this.clickData.typeName = data.typeName
      this.clickData.remark = data.remark
      console.log('typeCode:', this.clickData.typeCode)
      console.log('typeName:', this.clickData.typeName)
      console.log('remark:', this.clickData.remark)
    },
    // 节点关闭
    handleNodeClose (data) {
      console.log(data)
      setTimeout(() => {
        this.fresh()
      }, 500)
      console.log('typeCode:', this.clickData.typeCode)
      console.log('typeName:', this.clickData.typeName)
      console.log('remark:', this.clickData.remark)
    },
    // // 未选中
    // handleNodeClose (data) {
    //   console.log('close')
    // },
    add () {
      console.log('add')
      if (this.clickData.typeCode === '0') {
        this.dialogTitle = '新增一级分类'
      } else {
        this.dialogTitle = '新增' + this.clickData.typeName + '的二级分类'
      }
      this.dialogVisible = true
    },
    edit () {
      if (!this.clickData.typeName) {
        this.dialogWarnVisible = true
        this.warnTitle = 'edit'
      } else {
        console.log('edit')
        this.dialogTitle = '修改分类'
        this.selecteGoodType()
        this.dialogVisible = true
      }
    },
    delet () {
      if (!this.clickData.typeName) {
        this.dialogWarnVisible = true
        this.warnTitle = 'delete'
      } else {
        console.log('delet')
        this.$confirm('此操作将永久删除此分类,是否继续?').then(() => {
          console.log('确定')
          this.deleteTableData()
        })
      }
    },
    fresh () {
      console.log('fresh')
      this.clickData.typeName = ''
      this.clickData.remark = ''
      this.clickData.typeCode = '0'
      // Object.keys(this.clickData).forEach(key => (this.clickData[key] = ''))
      console.log('typeCode:', this.clickData.typeCode)
      console.log('typeName:', this.clickData.typeName)
      console.log('remark:', this.clickData.remark)
    },
    dialogSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '修改分类') {
            this.editTableData()
            this.$refs.form.resetFields()
            this.dialogVisible = false
          } else {
            this.addTableData()
            this.$refs.form.resetFields()
            this.dialogVisible = false
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
    // 查询分类
    selectLevel () {
      req('selectLevel', {}).then(data => {
        this.treeData = data.data
        console.log('data:', this.treeData)
      })
    },
    // 查询详细信息
    selecteGoodType () {
      req('selecteGoodType', {
        typeCode: this.clickData.typeCode
      }).then(data => {
        console.log('data:', data.data)
        this.dialogFormData = Object.assign({}, data.data)
        console.log('selecteGoodType', this.dialogFormData)
      })
    },
    // 新增
    addTableData () {
      req('addTableData', {
        typeName: this.dialogFormData.typeName,
        remark: this.dialogFormData.remark,
        parentCode: this.clickData.typeCode
      }).then(data => {
        console.log('data', data.msg)
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          // this.fetch()
          this.selectLevel()
          sessionStorage.setItem('addInfo', JSON.stringify(data.data))
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
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.selectLevel()
          this.$refs.form.resetFields()
          this.dialogVisible = false
          sessionStorage.setItem('addInfo', JSON.stringify(data.data))
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
        typeCode: this.clickData.typeCode
      }).then(data => {
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.selectLevel()
          sessionStorage.setItem('deleteInfo', JSON.stringify(data.data))
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
      this.clickData.typeCode = ''
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
        }
      }
    }
  }
</style>
