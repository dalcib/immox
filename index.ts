import { useMemo } from 'react'
//import { immerable } from 'immer'
import { useImmer } from 'use-immer'

export function useImmox<State extends object>(initialState: State) {
  const depends: Set<string | number | symbol> = new Set()
  const clonedState = {
    /* [immerable]: true */
  } as State
  const getters: Map<string, { get: () => any; depends: (string | number | symbol)[] }> = new Map()
  const proxy = new Proxy(initialState, {
    get: function(target, name) {
      depends.add(name)
    },
  })
  let keys: string[] = []
  let obj: State | object = {}
  if (Object.getPrototypeOf(initialState).constructor.name === 'Object') {
    keys = Object.keys(initialState)
    obj = initialState
  } else {
    keys = [
      ...Object.keys(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(initialState))),
      ...Object.keys(initialState),
    ]
    obj = Object.getPrototypeOf(initialState)
  }
  keys.forEach(prop => {
    const desc = Object.getOwnPropertyDescriptor(obj, prop)
    if (desc && desc.get) {
      clonedState[prop] = desc.get.call(proxy)
      getters.set(prop, { get: desc.get, depends: Array.from(depends) })
      depends.clear()
    } else {
      clonedState[prop] = initialState[prop]
    }
  })

  const [state, updateState] = useImmer<State>(clonedState)

  getters.forEach((value, prop) => {
    const depends = value.depends.map(depend => state[depend])
    //eslint-disable-next-line
    useMemo(() => {
      updateState(d => {
        d[prop] = value.get.call(d)
      })
      //eslint-disable-next-line
    }, depends)
  })

  return [state, updateState]
}

export default useImmox
