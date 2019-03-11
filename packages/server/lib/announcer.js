module.exports = async (promise, message) => promise.then((...args) => {
  console.log('=========================')
  console.log(`= ${message} =`)
  console.log('=========================')
})
