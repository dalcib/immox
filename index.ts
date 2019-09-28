import { useMemo, useState, useCallback } from 'react'
import { Draft, produce } from 'immer'

export function useImmox<S = any>(
  initialValue: S | (() => S)
): [S, (f: (draft: Draft<S>) => void | S) => void]
export function useImmox(initialState: any) {
  const depends: Set<string | number | symbol> = new Set()
  const clonedState = {}
  const getters: Map<string, { get: () => any; depends: (string | number | symbol)[] }> = new Map()
  const proxy = new Proxy(initialState, {
    get: function(target, name) {
      depends.add(name)
    },
  })
  let keys: string[] = []
  let obj = {}
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

  const [state, updateState] = useState(clonedState)
  const updateDraft = useCallback(updater => {
    updateState(produce(updater))
  }, [])

  getters.forEach((value, prop) => {
    const depends = value.depends.map(depend => state[depend])
    //eslint-disable-next-line
    useMemo(() => {
      updateDraft((d: Draft<any>) => {
        d[prop] = value.get.call(d)
      })
      //eslint-disable-next-line
    }, depends)
  })

  return [state, updateDraft]
}

export default useImmox
