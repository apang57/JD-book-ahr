<template>
  <div class="container">
    <div class="file-box">
      <el-button class="add-btn" @click="addImg" :loading="loading" type="primary" plain icon="el-icon-plus" :disabled="!(imgPath === '')"></el-button>
      <span v-show="imgPath">
        <el-link :underline="false">
          <el-image
            style="width: 50px; height: 50px; margin: 0 10px"
            :src="imgPath"
            :preview-src-list="imgSrc">
          </el-image>
        </el-link>
      </span>
      <el-button v-show="imgPath" @click="deleteImg" class="delete-btn" type="danger" plain icon="el-icon-delete"></el-button>
    </div>
    <input type="file" ref="file" name="imageFile" id="file" value="" @change="fileChange($event)" style="display: none"/>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'i-file',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      imgPath: '',
      loading: false,
      imgSrc: []
    }
  },
  watch: {
    value: {
      handler (value) {
        this.imgPath = value
        this.imgSrc.splice(0)
        this.imgSrc.push(value)
        if (!value) {
          document.getElementById('file').value = ''
        }
      },
      deep: true
    }
  },
  methods: {
    addImg () {
      this.$refs.file.click()
    },
    deleteImg () {
      this.imgPath = ''
      this.$emit('input', this.imgPath)
    },
    fileChange (event) {
      if (event.target.files.length) {
        this.loading = true
        let formData = new FormData() // 通过form数据格式来传
        let file = document.getElementById('file').files[0]
        formData.append('file', file, file.name) // 传文件
        formData.append('access_token', JSON.parse(sessionStorage.getItem('userInfo')).access_token) // access_token
        axios({
          method: 'post',
          url: 'http://299213w34l.wicp.vip:14644/pc/tencentCos/upload',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((data) => {
          console.log('data:', data.data.data)
          this.loading = false
          this.imgPath = data.data.data
          this.imgSrc.splice(0)
          this.imgSrc.push(data.data.data)
          console.log('imgSrc:', this.imgSrc)
          this.$emit('input', this.imgPath)
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.imgPath = ''
        this.$emit('input', this.imgPath)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    .file-box {
      display: flex;
      .el-button {
        width: 50px;
        height: 50px;
        border: 1px dashed;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
      }
    }
  }
</style>
