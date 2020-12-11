import { useMachine } from '@xstate/react'
import { requestMachine } from 'src/machines'
import { TODO_API_PATH } from 'src/constants'

export function useCreateTodo() {
  const [state, send] = useMachine(requestMachine, {
    context: {
      method: 'POST',
      url: TODO_API_PATH,
      headers: { 'Content-Type': 'application/json' },
    },
  })

  return [state, send]
}
