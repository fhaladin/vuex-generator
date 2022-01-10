export default (_type) => {
  const type = _type ? `_${_type}`.toUpperCase() : ''

  return {
    PENDING: `PENDING${type}`,
    SUCCESS: `SUCCESS${type}`,
    FAILURE: `FAILURE${type}`
  }
}
