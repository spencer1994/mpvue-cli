const homeRouter = require('./modules/home')
const vuexRouter = require('./modules/vuexRouter')
module.exports = [
  ...homeRouter,
  ...vuexRouter
]
