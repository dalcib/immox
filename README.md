# Immox

## State management with Immer and Computed Properties

Immox is a tiny package that works with immutable state supported by Immer, allowing the use of compoud properties, like in Mobx.
It replaces Getters in a Class or in a Literal Object by useMemo().

A instance class or a literal object with a computed property (getter), like this,

```
{...
get name() { return this.firstName + ' ' + this.surName }
...}
```

becames:

```
useMemo(()=> updateState((d)=> {d.name = d.firstName + ' ' + d.surName}), [state.firstName, state.surName])
```

It provides a hook to use either a instance of a class or a literal object, both with computed properties (getters), as a React [hook](https://reactjs.org/docs/hooks-intro.html) to manipulate state with [immer](https://github.com/immerjs/immer). This project is inspired by [use-immer](https://github.com/immerjs/use-immer) and [mobx](https://github.com/mobjs/mobx). Thank you Michel Weststrate for creating both.

This package uses Proxy like Immer. Performance tests haven't been done yet.

**_Important:_** This project it's in a early stage of the development. It is not production ready yet.

## Installation

Less than 1kb + Immer(14 kb). No other dependecies.

`npm i immer immox` or `yarn add immer immox`

## API: useImmox()

`useImmox(initialState)` is very similar to [`useImmer`](https://github.com/immerjs/use-immer) and [`useState`](https://reactjs.org/docs/hooks-state.html).
The function returns a tuple, the first value of the tuple is the current state, the second is the updater function,
which accepts an [immer producer function](https://github.com/mweststrate/immer#api), in which the `draft` can be mutated freely, until the producer ends and the changes will be made immutable and become the next state.
With Immox, it is possible to use Computed Properties, just defining getters in the initial state, like in Mobx.

For Typescript use `useImmox<State>(initialState)`

Example: https://codesandbox.io/s/useimmox-3ghiw

```javascript
import React from 'react'
import { useImmox } from 'immox'

class Person {
  firstName = 'Michel'
  surName = 'W.'
  age = 33
  collection = [1, 2, 3, 4, 5, 6]
  get sum() {
    return this.collection && this.collection.reduce((acc, item) => acc + item)
  }
  get average() {
    return this.collection && this.sum / this.collection.length
  }
  get borned() {
    return new Date().getFullYear() - this.age
  }
  get name() {
    return this.firstName + ' ' + this.surName
  }
  get even() {
    return (this.collection && this.collection.filter(n => n % 2 === 0)) || []
  }
  add() {
    this.collection.push(Math.round(Math.random() * 10))
  }
}

const initPerson = new Person()
```

```JSX
function App() {
  const [person, updatePerson] = useImmox(
    initPerson    //objPerson  [See the literal object example in the end]
  )

  function updateName(name) {
    updatePerson(draft => {draft.name = name})
  }

  function becomeOlder() {
    updatePerson(draft => {draft.age++})
  }

  return (
    <div className="App">
      <h1>Hello {person.name} ({person.age})</h1>
      <h2>Borned in {person.borned}</h2>
      <input
        onChange={e => { updateFirstName(e.target.value)}}
        value={person.firstName}
      />
      <input
        onChange={e => {
          updatePerson(draft => {draft.surName = e.target.value})
          e.persist()
        }}
        value={person.surName}
      />
      <br />  <br />
      <button onClick={becomeOlder}>Older</button> <br /> <br />
      <h3>{person.collection.join(',')}</h3>
      <span>Sum: {person.sum} </span> <br />
      <span>Count: {person.collection.length} </span> <br />
      <span>Average: {person.average} </span> <br />
      <span>Even: {person.even.join(',')} </span> <br /> <br />
      <button onClick={() => {
        updatePerson(draft => { draft.add()})
        }}>
        Add Random
      </button>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

## Immox also work with Literal Objects

```javascript
const objPerson = {
  firstName: 'Michel',
  surName: 'W.',
  age: 33,
  collection: [1, 2, 3, 4, 5, 6],
  get sum() {
    return this.collection && this.collection.reduce((acc, item) => acc + item)
  },
  get average() {
    return this.collection && this.sum / this.collection.length
  },
  get borned() {
    return new Date().getFullYear() - this.age
  },
  get name() {
    return this.firstName + ' ' + this.surName
  },
  get even() {
    return (this.collection && this.collection.filter(n => n % 2 === 0)) || []
  },
  add() {
    this.collection.push(Math.round(Math.random() * 10))
  },
}
```
