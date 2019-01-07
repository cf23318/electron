import fs from 'fs-extra'
import path from 'path'

export function getDirSize (dir) {
  return new Promise((resolve, reject) => {
    var size = 0

    fs.stat(dir, function (err, stats) {
      if (err) return reject(err)// 如果出错
      if (stats.isFile()) return resolve(stats.size)// 如果是文件

      fs.readdir(dir, async function (err, files) { // 如果是目录
        if (err) return reject(err)// 如果遍历目录出错
        if (files.length === 0) return resolve(0)// 如果目录是空的

        var count = files.length// 哨兵变量
        for (var i = 0; i < files.length; i++) {
          try {
            let _size = await getDirSize(path.join(dir, files[i]))

            size += _size
            if (--count <= 0) { // 如果目录中所有文件(或目录)都遍历完成
              resolve(size)
            }
          } catch (e) {
            reject(e)
          }
        }
      })
    })
  })
}
