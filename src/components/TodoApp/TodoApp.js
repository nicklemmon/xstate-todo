import React from 'react'
import { Button, Inline, Panel, TextField, ScreenReaderOnly, Stack } from '@sparkpost/matchbox'
import { CheckBox, CheckBoxOutlineBlank } from '@sparkpost/matchbox-icons'
import { useMachine } from '@xstate/react'
import { todoAppMachine } from './todoAppMachine'
import {
  Loading,
  CheckButton,
  ClearButton,
  TodoListItem,
  DeleteButton,
  TodoDescription,
  TodoContent,
  Empty,
  SubmitButton,
} from './components'

export function TodoApp() {
  const [state, send] = useMachine(todoAppMachine)
  const hasTodos = Boolean(state.context.todos?.length)

  function handleSubmit(e) {
    e.preventDefault()

    send({ type: 'SUBMIT_FORM' })
  }

  return (
    <Panel>
      <Panel.Header>Todo App</Panel.Header>

      <Panel.Section>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextField
              label="Task"
              id="content"
              name="content"
              type="text"
              disabled={state.matches('submitting')}
              value={state.context.newTodo.content}
              onChange={e => send({ type: 'CHANGE_CONTENT', value: e.target.value })}
            />

            <TextField
              label="Description"
              id="description"
              name="description"
              type="text"
              disabled={state.matches('submitting')}
              value={state.context.newTodo.description}
              onChange={e => send({ type: 'CHANGE_DESCRIPTION', value: e.target.value })}
            />

            <Inline>
              <SubmitButton loading={state.matches('submitting')}>Add Todo</SubmitButton>

              <ClearButton
                disabled={state.matches('submitting')}
                onClick={() => {
                  send({ type: 'CHANGE_DESCRIPTION', value: '' })
                  send({ type: 'CHANGE_CONTENT', value: '' })
                }}
              >
                Clear
              </ClearButton>
            </Inline>
          </Stack>
        </form>
      </Panel.Section>

      {state.matches('fetching') && !hasTodos && <Loading />}

      {state.matches('fetched') && !hasTodos && <Empty />}

      {hasTodos ? (
        <Panel.Section>
          <Stack as="ul">
            {state.context.todos.map(todo => {
              const isButtonDisabled =
                state.matches('fetching') ||
                state.matches({ fetched: 'deleting' }) ||
                state.matches({ fetched: 'updating' })

              return (
                <TodoListItem key={todo.objectId}>
                  <Inline>
                    <CheckButton
                      disabled={isButtonDisabled}
                      onClick={() =>
                        send({
                          type: 'UPDATE_TODO',
                          todo: {
                            ...todo,
                            status: todo.status === 'incomplete' ? 'complete' : 'incomplete',
                          },
                        })
                      }
                    >
                      {todo.status === 'incomplete' && (
                        <>
                          <Button.Icon as={CheckBoxOutlineBlank} />
                          <ScreenReaderOnly>Mark Complete</ScreenReaderOnly>
                        </>
                      )}

                      {todo.status === 'complete' && (
                        <>
                          <Button.Icon as={CheckBox} />
                          <ScreenReaderOnly>Mark Incomplete</ScreenReaderOnly>
                        </>
                      )}
                    </CheckButton>

                    <span>
                      <TodoContent>{todo.content}</TodoContent>

                      <TodoDescription>{todo.description}</TodoDescription>
                    </span>
                  </Inline>

                  <DeleteButton
                    disabled={isButtonDisabled}
                    onClick={() => send({ type: 'DELETE_TODO', todoId: todo.objectId })}
                  />
                </TodoListItem>
              )
            })}
          </Stack>
        </Panel.Section>
      ) : null}
    </Panel>
  )
}
