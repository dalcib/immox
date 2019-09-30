import * as React from 'react'
import { useContext } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import * as renderer from 'react-test-renderer'
import useImmox from './index'

const waitForUseEffect = () => new Promise(resolve => setTimeout(resolve))

function ContextProvider(initialState: any) {
  const Context = React.createContext<any | null>(null)
  const { result, waitForNextUpdate } = renderHook(() => {
    const [state, setState] = useImmox(initialState)
    return { state, setState }
  })
  const store = { state: result.current.state, setState: result.current.setState }
  function Provider({ children }: any) {
    return <Context.Provider value={store}> {children} </Context.Provider>
  }
  return { Provider, result, Context, waitForNextUpdate }
}

describe('React', () => {
  test('should allow using hooks', async () => {
    let renderCount = 0
    const config = {
      foo: 'bar',
      updateFoo() {
        this.foo += '!'
      },
    }

    const { Provider, result, Context } = ContextProvider(config)
    act(() => {
      result.current.setState((d: any) => {
        d.updateFoo()
      })
    })
    expect(result.current.state.foo).toBe('bar!')
  })

  test('should handle arrays', async () => {
    const config = {
      foo: ['foo', 'bar'],
      updateFoo() {
        return this.foo.push('baz')
      },
    }

    const { Provider, result, Context } = ContextProvider(config)
    act(() => {
      result.current.setState((d: any) => {
        d.updateFoo()
      })
    })
    expect(result.current.state.foo).toEqual(['foo', 'bar', 'baz'])
  })

  test('should handle objects', async () => {
    const config = {
      foo: {
        foo: 'bar',
        bar: 'baz',
        baz: 'boing',
      },
      updateFoo() {
        Object.keys(this.foo).forEach(key => {
          this.foo[key] = this.foo[key].toUpperCase()
        })
      },
    }
    const { Provider, result, Context } = ContextProvider(config)
    act(() => {
      result.current.setState((d: any) => {
        d.updateFoo()
      })
    })
    expect(result.current.state.foo.foo).toEqual('BAR')
    expect(result.current.state.foo.bar).toEqual('BAZ')
    expect(result.current.state.foo.baz).toEqual('BOING')
  })

  test.skip('should render on object add and remove', async () => {
    const config = {
      object: {} as { [key: string]: string },
    }

    const { Provider, result, Context } = ContextProvider(config)

    const addFoo = () =>
      result.current.setState(({ state }) => {
        state.object.foo = 'bar'
      })

    const removeFoo = () =>
      result.current.setState(({ state }) => {
        delete state.object.foo
      })

    act(() => {
      addFoo()
    })

    expect(result.current.state.object.foo).toEqual('bar')

    act(() => {
      removeFoo()
    })

    expect(result.current.state.objsct).toEqual({})
  })

  test.skip('should target state', async () => {
    const config = {
      foo: [
        {
          title: 'foo',
        },
      ],
      async updateFoo() {
        const item = this.foo[0]
        item.title = 'foo2'
        await Promise.resolve()
        item.title = 'foo3'
      },
    }

    const { Provider, result, Context, waitForNextUpdate } = ContextProvider(config)

    let promise: Promise<any>
    await act(async () => {
      promise = result.current.state.updateFoo()
      expect(result.current.state.foo[0].title).toEqual('foo2')
      await waitForNextUpdate()
      await Promise.resolve()
      expect(result.current.state.foo[0].title).toEqual('foo2')
    })
  })

  /*
  test('should allow async changes', async () => {
    const config = {
      state: {
        foo: ['foo', 'bar'],
      },
      actions: {
        updateFoo: async ({ state }) => {
          state.foo[0] += '2'
          await Promise.resolve()
          state.foo[0] += '3'
        },
      },
    }

    const useState = createStateHook<typeof config>()
    const store = createStore(config)
    const FooComponent: React.FunctionComponent = () => {
      const state = useState()

      return (
        <ul>
          {state.foo.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      )
    }

    const tree = renderer.create(
      <Provider store={store}>
        <FooComponent />
      </Provider>
    )

    expect(tree).toMatchSnapshot()

    let promise
    await renderer.act(async () => {
      await waitForUseEffect()
      promise = store.actions.updateFoo()
      await Promise.resolve()
      expect(tree.toJSON()).toMatchSnapshot()
    })
    await renderer.act(async () => {
      await promise
      expect(tree.toJSON()).toMatchSnapshot()
    })

    expect(tree.toJSON()).toMatchSnapshot()
  })
  test('should handle cross async action changes', async () => {
    const config = {
      state: {
        foo: 'bar',
      },
      actions: {
        updateFoo: async ({ state }) => {
          state.foo += '1'
          await new Promise((resolve) => setTimeout(resolve))
          state.foo += '1'
        },
        updateFoo2: async ({ state }) => {
          await Promise.resolve()
          state.foo += '2'
        },
      },
    }

    const useState = createStateHook<typeof config>()
    const store = createStore(config)
    const FooComponent: React.FunctionComponent = () => {
      const state = useState()

      return <h1>{state.foo}</h1>
    }

    const tree = renderer.create(
      <Provider store={store}>
        <FooComponent />
      </Provider>
    )

    await renderer.act(async () => {
      await waitForUseEffect()
      return Promise.all([
        store.actions.updateFoo(),
        store.actions.updateFoo2(),
      ])
    })

    expect(tree.toJSON()).toMatchSnapshot()
  })*/
  test('should allow usage of computed', async () => {
    const config = {
      foo: ['foo', 'bar'],
      updateFoo() {
        this.foo.push('baz')
      },
      get upperFoo() {
        return this.foo && this.foo.map(text => text.toUpperCase())
      },
    }

    const { Provider, result, Context } = ContextProvider(config)
    expect(result.current.state.upperFoo).toEqual(['FOO', 'BAR'])
    act(() => {
      result.current.setState((d: any) => {
        d.updateFoo()
      })
    })
    expect(result.current.state.upperFoo).toEqual(['FOO', 'BAR', 'BAZ'])
  })
})
