import { constantCase } from 'constant-case'

export default (_type) => {
  const type = _type ? `_${constantCase(_type)}` : ''

  return {
    PENDING: `PENDING${type}`,
    SUCCESS: `SUCCESS${type}`,
    FAILURE: `FAILURE${type}`
  }
}
