import React from 'react'
import { ThemeProvider } from '@sparkpost/matchbox'
import { Layout, TodoApp } from 'src/components'

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <TodoApp />
      </Layout>
    </ThemeProvider>
  )
}

export default App
