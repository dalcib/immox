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
    let initialStateProto = initialState
    let tyoeObject = 'Literal'
    if (!(Object.getPrototypeOf(initialState).constructor.name === 'Object')) {
      keys = [
        ...Object.keys(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(initialState))),
        ...Object.keys(initialState),
      ]
      initialStateProto = Object.getPrototypeOf(initialState)
      tyoeObject = 'Class'
    }
    //console.log(Object.getOwnPropertyDescriptors(initialState))
    keys.forEach(prop => {
      const desc = Object.getOwnPropertyDescriptor(initialState, prop)
      if (desc && desc.get) {
        Object.defineProperty(initialState, prop, { value: desc.get.call(proxy) })
        getters.set(prop, { get: desc.get, dependents: Array.from(dependents) })
        dependents.clear()
      }
      if (desc && typeof desc.value === 'function' && prop !== 'constructor') {
        const method = function producer(...args: any) {
          console.log('producer')
          return produce(initialState, (draft: any) => {
            //console.log(desc.value.toString(), args)
            desc.value.apply(draft, args)
          })
        }
        //const object = Object.getPrototypeOf(initialState) || initialState
        Object.defineProperty(initialStateProto, prop /* + 'a' */, {
          value: method,
          ...desc,
        })
        if (prop === 'add') {
          console.log(
            /* initialState[prop].toString() */
            prop,
            Object.getOwnPropertyDescriptor(initialState, prop),
            '###############',
            tyoeObject
          )
        }
      }
    })
    initialState[immox] = getters
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [state, updateState] = useState(initialState)
  const updateDraft = useCallback(updater => {
    updateState(produce(updater))
  }, [])

  state[immox].forEach((value: Getter, prop: string) => {
    const dependents = value.dependents.map(dependent => state[dependent])
    //eslint-disable-next-line react-hooks/rules-of-hooks
    useMemo(() => {
      updateDraft((d: Draft<any>) => {
        d[prop] = value.get.call(d)
      })
      //eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependents)
  })

  return [state, updateDraft]
}

export default useImmox

type SetState = <S = any>(f: (draft: Draft<S>) => void | S) => void
export { Draft, SetState }
