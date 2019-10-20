import { useMemo, useState, useCallback } from 'react'
import { Draft, produce, immerable } from 'immer'

const immox = Symbol('immox')
type Getter = { get: () => any; dependents: (string | number | symbol)[] }

export function useImmox<S = any>(
  initialValue: S | (() => S)
): [S, (f: (draft: Draft<S>) => void | S) => void]
export function useImmox(initialState: any) {
  const getters: Map<string, Getter> = new Map()
  const dependents: Set<string | number | symbol> = new Set()
  const proxy = new Proxy(initialState, {
    get: function(target, name) {
      dependents.add(name)
    },
  })

  const descs = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(initialState))
  Object.keys(descs).forEach(prop => {
    if (descs[prop] && descs[prop].get) {
      Object.defineProperty(initialState, prop, { value: descs[prop].get!.call(proxy) })
      //@ts-ignore
      getters.set(prop, { get: descs[prop].get, dependents: Array.from(dependents) })
      dependents.clear()
    }
  })

  initialState[immox] = getters
  initialState[immerable] = true

  const [state, updateState] = useState(initialState)
  const updateDraft = useCallback(updater => {
    updateState(produce(updater))
  }, [])

  initialState[immox].forEach((value: Getter, prop: string) => {
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

function literalToInstance(initialState: any) {
  if (Object.getPrototypeOf(initialState).constructor.name === 'Object') {
    const descrit = Object.getOwnPropertyDescriptors(initialState)
    let obj = {}
    let proto = {}
    Object.keys(descrit).forEach(prop => {
      if (typeof descrit[prop].value === 'function' || descrit[prop].set) {
        proto = { ...descrit, ...proto }
      } else {
        obj = { ...descrit, ...obj }
      }
    })
    initialState = Object.create({}, obj)
    Object.setPrototypeOf(initialState, Object.create({}, proto))
    console.log('Object Literal')
  } else {
    console.log('Class')
  }
  return initialState
}

/*    //https://github.com/immerjs/immer/pull/312
      if (desc && desc.value && typeof desc.value === 'function' && prop !== 'constructor') {
                Object.defineProperty(initialState, prop, {
          value: function producer(...args: any) {
            return produce(this, (draft: any) => {
              //@ts-ignore
              desc.value.apply(draft, args) 
            })
          },
          ...desc,
        }) 
        producer(initialState, prop)
        console.log('producer')
      } */

/*  const getters: Map<string, Getter> = new Map()
    const dependents: Set<string | number | symbol> = new Set()
    const proxy = new Proxy(initialState, {
      get: function(target, name) {
        dependents.add(name)
      },
    })
    let desc: {
      [key: string]: PropertyDescriptor
    } = Object.getOwnPropertyDescriptors(initialState)
    let initialStateProto = initialState
    let tyoeObject = 'Literal'
    if (!(Object.getPrototypeOf(initialState).constructor.name === 'Object')) {
      desc = {
        ...Object.getOwnPropertyDescriptors(Object.getPrototypeOf(initialState)),
        ...desc,
      }
      tyoeObject = 'Class'
      delete desc['constructor']
    }
    console.log(tyoeObject)
    let meth = false
    Object.keys(desc).forEach(prop => {
      //console.log(prop, Object.keys(desc[prop]))
      if (desc[prop] && desc[prop].get) {
        //@ts-ignore
        const getFunc = desc[prop].get 
        const defaultValue = getFunc.call(proxy)
        Object.defineProperty(initialState, prop, {
          //@ts-ignore
          value: desc[prop].get.call(initialState),
          writable: true,
          enumerable: true,
          configurable: true,
        })
        //@ts-ignore
        getters.set(prop, { get: desc[prop].get, dependents: Array.from(dependents) })
        dependents.clear()

      }
      //https://github.com/immerjs/immer/pull/312
      if (desc[prop] && typeof desc[prop].value === 'function' && prop !== 'constructor') {
        Object.defineProperty(initialState, prop, {
          value: function producer(...args: any) {
            return produce(this, (draft: any) => {
              console.log('producer')
              desc[prop].value.apply(draft, args)
            })
          },
          ...desc[prop],
        })
        meth = true
      }

    
    initialState[immox] = getters 

    //initialState[immerable] = true
        if (!(Object.getPrototypeOf(initialState).constructor.name === 'Object')) {
      initialState = Object.create(
        initialState,
        Object.getOwnPropertyDescriptors(Object.getPrototypeOf(initialState))
      )
    }*/
