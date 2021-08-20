#! /usr/bin/env node
const inquirer = require('inquirer')
const chalk = require('chalk')
const { writeDir, writeFile, writeRouter, updataAppModel, getHumpAndLineName } = require('./util')

const log = console.log

const promptList = require('./prompt')

;(async function() {
  const { name, path, entitys } = await inquirer.prompt(promptList)
  const entitysArr = entitys.split(',')
  const filePath = await writeDir(name)
  const { line } = getHumpAndLineName(name)
  await writeFile(filePath, name, entitysArr, path)
  await writeRouter(name)
  await updataAppModel(name)
  
  log(
    '   - ', chalk.greenBright('Create'), chalk.blueBright(`${filePath}/${line}.module.ts`), '\n',
    '   - ', chalk.greenBright('Create'), chalk.blueBright(`${filePath}/${line}.controller.ts`), '\n',
    '   - ', chalk.greenBright('Create'), chalk.blueBright(`${filePath}/${line}.service.ts`), '\n',

    '   - ', chalk.redBright('Update'), chalk.blueBright('/nest-manage/src/modules/index.ts'), '\n',
    '   - ', chalk.redBright('Update'), chalk.blueBright('/nest-manage/src/app.module.ts'), '\n',
  )
})()