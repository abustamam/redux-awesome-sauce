import isEmpty from 'lodash/fp/isEmpty'
import isFunction from 'lodash/fp/isFunction'
import isObject from 'lodash/fp/isObject'
import isEqual from 'lodash/fp/isEqual'
import isArray from 'lodash/fp/isArray'
import join from 'lodash/fp/join'
import getOr from 'lodash/fp/getOr'
import keys from 'lodash/fp/keys'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import reduce from 'lodash/fp/reduce'
import anyPass from 'lodash/fp/anyPass'
import has from 'lodash/fp/has'
import merge from 'lodash/fp/merge'
import replace from 'lodash/fp/replace'
import toUpper from 'lodash/fp/toUpper'
import pick from 'lodash/fp/pick'
import zipObj from 'lodash/fp/zipObj'
import isNil from 'lodash/fp/isNil'
import trim from 'lodash/fp/trim'
import split from 'lodash/fp/split'
import fromPairs from 'lodash/fp/fromPairs'
import reject from 'lodash/fp/reject'
import set from 'lodash/fp/set'
import capitalize from 'lodash/fp/capitalize'
import { load } from 'redux-dataloader'

const reduceObjIndexed = reduce.convert({ cap: false })

export const DEFAULT = 'DEFAULT'

const defaultOptions = {
  prefix: '',
  useLoader: false,
}

const isNilOrEmpty = anyPass([isNil, isEmpty])

export const createTypes = (types, options = {}) => {
  if (isNilOrEmpty(types))
    throw new Error('valid types are required')

  const { prefix } = merge(defaultOptions, options)

  return flow(
    trim,
    split(/\s/),
    map(trim),
    reject(isNilOrEmpty),
    map(x => [x, prefix + x]),
    fromPairs,
  )(types)
}

export const createApiTypes = (
  types,
  options = defaultOptions,
) => {
  if (isNilOrEmpty(types))
    throw new Error('valid types are required')
  const { prefix } = options
  return flow(
    trim,
    split(/\s/),
    map(trim),
    reject(isNilOrEmpty),
    reduceObjIndexed((acc, x) => {
      const req = `${x}_REQUEST`
      const suc = `${x}_SUCCESS`
      const fail = `${x}_FAILURE`
      return flow(
        set(req, `${prefix}${req}`),
        set(suc, `${prefix}${suc}`),
        set(fail, `${prefix}${fail}`),
      )(acc)
    }, {}),
  )(types)
}

// matches on capital letters (except at the start & end of the string)
const RX_CAPS = /(?!^)([A-Z])/g

// converts a camelCaseWord into a SCREAMING_SNAKE_CASE word
const camelToScreamingSnake = flow(
  replace(RX_CAPS, '_$1'),
  toUpper,
)

// build Action Types out of an object
const convertToTypes = (config, options = defaultOptions) =>
  flow(
    keys, // just the keys
    map(camelToScreamingSnake), // CONVERT_THEM
    join(' '), // space separated
    types => createTypes(types, options), // make them into Redux Types
  )(config)

// build Action Types out of an object
const convertToApiTypes = (
  config,
  options = defaultOptions,
) =>
  flow(
    keys, // just the keys
    map(camelToScreamingSnake), // CONVERT_THEM
    join(' '), // space separated
    types => createApiTypes(types, options), // make them into Redux Types
  )(config)

// an action creator with additional properties
const createActionCreator = (
  name,
  extraPropNames,
  options,
) => {
  const { prefix } = merge(defaultOptions, options)
  // types are upcase and snakey
  const type = `${prefix}${camelToScreamingSnake(name)}`

  // do we need extra props for this?
  const noKeys =
    isNil(extraPropNames) || isEmpty(extraPropNames)

  // a type-only action creator
  if (noKeys) return () => ({ type })

  // an action creator with type + properties
  // "properties" is defined as an array of prop names
  if (isArray(extraPropNames)) {
    return (...values) => {
      const extraProps = zipObj(extraPropNames, values)
      return { type, payload: { ...extraProps } }
    }
  }

  // an action creator with type + properties
  // "properties" is defined as an object of {prop name: default value}
  if (isObject(extraPropNames)) {
    const defaultProps = extraPropNames
    return valueObject => {
      const providedProps = pick(
        keys(defaultProps),
        valueObject,
      )
      return {
        type,
        payload: { ...defaultProps, ...providedProps },
      }
    }
  }

  throw new Error(
    'action props must be a null/array/object/function',
  )
}

// an action creator with additional properties
const createApiActionCreator = (
  name,
  extraPropNames,
  options = defaultOptions,
  apiType,
) => {
  const { prefix, useLoader } = options
  // types are upcase and snakey
  const type = `${prefix}${camelToScreamingSnake(
    name + apiType,
  )}`

  const wrap = (useLoader && apiType === 'Request') ? load : x => x
  // do we need extra props for this?
  const noKeys =
    isNil(extraPropNames) || isEmpty(extraPropNames)

  // a type-only action creator
  if (noKeys) return () => wrap({ type })

  // an action creator with type + properties
  // "properties" is defined as an array of prop names
  if (isArray(extraPropNames)) {
    return (...values) => {
      const extraProps = zipObj(extraPropNames, values)
      return wrap({ type, payload: { ...extraProps } })
    }
  }

  // an action creator with type + properties
  // "properties" is defined as an object of {prop name: default value}
  if (isObject(extraPropNames)) {
    const defaultProps = extraPropNames
    return valueObject => {
      const providedProps = pick(
        keys(defaultProps),
        valueObject,
      )
      return {
        type,
        payload: { ...defaultProps, ...providedProps },
      }
    }
  }

  throw new Error(
    'action props must be a null/array/object/function',
  )
}

// build Action Creators out of an object
const convertToCreators = (config, options) =>
  reduceObjIndexed(
    (acc, val, key) => {
      if (isFunction(val)) {
        // the user brought their own action creator
        return set(key, val, acc)
      }
      // lets make an action creator for them!
      return set(
        key,
        createActionCreator(key, val, options),
        acc,
      )
    },
    {},
    config,
  )

const apiTypes = ['request', 'success', 'failure']

// build Action Creators out of an object
const convertToApiCreators = (
  config,
  options = defaultOptions,
) =>
  reduceObjIndexed(
    (acc, val, key) => {
      const vals = reduceObjIndexed(
        (acc, type) => {
          const fn = getOr(null, type, val)
          if (isFunction(fn)) {
            // the user brought their own action creator
            return set(type, fn, acc)
          }

          const ctor = createApiActionCreator(
            key,
            fn,
            options,
            capitalize(type),
          )
          return set(type, ctor, acc)
        },
        {},
        apiTypes,
      )

      const { request, success, failure } = vals
      return flow(
        set(`${key}Request`, request),
        set(`${key}Success`, success),
        set(`${key}Failure`, failure),
      )(acc)
      // lets make an action creator for them!
    },
    {},
    config,
  )

export const createActions = (config, options) => {
  if (isNil(config)) {
    throw new Error(
      'an object is required to setup types and creators',
    )
  }
  if (isEmpty(config)) {
    throw new Error('empty objects are not supported')
  }

  return {
    types: convertToTypes(config, options),
    creators: convertToCreators(config, options),
  }
}

export const createApiActions = (config, options) => {
  if (isNil(config)) {
    throw new Error(
      'an object is required to setup types and creators',
    )
  }
  if (isEmpty(config)) {
    throw new Error('empty objects are not supported')
  }

  return {
    types: convertToApiTypes(config, options),
    creators: convertToApiCreators(config, options),
  }
}

export const createReducer = (initialState, handlers) => {
  // initial state is required
  if (isNil(initialState)) {
    throw new Error('initial state is required')
  }

  // handlers must be an object
  if (isNil(handlers) || !isObject(handlers)) {
    throw new Error('handlers must be an object')
  }

  // handlers cannot have an undefined key
  if (
    anyPass([isNil, isEqual('undefined')])(keys(handlers))
  ) {
    throw new Error('handlers cannot have an undefined key')
  }

  // create the reducer function
  return (state = initialState, action) => {
    // wrong actions, just return state
    if (isNil(action)) return state
    if (!has('type', action)) return state

    // look for the handler
    const handler =
      handlers[action.type] || handlers[DEFAULT]

    // no handler no cry
    if (isNil(handler)) return state

    // execute the handler
    return handler(state, action)
  }
}
