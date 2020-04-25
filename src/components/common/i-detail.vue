<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="60%"
      :before-close="beforeDetailClose"
      @close= "dialogClose"
    >
      <slot></slot>
      <div class="dialog-footer">
        <el-button type="primary" @click="detailClose">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'i-detail',
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
    detailClose () {
      this.$emit('Detail-Close')
      this.visible = false
    },
    beforeDetailClose () {
      this.$emit('before-Detail-Close')
      this.visible = false
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
