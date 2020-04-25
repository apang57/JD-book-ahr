import req from '../fetch/index.js'

const config = {
  getUploadUrl: {
    url: '/pc/tencentCos/upload',
    method: 'post'
  },
  getTableData: {
    url: '/pc/slideshow/listSlideshow',
    method: 'post'
  },
  getTableChildData: {
    url: '/pc/good/listGoodOfSelect',
    method: 'post'
  },
  selectSlidehow: {
    url: '/pc/slideshow/selectSlideshow',
    method: 'post'
  },
  addTableData: {
    url: '/pc/slideshow/saveSlideshow',
    method: 'post'
  },
  deleteTableData: {
    url: '/pc/slideshow/deleteSlideshow',
    method: 'post'
  },
  updateSlideshowState: {
    url: '/pc/slideshow/stateSlideshow',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
