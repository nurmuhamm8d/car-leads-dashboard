import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routes'
import './styles/index.css'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="header">
      <div className="header-inner container-page">
        <div className="logo">Car Leads Dashboard</div>
      </div>
    </div>
    <div className="container-page my-6">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
)
