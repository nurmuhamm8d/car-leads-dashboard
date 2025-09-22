import React from 'react'
import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router'
import Home from './screens/Home'

function Shell() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  )
}

const rootRoute = createRootRoute({ component: Shell })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const routeTree = rootRoute.addChildren([indexRoute])
export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' { interface Register { router: typeof router } }

export default function AppRouter() {
  return <RouterProvider router={router} />
}
