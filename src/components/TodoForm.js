import React from 'react'
import { Machine, assign } from 'xstate'
import { useMachine } from '@xstate/react'
import { createTodoMachine, deleteTodoMachine, getTodosMachine } from 'src/machines'

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
    todoToUpdate: {},
    todoToDeleteId: '',
  },
  states: {
    fetching: {
      invoke: {
        src: getTodosMachine,
        onDone: {
          target: 'fetched',
          actions: assign((_ctx, event) => ({ todos: event.data.todos })),
        },
        onError: 'error',
      },
    },
    fetched: {
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
              actions: assign((ctx, event) => {
                return {
                  newTodo: { ...ctx.newTodo, description: event.value },
                }
              }),
            },
            DELETE_TODO: {
              target: 'deleting',
              actions: assign((_ctx, event) => {
                return {
                  todoToDeleteId: event.todoId,
                }
              }),
            },
            UPDATE_TODO: {
              target: 'updating',
              actions: assign((_ctx, event) => {
                return {
                  todoToUpdate: event.todo,
                }
              }),
            },
            SUBMIT_FORM: {
              target: 'submitting',
            },
          },
        },
        deleting: {
          invoke: {
            src: deleteTodoMachine,
            data: {
              todoId: ctx => ctx.todoToDeleteId,
            },
            onDone: {
              target: 'fetched',
              actions: assign(() => {
                return { todoToDelete: {} }
              }),
            },
            onError: 'error',
          },
        },
        updating: {},
        submitting: {
          invoke: {
            src: createTodoMachine,
            data: {
              newTodo: ctx => ctx.newTodo,
            },
            onDone: {
              target: 'fetched',
              actions: assign(() => {
                return { newTodo: newTodoInitialState }
              }),
            },
            onError: 'error',
          },
        },
        fetched: {
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
  const hasTodos = Boolean(state.context.todos.length)

  function handleSubmit(e) {
    e.preventDefault()

    send({ type: 'SUBMIT_FORM' })
  }

  console.log('state.value', state.value)

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

        <button disabled={state.matches('fetching')} type="submit">
          {state.value === 'loading' ? 'Loading...' : 'Add Todo'}
        </button>
      </form>

      {state.matches('fetching') && !hasTodos ? <p>Loading...</p> : null}

      {/*
        TODO: This could probably be addressed via state machines as well:
        https://xstate.js.org/docs/guides/context.html
      */}
      {state.matches('fetched') && !hasTodos ? <p>No todos yet. Add some!</p> : null}

      {hasTodos ? (
        <ul>
          {state.context.todos.map(todo => {
            const isButtonDisabled =
              state.matches('fetching') ||
              state.matches({ fetched: 'deleting' }) ||
              state.matches({ fetched: 'updating' })

            return (
              <li key={todo.objectId}>
                <span>{todo.content}</span>

                <button type="button" disabled={isButtonDisabled} onClick={() => {}}>
                  Done
                </button>

                <button
                  type="button"
                  disabled={isButtonDisabled}
                  onClick={() => send({ type: 'DELETE_TODO', todoId: todo.objectId })}
                >
                  Delete
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </>
  )
}
