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
   * @param {Object} config - axios config
   * @param {String} type
   * @param {String} url
   *
   * @returns {Promise}
   */
  $apiCall (
    commit,
    {
      config,
      method,
      type = '',
      dataSource = '',
      url = null,
      fetch = true
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
      window.$nuxt.$axios[`$${method}`](endpoint, config)
        .then((response) => {
          const statusCode = 200

          let data = dataSource ? response[dataSource] : response
          if (!fetch) {
            data = []
          }
  
          commit(mMap(type).SUCCESS, {
            fetch,
            data,
            dataKey,
            statusCode,
            statusCodeKey,
            loadingKey
          })
  
          resolve(response)
        })
        .catch((error) => {
          const { status: statusCode } = error.response
  
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
   apiCall (
    commit,
    {
      config,
      method,
      type = '',
      dataSource = '',
      url = null,
      fetch = true
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
      window.$nuxt.$axios[`${method}`](endpoint, config)
        .then((response) => {
          const { data: _data, status: statusCode } = response
          
          let data = dataSource ? _data[dataSource] : _data
          if (!fetch) {
            data = []
          }
  
          commit(mMap(type).SUCCESS, {
            fetch,
            data,
            dataKey,
            statusCode,
            statusCodeKey,
            loadingKey
          })
  
          resolve(response)
        })
        .catch((error) => {
          const { status: statusCode } = error.response
  
          commit(mMap(type).FAILURE, {
            statusCode,
            statusCodeKey,
            loadingKey
          })
  
          reject(error)
        })
    })
  }
}

module.exports = Axios
