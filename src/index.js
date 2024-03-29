import { sprintf } from 'sprintf-js'
import { constantCase } from 'constant-case'

const objectPath = require('object-path')

class VuexGenerator {
  constructor () {
    this.state = {}
    this.mutations = {}
    this.actions = {}
  }

  createState (states) {
    for (const key in states) {
      const { mutations } = this
      const KEY = constantCase(key)

      mutations[`SET_${KEY}`] = (state, payload) => {
        state[key] = payload
      }

      mutations[`RESET_${KEY}`] = (state) => {
        state[key] = states[key]
      }

      this.state[key] = states[key]
    }
  }

  async createAsync (name, {
    axios,
    endpoint,
    context,
    payload = {},
    state = '',
    fetch = false,
    cached = false,
    source = null,
    method = 'get',
    loadingDefault = false
  }) {
    const { commit, state: vuexState } = context

    const refresh = !!payload.refresh
    const sprintfData = payload.sprintfData || null
    const payloadData = payload.data || {}
    const config = payload.config || {}

    const trueEndpoint = sprintfData ? sprintf(endpoint, sprintfData) : endpoint

    const loadingKey = state ? `${state}Loading` : 'loading'
    const statusCodeKey = state ? `${state}StatusCode` : 'statusCode'
    const stateKey = state ? `${state}` : 'data'

    this.state[loadingKey] = loadingDefault

    if (!refresh) {
      const data = vuexState[stateKey]

      // Array
      if (Array.isArray(data)) {
        if (cached && data.length > 0) {
          return
        }
      }

      // Object
      if (cached && typeof data === 'object' && data !== null) {
        if (cached && Object.keys(data).length > 0) {
          return
        }
      }
    }

    commit(MUTATION_MAP(name).PENDING, {
      loadingKey,
      loading: true
    })

    try {
      const axiosArguments = method === 'get'
        ? [trueEndpoint, config]
        : [trueEndpoint, payloadData, config]

      const response = await axios[method](...axiosArguments)
      const data = source ? objectPath.get(response, source) : response.data

      commit(MUTATION_MAP(name).SUCCESS, {
        fetch,
        statusCodeKey,
        statusCode: response.status,
        stateKey,
        loadingKey,
        data
      })

      return response
    } catch (error) {
      commit(MUTATION_MAP(name).FAILURE, {
        loadingKey,
        statusCodeKey,
        statusCode: error.response.status
      })

      throw error
    }
  }

  generateAsyncMutations (name, state = null) {
    const mutations = {}

    const loadingKey = state ? `${state}Loading` : 'loading'
    const stateKey = state ? `${state}Data` : 'data'
    const arrStateKey = constantCase(stateKey).split('_')

    if (arrStateKey.length > 1) {
      arrStateKey.pop()
    }

    const normalizedStateKey = arrStateKey.join('_')

    mutations[`RESET_${normalizedStateKey}`] = (state) => {
      state[stateKey] = null
    }

    mutations[`SET_LOADING_${normalizedStateKey}`] = (state, payload) => {
      state[loadingKey || 'loading'] = payload
    }

    mutations[MUTATION_MAP(name).PENDING] = (state, payload) => {
      state[payload.loadingKey || 'loading'] = true
    }

    mutations[MUTATION_MAP(name).SUCCESS] = (state, payload) => {
      if (payload.fetch) {
        state[payload.stateKey || 'data'] = payload.data
      }

      state[payload.statusCodeKey || 'statusCode'] = payload.statusCode
      state[payload.loadingKey || 'loading'] = false
    }

    mutations[MUTATION_MAP(name).FAILURE] = (state, payload) => {
      state[payload.statusCodeKey || 'statusCode'] = payload.statusCode
      state[payload.loadingKey || 'loading'] = false
    }

    return mutations
  }
}

const MUTATION_MAP = (type) => {
  const _type = type ? `${constantCase(type)}_` : ''

  return {
    PENDING: `${_type}PENDING`,
    SUCCESS: `${_type}SUCCESS`,
    FAILURE: `${_type}FAILURE`
  }
}

export default VuexGenerator
