import React from 'react'
import { Machine, assign } from 'xstate'
import { useMachine } from '@xstate/react'
import { createTodoFormMachine, createTodoMachine, getTodosMachine } from 'src/machines'

const newTodoInitialState = {
  content: '',
  description: '',
  status: 'incomplete',
}

const todoAppMachine = Machine({
  id: 'todo-app',
  initial: 'fetching',
  context: {
    todos: [],
    newTodo: {
      content: '',
      description: '',
      status: 'incomplete',
    },
  },
  states: {
    fetching: {
      invoke: {
        src: getTodosMachine,
        onDone: {
          target: 'success',
          actions: assign((_ctx, event) => ({ todos: event.data.todos })),
        },
        onError: 'error',
      },
    },
    success: {
      initial: 'idle',
      // Handle form editing once the initial todo list is requested
      states: {
        idle: {
          on: {
            CHANGE_CONTENT: {
              target: 'idle',
              actions: assign((ctx, event) => ({
                newTodo: { ...ctx.newTodo, content: event.value },
              })),
            },
            CHANGE_DESCRIPTION: {
              target: 'idle',
              actions: assign((ctx, event) => ({
                newTodo: { ...ctx.newTodo, description: event.value },
              })),
            },
            SUBMIT: {
              target: 'pending',
            },
          },
        },
        pending: {
          invoke: {
            src: createTodoMachine,
            data: {
              newTodo: ctx => ctx.newTodo,
            },
            onDone: {
              target: 'success',
              actions: assign(() => {
                return { newTodo: newTodoInitialState }
              }),
            },
            onError: 'error',
          },
        },
        success: {
          type: 'final',
        },
        // TODO: Flesh this out
        error: {},
      },
      onDone: 'fetching',
      onError: 'error',
    },
    error: {
      on: {
        RETRY: 'fetching',
      },
    },
  },
})

export function TodoForm() {
  const [state, send] = useMachine(todoAppMachine)

  function handleSubmit(e) {
    e.preventDefault()

    send({ type: 'SUBMIT' })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="content">Task</label>
        <input
          id="content"
          name="content"
          type="text"
          disabled={state.matches('fetching')}
          value={state.context.newTodo.content}
          onChange={e => send({ type: 'CHANGE_CONTENT', value: e.target.value })}
        />

        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          type="text"
          disabled={state.matches('fetching')}
          value={state.context.newTodo.description}
          onChange={e => send({ type: 'CHANGE_DESCRIPTION', value: e.target.value })}
        />

        <button disabled={state.matches('fetching')}>
          {state.value === 'loading' ? 'Loading...' : 'Add Todo'}
        </button>
      </form>

      {state.matches('fetching') ? <p>Loading...</p> : null}

      {state.matches('success') ? (
        <ul>
          {state.context.todos.map((todo, index) => {
            return (
              <li key={todo.objectId}>
                <span>{todo.content}</span>
                <button onClick={() => {}}>Done</button>
                <button onClick={() => {}}>Delete</button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </>
  )
}
