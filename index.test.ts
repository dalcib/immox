import { renderHook, act } from '@testing-library/react-hooks'
import useImmox from './index'
import { initPerson } from './example'

describe('test useImmox', () => {
  const { result } = renderHook(() => {
    const [state, setState] = useImmox(initPerson)
    return { state, setState }
  })

  test('should increment collection', () => {
    expect(result.current.state.collection.length).toBe(6)
    act(() => {
      result.current.setState(d => {
        d.add()
      })
    })
    expect(result.current.state.collection.length).toBe(7)
  })

  test('should change the name', () => {
    act(() => {
      result.current.setState(d => {
        d.surName = 'wwwww'
      })
    })
    expect(result.current.state.name).toBe('Michel wwwww')
    //console.log(result.current.state)
  })

  test('should change the borned', () => {
    act(() => {
      result.current.setState(d => {
        d.age++
      })
    })
    expect(result.current.state.borned).toBe(1985)
  })

  test('should object chenge', () => {
    //expect(initPerson).toEqual(result.current.state)
  })
})
