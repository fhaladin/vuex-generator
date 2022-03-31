'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mutationMap = require('./mutation-map');

var _mutationMap2 = _interopRequireDefault(_mutationMap);

var _axios = require('./axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VuexGenerator = function () {
  /**
   * Predefined endpoint
   * @param {Object | String} endpoint 
   * 
   * Use string for single endpoint
   * Use object for multiple endpoint with 'base' param as base endpoint
   * 
   */
  function VuexGenerator() {
    _classCallCheck(this, VuexGenerator);

    this.state = {};
    this.mutations = {};
    this.axios = new _axios2.default();
  }

  // ANCHOR - Mutation


  _createClass(VuexGenerator, [{
    key: 'createAsync',
    value: function createAsync(apiEndpoint) {
      var _this = this;

      var endpoint = apiEndpoint.endpoint,
          _apiEndpoint$type = apiEndpoint.type,
          type = _apiEndpoint$type === undefined ? '' : _apiEndpoint$type;
      var mutations = this.mutations;


      if ((typeof apiEndpoint === 'undefined' ? 'undefined' : _typeof(apiEndpoint)) === 'object' && !Array.isArray(apiEndpoint) && apiEndpoint !== null) {
        this.axios.endpoint[type || 'base'] = endpoint;
      } else {
        this.axios.endpoint.base = apiEndpoint;
      }

      mutations[(0, _mutationMap2.default)(type).PENDING] = function (state, payload) {
        _this.setState(state, {
          key: payload.loadingKey || 'loading',
          value: payload.loading
        });
      };

      mutations[(0, _mutationMap2.default)(type).SUCCESS] = function (state, payload) {
        _this.setState(state, {
          key: payload.statusCodeKey || 'statusCode',
          value: payload.statusCode
        });

        _this.setState(state, {
          key: payload.dataKey || 'data',
          value: payload.data
        });

        _this.setState(state, {
          key: payload.loadingKey || 'loading',
          value: false
        });
      };

      mutations[(0, _mutationMap2.default)(type).FAILURE] = function (state, payload) {
        _this.setState(state, {
          key: payload.statusCodeKey || 'statusCode',
          value: payload.statusCode
        });

        _this.setState(state, {
          key: payload.loadingKey || 'loading',
          value: false
        });
      };
    }
  }, {
    key: 'createNonAsync',
    value: function createNonAsync(states) {
      for (var key in states) {
        if (typeof states[key] === 'function') {
          var custom = states[key]();

          for (var customKey in custom) {
            var _custom$customKey = custom[customKey],
                value = _custom$customKey.default,
                _custom$customKey$arr = _custom$customKey.arrayMutations,
                arrayMutations = _custom$customKey$arr === undefined ? false : _custom$customKey$arr,
                _custom$customKey$obj = _custom$customKey.objectMutations,
                objectMutations = _custom$customKey$obj === undefined ? false : _custom$customKey$obj;


            this.createBaseMutations(customKey, value);

            if (arrayMutations) {
              if (!Array.isArray(arrayMutations)) {
                this.createArrayMutations(customKey);
              } else {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = arrayMutations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var type = _step.value;

                    this.createArrayMutations(customKey, type);
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }
              }
            }

            if (objectMutations) {
              if (!Array.isArray(arrayMutations)) {
                this.createObjectMutations(customKey);
              } else {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = arrayMutations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _type = _step2.value;

                    this.createObjectMutations(customKey, _type);
                  }
                } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                      _iterator2.return();
                    }
                  } finally {
                    if (_didIteratorError2) {
                      throw _iteratorError2;
                    }
                  }
                }
              }
            }
          }
        } else {
          this.createBaseMutations(key, states[key]);
        }
      }
    }
  }, {
    key: 'createBaseMutations',
    value: function createBaseMutations(key, value) {
      var mutations = this.mutations;

      var KEY = key.toUpperCase();

      mutations['SET_' + KEY] = function (state, payload) {
        state[key] = payload;
      };

      mutations['RESET_' + KEY] = function (state) {
        state[key] = value;
      };

      this.state[key] = value;
    }

    // ANCHOR - ARRAY

  }, {
    key: 'createArrayMutations',
    value: function createArrayMutations(key) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      switch (type) {
        case 'pop':
          return this.createPop(key);
        case 'push':
          return this.createPush(key);
        case 'flat':
          return this.createFlat(key);
        case 'fill':
          return this.createFill(key);
        case 'slice':
          return this.createSlice(key);
        case 'shift':
          return this.createShift(key);
        case 'splice':
          return this.createSplice(key);
        case 'unshift':
          return this.createUnshift(key);

        default:
          this.createPop(key);
          this.createPush(key);
          this.createFlat(key);
          this.createFill(key);
          this.createSlice(key);
          this.createShift(key);
          this.createSplice(key);
          this.createUnshift(key);
          break;
      }
    }
  }, {
    key: 'createPush',
    value: function createPush(key) {
      this.mutations['PUSH_' + key.toUpperCase()] = function (state, payload) {
        state[key].push(payload);
      };
    }
  }, {
    key: 'createPop',
    value: function createPop(key) {
      this.mutations['POP_' + key.toUpperCase()] = function (state) {
        state[key].pop();
      };
    }
  }, {
    key: 'createSlice',
    value: function createSlice(key) {
      this.mutations['SLICE_' + key.toUpperCase()] = function (state, payload) {
        state[key].slice(payload.start, payload.end);
      };
    }
  }, {
    key: 'createSplice',
    value: function createSplice(key) {
      this.mutations['SPLICE_' + key.toUpperCase()] = function (state, payload) {
        var _state$key;

        var _items = payload.items || undefined;
        var items = Array.isArray(_items) ? _items : [_items];

        (_state$key = state[key]).splice.apply(_state$key, [payload.start, payload.deleteCount].concat(_toConsumableArray(items)));
      };
    }
  }, {
    key: 'createShift',
    value: function createShift(key) {
      this.mutations['SHIFT_' + key.toUpperCase()] = function (state) {
        state[key].shift();
      };
    }
  }, {
    key: 'createUnshift',
    value: function createUnshift(key) {
      this.mutations['UNSHIFT_' + key.toUpperCase()] = function (state, payload) {
        var _state$key2;

        var items = Array.isArray(payload) ? payload : [payload];
        (_state$key2 = state[key]).unshift.apply(_state$key2, _toConsumableArray(items));
      };
    }
  }, {
    key: 'createFlat',
    value: function createFlat(key) {
      this.mutations['FLAT_' + key.toUpperCase()] = function (state, payload) {
        state[key].flat(payload);
      };
    }
  }, {
    key: 'createFill',
    value: function createFill(key) {
      this.mutations['FILL_' + key.toUpperCase()] = function (state, payload) {
        state[key].fill(payload.value, payload.start, payload.end);
      };
    }

    // ANCHOR - OBJECT

  }, {
    key: 'createObjectMutations',
    value: function createObjectMutations(key) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      switch (type) {
        case 'add':
          return this.createAdd(key);
        case 'update':
          return this.createUpdate(key);
        case 'remove':
          return this.createRemove(key);

        default:
          this.createAdd(key);
          this.createUpdate(key);
          this.createRemove(key);
          break;
      }
    }
  }, {
    key: 'createAdd',
    value: function createAdd(key) {
      this.mutations['ADD_' + key.toUpperCase()] = function (state, payload) {
        state[key][payload.key] = payload.value;
      };
    }
  }, {
    key: 'createUpdate',
    value: function createUpdate(key) {
      this.mutations['UPDATE_' + key.toUpperCase()] = function (state, payload) {
        state[key][payload.key] = payload.value;
      };
    }
  }, {
    key: 'createRemove',
    value: function createRemove(key) {
      this.mutations['REMOVE_' + key.toUpperCase()] = function (state, payload) {
        state[key][payload.key] = undefined;
      };
    }
  }, {
    key: 'setState',
    value: function setState(state, _ref) {
      var key = _ref.key,
          value = _ref.value;

      if (typeof window !== 'undefined') {
        window.$nuxt.$set(state, key, value);
      } else {
        state[key] = value;
      }
    }
  }]);

  return VuexGenerator;
}();

module.exports = VuexGenerator;