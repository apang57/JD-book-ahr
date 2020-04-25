import req from '../fetch/index.js'

const config = {
  listArea: {
    url: '/pc/store/listArea',
    method: 'post'
  },
  getTableData: {
    url: '/pc/store/listStore',
    method: 'post'
  },
  selectStore: {
    url: '/pc/store/selectStore',
    method: 'post'
  },
  addTableData: {
    url: '/pc/store/saveStore',
    method: 'post'
  },
  editTableData: {
    url: '/pc/store/updateStore',
    method: 'post'
  },
  deleteTableData: {
    url: '/pc/store/deleteStore',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
