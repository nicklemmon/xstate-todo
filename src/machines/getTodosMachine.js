import { Machine, assign } from 'xstate'
import { API_BASE_URL, TODO_API_PATH } from 'src/constants'
import { customAxios } from 'src/config'

export const getTodosMachine = Machine({
  id: 'get-todos',
  initial: 'fetching',
  context: {
    data: [],
    error: {},
  },
  states: {
    fetching: {
      invoke: {
        id: 'fetchTodos',
        src: fetchTodos,
        onDone: {
          target: 'success',
          actions: assign({ data: (_ctx, event) => event.data }),
        },
        onError: {
          target: 'error',
          actions: assign({ error: (_ctx, event) => event.data }),
        },
      },
    },
    success: {
      type: 'final',
      data: {
        todos: context => context.data,
      },
    },
    error: {
      type: 'final',
      data: {
        error: context => context.error,
      },
    },
  },
})

function fetchTodos() {
  return customAxios({
    method: 'GET',
    url: `${API_BASE_URL}/${TODO_API_PATH}`,
  })
    .then(({ data: { results } }) => results)
    .then(err => err)
}
