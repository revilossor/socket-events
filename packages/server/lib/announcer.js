module.exports = async (promise, message) => promise.then(arg => {
  console.log(message)
  return arg
})
