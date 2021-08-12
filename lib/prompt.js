module.exports = promptList = [
  {
    type: 'input',
    message: '设置model名称(英文):',
    name: 'name',
    validate: function(val) {
      if (!val.match(/^[a-zA-Z_]{1,}$/g)) {
        return '此项输入有错误'
      }
      return true
    }
  },
  {
    type: 'input',
    message: '设置基础path(eg: /api):',
    name: 'path',
  },
  {
    type: 'input',
    message: '输入用到的实例对象(用逗号隔开):',
    name: 'entitys',
  },
]