'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var snakeToCamel = function snakeToCamel(str) {
  var strArr = str.split('_');
  var strCamel = strArr.map(function (str, idx) {
    return idx !== 0 ? capitalizeFirstLetter(str) : str;
  }).join('');

  return strCamel;
};

var camelToSnake = function camelToSnake(str) {
  var strArr = str.match(/[A-Z][a-z]+/g);
  var strSnake = strArr.map(function (str) {
    return str.toLowerCase();
  }).join('_');

  return strSnake;
};

var capitalizeFirstLetter = function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

exports.snakeToCamel = snakeToCamel;
exports.camelToSnake = camelToSnake;
exports.capitalizeFirstLetter = capitalizeFirstLetter;