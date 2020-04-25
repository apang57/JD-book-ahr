import req from '../fetch/index.js'

const config = {
  getTableData: {
    url: '/pc/hotGood/listHotGood',
    method: 'post'
  },
  selectHotGood: {
    url: '/pc/hotGood/selectHotGood',
    method: 'post'
  },
  getTableChildData: {
    url: 'pc/good/listGoodOfSelect',
    method: 'post'
  },
  addTableData: {
    url: '/pc/hotGood/saveHotGood',
    method: 'post'
  },
  editTableData: {
    url: '/pc/hotGood/updateHotGood',
    method: 'post'
  },
  deleteTableData: {
    url: '/pc/hotGood/deleteHotGood',
    method: 'post'
  },
  getHotGood: {
    url: '/pc/hotGood/getHotGood',
    method: 'post'
  },
  setHotGood: {
    url: '/pc/hotGood/setHotGood',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
