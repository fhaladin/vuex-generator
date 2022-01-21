'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mutationMap = require('./mutation-map');

var _mutationMap2 = _interopRequireDefault(_mutationMap);

var _string = require('./string');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Axios = function () {
  function Axios() {
    _classCallCheck(this, Axios);

    this.endpoint = {};
  }

  /**
   * Api call fetch style using nuxt axios
   * --> will generate 3 mutations (PENDING, SUCCESS, FAILURE)
   *
   * @param {Function} commit
   * @param {Object} config - axios config
   * @param {String} type
   * @param {String} url
   *
   * @returns {Promise}
   */


  _createClass(Axios, [{
    key: '$apiCall',
    value: function $apiCall(commit, _ref) {
      var config = _ref.config,
          method = _ref.method,
          _ref$type = _ref.type,
          type = _ref$type === undefined ? '' : _ref$type,
          _ref$dataSource = _ref.dataSource,
          dataSource = _ref$dataSource === undefined ? '' : _ref$dataSource,
          _ref$url = _ref.url,
          url = _ref$url === undefined ? null : _ref$url;

      var dataKey = type ? (0, _string.snakeToCamel)('data_' + type) : false;
      var loadingKey = type ? (0, _string.snakeToCamel)('loading_' + type) : false;
      var statusCodeKey = type ? (0, _string.snakeToCamel)('status_code_' + type) : false;

      var endpoint = url;
      if (!url) {
        endpoint = type ? this.endpoint[type] : this.endpoint.base;
      }

      commit((0, _mutationMap2.default)(type).PENDING, {
        loadingKey: loadingKey,
        loading: true
      });

      return new Promise(function (resolve, reject) {
        window.$nuxt.$axios['$' + method](endpoint, config).then(function (response) {
          var data = dataSource ? response[dataSource] : response;
          var statusCode = 200;

          commit((0, _mutationMap2.default)(type).SUCCESS, {
            data: data,
            dataKey: dataKey,
            statusCode: statusCode,
            statusCodeKey: statusCodeKey,
            loadingKey: loadingKey
          });

          resolve(response);
        }).catch(function (error) {
          var statusCode = error.response.status;


          commit((0, _mutationMap2.default)(type).FAILURE, {
            statusCode: statusCode,
            statusCodeKey: statusCodeKey,
            loadingKey: loadingKey
          });

          reject(error);
        });
      });
    }

    /**
     * Api call normal style using nuxt axios
     * --> will generate 3 mutations (PENDING, SUCCESS, FAILURE)
     *
     * @param {Function} commit
     * @param {Object} config - axios config
     * @param {String} type
     * @param {String} url
     *
     * @returns {Promise}
     */

  }, {
    key: 'apiCall',
    value: function apiCall(commit, _ref2) {
      var config = _ref2.config,
          method = _ref2.method,
          _ref2$type = _ref2.type,
          type = _ref2$type === undefined ? '' : _ref2$type,
          _ref2$dataSource = _ref2.dataSource,
          dataSource = _ref2$dataSource === undefined ? '' : _ref2$dataSource,
          _ref2$url = _ref2.url,
          url = _ref2$url === undefined ? null : _ref2$url;

      var dataKey = type ? (0, _string.snakeToCamel)('data_' + type) : false;
      var loadingKey = type ? (0, _string.snakeToCamel)('loading_' + type) : false;
      var statusCodeKey = type ? (0, _string.snakeToCamel)('status_code_' + type) : false;

      var endpoint = url;
      if (!url) {
        endpoint = type ? this.endpoint[type] : this.endpoint.base;
      }

      commit((0, _mutationMap2.default)(type).PENDING, {
        loadingKey: loadingKey,
        loading: true
      });

      return new Promise(function (resolve, reject) {
        window.$nuxt.$axios['' + method](endpoint, config).then(function (response) {
          var _data = response.data,
              statusCode = response.status;

          var data = dataSource ? _data[dataSource] : _data;

          commit((0, _mutationMap2.default)(type).SUCCESS, {
            data: data,
            dataKey: dataKey,
            statusCode: statusCode,
            statusCodeKey: statusCodeKey,
            loadingKey: loadingKey
          });

          resolve(response);
        }).catch(function (error) {
          var statusCode = error.response.status;


          commit((0, _mutationMap2.default)(type).FAILURE, {
            statusCode: statusCode,
            statusCodeKey: statusCodeKey,
            loadingKey: loadingKey
          });

          reject(error);
        });
      });
    }
  }]);

  return Axios;
}();

module.exports = Axios;