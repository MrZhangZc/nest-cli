const path = require('path')
const fs = require('fs')
const fsPromise = require('fs').promises
const readline = require('readline')

const getHump = name => {
  let arr = name.split('')
  arr.map((item, index) => {
      if (index === 0) arr[index] = arr[index].toUpperCase()
      if (item == '_') {
          arr.splice(index,1)
          arr[index] = arr[index].toUpperCase()
      }
  })
  return arr.join('')
}

const getsHump = name => {
  let arr = name.split('')
  arr.map((item, index) => {
      if (item == '_') {
          arr.splice(index,1)
          arr[index] = arr[index].toUpperCase()
      }
  })
  return arr.join('')
}

const getHumpAndLineName = name => {
  let line = ''
  let hump = ''
  let shump = ''

  if (name.includes('_')) {
    hump = getHump(name)
    shump = getsHump(name)
    line = name
  } else {
    line = name.replace(/[A-Z]/g, function (match) {
      return '_' + match.toLowerCase()
    })
    if (line.slice(0, 1) === '_') {
      line = line.slice(1)
    }
    shump = getsHump(line)
    hump = name
  }

  return { line, hump, shump }
}

const writeDir = async (name) => {
  const MODULEFILE = path.join(process.cwd(), './src/modules')
  const { line } = getHumpAndLineName(name)
  const file = path.join(MODULEFILE, `/${line}`)
  await fsPromise.mkdir(file)
  return file
}

const writeFile = async (filePath, name, entitys, basepath) => {
  const { line, hump, shump } = getHumpAndLineName(name)
  const modelTPL = require('./tpl/module')(line, hump, entitys)
  const controllerTPL = require('./tpl/controller')(line, hump, shump, basepath)
  const serviceTPL = require('./tpl/service')(line, hump, entitys, shump)

  const modelRouter = path.join(filePath, `${line}.module.ts`)
  const controllerRouter = path.join(filePath, `${line}.controller.ts`)
  const serviceRouter = path.join(filePath, `${line}.service.ts`)

  await fsPromise.writeFile(modelRouter, modelTPL)
  await fsPromise.writeFile(controllerRouter, controllerTPL)
  await fsPromise.writeFile(serviceRouter, serviceTPL)
}

const writeRouter = async (name) => {
  const MODULEINDEXFILE = path.resolve(process.cwd(), './src/modules/index.ts')
  const { line } = getHumpAndLineName(name)
  const content = `export * from './${line}/${line}.module';`
  await fsPromise.appendFile(MODULEINDEXFILE, content)
}

const updataAppModel = async (name) => {
  const APPMODULEFILE = path.resolve(process.cwd(), './src/app.module.ts')
  const rl = readline.createInterface({
    input: fs.createReadStream(APPMODULEFILE)
  })
  let result = 0
  let importIndex = 0
  let modelIndex = 0

  for await (const row of rl) {
    result++
    if (row.includes('\u0027./modules\u0027')) importIndex = result - 1;
    if (row.includes('InsertModel')) modelIndex = result;
  }
  
  const { hump } = getHumpAndLineName(name)
  let data = fs.readFileSync(APPMODULEFILE, 'utf-8').split(/\r\n|\n|\r/gm)

  const indexInsert = data[importIndex].indexOf('}')
  const baseArr = data[importIndex].split('')
  const content = baseArr.reduce((prev, cur, index) => {
    if(index === indexInsert) {
      prev += ` ${hump}Module, }`
    } else {
      prev += cur
    }
    return prev
  }, '')
  data.splice(importIndex, 1, content)
  await fsPromise.writeFile(APPMODULEFILE, data.join('\n'))

  data.splice(modelIndex, 0, `    ${hump}Module,`)
  await fsPromise.writeFile(APPMODULEFILE, data.join('\n'))
}

module.exports = {
  writeFile,
  writeDir,
  writeRouter,
  updataAppModel,
  getHumpAndLineName
}