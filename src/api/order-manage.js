import req from '../fetch/index.js'

const config = {
  getTableData: {
    url: '/pc/order/listOrder',
    method: 'post'
  },
  getTableDetailData: {
    url: '/pc/order/selectOrder',
    method: 'post'
  },
  selectOrder: {
    url: '/pc/order/selectOrder',
    method: 'post'
  },
  updatetateOrder: {
    url: '/pc/order/stateOrder',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
