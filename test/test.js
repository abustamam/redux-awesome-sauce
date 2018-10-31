import keys from 'lodash/fp/keys'
import values from 'lodash/fp/values'
import {
  createActions,
  createApiActions,
  createApiTypes,
  createReducer,
  createTypes,
  DEFAULT,
} from './../lib'

describe('Create Actions', () => {
  it('throws an error if passed crap', () => {
    expect(() => createActions(null)).toThrow(
      'an object is required to setup types and creators',
    )
    expect(() => createActions()).toThrow(
      'an object is required to setup types and creators',
    )
    expect(() => createActions({})).toThrow(
      'empty objects are not supported',
    )
  })

  it('has creators and types', () => {
    const { creators, types } = createActions({ one: null })
    expect(creators).toBeTruthy()
    expect(types).toBeTruthy()
  })

  it('types are snake case', () => {
    const { types } = createActions({ helloWorld: null })
    expect(types.HELLO_WORLD).toBe('HELLO_WORLD')
  })

  it('null produces a type-only action creator', () => {
    const { creators } = createActions({ helloWorld: null })
    expect(creators.helloWorld).toBeInstanceOf(Function)
    expect(creators.helloWorld()).toEqual({
      type: 'HELLO_WORLD',
    })
  })

  it('[] produces a type-only action creator', () => {
    const { creators } = createActions({ helloWorld: [] })
    expect(creators.helloWorld).toBeInstanceOf(Function)
    expect(creators.helloWorld()).toEqual({
      type: 'HELLO_WORLD',
    })
  })

  it("['steve'] produces a valid action creator", () => {
    const { creators } = createActions({
      helloWorld: ['steve'],
    })
    expect(creators.helloWorld).toBeInstanceOf(Function)
    expect(creators.helloWorld('hi')).toEqual({
      type: 'HELLO_WORLD',
      payload: {
        steve: 'hi',
      },
    })
  })

  it('{} produces a type-only action creator', () => {
    const { creators } = createActions({ helloWorld: {} })
    expect(creators.helloWorld).toBeInstanceOf(Function)
    expect(creators.helloWorld()).toEqual({
      type: 'HELLO_WORLD',
    })
  })

  it('{"foo": 1, "bar": 2} produces a valid action creator', () => {
    const { creators } = createActions({
      helloWorld: { foo: 10, bar: 2 },
    })
    expect(creators.helloWorld).toBeInstanceOf(Function)
    expect(
      creators.helloWorld({ foo: 10, foobar: 2 }),
    ).toEqual({
      type: 'HELLO_WORLD',
      payload: {
        foo: 10,
        bar: 2,
      },
    })
  })

  it('custom action creators are supported', () => {
    const { creators } = createActions({
      custom: () => 123,
    })
    expect(creators.custom()).toBe(123)
  })

  it('action types prefix is supported', () => {
    const { types, creators } = createActions(
      { helloWorld: null },
      { prefix: 'SUPER_' },
    )
    expect(types.HELLO_WORLD).toBe('SUPER_HELLO_WORLD')
    expect('SUPER_HELLO_WORLD').toBe(
      creators.helloWorld().type,
    )
  })
})

describe('Create Api Actions', () => {
  it('throws an error if passed crap', () => {
    expect(() => createApiActions(null)).toThrow(
      'an object is required to setup types and creators',
    )
    expect(() => createApiActions()).toThrow(
      'an object is required to setup types and creators',
    )
    expect(() => createApiActions({})).toThrow(
      'empty objects are not supported',
    )
  })

  it('has creators and types', () => {
    const { creators, types } = createApiActions({
      one: null,
    })
    expect(creators).toBeTruthy()
    expect(types).toBeTruthy()
  })

  it('types are snake case', () => {
    const { types } = createApiActions({ helloWorld: null })
    expect(types.HELLO_WORLD_REQUEST).toBe(
      'HELLO_WORLD_REQUEST',
    )
    expect(types.HELLO_WORLD_SUCCESS).toBe(
      'HELLO_WORLD_SUCCESS',
    )
    expect(types.HELLO_WORLD_FAILURE).toBe(
      'HELLO_WORLD_FAILURE',
    )
  })

  it('null produces a type-only action creator', () => {
    const { creators } = createApiActions({
      helloWorld: null,
    })
    expect(creators.helloWorldRequest).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldSuccess).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldFailure).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldRequest()).toEqual({
      type: 'HELLO_WORLD_REQUEST',
    })
    expect(creators.helloWorldSuccess()).toEqual({
      type: 'HELLO_WORLD_SUCCESS',
    })
    expect(creators.helloWorldFailure()).toEqual({
      type: 'HELLO_WORLD_FAILURE',
    })
  })

  it('[] produces a type-only action creator', () => {
    const { creators } = createApiActions({
      helloWorld: [],
    })
    expect(creators.helloWorldRequest).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldSuccess).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldFailure).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldRequest()).toEqual({
      type: 'HELLO_WORLD_REQUEST',
    })
    expect(creators.helloWorldSuccess()).toEqual({
      type: 'HELLO_WORLD_SUCCESS',
    })
    expect(creators.helloWorldFailure()).toEqual({
      type: 'HELLO_WORLD_FAILURE',
    })
  })

  it("['steve'] produces a valid action creator", () => {
    const { creators } = createApiActions({
      helloWorld: {
        request: ['steve'],
        success: ['mike'],
        failure: ['peeve'],
      },
    })
    expect(creators.helloWorldRequest).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldSuccess).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldFailure).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldRequest('hi')).toEqual({
      type: 'HELLO_WORLD_REQUEST',
      payload: {
        steve: 'hi',
      },
    })
    expect(creators.helloWorldSuccess('hi')).toEqual({
      type: 'HELLO_WORLD_SUCCESS',
      payload: {
        mike: 'hi',
      },
    })
    expect(creators.helloWorldFailure('hi')).toEqual({
      type: 'HELLO_WORLD_FAILURE',
      payload: {
        peeve: 'hi',
      },
    })
  })

  it('{} produces a type-only action creator', () => {
    const { creators } = createApiActions({
      helloWorld: {},
    })

    expect(creators.helloWorldRequest).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldSuccess).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldFailure).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldRequest()).toEqual({
      type: 'HELLO_WORLD_REQUEST',
    })
    expect(creators.helloWorldSuccess()).toEqual({
      type: 'HELLO_WORLD_SUCCESS',
    })
    expect(creators.helloWorldFailure()).toEqual({
      type: 'HELLO_WORLD_FAILURE',
    })
  })

  it('{"foo": 1, "bar": 2} produces a valid action creator', () => {
    const { creators } = createApiActions({
      helloWorld: {
        request: { foo: 10, bar: 2 },
        success: { foo: 15, bar: 4 },
        failure: { foo: 20, bar: 6 },
      },
    })
    expect(creators.helloWorldRequest).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldSuccess).toBeInstanceOf(
      Function,
    )
    expect(creators.helloWorldFailure).toBeInstanceOf(
      Function,
    )
    expect(
      creators.helloWorldRequest({ foo: 1, foobar: 2 }),
    ).toEqual({
      type: 'HELLO_WORLD_REQUEST',
      payload: {
        foo: 1,
        bar: 2,
      },
    })
    expect(
      creators.helloWorldSuccess({ foo: 11, foobar: 4 }),
    ).toEqual({
      type: 'HELLO_WORLD_SUCCESS',
      payload: {
        foo: 11,
        bar: 4,
      },
    })
    expect(
      creators.helloWorldFailure({ foo: 101, foobar: 2 }),
    ).toEqual({
      type: 'HELLO_WORLD_FAILURE',
      payload: {
        foo: 101,
        bar: 6,
      },
    })
  })

  it('custom action creators are supported', () => {
    const { creators } = createApiActions({
      custom: {
        request: () => 123,
        success: () => 234,
        failure: () => 345,
      },
    })
    expect(creators.customRequest()).toBe(123)
    expect(creators.customSuccess()).toBe(234)
    expect(creators.customFailure()).toBe(345)
  })

  it('mixed action creators are supported', () => {
    const { creators } = createApiActions({
      custom: {
        request: ['x'],
        success: () => 234,
        failure: () => 345,
      },
    })
    expect(creators.customRequest('foo'))
      .toEqual(({ type: 'CUSTOM_REQUEST', payload: { x: 'foo' } }))
    expect(creators.customSuccess()).toBe(234)
    expect(creators.customFailure()).toBe(345)
  })

  it('action types prefix is supported', () => {
    const { types, creators } = createApiActions(
      { helloWorld: null },
      { prefix: 'SUPER_' },
    )
    expect(types.HELLO_WORLD_REQUEST).toBe(
      'SUPER_HELLO_WORLD_REQUEST',
    )
    expect(types.HELLO_WORLD_SUCCESS).toBe(
      'SUPER_HELLO_WORLD_SUCCESS',
    )
    expect(types.HELLO_WORLD_FAILURE).toBe(
      'SUPER_HELLO_WORLD_FAILURE',
    )
    expect('SUPER_HELLO_WORLD_REQUEST').toBe(
      creators.helloWorldRequest().type,
    )
    expect('SUPER_HELLO_WORLD_SUCCESS').toBe(
      creators.helloWorldSuccess().type,
    )
    expect('SUPER_HELLO_WORLD_FAILURE').toBe(
      creators.helloWorldFailure().type,
    )
  })
})

describe('Create Reducer', () => {
  it('throws an error when initial state is missing', () => {
    expect(() => createReducer(null)).toThrow()
    expect(() => createReducer()).toThrow()
  })

  it('throws an error when the handlers are not an object', () => {
    expect(() => createReducer(1, 0)).toThrow()
    expect(() => createReducer(1, null)).toThrow()
    expect(() => createReducer(1)).toThrow()
  })

  // it('throws an error when the handlers have an undefined key', () => {
  //   const a = state => state
  //   expect(() => createReducer(1, { [undefined]: a })).toThrow()
  //   expect(() => createReducer(1, { undefined: a })).toThrow()
  // })

  it('creates a reducer function', () => {
    expect(createReducer(1, {})).toBeTruthy()
  })

  it('dodges the wrong actions', () => {
    const a = state => state + 1
    const r = createReducer(0, { hi: a })
    const v = r(5, { type: 'wrong' })
    expect(v).toBe(5)
  })

  it('dodges null actions', () => {
    const a = state => state + 1
    const r = createReducer(0, { hi: a })
    const v = r(5, null)
    expect(v).toBe(5)
  })

  it('dodges actions with no type', () => {
    const a = state => state + 1
    const r = createReducer(0, { hi: a })
    const v = r(5, { bad: 'type' })
    expect(v).toBe(5)
  })

  it('invokes the correct actions', () => {
    const i = 5
    const a = state => state + 1
    const r = createReducer(i, { hi: a })
    const v = r(i, { type: 'hi' })
    expect(v).toBe(6)
  })

  it('falls down to default handler', () => {
    const i = 5
    const a = state => state + 1
    const b = state => state + 2
    const r = createReducer(i, { hi: a, [DEFAULT]: b })
    const v1 = r(i, { type: 'hi' })
    expect(v1).toBe(6)
    const v2 = r(i, { type: 'unknown action' })
    expect(v2).toBe(7)
  })

  it('invokes the correct action on an object', () => {
    const i = { i: 5 }
    const a = state => ({ i: state.i + 1 })
    const r = createReducer(i, { hi: a })
    const v = r(i, { type: 'hi' })
    expect(v).toEqual({ i: 6 })
  })
})

describe('Create types', () => {
  it('responds with violence if not passed a string', () => {
    expect(() => createTypes()).toThrow()
  })

  it('creates an object when passed a string', () => {
    const types = createTypes('one')
    expect(types).toBeTruthy()
    expect(types).toBeInstanceOf(Object)
  })

  it('creates an object with the right keys and values', () => {
    const types = createTypes('one')
    const k = keys(types)
    const v = values(types)
    expect(k[0]).toBe('one')
    expect(v[0]).toBe('one')
  })

  it('handles the prefix option', () => {
    const types = createTypes('one', {
      prefix: 'SUPER_',
    })
    const k = keys(types)
    const v = values(types)
    expect(k[0]).toBe('one')
    expect(v[0]).toBe('SUPER_one')
  })

  it('handles space delimited', () => {
    const types = createTypes('one two three')
    const k = keys(types)
    const v = values(types)
    expect(k.length).toBe(3)
    expect(k[2]).toBe('three')
    expect(v[2]).toBe('three')
  })

  it('handles multiple space delimiters', () => {
    const types = createTypes('one two     three')
    const k = keys(types)
    const v = values(types)
    expect(k.length).toBe(3)
    expect(k[2]).toBe('three')
    expect(v[2]).toBe('three')
  })

  it('handles multiple tab delimiters', () => {
    const types = createTypes('one two\t\t\t\tthree')
    const k = keys(types)
    const v = values(types)
    expect(k.length).toBe(3)
    expect(k[2]).toBe('three')
    expect(v[2]).toBe('three')
  })

  it('handles multiple <CR> delimiters', () => {
    const types = createTypes(`
    ONE
    2
    THREE
  `)
    const k = keys(types)
    const v = values(types)
    expect(k.length).toBe(3)
    expect(k[2]).toBe('THREE')
    expect(v[2]).toBe('THREE')
  })
})

describe('Create Api types', () => {
  it('responds with violence if not passed a string', () => {
    expect(() => createApiTypes()).toThrow()
  })

  it('creates an object when passed a string', () => {
    const types = createApiTypes('one')
    expect(types).toBeTruthy()
    expect(types).toBeInstanceOf(Object)
  })

  it('creates an object with the right keys and values', () => {
    const types = createApiTypes('one')
    const [reqK, sucK, failK] = keys(types)
    const [reqV, sucV, failV] = values(types)
    expect(reqK).toBe('one_REQUEST')
    expect(sucK).toBe('one_SUCCESS')
    expect(failK).toBe('one_FAILURE')
    expect(reqV).toBe('one_REQUEST')
    expect(sucV).toBe('one_SUCCESS')
    expect(failV).toBe('one_FAILURE')
  })

  it('handles the prefix option', () => {
    const types = createApiTypes('one', {
      prefix: 'SUPER_',
    })
    const [reqK, sucK, failK] = keys(types)
    const [reqV, sucV, failV] = values(types)
    expect(reqK).toBe('one_REQUEST')
    expect(sucK).toBe('one_SUCCESS')
    expect(failK).toBe('one_FAILURE')
    expect(reqV).toBe('SUPER_one_REQUEST')
    expect(sucV).toBe('SUPER_one_SUCCESS')
    expect(failV).toBe('SUPER_one_FAILURE')
  })

  it('handles space delimited', () => {
    const types = createApiTypes('one two three')
    const k = keys(types)
    const [, , , , , , thirdReqK, thirdSucK, thirdFailK] = k
    const [
      ,
      ,
      ,
      ,
      ,
      ,
      thirdReqV,
      thirdSucV,
      thirdFailV,
    ] = values(types)
    expect(k.length).toBe(9)
    expect(thirdReqK).toBe('three_REQUEST')
    expect(thirdSucK).toBe('three_SUCCESS')
    expect(thirdFailK).toBe('three_FAILURE')
    expect(thirdReqV).toBe('three_REQUEST')
    expect(thirdSucV).toBe('three_SUCCESS')
    expect(thirdFailV).toBe('three_FAILURE')
  })

  it('handles multiple space delimiters', () => {
    const types = createApiTypes('one two     three')
    const k = keys(types)
    const [, , , , , , thirdReqK, thirdSucK, thirdFailK] = k
    const [
      ,
      ,
      ,
      ,
      ,
      ,
      thirdReqV,
      thirdSucV,
      thirdFailV,
    ] = values(types)
    expect(k.length).toBe(9)
    expect(thirdReqK).toBe('three_REQUEST')
    expect(thirdSucK).toBe('three_SUCCESS')
    expect(thirdFailK).toBe('three_FAILURE')
    expect(thirdReqV).toBe('three_REQUEST')
    expect(thirdSucV).toBe('three_SUCCESS')
    expect(thirdFailV).toBe('three_FAILURE')
  })

  it('handles multiple tab delimiters', () => {
    const types = createApiTypes('one two\t\t\t\tthree')
    const k = keys(types)
    const [, , , , , , thirdReqK, thirdSucK, thirdFailK] = k
    const [
      ,
      ,
      ,
      ,
      ,
      ,
      thirdReqV,
      thirdSucV,
      thirdFailV,
    ] = values(types)
    expect(k.length).toBe(9)
    expect(thirdReqK).toBe('three_REQUEST')
    expect(thirdSucK).toBe('three_SUCCESS')
    expect(thirdFailK).toBe('three_FAILURE')
    expect(thirdReqV).toBe('three_REQUEST')
    expect(thirdSucV).toBe('three_SUCCESS')
    expect(thirdFailV).toBe('three_FAILURE')
  })

  it('handles multiple <CR> delimiters', () => {
    const types = createApiTypes(`
    ONE
    2
    THREE
  `)
    const k = keys(types)
    const [, , , , , , thirdReqK, thirdSucK, thirdFailK] = k
    const [
      ,
      ,
      ,
      ,
      ,
      ,
      thirdReqV,
      thirdSucV,
      thirdFailV,
    ] = values(types)
    expect(k.length).toBe(9)
    expect(thirdReqK).toBe('THREE_REQUEST')
    expect(thirdSucK).toBe('THREE_SUCCESS')
    expect(thirdFailK).toBe('THREE_FAILURE')
    expect(thirdReqV).toBe('THREE_REQUEST')
    expect(thirdSucV).toBe('THREE_SUCCESS')
    expect(thirdFailV).toBe('THREE_FAILURE')
  })
})
