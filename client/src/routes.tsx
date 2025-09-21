import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import Header from './components/Header'
import Home from './screens/Home'

function Root() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  )
}

const rootRoute = createRootRoute({ component: Root })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
export const routeTree = rootRoute.addChildren([indexRoute])
