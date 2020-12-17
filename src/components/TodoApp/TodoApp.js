import React from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  Inline,
  Panel,
  TextField,
  ScreenReaderOnly,
  Stack,
  Spinner,
} from '@sparkpost/matchbox'
import { CheckBox, CheckBoxOutlineBlank, DeleteOutline } from '@sparkpost/matchbox-icons'
import { useMachine } from '@xstate/react'
import { todoAppMachine } from './todoAppMachine'

const TodoListItem = styled('li')`
  list-style-type: none;
  position: relative; /* allows absolute positioning within */
`

const DeleteButton = styled(Button)`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
`

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
              <Button color="blue" loading={state.matches('submitting')} submit>
                {state.value === 'loading' ? 'Loading...' : 'Add Todo'}
              </Button>

              <Button
                variant="outline"
                color="blue"
                disabled={state.matches('submitting')}
                onClick={() => send({ type: 'CLEAR' })}
              >
                Clear
              </Button>
            </Inline>
          </Stack>
        </form>
      </Panel.Section>

      <Panel.Section>
        {state.matches('fetching') && !hasTodos ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Spinner size="large" label="loading" />
          </Box>
        ) : null}

        {/*
        TODO: This could probably be addressed via state machines as well:
        https://xstate.js.org/docs/guides/context.html
      */}

        {state.matches('fetched') && !hasTodos ? <p>No todos yet. Add some!</p> : null}

        {hasTodos ? (
          <Stack as="ul">
            {state.context.todos.map(todo => {
              const isButtonDisabled =
                state.matches('fetching') ||
                state.matches({ fetched: 'deleting' }) ||
                state.matches({ fetched: 'updating' })

              return (
                <TodoListItem
                  key={todo.objectId}
                  style={{ position: 'relative', listStyleType: 'none' }}
                >
                  <Inline>
                    <Button
                      color="blue"
                      padding="300"
                      variant="mutedOutline"
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
                          <CheckBoxOutlineBlank />
                          <ScreenReaderOnly>Mark Complete</ScreenReaderOnly>
                        </>
                      )}

                      {todo.status === 'complete' && (
                        <>
                          <CheckBox />
                          <ScreenReaderOnly>Mark Incomplete</ScreenReaderOnly>
                        </>
                      )}
                    </Button>

                    <Box as="span">
                      <Box as="span" display="block">
                        {todo.content}
                      </Box>

                      <Box as="span" display="block" fontSize="200" color="gray.600">
                        {todo.description}
                      </Box>
                    </Box>
                  </Inline>

                  <DeleteButton
                    color="red"
                    padding="300"
                    variant="text"
                    disabled={isButtonDisabled}
                    onClick={() => send({ type: 'DELETE_TODO', todoId: todo.objectId })}
                  >
                    <DeleteOutline />
                    <ScreenReaderOnly>Delete</ScreenReaderOnly>
                  </DeleteButton>
                </TodoListItem>
              )
            })}
          </Stack>
        ) : null}
      </Panel.Section>
    </Panel>
  )
}
