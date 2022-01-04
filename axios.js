import mMap from './mutation-map'
import { snakeToCamel } from './string'

/**
 *
 * @param {Object} param0 - Vuex context
 * @param {Object} param1 - For axios
 * NOTE -- method value must be fetch style ex: $post, $get, $put etc (with $)
 *
 * @returns {Promise}
 */
const $apiCall = (
  { commit },
  { method, endpoint, body, type = '' }
) => {
  const dataKey = type ? snakeToCamel(`data_${type}`) : false
  const loadingKey = type ? snakeToCamel(`loading_${type}`) : false

  commit(mMap(type).PENDING, {
    loadingKey,
    loading: true
  })

  return new Promise((resolve, reject) => {
    window.$nuxt.$axios[method](endpoint, body)
      .then((response) => {
        const { data, code: statusCode } = response

        commit(mMap(type).SUCCESS, {
          data,
          statusCode,
          dataKey
        })

        commit(mMap(type).PENDING, {
          loadingKey,
          loading: false
        })

        resolve(response)
      })
      .catch((error) => {
        const { code: statusCode } = error.response

        commit(mMap(type).FAILURE, { statusCode })
        commit(mMap(type).PENDING, {
          loadingKey,
          loading: false
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
const apiCall = (
  { commit },
  { method, endpoint, body, type = '' }
) => {}

export { $apiCall, apiCall }
