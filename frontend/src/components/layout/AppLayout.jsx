import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import AIChatWidget from '../ai/AIChatWidget'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* subtle grid background */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-60" />
      {/* subtle glow orbs far in background */}
      <div className="fixed w-[500px] h-[500px] -top-40 left-1/3 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05), transparent)', filter: 'blur(60px)' }} />
      <div className="fixed w-[400px] h-[400px] bottom-0 right-1/4 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.04), transparent)', filter: 'blur(60px)' }} />

      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen flex flex-col relative">
        <TopBar />
        <div className="flex-1 px-8 py-6">
          <Outlet />
        </div>
      </main>
      <AIChatWidget />
    </div>
  )
}
