import React, { useState } from 'react'
import { useCreateTodo } from 'src/hooks'

export function TodoForm() {
  const [state, send] = useCreateTodo()
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const status = 'incomplete' // 'incomplete' | 'completed'

  function handleSubmit(e) {
    e.preventDefault()

    setContent('')
    setDescription('')
    send({ type: 'FETCH', data: { content, description, status } })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="content">Task</label>
      <input
        id="content"
        name="content"
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <label htmlFor="description">Description</label>
      <input
        id="description"
        name="description"
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button disabled={state.value === 'loading'}>
        {state.value === 'loading' ? 'Loading...' : 'Add Todo'}
      </button>
    </form>
  )
}
