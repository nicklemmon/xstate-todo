import { Machine, assign } from 'xstate'
import { API_BASE_URL, TODO_API_PATH } from 'src/constants'
import { customAxios } from 'src/config'

export const updateTodoMachine = Machine({
  id: 'update-todo',
  initial: 'updating',
  context: {
    todo: {},
    response: {},
    error: {},
  },
  states: {
    updating: {
      invoke: {
        id: 'updateTodo',
        src: ctx => updateTodo(ctx.todo),
        onDone: {
          target: 'success',
          actions: assign((_ctx, event) => {
            return {
              response: event,
            }
          }),
        },
        onError: {
          target: 'error',
          actions: assign((_ctx, event) => {
            return {
              error: event,
            }
          }),
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
})

function updateTodo(todo) {
  const { objectId, content, description, status } = todo

  return customAxios({
    method: 'PUT',
    url: `${API_BASE_URL}/${TODO_API_PATH}/${objectId}`,
    headers: { 'Content-Type': 'application/json' },
    data: {
      content,
      description,
      status,
    },
  })
    .then(res => res)
    .catch(err => err)
}
