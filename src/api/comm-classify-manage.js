import req from '../fetch/index.js'

const config = {
  selectLevel: {
    url: '/pc/goodType/selectLevelOne',
    method: 'post'
  },
  selecteGoodType: {
    url: '/pc/goodType/selecteGoodType',
    method: 'post'
  },
  addTableData: {
    url: '/pc/goodType/saveGoodType',
    method: 'post'
  },
  editTableData: {
    url: '/pc/goodType/updateGoodType',
    method: 'post'
  },
  deleteTableData: {
    url: '/pc/goodType/deleteGoodType',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
