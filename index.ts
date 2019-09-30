import { useMemo, useState, useCallback } from 'react'
import { Draft, produce } from 'immer'

const immox = Symbol('immox')
type Getter = { get: () => any; dependents: (string | number | symbol)[] }

export function useImmox<S = any>(
  initialValue: S | (() => S)
): [S, (f: (draft: Draft<S>) => void | S) => void]
export function useImmox(initialState: any) {
  useMemo(() => {
    const getters: Map<string, Getter> = new Map()
    const dependents: Set<string | number | symbol> = new Set()
    const proxy = new Proxy(initialState, {
      get: function(target, name) {
        dependents.add(name)
      },
    })
    let keys: string[] = Object.keys(initialState)
    if (!(Object.getPrototypeOf(initialState).constructor.name === 'Object')) {
      keys = [
        ...Object.keys(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(initialState))),
        ...Object.keys(initialState),
      ]
    }
    keys.forEach(prop => {
      const desc = Object.getOwnPropertyDescriptor(initialState, prop)
      if (desc && desc.get) {
        Object.defineProperty(initialState, prop, { value: desc.get.call(proxy) })
        getters.set(prop, { get: desc.get, dependents: Array.from(dependents) })
        dependents.clear()
      }
    })
    initialState[immox] = getters
  }, [])

  const [state, updateState] = useState(initialState)
  const updateDraft = useCallback(updater => {
    updateState(produce(updater))
  }, [])

  state[immox].forEach((value: Getter, prop: string) => {
    const dependents = value.dependents.map(dependent => state[dependent])
    //eslint-disable-next-line
    useMemo(() => {
      updateDraft((d: Draft<any>) => {
        d[prop] = value.get.call(d)
      })
      //eslint-disable-next-line
    }, dependents)
  })

  return [state, updateDraft]
}

export default useImmox
