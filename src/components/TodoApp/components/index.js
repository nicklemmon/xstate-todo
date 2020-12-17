import styled from 'styled-components'
import { DeleteOutline } from '@sparkpost/matchbox-icons'
import { Box, Button, Inline, Panel, Spinner, ScreenReaderOnly } from '@sparkpost/matchbox'

export const ItemStyles = styled('li')`
  list-style-type: none;
  position: relative; /* allows absolute positioning within */
`

export const DeleteButtonStyles = styled(Button)`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
`

export function TodoListItem({ children }) {
  return <ItemStyles>{children}</ItemStyles>
}

export function TodoContent({ children }) {
  return (
    <Box as="span" display="block">
      {children}
    </Box>
  )
}

export function TodoDescription({ children }) {
  return (
    <Box as="span" display="block" fontSize="200" color="gray.600">
      {children}
    </Box>
  )
}

export function DeleteButton({ onClick, disabled }) {
  return (
    <DeleteButtonStyles
      color="red"
      padding="300"
      variant="text"
      disabled={disabled}
      onClick={onClick}
    >
      <DeleteOutline />
      <ScreenReaderOnly>Delete</ScreenReaderOnly>
    </DeleteButtonStyles>
  )
}

export function CheckButton({ disabled, children, onClick }) {
  return (
    <Button color="blue" padding="300" variant="mutedOutline" disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  )
}

export function SubmitButton({ children, loading }) {
  return (
    <Button color="blue" loading={loading} submit>
      {children}
    </Button>
  )
}

export function ClearButton({ children, disabled, onClick }) {
  return (
    <Button variant="outline" color="blue" disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  )
}

export function Loading() {
  return (
    <Panel.Section>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Spinner size="large" label="loading" />
      </Box>
    </Panel.Section>
  )
}

export function Empty() {
  return (
    <Box as={Panel.Section} backgroundColor="gray.100">
      <p>No todos yet. Add some!</p>
    </Box>
  )
}
