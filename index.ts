import { useMemo, useState, useCallback } from 'react'
import { Draft, produce, immerable } from 'immer'

const immox = Symbol('immox')
type Getter = { get: () => any; dependents: (string | number | symbol)[] }

//export function producer<T>(target: T) : any
export function producer<T>(
  target: T,
  prop?: string | number | symbol,
  d?: PropertyDescriptor
): any {
  // producer(fn)
  if (arguments.length === 1 && typeof target === 'function') {
    return function producer(...args: any) {
      //@ts-ignore
      return produce(this, (draft: any) => {
        target.apply(draft, args)
      })
    }
  }
  // producer(prototype, "prop")
  // @producer fn
  //@ts-ignore
  const descriptor = d || Object.getOwnPropertyDescriptor(target, prop)
  if (!descriptor)
    throw new Error(
      //@ts-ignore
      `Property '${prop}' does not exist on the specified target (tip: make sure to pass 'Class.prototype', not just 'Class')`
    )
  const { value } = descriptor
  if (typeof value !== 'function')
    throw new Error(`@producer should be used on methods only, got: ${typeof value}`)
  const newDescriptor: PropertyDescriptor = {
    ...descriptor,
    value: producer(value),
  }
  //target[immerable] = true
  //@ts-ignore
  if (!d) Object.defineProperty(target, prop, newDescriptor)
  else return newDescriptor
}

export function useImmox<S = any>(
  initialValue: S | (() => S)
): [S, (f: (draft: Draft<S>) => void | S) => void]
export function useImmox(initialState: any) {
  useMemo(() => {
    /* const getters: Map<string, Getter> = new Map()
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
        console.log(
          'set',
          prop,
          Object.getOwnPropertyDescriptor(initialState, prop),
          //@ts-ignore
          desc[prop].get.toString,
          //@ts-ignore
          desc[prop].get.toString(),
          //@ts-ignore
          desc[prop].get.apply(proxy)
        )
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
      if (prop === 'addx') {
        console.log(
          prop,
          meth,
          Object.getOwnPropertyDescriptor(initialState, prop),
          Object.getOwnPropertyDescriptor(Object.getPrototypeOf(initialState), prop),
          '###############',
          tyoeObject,
          initialState[prop].toString()
        )
      }
    })
    initialState[immox] = getters */

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

    if (Object.keys(Object.getPrototypeOf(initialState)).includes('add')) {
      producer(Object.getPrototypeOf(initialState), 'add')
      console.log(initialState.add.toString())
    }

    //initialState[immerable] = true

    /*    if (!(Object.getPrototypeOf(initialState).constructor.name === 'Object')) {
      initialState = Object.create(
        initialState,
        Object.getOwnPropertyDescriptors(Object.getPrototypeOf(initialState))
      )
    }
    const getters: Map<string, Getter> = new Map()
    const dependents: Set<string | number | symbol> = new Set()
    const proxy = new Proxy(initialState, {
      get: function(target, name) {
        dependents.add(name)
      },
    })
    let keys: string[] = Object.keys(initialState)
    //let objType = 'Literal'
    //     if (!(Object.getPrototypeOf(initialState).constructor.name === 'Object')) {
    //  keys = [
    //    ...Object.keys(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(initialState))),
    //    //...Object.keys(initialState),
    //  ]
    //  objType = 'Class'
    } 
    keys.forEach(prop => {
      let desc = Object.getOwnPropertyDescriptor(initialState, prop)
      if (desc && desc.get) {
        Object.defineProperty(initialState, prop, { value: desc.get.call(proxy) })
        getters.set(prop, { get: desc.get, dependents: Array.from(dependents) })
        dependents.clear()
        //console.log(objType, prop, '################3333')
      }
      //https://github.com/immerjs/immer/pull/312
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
      }
    })

    initialState[immox] = getters
    //initialState[immerable] = true

    console.log(objType, getters.size, '%%%') */

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [state, updateState] = useState(initialState)
  const updateDraft = useCallback(updater => {
    updateState(produce(updater))
  }, [])

  /*   state[immox].forEach((value: Getter, prop: string) => {
    const dependents = value.dependents.map(dependent => state[dependent])
    //eslint-disable-next-line react-hooks/rules-of-hooks
    useMemo(() => {
      updateDraft((d: Draft<any>) => {
        d[prop] = value.get.call(d)
      })
      //eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependents)
  }) */

  return [state, updateDraft]
}

export default useImmox

type SetState = <S = any>(f: (draft: Draft<S>) => void | S) => void
export { Draft, SetState }
