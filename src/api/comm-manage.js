import req from '../fetch/index.js'

const config = {
  getUploadUrl: {
    url: '/pc/tencentCos/upload',
    method: 'post'
  },
  getTableData: {
    url: '/pc/good/listGood',
    method: 'post'
  },
  selectLevel: {
    url: '/pc/goodType/selectLevel',
    method: 'post'
  },
  selectGood: {
    url: '/pc/good/selectGood',
    method: 'post'
  },
  addTableData: {
    url: '/pc/good/saveGood',
    method: 'post'
  },
  editTableData: {
    url: '/pc/good/updateGood',
    method: 'post'
  },
  deleteTableData: {
    url: '/pc/good/deleteGood',
    method: 'post'
  },
  updateGoodState: {
    url: '/pc/good/stateGood',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
