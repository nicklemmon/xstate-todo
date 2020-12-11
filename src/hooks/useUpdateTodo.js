import { useMachine } from '@xstate/react'
import { requestMachine } from 'src/machines'
import { TODO_API_PATH } from 'src/constants'

export function useUpdateTodo() {
  const [state, send] = useMachine(requestMachine, {
    context: {
      method: 'PUT',
      url: TODO_API_PATH,
      headers: { 'Content-Type': 'application/json' },
    },
  })

  return [state, send]
}
