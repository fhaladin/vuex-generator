# Vuex Generator
Facing some problems like :

- State management using vuex is really hard?
- Tired to make so many mutations?
- Need to make your state management code cleaner?

Probably this package will help you.


## Features
This package came out with some features :
- Asynchronous handler
- Non-Asynchronous handler
- Multiple Asynchronous handler in each module
- State with Array & Object data type handler
- Auto generate mutations
- Running well on Vue Dev Tools


## Installation
Install @fhaladin/vuex-generator with npm

```bash
  npm install @fhaladin/vuex-generator
```

with yarn
```bash
  yarn add @fhaladin/vuex-generator
```  

## Usage/Examples
Follow this step to use this package on your project.

1. **Tell nuxt to use vuex**
Create `index.html` inside `/store` folder.

2. **Create vuex module**
Create module file inside `/store` folder.
You can use whatever name you want for every module according to your project.

ex: `/store/<module-name>.js`

```javascript
import VuexGenerator from '@fhaladin/vuex-generator'

const <module-name> = new VuexGenerator()

<module-name>.createAsync(<your-api-endpoint>)
<module-name>.createAsync({
  endpoint: <your-another-api-endpoint>,
  type: 'detail'
})

export const state = () => <module-name>.state
export const mutations = <module-name>.mutations

export const actions = {
  get ({ commit }) {
    return <module-name>.axios.$apiCall(commit, {
      method: 'get' 
    })
  },
  getDetail ({ commit }) {
    return <module-name>.axios.$apiCall(commit, {
      type: 'detail',
      method: 'get'
    })
  }
}
```
Every `<module-name>.createAsync` will generate 3 mutations (PENDING, SUCCESS & FAILURE).

If the type is applicable, mutations will have suffix based on the type.


## Non-Asynchronous Usage
Instead of using `createAsync` you can use `createNonAsync` to handle Non-Asynchronous state.

```Javascript
<module-name>.createNonAsync({
  hobbies: ['draw', 'play'],
  address: {},
  height: 200,
  custom () {
    return {
      subjects: {
        default: ['Math', 'Physics'],
        arrayMutations: true
      }
    }
  }
})
```

`createNonAsync` will generate 2 mutations (SET & RESET).

If you use custom, you can generate mutations for handle state with data type Array or Object.

- arrayMutations (POP, PUSH, FLAT, FILL, SLICE, SHIFT, SPLICE, UNSHIFT)
- objecMutations (ADD, UPDATE, REMOVE)

You can set true to generate all mutations or set array of mutations that you need to generate like this :

```Javascript
  custom () {
    return {
      subjects: {
        default: ['Math', 'Physics'],
        arrayMutations: ['push', 'pop', 'slice']
      }
    }
  }
```

## Documentation
[Soon](https://)


## Change Log
See [CHANGELOG.md.](https://github.com/fhaladin/vuex-generator/blob/master/CHANGELOG.md)


## Authors
- [@fhaladin](https://www.github.com/fhaladin)


## Support
For support, email farhan.nif.alaudin@gmail.com.


## License
[MIT](https://choosealicense.com/licenses/mit/)
