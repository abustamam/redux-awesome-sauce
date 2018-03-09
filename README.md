## Redux Helpers

This is a basic port of https://github.com/infinitered/reduxsauce

Most of the original documentation stands, with a few differences, as can be seen in this code example:

```js
// Added `createApiActions`
import {
  createActions,
  createApiActions,
} from 'redux-awesome-sauce'

// I've opted to lowercase `types` and `creators`...
const { types, creators } = createActions(
  {
    logout: ['user'],
    requestWithDefaultValues: {
      username: 'guest',
      password: null,
    },
    custom: (a, b) => ({ type: 'CUSTOM', total: a + b }),
  },
  {}, // options - the 2nd parameter is optional
)

// For better or for worse, arguments are nested under `payload`:
const { logout } = creators

logout('abustamam') // { type: 'LOGOUT', payload: { user: 'abustamam '}}

// Using `createApiActions`:

const {
  types: apiTypes,
  creators: apiCreators,
} = createApiActions({
  login: {
    request: ['user', 'password'],
    success: ['response'],
    failure: ['error'],
  },
})

const {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} = apiTypes
const {
  loginRequest,
  loginSuccess,
  loginFailure,
} = apiCreators
loginRequest('abustamam', 'foobar')
// {
//   type: 'LOGIN_REQUEST',
//   payload: { user: 'abustamam', password: 'foobar' }
// }
```

Those are the additions I made, and it makes working with redux sagas a lot simpler.
