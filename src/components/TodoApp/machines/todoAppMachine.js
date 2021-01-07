import { Machine, assign } from 'xstate'
import {
  createTodoMachine,
  deleteTodoMachine,
  getTodosMachine,
  updateTodoMachine,
} from 'src/machines'

const newTodoInitialState = {
  content: '',
  description: '',
  status: 'incomplete',
}

export const todoAppMachine = Machine({
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
        updating: {
          invoke: {
            src: updateTodoMachine,
            data: {
              todo: ctx => {
                return ctx.todoToUpdate
              },
            },
            onDone: {
              target: 'fetched',
              actions: assign(() => {
                return { todoToUpdate: {} }
              }),
            },
            onError: {
              target: 'error',
            },
          },
        },
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
