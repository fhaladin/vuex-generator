import mMap from './mutation-map'
import Axios from './axios'

class VuexGenerator {
  /**
   * Predefined endpoint
   * @param {Object | String} endpoint 
   * 
   * Use string for single endpoint
   * Use object for multiple endpoint with 'base' param as base endpoint
   * 
   */
  constructor () {
    this.state = {}
    this.mutations = {}
    this.axios = new Axios()
  }

  // ANCHOR - Mutation
  createAsync (apiEndpoint) {
    const { endpoint, type = '' } = apiEndpoint
    const { mutations } = this

    if (typeof apiEndpoint === 'object' && !Array.isArray(apiEndpoint) && apiEndpoint !== null) {
      this.axios.endpoint[type || 'base'] = endpoint
    } else {
      this.axios.endpoint.base = apiEndpoint
    }
    
    mutations[mMap(type).PENDING] = (state, payload) => {
      this.setState(state, {
        key: payload.loadingKey || 'loading',
        value: payload.loading
      })
    }

    mutations[mMap(type).SUCCESS] = (state, payload) => {
      this.setState(state, {
        key: payload.statusCodeKey || 'statusCode',
        value: payload.statusCode
      })

      this.setState(state, {
        key: payload.dataKey || 'data',
        value: payload.data
      })

      this.setState(state, {
        key: payload.loadingKey || 'loading',
        value: false
      })
    }

    mutations[mMap(type).FAILURE] = (state, payload) => {
      this.setState(state, {
        key: payload.statusCodeKey || 'statusCode',
        value: payload.statusCode
      })

      this.setState(state, {
        key: payload.loadingKey || 'loading',
        value: false
      })
    }
  }

  createNonAsync (states) {
    for (const key in states) {
      if (typeof states[key] === 'function') {
        const custom = states[key]()

        for (const customKey in custom) {
          const {
            default: value,
            arrayMutations = false,
            objectMutations = false
          } = custom[customKey]

          this.createBaseMutations(customKey, value)

          if (arrayMutations) {
            if (!Array.isArray(arrayMutations)) {
              this.createArrayMutations(customKey)
            } else {
              for (const type of arrayMutations) {
                this.createArrayMutations(customKey, type)
              }
            }
          }

          if (objectMutations) {
            if (!Array.isArray(arrayMutations)) {
              this.createObjectMutations(customKey)
            } else {
              for (const type of arrayMutations) {
                this.createObjectMutations(customKey, type)
              }
            }
          }
        }
      } else {
        this.createBaseMutations(key, states[key])
      }
    }
  }

  createBaseMutations (key, value) {
    const { mutations } = this
    const KEY = key.toUpperCase()

    mutations[`SET_${KEY}`] = (state, payload) => {
      state[key] = payload
    }

    mutations[`RESET_${KEY}`] = (state) => {
      state[key] = value
    }

    if (value) {
      this.state[key] = value
    }
  }

  // ANCHOR - ARRAY
  createArrayMutations (key, type = null) {
    switch (type) {
      case 'pop': return this.createPop(key)
      case 'push': return this.createPush(key)
      case 'flat': return this.createFlat(key)
      case 'fill': return this.createFill(key)
      case 'slice': return this.createSlice(key)
      case 'shift': return this.createShift(key)
      case 'splice': return this.createSplice(key)
      case 'unshift': return this.createUnshift(key)

      default:
        this.createPop(key)
        this.createPush(key)
        this.createFlat(key)
        this.createFill(key)
        this.createSlice(key)
        this.createShift(key)
        this.createSplice(key)
        this.createUnshift(key)
        break
    }
  }

  createPush (key) {
    this.mutations[`PUSH_${key.toUpperCase()}`] = (state, payload) => {
      state[key].push(payload)
    }
  }

  createPop (key) {
    this.mutations[`POP_${key.toUpperCase()}`] = (state) => {
      state[key].pop()
    }
  }

  createSlice (key) {
    this.mutations[`SLICE_${key.toUpperCase()}`] = (state, payload) => {
      state[key].slice(payload.start, payload.end)
    }
  }

  createSplice (key) {
    this.mutations[`SPLICE_${key.toUpperCase()}`] = (state, payload) => {
      const _items = payload.items || undefined
      const items = Array.isArray(_items) ? _items : [_items]

      state[key].splice(payload.start, payload.deleteCount, ...items)
    }
  }

  createShift (key) {
    this.mutations[`SHIFT_${key.toUpperCase()}`] = (state) => {
      state[key].shift()
    }
  }

  createUnshift (key) {
    this.mutations[`UNSHIFT_${key.toUpperCase()}`] = (state, payload) => {
      const items = Array.isArray(payload) ? payload : [payload]
      state[key].unshift(...items)
    }
  }

  createFlat (key) {
    this.mutations[`FLAT_${key.toUpperCase()}`] = (state, payload) => {
      state[key].flat(payload)
    }
  }

  createFill (key) {
    this.mutations[`FILL_${key.toUpperCase()}`] = (state, payload) => {
      state[key].fill(payload.value, payload.start, payload.end)
    }
  }

  // ANCHOR - OBJECT
  createObjectMutations (key, type = null) {
    switch (type) {
      case 'add': return this.createAdd(key)
      case 'update': return this.createUpdate(key)
      case 'remove': return this.createRemove(key)

      default:
        this.createAdd(key)
        this.createUpdate(key)
        this.createRemove(key)
        break
    }
  }

  createAdd (key) {
    this.mutations[`ADD_${key.toUpperCase()}`] = (state, payload) => {
      state[key][payload.key] = payload.value
    }
  }

  createUpdate (key) {
    this.mutations[`UPDATE_${key.toUpperCase()}`] = (state, payload) => {
      state[key][payload.key] = payload.value
    }
  }

  createRemove (key) {
    this.mutations[`UPDATE_${key.toUpperCase()}`] = (state, payload) => {
      state[key][payload.key] = undefined
    }
  }

  setState (state, { key, value }) {
    if (typeof window !== 'undefined') {
      window.$nuxt.$set(state, key, value)
    } else {
      state[key] = value
    }
  }
}

module.exports = VuexGenerator