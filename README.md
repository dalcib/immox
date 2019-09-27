# immox

## State management with Immer and Computed Properties

This project it's in a early stage of the development, not production ready yet.

Immer with immutabilitie and compoud properties, like Mbox

# use-immer

A hook to use compaund properties with [immer](https://github.com/mweststrate/immer) as a React [hook](https://reactjs.org/docs/hooks-intro.html) to manipulate state.

# Installation

`npm install immer immox`

# API

## useImmox

`useImmocx(initialState)` is very similar to [`useImmer`](https://github.com/immerjs/use-immer) and [`useState`](https://reactjs.org/docs/hooks-state.html).
The function returns a tuple, the first value of the tuple is the current state, the second is the updater function,
which accepts an [immer producer function](https://github.com/mweststrate/immer#api), in which the `draft` can be mutated freely, until the producer ends and the changes will be made immutable and become the next state.
With Immox, it is possible to use Computed Properties, just defining getters in the initial state, like in Mobx.

Example: https://codesandbox.io/s/useimmox-3ghiw

```javascript
import React from 'react'
import { useImmer } from 'use-immer'
class Person {
  name = 'Michel'
  surName = 'Weststrate'
  age = 33
  collection = [1, 2, 3, 4, 5]
  get sum() {
    return this.collection && this.collection.reduce((acc, item) => acc + item)
  }
  get average() {
    return this.collection && this.sum / this.collection.length
  }
  get borned() {
    return new Date().getFullYear() - this.age
  }
  get wholeName() {
    return this.name + this.surName
  }
  get agename() {
    return this.name + this.age
  }
  add() {
    this.collection.push(7)
  }
}
```

function App() {
const [person, updatePerson] = useStore(
initPerson
//objPerson
);

function updateName(name) {
updatePerson(draft => {
draft.name = name;
});
}

function becomeOlder() {
updatePerson(draft => {
draft.age++;
});
}

return (
<div className="App">
<h1>
Hello {person.name} ({person.age}) - {person.borned}
</h1>
<h2>
{person.wholeName} - {person.agename} - {person.sum} - {person.average}
</h2>
<input
onChange={e => {
updateName(e.target.value);
}}
value={person.name}
/>
<br />
<button onClick={becomeOlder}>Older</button>
<br />
<br />
<button
onClick={() =>
updatePerson(d => {
d.add();
})
} >
Add
</button>
</div>
);
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
