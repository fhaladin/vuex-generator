'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_type) {
  var type = _type ? ('_' + _type).toUpperCase() : '';

  return {
    PENDING: 'PENDING' + type,
    SUCCESS: 'SUCCESS' + type,
    FAILURE: 'FAILURE' + type
  };
};