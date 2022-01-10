import mMap from './mutation-map'
import { snakeToCamel } from './string'

class Axios {
  constructor () {
    this.endpoint = {}
  }
  
  /**
   * Api call fetch style using nuxt axios
   * --> will generate 3 mutations (PENDING, SUCCESS, FAILURE)
   *
   * @param {Function} commit
   * @param {Object} body - axios body
   * @param {String} type
   * @param {String} url
   *
   * @returns {Promise}
   */
  $apiCall (
    commit,
    {
      body,
      method,
      type = '',
      url = null
    }
  ) {
    const dataKey = type ? snakeToCamel(`data_${type}`) : false
    const loadingKey = type ? snakeToCamel(`loading_${type}`) : false
    const statusCodeKey = type ? snakeToCamel(`status_code_${type}`) : false
    
    let endpoint = url
    if (!url) {
      endpoint = type ? this.endpoint[type] : this.endpoint.base
    }
    
    commit(mMap(type).PENDING, {
      loadingKey,
      loading: true
    })
  
    return new Promise((resolve, reject) => {
      window.$nuxt.$axios[`$${method}`](endpoint, body)
        .then((response) => {
          const { data, code: statusCode } = response
  
          commit(mMap(type).SUCCESS, {
            data,
            dataKey,
            statusCode,
            statusCodeKey,
            loadingKey
          })
  
          resolve(response)
        })
        .catch((error) => {
          const { code: statusCode } = error.response.data.error
  
          commit(mMap(type).FAILURE, {
            statusCode,
            statusCodeKey,
            loadingKey
          })
  
          reject(error)
        })
    })
  }
  
  /**
   *
   * @param {Object} param0 - Vuex context
   * @param {Object} param1 - For axios
   * NOTE -- method value must be non fetch style ex: post, get, put etc (without $)
   *
   * @returns {Promise}
   */
  apiCall  (
    commit,
    {
      body,
      method,
      type = '',
      url = null
    }
  ) {}
}

module.exports = Axios
