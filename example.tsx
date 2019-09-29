import React from 'react'
import { useImmox } from './index'

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
    //console.log('add')
    this.collection.push(Math.round(Math.random() * 10))
  }
}

export const initPerson = new Person()

export function Example() {
  const [person, updatePerson] = useImmox(
    initPerson
    //objPerson
  )

  function updateFirstName(name: string) {
    updatePerson(draft => {
      draft.firstName = name
    })
  }

  function becomeOlder() {
    updatePerson(draft => {
      draft.age++
    })
  }

  return (
    <div className="App">
      <h1>
        Hello {person.name} ({person.age})
      </h1>
      <h2>Borned in {person.borned}</h2>
      <input
        onChange={e => {
          updateFirstName(e.target.value)
        }}
        value={person.firstName}
      />
      <input
        onChange={e => {
          updatePerson(d => {
            d.surName = e.target.value
          })
          e.persist()
        }}
        value={person.surName}
      />
      <br />
      <br />
      <button onClick={becomeOlder}>Older</button>
      <br />
      <br />
      <h3>{person.collection.join(',')}</h3>
      <span>Sum: {person.sum} </span>
      <br />
      <span>Count: {person.collection.length} </span>
      <br />
      <span>Average: {person.average} </span>
      <br />
      <span>Even: {person.even.join(',')} </span>
      <br />
      <br />
      <button
        onClick={() =>
          updatePerson(d => {
            d.add()
          })
        }
      >
        Add Random
      </button>
    </div>
  )
}

//Immox also work with Object Literal
/* const objPerson = {
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
} */
