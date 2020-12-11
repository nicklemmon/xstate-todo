import React from 'react'
import { useGetTodos } from 'src/hooks'

export function TodoList() {
  const [state, send] = useGetTodos()
  console.log('state', state)
  const todos = state.context.data

  React.useEffect(() => {
    send('FETCH')
    // eslint-disable-next-line
  }, [])

  switch (state.value) {
    case 'idle':
    case 'loading': {
      return <p>Loading...</p>
    }

    case 'failure': {
      return <p>Failure.</p>
    }

    case 'success': {
      return (
        <ul>
          {todos.map((todo, index) => {
            return <li key={todo.objectId}>{todo.content}</li>
          })}
        </ul>
      )
    }

    default: {
      throw new Error(`${state.value} is not supported`)
    }
  }
}
