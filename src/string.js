const snakeToCamel = (str) => {
  const strArr = str.split('_')
  const strCamel = strArr
    .map((str, idx) => {
      return idx !== 0 ? capitalizeFirstLetter(str) : str
    })
    .join('')

  return strCamel
}

const camelToSnake = (str) => {
  const strArr = str.match(/[A-Z][a-z]+/g)
  const strSnake = strArr
    .map(str => str.toLowerCase())
    .join('_')

  return strSnake
}

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export { snakeToCamel, camelToSnake, capitalizeFirstLetter }
