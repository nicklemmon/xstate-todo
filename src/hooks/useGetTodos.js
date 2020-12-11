import { useMachine } from '@xstate/react'
import { requestMachine } from 'src/machines'
import { TODO_API_PATH } from 'src/constants'

export function useGetTodos() {
  const [state, send] = useMachine(requestMachine, {
    context: {
      method: 'GET',
      url: TODO_API_PATH,
      data: [],
    },
  })

  return [state, send]
}
