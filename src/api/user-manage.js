import req from '../fetch/index.js'

const config = {
  // 侧边栏
  getMenuHome: {
    url: '/pc/menu/listMenuHome',
    method: 'post'
  },

  topColumnUserData: {
    url: '/pc/user/topColumn',
    method: 'post'
  },
  getUploadUrl: {
    url: '/pc/tencentCos/upload',
    method: 'post'
  },
  getTableData: {
    url: '/pc/user/listUser',
    method: 'post'
  },
  selectUser: {
    url: '/pc/user/selectUser',
    method: 'post'
  },
  addTableData: {
    url: '/pc/user/saveUser',
    method: 'post'
  },
  editTableData: {
    url: '/pc/user/updateUser',
    method: 'post'
  },
  deleteTableData: {
    url: '/pc/user/deleteUser',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
