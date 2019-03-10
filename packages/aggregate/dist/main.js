(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.aggregate = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Aggregate = function Aggregate(url, id) {
    _classCallCheck(this, Aggregate);

    this.url = url;
    this.id = id;
  };

  var main = (function (url) {
    return function (id) {
      return new Aggregate(url, id);
    };
  });

  return main;

}));
