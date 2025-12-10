import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import Routes from './routes/Routes'
import AuthProvider from './providers/AuthProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient} >
        <AuthProvider>
          <RouterProvider router={Routes} />
        </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
