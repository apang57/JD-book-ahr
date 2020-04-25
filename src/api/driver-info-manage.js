import req from '../fetch/index.js'

const config = {
  listArea: {
    url: '/pc/store/listArea',
    method: 'post'
  },
  getTableData: {
    url: '/pc/driver/listDriver',
    method: 'post'
  },
  selectDriver: {
    url: '/pc/driver/selectDriver',
    method: 'post'
  },
  addTableData: {
    url: '/pc/driver/saveDriver',
    method: 'post'
  },
  editTableData: {
    url: '/pc/driver/updateDriver',
    method: 'post'
  },
  deleteTableData: {
    url: '/pc/driver/deleteDriver',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
