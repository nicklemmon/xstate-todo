import { useMachine } from '@xstate/react'
import { requestMachine } from 'src/machines'
import { TODO_API_PATH } from 'src/constants'

export function useDeleteTodo(todoId) {
  const [state, send] = useMachine(requestMachine, {
    context: { method: 'DELETE', url: TODO_API_PATH },
  })

  return [state, send]
}
