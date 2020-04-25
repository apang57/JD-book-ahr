<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="60%"
      :before-close="beforeDialogClose"
      @close= "dialogClose"
    >
      <slot></slot>
      <div class="dialog-footer">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'i-dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    dialogClose () {
      this.visible = false
      this.$emit('input', this.visible)
    },
    beforeDialogClose () {
      this.$emit('before-Dialog-Close')
      this.visible = false
    },
    dialogCancel () {
      this.$emit('dialog-Cancel')
    },
    dialogSubmit () {
      this.$emit('dialog-Submit')
    }
  },
  watch: {
    value: {
      handler (value) {
        this.visible = value
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
