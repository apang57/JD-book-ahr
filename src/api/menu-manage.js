import req from '../fetch/index.js'

const config = {
  getTableData: {
    url: '/pc/menu/listMenu',
    method: 'post'
  },
  selectMenu: {
    url: '/pc/menu/selectMenu',
    method: 'post'
  },
  addTableData: {
    url: '/pc/menu/saveMenu',
    method: 'post'
  },
  deleteTableData: {
    url: '/pc/menu/deleteMenu',
    method: 'post'
  },
  updateMenu: {
    url: '/pc/menu/updateMenu',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
