import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
