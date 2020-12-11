import { Machine, assign } from 'xstate'
import { API_BASE_URL, TODO_API_PATH } from 'src/constants'
import { customAxios } from 'src/config'

export const createTodoMachine = Machine(
  {
    id: 'create-todo',
    initial: 'creating',
    context: {
      newTodo: {},
      response: undefined,
      error: undefined,
    },
    states: {
      creating: {
        invoke: {
          id: 'createTodo',
          src: ctx => createTodo(ctx.newTodo),
          onDone: {
            target: 'success',
            actions: ['@setData'],
          },
          onError: {
            target: 'error',
            actions: ['@setError'],
          },
        },
      },
      success: {
        type: 'final',
      },
      error: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      '@setData': assign((_ctx, event) => {
        return {
          response: event,
        }
      }),
      '@setError': assign((_ctx, event) => {
        return {
          error: event,
        }
      }),
    },
  },
)

function createTodo(newTodo) {
  return customAxios({
    method: 'POST',
    url: `${API_BASE_URL}/${TODO_API_PATH}`,
    data: newTodo,
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res)
    .then(err => err)
}
