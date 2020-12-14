import { Machine, assign } from 'xstate'
import { API_BASE_URL, TODO_API_PATH } from 'src/constants'
import { customAxios } from 'src/config'

export const deleteTodoMachine = Machine({
  id: 'delete-todo',
  initial: 'deleting',
  context: {
    todoId: '',
    response: {},
    error: {},
  },
  states: {
    deleting: {
      invoke: {
        id: 'deleteTodo',
        src: ctx => deleteTodo(ctx.todoId),
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

function deleteTodo(todoId) {
  return customAxios({
    method: 'DELETE',
    url: `${API_BASE_URL}/${TODO_API_PATH}/${todoId}`,
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res)
    .then(err => err)
}
