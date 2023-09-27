const http = require('http')
const fs = require('fs')
const path = require('path')

const types = {
  css: "text/css",
  gif: "image/gif",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  pdf: "application/pdf",
  png: "image/png",
  svg: "image/svg+xml",
  swf: "application/x-shockwave-flash",
  tiff: "image/tiff",
  txt: "text/plain",
  wav: "audio/x-wav",
  wma: "audio/x-ms-wma",
  wmv: "video/x-ms-wmv",
  xml: "text/xml"
}

const binaryTypes = ['gif', 'ico', 'jpe', 'jpg', 'pdf', 'png', 'svg', 'swf', 'tif', 'wav', 'wma', 'wmv']

http.createServer((request, response) => {
  if (request.method !== 'GET') {
    response.statusCode = 405
    return response.end('<h1>405 Method Not Allowed</h1>')
  }
  console.log(request.url)
  if (request.url == '/') {
    request.url = 'index.html'
  }

  const { pathname } = new URL(request.url, 'http://127.0.0.1')

  let type = types[path.extname(pathname).slice(1)]

  if (binaryTypes.includes(path.extname(pathname).slice(1))) {
    console.log(path.extname(pathname).slice(1))
    console.log(__dirname + '/public' + pathname)
    fs.readFile(__dirname + '/public' + pathname, 'binary',  (err, data) => {
      if (err) {
        console.log('err',err)
        response.setHeader('content-type', 'text/html;charset=utf-8')
        switch (err.code) {
          case 'ENOENT':
            response.statusCode = 404
            return response.end('<h1>404 Not Found</h1>')
          case 'EPERM':
            response.statusCode = 403
            return response.end('<h1>403 Forbidden</h1>')
          default:
            response.statusCode = 500
            return response.end('<h1>500 Internal Server Error</h1>')
        }
      }
      if (type) {
        response.setHeader('content-type', type)
      } else {
        response.setHeader('content-type', 'applicatiopn/octet-stream')
      }
      response.write(data,'binary'); //发送二进制数据
      response.end()
    });
  } else {

    fs.readFile(__dirname + '/public' + pathname, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        response.setHeader('content-type', 'text/html;charset=utf-8')
        switch (err.code) {
          case 'ENOENT':
            response.statusCode = 404
            return response.end('<h1>404 Not Found</h1>')
          case 'EPERM':
            response.statusCode = 403
            return response.end('<h1>403 Forbidden</h1>')
          default:
            response.statusCode = 500
            return response.end('<h1>500 Internal Server Error</h1>')
        }
      }
      if (type) {
        response.setHeader('content-type', type)
      } else {
        response.setHeader('content-type', 'applicatiopn/octet-stream')
      }
      response.end(data)
    })
  }



}).listen(9000, () => {
  console.log('server started');
})

// html: 'text/html',
// css: 'text/css',
// js: 'text/javascript',
// png: 'image/png',
// jpg: 'image/jpeg',
// gif: 'image/gif',
// mp4: 'video/mp4',
// mp3: 'audio/mpeg',
// json: 'application/json'