const { mergeWith, isArray, cloneDeep } = require('lodash')

const isWin = process.platform === 'win32'
const isMac = process.platform === 'darwin'

function deepMerge (...args) {
  return mergeWith(...args, function (curr, next) {
    if (isArray(curr)) {
      return next
    }
  })
}

function fixNewFilePath () {
  return isWin ? '../' : './'
}

function fixLocalFilePath (path) {
  return `file://${path}`
}

/**
 * 转换为固定格式
 * @param {Number} length 字符长度
 * @param {String} unit 格式
 */
function getSize (length, unit = 'MB') {
  const UNIT_MAP = {
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024
  }

  return length / UNIT_MAP[unit.toUpperCase()]
}

/**
 * 过滤不需要的文件
 * @param {Array} fileNames readdir 读出来的文件列表
 */
function filterUnwantedFiles (fileNames) {
  if (!isArray(fileNames)) throw new Error('fileName不是一个列表!')

  return cloneDeep(fileNames).filter(item => !(/(^|\/)\.[^\\/\\.]/g).test(item))
}

module.exports = {
  isWin,
  isMac,
  deepMerge,
  fixNewFilePath,
  fixLocalFilePath,
  getSize,
  filterUnwantedFiles
}
