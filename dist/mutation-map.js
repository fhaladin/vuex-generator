'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constantCase = require('constant-case');

exports.default = function (_type) {
  var type = _type ? '_' + (0, _constantCase.constantCase)(_type) : '';

  return {
    PENDING: 'PENDING' + type,
    SUCCESS: 'SUCCESS' + type,
    FAILURE: 'FAILURE' + type
  };
};