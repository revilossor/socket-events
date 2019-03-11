module.exports = async (promise, message) => promise.then((...args) => {
  console.log(message)
})
