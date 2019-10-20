import * as React from 'react'
//import { render } from 'react-dom'
import produce, { original } from 'immer'
//import { render, fireEvent } from 'react-native-testing-library'
import { create, act } from 'react-test-renderer'

class User {
  name = ''
  username = ''
}
const user = new User()

const App2 = () => {
  //const [form, setForm] = React.useState({ name: '', username: '' })
  const [form, setForm] = React.useState(user)

  return (
    <form>
      <input
        data-testID="username"
        name="username"
        aria-label="username"
        value={form.username}
        onChange={({ target }) => {
          console.log(form, 'form')
          const newValue = produce(draft => {
            console.log(original(draft), 'origim', draft, 'draft')
            draft.username = target.value
          })
          console.log(newValue)
          setForm(newValue)
        }}
      />
      <input
        aria-label="name"
        value={form.name}
        onChange={({ target }) => {
          setForm(
            produce(draft => {
              console.log(draft)
              draft.name = target.value
              console.log(draft)
            })
          )
        }}
      />
    </form>
  )
}

//const rootElement = document.getElementById('root')
//render(<App2 />, rootElement)

const utils = create(<App2 />)
const inputs = utils.root.findAllByType('input')
//console.log(JSON.stringify(utils.toJSON()))
const input = inputs[0]

it('should ', () => {
  expect(input.props.value).toEqual('')
  act(() => input.props.onChange({ target: { value: '1asd' } }))
  expect(input.props.value).toEqual('1asd')
  act(() => input.props.onChange({ target: { value: '1asdx' } }))
  expect(input.props.value).toEqual('1asdx')
  //console.log(JSON.stringify(utils.toJSON().children[0]))
})
