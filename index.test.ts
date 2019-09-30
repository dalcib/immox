import { renderHook, act } from '@testing-library/react-hooks'
import useImmox from './index'
import { initPerson, objPerson } from './example'

describe('test useImmox with a Class', () => {
  const { result } = renderHook(() => {
    const [state, setState] = useImmox(initPerson)
    return { state, setState }
  })

  test('should comput the name', () => {
    expect(result.current.state.name).toBe('Michel W.')
    act(() => {
      result.current.setState(d => {
        d.surName = 'wwwww'
      })
    })
    expect(result.current.state.name).toBe('Michel wwwww')
    //console.log(result.current.state)
  })

  test('should comput the year borned', () => {
    act(() => {
      result.current.setState(d => {
        d.age++
      })
    })
    expect(result.current.state.borned).toBe(1985)
  })

  test('should comput sum, average and even  from collection', () => {
    act(() => {
      result.current.setState(d => {
        d.collection.push(7)
        d.collection.push(8)
      })
    })
    expect(result.current.state.collection).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(result.current.state.sum).toEqual(36)
    expect(result.current.state.average).toEqual(4.5)
    expect(result.current.state.even).toEqual([2, 4, 6, 8])
  })

  test('should increment collection', () => {
    expect(result.current.state.collection.length).toBe(8)
    act(() => {
      result.current.setState(d => {
        d.add()
      })
    })
    expect(result.current.state.collection.length).toBe(9)
  })
})

describe('test useImmox with a Literal Object', () => {
  const { result } = renderHook(() => {
    const [state, setState] = useImmox(objPerson)
    return { state, setState }
  })

  test('should comput the name', () => {
    expect(result.current.state.name).toBe('Michel W.')
    act(() => {
      result.current.setState(d => {
        d.surName = 'wwwww'
      })
    })
    expect(result.current.state.name).toBe('Michel wwwww')
    //console.log(result.current.state)
  })

  test('should comput the year borned', () => {
    act(() => {
      result.current.setState(d => {
        d.age++
      })
    })
    expect(result.current.state.borned).toBe(1985)
  })

  test('should comput sum, average and even from collection', () => {
    act(() => {
      result.current.setState(d => {
        d.collection.push(7)
        d.collection.push(8)
      })
    })
    expect(result.current.state.collection).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(result.current.state.sum).toEqual(36)
    expect(result.current.state.average).toEqual(4.5)
    expect(result.current.state.even).toEqual([2, 4, 6, 8])
  })

  test('should increment collection', () => {
    expect(result.current.state.collection.length).toBe(8)
    act(() => {
      result.current.setState(d => {
        d.add()
      })
    })
    expect(result.current.state.collection.length).toBe(9)
  })
})
