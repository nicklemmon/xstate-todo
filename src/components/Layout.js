import React from 'react'
import { Box } from '@sparkpost/matchbox'

export function Layout({ children }) {
  return (
    <Box padding="800" marginX="auto" maxWidth="700px" width="100vw" height="100vh">
      {children}
    </Box>
  )
}
