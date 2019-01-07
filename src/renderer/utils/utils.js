import { mergeWith, isArray } from 'lodash'

export const isWin = process.platform === 'win32'
export const isMac = process.platform === 'darwin'

export function deepMerge (...args) {
  return mergeWith(...args, function (curr, next) {
    if (isArray(curr)) {
      return next
    }
  })
}
