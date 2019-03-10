(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory()
    : typeof define === 'function' && define.amd ? define(factory)
      : (global = global || self, global.Aggregate = factory())
}(this, function () {
  'use strict'

  function _classCallCheck (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function')
    }
  }

  var Aggregate = function Aggregate () {
    _classCallCheck(this, Aggregate)

    console.log('construct!')
  }

  return Aggregate
}))
