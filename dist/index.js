'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sprintfJs = require('sprintf-js');

var _constantCase = require('constant-case');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var objectPath = require('object-path');

var VuexGenerator = function () {
  function VuexGenerator() {
    _classCallCheck(this, VuexGenerator);

    this.state = {};
    this.mutations = {};
    this.actions = {};
  }

  _createClass(VuexGenerator, [{
    key: 'createState',
    value: function createState(states) {
      var _this = this;

      var _loop = function _loop(key) {
        var mutations = _this.mutations;

        var KEY = (0, _constantCase.constantCase)(key);

        mutations['SET_' + KEY] = function (state, payload) {
          state[key] = payload;
        };

        mutations['RESET_' + KEY] = function (state) {};

        _this.state[key] = states[key];
      };

      for (var key in states) {
        _loop(key);
      }
    }
  }, {
    key: 'createAsync',
    value: async function createAsync(name, _ref) {
      var axios = _ref.axios,
          endpoint = _ref.endpoint,
          context = _ref.context,
          _ref$payload = _ref.payload,
          payload = _ref$payload === undefined ? {} : _ref$payload,
          _ref$state = _ref.state,
          state = _ref$state === undefined ? '' : _ref$state,
          _ref$fetch = _ref.fetch,
          fetch = _ref$fetch === undefined ? false : _ref$fetch,
          _ref$cached = _ref.cached,
          cached = _ref$cached === undefined ? false : _ref$cached,
          _ref$source = _ref.source,
          source = _ref$source === undefined ? null : _ref$source,
          _ref$method = _ref.method,
          method = _ref$method === undefined ? 'get' : _ref$method,
          _ref$loadingDefault = _ref.loadingDefault,
          loadingDefault = _ref$loadingDefault === undefined ? false : _ref$loadingDefault;
      var commit = context.commit,
          vuexState = context.state;


      var refresh = !!payload.refresh;
      var sprintfData = payload.sprintfData || {};
      var payloadData = payload.data || {};
      var config = payload.config || {};

      var trueEndpoint = (0, _sprintfJs.sprintf)(endpoint, sprintfData);

      var loadingKey = state ? state + 'Loading' : 'loading';
      var statusCodeKey = state ? state + 'StatusCode' : 'statusCode';
      var stateKey = state ? state + 'Data' : 'data';

      this.state[loadingKey] = loadingDefault;

      if (!refresh) {
        var data = vuexState[stateKey];

        // Array
        if (Array.isArray(data)) {
          if (cached && data.length > 0) {
            return;
          }
        }

        // Object
        if (cached && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data !== null) {
          if (cached && Object.keys(data).length > 0) {
            return;
          }
        }
      }

      commit(MUTATION_MAP(name).PENDING, {
        loadingKey: loadingKey,
        loading: true
      });

      try {
        var axiosArguments = method === 'get' ? [trueEndpoint, config] : [trueEndpoint, payloadData, config];

        var response = await axios[method].apply(axios, axiosArguments);
        var _data = source ? objectPath.get(response, source) : response.data;

        commit(MUTATION_MAP(name).SUCCESS, {
          fetch: fetch,
          statusCodeKey: statusCodeKey,
          statusCode: response.status,
          stateKey: stateKey,
          loadingKey: loadingKey,
          data: _data
        });

        return response;
      } catch (error) {
        commit(MUTATION_MAP(name).FAILURE, {
          loadingKey: loadingKey,
          statusCode: error.response.status
        });

        throw error;
      }
    }
  }, {
    key: 'generateAsyncMutations',
    value: function generateAsyncMutations(name) {
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var mutations = {};

      var loadingKey = state ? state + 'Loading' : 'loading';
      var stateKey = state ? state + 'Data' : 'data';
      var arrStateKey = (0, _constantCase.constantCase)(stateKey).split('_');

      if (arrStateKey.length > 1) {
        arrStateKey.pop();
      }

      var normalizedStateKey = arrStateKey.join('_');

      mutations['RESET_' + normalizedStateKey] = function (state) {
        state[stateKey] = null;
      };

      mutations['SET_LOADING_' + normalizedStateKey] = function (state, payload) {
        state[loadingKey || 'loading'] = payload;
      };

      mutations[MUTATION_MAP(name).PENDING] = function (state, payload) {
        state[payload.loadingKey || 'loading'] = true;
      };

      mutations[MUTATION_MAP(name).SUCCESS] = function (state, payload) {
        if (payload.fetch) {
          state[payload.stateKey || 'data'] = payload.data;
        }

        state[payload.statusCodeKey || 'statusCode'] = payload.statusCode;
        state[payload.loadingKey || 'loading'] = false;
      };

      mutations[MUTATION_MAP(name).FAILURE] = function (state, payload) {
        state[payload.statusCodeKey || 'statusCode'] = payload.statusCode;
        state[payload.loadingKey || 'loading'] = false;
      };

      return mutations;
    }
  }]);

  return VuexGenerator;
}();

var MUTATION_MAP = function MUTATION_MAP(type) {
  var _type = type ? type + '_' : '';

  return {
    PENDING: _type + 'PENDING',
    SUCCESS: _type + 'SUCCESS',
    FAILURE: _type + 'FAILURE'
  };
};

exports.default = VuexGenerator;