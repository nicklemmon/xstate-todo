import React from 'react'
import { useMachine } from '@xstate/react'
import { requestMachine } from 'src/machines'
import { TodoList, TodoForm } from 'src/components'

function App() {
  return (
    <>
      <TodoForm />
      <TodoList />
    </>
  )
}

export default App
