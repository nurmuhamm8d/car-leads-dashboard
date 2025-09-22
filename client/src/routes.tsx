import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import Home from './screens/Home'

function Root() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  )
}

export const rootRoute = createRootRoute({ component: Root })
export const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
export const routeTree = rootRoute.addChildren([indexRoute])
